process.env.NODE_ENV = 'test';
const http = require('http');
const app = require('./server');

const PORT = 5001; // test on port 5001 to avoid any conflicts
const server = app.listen(PORT, async () => {
  console.log(`[Test Suite] Running against test server on port ${PORT}...`);

  const request = (path, method = 'GET', body = null) => {
    return new Promise((resolve, reject) => {
      const data = body ? JSON.stringify(body) : null;
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: PORT,
          path,
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
          }
        },
        (res) => {
          let resData = '';
          res.on('data', (chunk) => (resData += chunk));
          res.on('end', () => {
            try {
              resolve({
                status: res.statusCode,
                headers: res.headers,
                body: JSON.parse(resData)
              });
            } catch (err) {
              resolve({
                status: res.statusCode,
                headers: res.headers,
                body: resData
              });
            }
          });
        }
      );
      req.on('error', reject);
      if (data) req.write(data);
      req.end();
    });
  };

  try {
    // 1. Test Health Check
    console.log('\n--- 1. Testing GET /api/health ---');
    const healthRes = await request('/api/health');
    console.log('Status:', healthRes.status);
    console.log('Response:', healthRes.body);
    if (healthRes.status !== 200 || healthRes.body.status !== 'ok') {
      throw new Error('Health check failed');
    }
    console.log('✓ Health check passed');

    // 1b. Test Static Frontend Delivery & SPA fallback
    console.log('\n--- 1b. Testing Static Frontend & Client Routing (GET / and GET /services) ---');
    const rootRes = await request('/');
    if (rootRes.status !== 200 || typeof rootRes.body !== 'string' || !rootRes.body.includes('<div id="root">')) {
      throw new Error('Root HTML delivery failed');
    }
    console.log('✓ Root SPA index.html served successfully');

    const spaRouteRes = await request('/services');
    if (spaRouteRes.status !== 200 || typeof spaRouteRes.body !== 'string' || !spaRouteRes.body.includes('<div id="root">')) {
      throw new Error('SPA client route fallback failed');
    }
    console.log('✓ SPA route fallback (/services) served successfully');

    // 2. Test Invalid Contact Submission
    console.log('\n--- 2. Testing POST /api/contact (Invalid Payload) ---');
    const invalidRes = await request('/api/contact', 'POST', {
      name: '',
      email: 'invalid-email',
      phone: '12',
      service: '',
      message: 'short'
    });
    console.log('Status:', invalidRes.status);
    console.log('Response:', invalidRes.body);
    if (invalidRes.status !== 400 || !invalidRes.body.errors || invalidRes.body.errors.length === 0) {
      throw new Error('Validation check should have failed with 400');
    }
    console.log('✓ Validation error check passed');

    // 3. Test Valid Contact Submission
    console.log('\n--- 3. Testing POST /api/contact (Valid Payload) ---');
    const validRes = await request('/api/contact', 'POST', {
      name: 'Engr. Muhammad Aslam',
      company: 'Pak Heavy Mechanical Works',
      email: 'aslam@pakheavy.com',
      phone: '+92 300 4567890',
      service: 'Precision Machining & Dedicated Parts',
      message: 'Require quotation for batch turning of 200 units alloy steel drive shafts according to ISO 2768-m tolerances.',
      drawingNote: 'AutoCAD STEP file ready for transfer.'
    });
    console.log('Status:', validRes.status);
    console.log('Response:', validRes.body);
    if (validRes.status !== 200 || !validRes.body.success) {
      throw new Error('Valid contact submission failed');
    }
    console.log('✓ Valid contact submission and inquiry dispatch passed');

    console.log('\n==========================================');
    console.log('ALL API UNIT & INTEGRATION TESTS PASSED!');
    console.log('==========================================');
  } catch (err) {
    console.error('\n❌ Test execution failed:', err);
    process.exitCode = 1;
  } finally {
    server.close(() => {
      console.log('[Test Suite] Server closed.');
    });
  }
});
