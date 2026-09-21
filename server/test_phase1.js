const assert = require('assert');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const { getStorageDriver, LocalStorageDriver, S3StorageDriver } = require('./storage/storageDriver');
const { processAndValidateFile, sanitizeBlockData, sanitizeFilename } = require('./middleware/uploadSecurity');
const db = require('./data/db');
const { requireRole } = require('./middleware/authMiddleware');

async function runPhase1Tests() {
  console.log('====================================================');
  console.log(' STARTING PHASE 1 AUTOMATED VERIFICATION SUITE');
  console.log('====================================================\n');

  // TEST 1: Modular Storage Driver
  console.log('--- 1. Testing Modular Storage Driver ---');
  const driver = getStorageDriver();
  assert(driver instanceof LocalStorageDriver, 'Default storage driver should be LocalStorageDriver');

  const testBuffer = Buffer.from('House of Engineers Test Buffer 2026', 'utf8');
  const saved = await driver.saveFile({
    buffer: testBuffer,
    originalName: 'test-document.txt',
    mimeType: 'text/plain',
    key: `test-${Date.now()}.txt`
  });

  assert(saved.key, 'Saved file must return key');
  assert(saved.url.startsWith('/uploads/'), 'Saved file must return safe /uploads/ URL');
  assert.strictEqual(saved.size, testBuffer.length, 'Size must match buffer length');
  console.log('✓ LocalStorageDriver successfully saved file:', saved.url);

  // Test S3 Storage Driver interface
  const s3Driver = new S3StorageDriver({ bucket: '' });
  assert(typeof s3Driver.saveFile === 'function', 'S3StorageDriver must implement saveFile');
  assert(typeof s3Driver.deleteFile === 'function', 'S3StorageDriver must implement deleteFile');
  console.log('✓ S3StorageDriver interface verified');

  // Clean up test file
  const deleted = await driver.deleteFile(saved.key);
  assert(deleted, 'deleteFile must remove test file');
  console.log('✓ File deletion verified');

  // TEST 2: Security & Magic-Number Validation
  console.log('\n--- 2. Testing Security & Upload Validation Pipeline ---');

  // 2a. Generate valid PNG buffer using Sharp
  const validPngBuffer = await sharp({
    create: {
      width: 100,
      height: 100,
      channels: 4,
      background: { r: 35, g: 88, b: 143, alpha: 1 }
    }
  }).png().toBuffer();

  const validatedImg = await processAndValidateFile({
    buffer: validPngBuffer,
    originalname: 'solar-blueprint.png'
  });

  assert.strictEqual(validatedImg.mimeType, 'image/webp', 'Sharp must convert raster images to WebP');
  assert.strictEqual(validatedImg.dimensions.width, 100, 'Dimensions width must be 100');
  assert.strictEqual(validatedImg.dimensions.height, 100, 'Dimensions height must be 100');
  assert(validatedImg.key.endsWith('.webp'), 'File key must have .webp extension');
  console.log('✓ Valid image converted to WebP with dimensions:', validatedImg.dimensions);

  // 2b. Test fake image with executable/script content disguised as PNG
  const fakePngBuffer = Buffer.from('<?php echo "malicious script"; ?>', 'utf8');
  let fakeBlocked = false;
  try {
    await processAndValidateFile({
      buffer: fakePngBuffer,
      originalname: 'shell.png'
    });
  } catch (err) {
    fakeBlocked = true;
    console.log('✓ Disguised executable properly blocked by magic-number check:', err.message);
  }
  assert(fakeBlocked, 'Security check must block fake image disguised as PNG');

  // 2c. Test SVG XSS Sanitization
  const maliciousSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" fill="red" />
    <script>alert("XSS Attack")</script>
  </svg>`;
  const svgResult = await processAndValidateFile({
    buffer: Buffer.from(maliciousSvg, 'utf8'),
    originalname: 'vector-diagram.svg'
  });
  const cleanSvgText = svgResult.buffer.toString('utf8');
  assert(!cleanSvgText.includes('<script>'), 'SVG sanitizer must strip <script> tags');
  assert(cleanSvgText.includes('<circle'), 'SVG sanitizer must preserve valid vector elements');
  console.log('✓ SVG XSS stripped successfully while preserving vector graphic');

  // 2d. Test XSS HTML Sanitization for Structured Block Content
  const dirtyContent = {
    headline: 'Safe Headline',
    subheadline: 'Subheadline <script>alert(1)</script> <img src=x onerror=alert(2)>',
    nested: {
      richText: '<p>Paragraph <strong>bold</strong><iframe src="evil.com"></iframe></p>'
    }
  };
  const cleanContent = sanitizeBlockData(dirtyContent);
  assert.strictEqual(cleanContent.headline, 'Safe Headline');
  assert(!cleanContent.subheadline.includes('<script>'), 'Must strip script from subheadline');
  assert(!cleanContent.subheadline.includes('onerror'), 'Must strip onerror attribute');
  assert(!cleanContent.nested.richText.includes('<iframe'), 'Must strip iframe');
  assert(cleanContent.nested.richText.includes('<strong>bold</strong>'), 'Must preserve safe tags');
  console.log('✓ Server-side XSS block content sanitizer verified');

  // TEST 3: Structured Database Stores (Media & Pages with Structured JSON Blocks)
  console.log('\n--- 3. Testing Structured Database Stores ---');

  // 3a. Media Store
  const initialMediaList = db.getMedia();
  assert(Array.isArray(initialMediaList.assets), 'getMedia must return assets array');
  const newAsset = db.addMedia({
    filename: 'unit-test-asset.webp',
    url: '/uploads/unit-test-asset.webp',
    fileSize: 12048,
    dimensions: { width: 1920, height: 1080 },
    altText: 'Unit test solar array'
  });
  assert(newAsset.id, 'New media asset must have an ID');
  console.log('✓ Media asset added:', newAsset.id);

  db.updateMedia(newAsset.id, { altText: 'Updated solar array alt text' });
  const fetchedAsset = db.getMediaById(newAsset.id);
  assert.strictEqual(fetchedAsset.altText, 'Updated solar array alt text');
  console.log('✓ Media asset alt text update verified');

  db.deleteMedia(newAsset.id);
  assert.strictEqual(db.getMediaById(newAsset.id), null, 'Media asset should be deleted');
  console.log('✓ Media asset deletion verified');

  // 3b. Structured Pages & Blocks Store
  const pages = db.getPages();
  assert(Array.isArray(pages), 'getPages must return array');
  console.log(`✓ Retrieved ${pages.length} page(s) from database`);

  // Create a structured test page
  const testPage = db.createPage({
    slug: '/unit-test-landing',
    title: 'Unit Test Landing Page',
    status: 'draft',
    seo: {
      metaTitle: 'Unit Test SEO Title',
      metaDescription: 'Unit Test Description',
      keywords: ['test', 'engineering'],
      ogImage: '/uploads/test.webp'
    },
    // Strongly-typed structured JSON blocks (NOT raw HTML strings)
    blocks: [
      {
        id: 'blk-1',
        type: 'hero',
        order: 0,
        content: {
          headline: 'Custom Modular Hero',
          subheadline: 'Engineered in Lahore',
          primaryButton: { text: 'Contact', url: '/contact' }
        },
        styling: {
          paddingTop: 'lg',
          paddingBottom: 'lg',
          backgroundColor: '#1e293b',
          alignment: 'center',
          containerWidth: 'wide'
        }
      },
      {
        id: 'blk-2',
        type: 'columns-grid',
        order: 1,
        content: {
          items: [
            { title: 'Col 1', description: 'Lathe turning' },
            { title: 'Col 2', description: 'Power press stamping' }
          ]
        },
        styling: {
          paddingTop: 'md',
          paddingBottom: 'md',
          backgroundColor: '#ffffff',
          alignment: 'left',
          containerWidth: 'normal'
        }
      }
    ]
  });

  assert(testPage.id, 'createPage must assign unique page ID');
  assert.strictEqual(testPage.blocks.length, 2, 'Page must store 2 structured blocks');
  assert.strictEqual(testPage.blocks[0].type, 'hero', 'Block 1 type must be hero');
  assert.strictEqual(testPage.status, 'draft', 'Initial status must be draft');
  console.log('✓ Created structured page with strongly-typed JSON blocks:', testPage.slug);

  // Update page: add another block and publish
  const updatedPage = db.updatePage(testPage.id, {
    status: 'published',
    summary: 'Published page with third block',
    blocks: [
      ...testPage.blocks,
      {
        id: 'blk-3',
        type: 'cta',
        order: 2,
        content: {
          headline: 'Ready to build?',
          primaryButton: { text: 'Request Quote', url: '/quote' }
        },
        styling: {
          paddingTop: 'md',
          paddingBottom: 'md',
          backgroundColor: '#23588f',
          alignment: 'center',
          containerWidth: 'wide'
        }
      }
    ]
  }, 'admin_1');

  assert.strictEqual(updatedPage.status, 'published');
  assert.strictEqual(updatedPage.blocks.length, 3);
  assert.strictEqual(updatedPage.publishedBlocks.length, 3, 'publishedBlocks must update on publish');
  assert(updatedPage.revisions.length >= 2, 'Revisions history must record changes');
  console.log(`✓ Updated and published page. Revision history count: ${updatedPage.revisions.length}`);

  // Test rollback to revision
  const firstRev = updatedPage.revisions[updatedPage.revisions.length - 1];
  const revertedPage = db.revertPageRevision(testPage.id, firstRev.id);
  assert.strictEqual(revertedPage.blocks.length, 2, 'Reverting to initial revision should restore 2 blocks');
  console.log('✓ Revert to revision snapshot verified');

  // Clean up test page
  db.deletePage(testPage.id);
  assert.strictEqual(db.getPageById(testPage.id), null, 'Test page must be deleted');
  console.log('✓ Page deletion verified');

  // TEST 4: RBAC Middleware Check
  console.log('\n--- 4. Testing Role-Based Access Control (RBAC) ---');
  const superadminReq = { user: { role: 'superadmin', email: 'admin@houseofengineers.pk' } };
  const editorReq = { user: { role: 'editor', email: 'editor@houseofengineers.pk' } };

  let superadminAllowed = false;
  requireRole(['superadmin'])(superadminReq, {}, () => { superadminAllowed = true; });
  assert(superadminAllowed, 'Superadmin must pass requireRole([superadmin])');

  let editorBlocked = false;
  const mockRes = {
    status: (code) => {
      if (code === 403) editorBlocked = true;
      return { json: () => {} };
    }
  };
  requireRole(['superadmin'])(editorReq, mockRes, () => {});
  assert(editorBlocked, 'Editor must be blocked by requireRole([superadmin]) with 403 Forbidden');
  console.log('✓ RBAC permissions correctly enforce role boundaries (Super Admin vs Editor)');

  console.log('\n====================================================');
  console.log(' ALL PHASE 1 TESTS PASSED SUCCESSFULLY! (100%)');
  console.log('====================================================');
}

runPhase1Tests().catch(err => {
  console.error('\n❌ PHASE 1 TEST FAILED:', err);
  process.exit(1);
});
