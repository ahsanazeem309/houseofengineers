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

    // 4. Test Public Content Aggregated Endpoint
    console.log('\n--- 4. Testing GET /api/content/all ---');
    const contentRes = await request('/api/content/all');
    console.log('Status:', contentRes.status);
    if (contentRes.status !== 200 || !contentRes.body.data.settings || !contentRes.body.data.services) {
      throw new Error('Public content endpoint failed');
    }
    console.log('✓ Public content endpoint returned complete data');

    // 5. Test Admin Login & JWT Issuance
    console.log('\n--- 5. Testing POST /api/auth/login ---');
    const loginRes = await request('/api/auth/login', 'POST', {
      email: 'admin@houseofengineers.pk',
      password: 'Admin@HOE2026!'
    });
    console.log('Status:', loginRes.status);
    if (loginRes.status !== 200 || !loginRes.body.token) {
      throw new Error('Admin login failed');
    }
    const adminToken = loginRes.body.token;
    console.log('✓ Admin login successful and JWT token received');

    // 6. Test Protected Admin Route with Token
    console.log('\n--- 6. Testing GET /api/admin/stats (Protected) ---');
    const statsRes = await new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: PORT,
          path: '/api/admin/stats',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          }
        },
        (res) => {
          let resData = '';
          res.on('data', (chunk) => (resData += chunk));
          res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(resData) }));
        }
      );
      req.on('error', reject);
      req.end();
    });
    console.log('Status:', statsRes.status);
    console.log('Stats:', statsRes.body.stats);
    if (statsRes.status !== 200 || statsRes.body.stats.totalInquiries < 1) {
      throw new Error('Admin stats check failed');
    }
    console.log('✓ Admin protected stats endpoint verified');
  } catch (err) {
    console.error('\n❌ Test execution failed:', err);
    process.exitCode = 1;
  } finally {
    server.close(() => {
      console.log('[Test Suite] Server closed.');
    });
  }
});
