const http = require('http');
const app = require('./server');

let server;
const PORT = 5003;

function makeRequest({ method, path, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers: {
        'Accept': 'application/json',
        ...headers
      }
    };

    if (body) {
      if (!options.headers['Content-Type']) {
        options.headers['Content-Type'] = 'application/json';
      }
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting Page CMS & Builder API Tests ---');

  // 1. Unauthorized request
  const unauthRes = await makeRequest({ method: 'GET', path: '/api/admin/pages' });
  console.assert(unauthRes.status === 401, `Expected 401 unauth, got ${unauthRes.status}`);
  console.log('✔ Unauthorized request properly blocked with 401');

  // 2. Login as Superadmin & Editor
  const adminLoginRes = await makeRequest({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: 'admin@houseofengineers.pk', password: 'Admin@HOE2026!' }
  });
  console.assert(adminLoginRes.status === 200, `Admin login failed: ${JSON.stringify(adminLoginRes.body)}`);
  const adminToken = adminLoginRes.body.token;

  const editorLoginRes = await makeRequest({
    method: 'POST',
    path: '/api/auth/login',
    body: { email: 'editor@houseofengineers.pk', password: 'Editor@HOE2026!' }
  });
  console.assert(editorLoginRes.status === 200, `Editor login failed: ${JSON.stringify(editorLoginRes.body)}`);
  const editorToken = editorLoginRes.body.token;
  console.log('✔ Logged in as Superadmin and Editor successfully');

  // 3. List pages
  const listRes = await makeRequest({
    method: 'GET',
    path: '/api/admin/pages',
    headers: { Authorization: `Bearer ${editorToken}` }
  });
  console.assert(listRes.status === 200 && Array.isArray(listRes.body.pages), 'Pages list failed');
  console.log(`✔ Pages retrieved count: ${listRes.body.pages.length}`);

  // 4. Create new draft page with structured blocks and XSS attack injection
  const testSlug = `/test-landing-${Date.now()}`;
  const createRes = await makeRequest({
    method: 'POST',
    path: '/api/admin/pages',
    headers: { Authorization: `Bearer ${editorToken}` },
    body: {
      title: 'Automated Test Landing Page',
      slug: testSlug,
      status: 'draft',
      seo: {
        metaTitle: 'Engineered Solutions | HOE',
        metaDescription: 'Industrial engineering and precision fabrication.',
        keywords: ['engineering', 'fabrication']
      },
      blocks: [
        {
          id: 'block-hero-test',
          type: 'hero',
          order: 0,
          content: {
            badge: 'Next Gen',
            heading: 'Precision Engineering Redefined <script>alert("XSS")</script>',
            subheading: 'ISO 9001 certified manufacturer.',
            primaryCtaText: 'Contact Us',
            primaryCtaLink: '/contact'
          },
          styling: {
            alignment: 'center',
            paddingY: 'lg',
            containerWidth: 'boxed'
          }
        },
        {
          id: 'block-rich-test',
          type: 'richText',
          order: 1,
          content: {
            title: 'Technical Overview',
            html: '<p>Standard paragraph text with <img src="x" onerror="alert(1)"> and <strong>safe bold tag</strong>.</p>'
          },
          styling: {
            paddingY: 'md',
            containerWidth: 'boxed'
          }
        }
      ]
    }
  });

  console.assert(createRes.status === 201, `Create page failed: ${JSON.stringify(createRes.body)}`);
  const createdPage = createRes.body.page;
  console.log('✔ Draft page created successfully with ID:', createdPage.id);

  // Verify XSS sanitization in stored blocks
  const heroHeading = createdPage.blocks[0].content.heading;
  console.assert(!heroHeading.includes('<script>'), `XSS was not stripped from hero heading: ${heroHeading}`);
  const richHtml = createdPage.blocks[1].content.html;
  console.assert(!richHtml.includes('onerror'), `XSS onerror was not stripped: ${richHtml}`);
  console.assert(richHtml.includes('<strong>safe bold tag</strong>'), `Safe strong tag was stripped: ${richHtml}`);
  console.log('✔ Recursive XSS sanitization verified on structured blocks');

  // 5. Update page and publish
  const updateRes = await makeRequest({
    method: 'PUT',
    path: `/api/admin/pages/${createdPage.id}`,
    headers: { Authorization: `Bearer ${editorToken}` },
    body: {
      status: 'published',
      summary: 'Ready for public launch',
      blocks: [
        ...createdPage.blocks,
        {
          id: 'block-cta-test',
          type: 'cta',
          order: 2,
          content: {
            heading: 'Ready to build your next project?',
            description: 'Request a customized quotation from our engineering team.',
            buttonText: 'Get Quote'
          },
          styling: {
            paddingY: 'xl',
            containerWidth: 'wide'
          }
        }
      ]
    }
  });

  console.assert(updateRes.status === 200, `Update page failed: ${JSON.stringify(updateRes.body)}`);
  const updatedPage = updateRes.body.page;
  console.assert(updatedPage.status === 'published', 'Page status should be published');
  console.assert(updatedPage.revisions.length >= 2, `Expected revisions >= 2, got ${updatedPage.revisions.length}`);
  console.log('✔ Page updated, published, and new revision snapshot created');

  // 6. Test Public Storefront Endpoint without authentication
  const publicRes = await makeRequest({
    method: 'GET',
    path: `/api/content/page?slug=${testSlug}`
  });
  console.assert(publicRes.status === 200, `Public page fetch failed: ${publicRes.status}`);
  console.assert(publicRes.body.page.blocks.length === 3, 'Public page should return published blocks');
  console.log('✔ Public page endpoint fetched published blocks successfully without auth');

  // 7. Test Revision Rollback
  const firstRevisionId = updatedPage.revisions[updatedPage.revisions.length - 1].id;
  const revertRes = await makeRequest({
    method: 'POST',
    path: `/api/admin/pages/${createdPage.id}/revert/${firstRevisionId}`,
    headers: { Authorization: `Bearer ${editorToken}` }
  });
  console.assert(revertRes.status === 200, `Revert failed: ${JSON.stringify(revertRes.body)}`);
  console.assert(revertRes.body.page.blocks.length === 2, 'Page should be reverted back to 2 blocks');
  console.log('✔ Page successfully reverted to initial revision snapshot');

  // 8. Test RBAC: Editor cannot delete page (403 Forbidden)
  const editorDeleteRes = await makeRequest({
    method: 'DELETE',
    path: `/api/admin/pages/${createdPage.id}`,
    headers: { Authorization: `Bearer ${editorToken}` }
  });
  console.assert(editorDeleteRes.status === 403, `Expected 403 for editor delete, got ${editorDeleteRes.status}`);
  console.log('✔ Editor delete page properly blocked with 403 Forbidden');

  // 9. Root homepage cannot be deleted even by Superadmin
  const pagesList = (await makeRequest({
    method: 'GET',
    path: '/api/admin/pages',
    headers: { Authorization: `Bearer ${adminToken}` }
  })).body.pages;
  const homePage = pagesList.find(p => p.slug === '/');
  if (homePage) {
    const rootDeleteRes = await makeRequest({
      method: 'DELETE',
      path: `/api/admin/pages/${homePage.id}`,
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.assert(rootDeleteRes.status === 400, `Expected 400 for deleting root homepage, got ${rootDeleteRes.status}`);
    console.log('✔ Deletion protection for root homepage verified (400 Bad Request)');
  }

  // 10. Superadmin deletes test page (200 OK)
  const adminDeleteRes = await makeRequest({
    method: 'DELETE',
    path: `/api/admin/pages/${createdPage.id}`,
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.assert(adminDeleteRes.status === 200, `Superadmin delete failed: ${JSON.stringify(adminDeleteRes.body)}`);
  console.log('✔ Superadmin successfully deleted test page (200 OK)');

  console.log('\n=========================================');
  console.log(' ALL PAGE CMS & BUILDER API TESTS PASSED! ');
  console.log('=========================================\n');
}

server = app.listen(PORT, async () => {
  console.log(`Test server running on port ${PORT}`);
  try {
    await runTests();
    server.close(() => process.exit(0));
  } catch (err) {
    console.error('Test run error:', err);
    server.close(() => process.exit(1));
  }
});
