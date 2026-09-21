const assert = require('assert');
const http = require('http');
const sharp = require('sharp');
const jwt = require('jsonwebtoken');

const app = require('./server');
const { JWT_SECRET } = require('./middleware/authMiddleware');
const db = require('./data/db');

function request(options, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ ...options, headers: { ...options.headers, ...headers } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, headers: res.headers, data: json, raw: body });
        } catch (_) {
          resolve({ status: res.statusCode, headers: res.headers, data: body, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runMediaApiTests() {
  console.log('====================================================');
  console.log(' TESTING MEDIA ASSET MANAGER BACKEND API');
  console.log('====================================================\n');

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(5002, resolve));
  const baseUrl = 'http://localhost:5002';
  console.log('✓ Media test server listening on port 5002');

  const superadminToken = jwt.sign(
    { email: 'admin@houseofengineers.pk', role: 'superadmin' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const editorToken = jwt.sign(
    { email: 'editor@houseofengineers.pk', role: 'editor' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // TEST 1: GET /api/admin/media without auth
  console.log('\n--- 1. Testing GET /api/admin/media without auth (Should be 401) ---');
  const unauthRes = await request({
    hostname: 'localhost',
    port: 5002,
    path: '/api/admin/media',
    method: 'GET'
  });
  assert.strictEqual(unauthRes.status, 401, 'Unauthenticated request must return 401');
  console.log('✓ Unauthenticated request properly rejected with 401');

  // TEST 2: GET /api/admin/media with superadmin auth
  console.log('\n--- 2. Testing GET /api/admin/media with valid JWT ---');
  const getMediaRes = await request(
    {
      hostname: 'localhost',
      port: 5002,
      path: '/api/admin/media',
      method: 'GET'
    },
    null,
    { Authorization: `Bearer ${superadminToken}` }
  );
  assert.strictEqual(getMediaRes.status, 200);
  assert(Array.isArray(getMediaRes.data.assets), 'Must return assets array');
  console.log(`✓ Retrieved ${getMediaRes.data.assets.length} assets. Total in DB: ${getMediaRes.data.total}`);

  // TEST 3: POST /api/admin/media/upload (Multipart upload with sharp-generated test PNG)
  console.log('\n--- 3. Testing POST /api/admin/media/upload (Multipart Image Upload) ---');
  const testPngBuffer = await sharp({
    create: {
      width: 400,
      height: 300,
      channels: 4,
      background: { r: 228, g: 135, b: 56, alpha: 1 } // Brand orange
    }
  }).png().toBuffer();

  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const multipartBody = Buffer.concat([
    Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="files"; filename="solar-test-canopy.png"\r\n` +
      `Content-Type: image/png\r\n\r\n`
    ),
    testPngBuffer,
    Buffer.from(
      `\r\n--${boundary}\r\n` +
      `Content-Disposition: form-data; name="altText"\r\n\r\n` +
      `Test High-Tensile Solar Canopy\r\n` +
      `--${boundary}--\r\n`
    )
  ]);

  const uploadRes = await request(
    {
      hostname: 'localhost',
      port: 5002,
      path: '/api/admin/media/upload',
      method: 'POST'
    },
    multipartBody,
    {
      Authorization: `Bearer ${editorToken}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': multipartBody.length
    }
  );

  assert.strictEqual(uploadRes.status, 201, `Upload should return 201, got ${uploadRes.status}`);
  assert(uploadRes.data.success, 'Upload response must indicate success');
  assert(uploadRes.data.assets.length >= 1, 'Must return uploaded asset record');
  const uploadedAsset = uploadRes.data.assets[0];

  assert(uploadedAsset.url.startsWith('/uploads/'), 'URL must point to /uploads/');
  assert.strictEqual(uploadedAsset.mimeType, 'image/webp', 'Raster PNG must be optimized to WebP');
  assert.strictEqual(uploadedAsset.dimensions.width, 400, 'Width must be 400');
  assert.strictEqual(uploadedAsset.dimensions.height, 300, 'Height must be 300');
  assert.strictEqual(uploadedAsset.altText, 'Test High-Tensile Solar Canopy');
  console.log('✓ File uploaded, compressed to WebP, metadata generated:', uploadedAsset.id, uploadedAsset.url);

  // TEST 4: PATCH /api/admin/media/:id (Update alt text)
  console.log('\n--- 4. Testing PATCH /api/admin/media/:id (Update Alt Text) ---');
  const updatePayload = JSON.stringify({ altText: 'Updated Certified Solar Framework' });
  const patchRes = await request(
    {
      hostname: 'localhost',
      port: 5002,
      path: `/api/admin/media/${uploadedAsset.id}`,
      method: 'PATCH'
    },
    updatePayload,
    {
      Authorization: `Bearer ${editorToken}`,
      'Content-Type': 'application/json'
    }
  );
  assert.strictEqual(patchRes.status, 200);
  assert.strictEqual(patchRes.data.asset.altText, 'Updated Certified Solar Framework');
  console.log('✓ Alt text updated successfully');

  // TEST 5: DELETE /api/admin/media/:id (Editor should be 403, Superadmin should succeed)
  console.log('\n--- 5. Testing DELETE /api/admin/media/:id (RBAC Enforcement) ---');
  // Editor attempts deletion -> 403 Forbidden
  const editorDeleteRes = await request(
    {
      hostname: 'localhost',
      port: 5002,
      path: `/api/admin/media/${uploadedAsset.id}`,
      method: 'DELETE'
    },
    null,
    { Authorization: `Bearer ${editorToken}` }
  );
  assert.strictEqual(editorDeleteRes.status, 403, 'Editor role must be forbidden from deleting media');
  console.log('✓ Editor correctly blocked from deleting media with 403 Forbidden');

  // Superadmin attempts deletion -> 200 OK
  const superadminDeleteRes = await request(
    {
      hostname: 'localhost',
      port: 5002,
      path: `/api/admin/media/${uploadedAsset.id}`,
      method: 'DELETE'
    },
    null,
    { Authorization: `Bearer ${superadminToken}` }
  );
  assert.strictEqual(superadminDeleteRes.status, 200, 'Superadmin must be allowed to delete media');
  console.log('✓ Superadmin successfully deleted media asset');

  server.close();
  console.log('\n====================================================');
  console.log(' ALL MEDIA BACKEND API TESTS PASSED! (100%)');
  console.log('====================================================');
}

runMediaApiTests().catch(err => {
  console.error('❌ Media API test error:', err);
  process.exit(1);
});
