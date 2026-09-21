const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  initialSiteSettings,
  initialServices,
  initialPortfolio,
  initialWorkshopInventory,
  initialDistricts,
  initialAdminUsers
} = require('./initialData');

// Determine base data directory: use /tmp if on Vercel/serverless, else local server/data
const isVercel = process.env.VERCEL === '1' || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
const baseDir = isVercel
  ? path.join(os.tmpdir(), 'house_of_engineers_data')
  : path.join(__dirname);

if (!fs.existsSync(baseDir)) {
  try {
    fs.mkdirSync(baseDir, { recursive: true });
  } catch (err) {
    console.warn('[DB] Notice creating base directory:', err.message);
  }
}

// In-memory cache
const memoryCache = {
  settings: null,
  services: null,
  portfolio: null,
  workshop: null,
  inquiries: null,
  users: null
};

/**
 * Read JSON file helper with memory cache fallback
 */
function readJson(filename, defaultData) {
  const cacheKey = filename.replace('.json', '');
  if (memoryCache[cacheKey]) {
    return memoryCache[cacheKey];
  }

  const filePath = path.join(baseDir, filename);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content);
      memoryCache[cacheKey] = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn(`[DB] Error reading ${filename}, falling back to defaults:`, err.message);
  }

  // If file doesn't exist, write defaults and cache
  memoryCache[cacheKey] = defaultData;
  writeJson(filename, defaultData);
  return defaultData;
}

/**
 * Write JSON atomically
 */
function writeJson(filename, data) {
  const cacheKey = filename.replace('.json', '');
  memoryCache[cacheKey] = data;

  const filePath = path.join(baseDir, filename);
  const tempPath = `${filePath}.tmp.${Date.now()}`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.warn(`[DB] Error writing ${filename}:`, err.message);
    try {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    } catch (_) {}
  }
}

// ==========================================
// DB Methods
// ==========================================

const db = {
  // Settings
  getSiteSettings: () => {
    return readJson('site_settings.json', initialSiteSettings);
  },
  updateSiteSettings: (updates) => {
    const current = db.getSiteSettings();
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    writeJson('site_settings.json', updated);
    return updated;
  },

  // Services
  getServices: () => {
    return readJson('services.json', initialServices);
  },
  saveServices: (services) => {
    writeJson('services.json', services);
    return services;
  },
  createService: (serviceData) => {
    const services = db.getServices();
    const newService = {
      ...serviceData,
      id: serviceData.id || `service-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString()
    };
    services.push(newService);
    writeJson('services.json', services);
    return newService;
  },
  updateService: (id, serviceData) => {
    const services = db.getServices();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) return null;
    services[index] = { ...services[index], ...serviceData, updatedAt: new Date().toISOString() };
    writeJson('services.json', services);
    return services[index];
  },
  deleteService: (id) => {
    const services = db.getServices();
    const filtered = services.filter((s) => s.id !== id);
    if (filtered.length === services.length) return false;
    writeJson('services.json', filtered);
    return true;
  },

  // Portfolio
  getPortfolio: () => {
    return readJson('portfolio.json', initialPortfolio);
  },
  createPortfolioProject: (projectData) => {
    const portfolio = db.getPortfolio();
    const newProject = {
      ...projectData,
      id: projectData.id || `proj-${Date.now().toString(36)}`,
      year: projectData.year || new Date().getFullYear().toString(),
      createdAt: new Date().toISOString()
    };
    portfolio.unshift(newProject);
    writeJson('portfolio.json', portfolio);
    return newProject;
  },
  updatePortfolioProject: (id, projectData) => {
    const portfolio = db.getPortfolio();
    const index = portfolio.findIndex((p) => p.id === id);
    if (index === -1) return null;
    portfolio[index] = { ...portfolio[index], ...projectData, updatedAt: new Date().toISOString() };
    writeJson('portfolio.json', portfolio);
    return portfolio[index];
  },
  deletePortfolioProject: (id) => {
    const portfolio = db.getPortfolio();
    const filtered = portfolio.filter((p) => p.id !== id);
    if (filtered.length === portfolio.length) return false;
    writeJson('portfolio.json', filtered);
    return true;
  },

  // Workshop & Provincial Coverage
  getWorkshop: () => {
    return readJson('workshop.json', {
      inventory: initialWorkshopInventory,
      districts: initialDistricts
    });
  },
  updateWorkshop: (inventory, districts) => {
    const data = {
      inventory: inventory || initialWorkshopInventory,
      districts: districts || initialDistricts,
      updatedAt: new Date().toISOString()
    };
    writeJson('workshop.json', data);
    return data;
  },

  // Inquiries / Leads
  getInquiries: () => {
    return readJson('inquiries.json', []);
  },
  addInquiry: (inquiryData) => {
    const inquiries = db.getInquiries();
    const newInquiry = {
      id: inquiryData.referenceId || `HOE-${Date.now().toString(36).toUpperCase()}`,
      status: 'new', // new | contacted | quoted | closed
      notes: '',
      submittedAt: new Date().toISOString(),
      ...inquiryData
    };
    inquiries.unshift(newInquiry);
    writeJson('inquiries.json', inquiries);
    return newInquiry;
  },
  updateInquiryStatus: (id, status, notes) => {
    const inquiries = db.getInquiries();
    const index = inquiries.findIndex((i) => i.id === id);
    if (index === -1) return null;
    inquiries[index] = {
      ...inquiries[index],
      status: status || inquiries[index].status,
      notes: typeof notes !== 'undefined' ? notes : inquiries[index].notes,
      updatedAt: new Date().toISOString()
    };
    writeJson('inquiries.json', inquiries);
    return inquiries[index];
  },
  deleteInquiry: (id) => {
    const inquiries = db.getInquiries();
    const filtered = inquiries.filter((i) => i.id !== id);
    if (filtered.length === inquiries.length) return false;
    writeJson('inquiries.json', filtered);
    return true;
  },

  // Admin Users
  getAdminUsers: () => {
    return readJson('users.json', initialAdminUsers);
  },
  findAdminByEmail: (email) => {
    const users = db.getAdminUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
  updateAdminPassword: (email, newPasswordHash) => {
    const users = db.getAdminUsers();
    const index = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (index === -1) return false;
    users[index].passwordHash = newPasswordHash;
    users[index].updatedAt = new Date().toISOString();
    writeJson('users.json', users);
    return true;
  }
};

module.exports = db;
