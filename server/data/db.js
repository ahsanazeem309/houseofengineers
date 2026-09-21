const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  initialSiteSettings,
  initialServices,
  initialPortfolio,
  initialWorkshopInventory,
  initialDistricts,
  initialAdminUsers,
  initialPages,
  initialMedia
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
  users: null,
  pages: null,
  media: null
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
  },

  // ==========================================
  // Dedicated Media Asset Manager Store
  // ==========================================
  getMedia: (filters = {}) => {
    const media = readJson('media.json', initialMedia);
    let result = [...media];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(m => 
        (m.filename && m.filename.toLowerCase().includes(q)) ||
        (m.altText && m.altText.toLowerCase().includes(q)) ||
        (m.originalName && m.originalName.toLowerCase().includes(q))
      );
    }

    if (filters.type && filters.type !== 'all') {
      result = result.filter(m => m.mimeType && m.mimeType.includes(filters.type));
    }

    // Sort newest first
    result.sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0));

    const total = result.length;
    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 24;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return {
      assets: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  getMediaById: (id) => {
    const { assets } = db.getMedia({ limit: 100000 });
    return assets.find(m => m.id === id) || null;
  },

  addMedia: (asset) => {
    const media = readJson('media.json', initialMedia);
    const newAsset = {
      id: asset.id || `asset-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      filename: asset.filename,
      originalName: asset.originalName || asset.filename,
      url: asset.url,
      mimeType: asset.mimeType || 'image/webp',
      fileSize: asset.fileSize || 0,
      dimensions: asset.dimensions || { width: 0, height: 0 },
      altText: asset.altText || '',
      uploadedAt: new Date().toISOString(),
      uploadedBy: asset.uploadedBy || 'admin'
    };
    media.unshift(newAsset);
    writeJson('media.json', media);
    return newAsset;
  },

  updateMedia: (id, updates) => {
    const media = readJson('media.json', initialMedia);
    const index = media.findIndex(m => m.id === id);
    if (index === -1) return null;
    media[index] = {
      ...media[index],
      altText: typeof updates.altText !== 'undefined' ? updates.altText : media[index].altText,
      updatedAt: new Date().toISOString()
    };
    writeJson('media.json', media);
    return media[index];
  },

  deleteMedia: (id) => {
    const media = readJson('media.json', initialMedia);
    const filtered = media.filter(m => m.id !== id);
    if (filtered.length === media.length) return false;
    writeJson('media.json', filtered);
    return true;
  },

  // ==========================================
  // Structured Page & Modular Block CMS Store
  // ==========================================
  getPages: () => {
    const pages = readJson('pages.json', initialPages);
    // Return summaries without huge block trees for speed
    return pages.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      status: p.status,
      seo: p.seo,
      blockCount: (p.blocks || []).length,
      updatedAt: p.updatedAt,
      publishedAt: p.publishedAt
    }));
  },

  getPageById: (id) => {
    const pages = readJson('pages.json', initialPages);
    return pages.find(p => p.id === id) || null;
  },

  getPageBySlug: (slug) => {
    const pages = readJson('pages.json', initialPages);
    const normalized = slug === '' || slug === '/' ? '/' : slug.replace(/^\/+|\/+$/g, '');
    return pages.find(p => {
      const pageNorm = p.slug === '/' ? '/' : p.slug.replace(/^\/+|\/+$/g, '');
      return pageNorm === normalized;
    }) || null;
  },

  createPage: (pageData) => {
    const pages = readJson('pages.json', initialPages);
    const slug = (pageData.slug || '').trim().toLowerCase();
    
    // Ensure slug starts with /
    const formattedSlug = slug.startsWith('/') ? slug : `/${slug}`;
    
    // Check if slug already exists
    if (pages.some(p => p.slug === formattedSlug)) {
      throw new Error(`A page with slug "${formattedSlug}" already exists.`);
    }

    const newPage = {
      id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      slug: formattedSlug,
      title: pageData.title || 'Untitled Page',
      status: pageData.status || 'draft',
      seo: {
        metaTitle: pageData.seo?.metaTitle || pageData.title || 'House of Engineers',
        metaDescription: pageData.seo?.metaDescription || '',
        keywords: pageData.seo?.keywords || [],
        ogImage: pageData.seo?.ogImage || ''
      },
      // Structured JSON blocks (no raw HTML strings as root container)
      blocks: Array.isArray(pageData.blocks) ? pageData.blocks : [],
      publishedBlocks: pageData.status === 'published' && Array.isArray(pageData.blocks) ? pageData.blocks : [],
      revisions: [
        {
          id: `rev-${Date.now()}`,
          timestamp: new Date().toISOString(),
          savedBy: pageData.savedBy || 'admin',
          summary: 'Initial page creation',
          blocks: Array.isArray(pageData.blocks) ? pageData.blocks : []
        }
      ],
      updatedAt: new Date().toISOString(),
      publishedAt: pageData.status === 'published' ? new Date().toISOString() : null
    };

    pages.push(newPage);
    writeJson('pages.json', pages);
    return newPage;
  },

  updatePage: (id, pageData, user = 'admin') => {
    const pages = readJson('pages.json', initialPages);
    const index = pages.findIndex(p => p.id === id);
    if (index === -1) return null;

    const existing = pages[index];
    const isPublishing = pageData.status === 'published';

    // Structured blocks assignment
    const updatedBlocks = Array.isArray(pageData.blocks) ? pageData.blocks : existing.blocks;

    // Create a new version snapshot
    const revision = {
      id: `rev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      savedBy: user,
      summary: pageData.summary || (isPublishing ? 'Published changes' : 'Saved draft update'),
      blocks: JSON.parse(JSON.stringify(updatedBlocks))
    };

    const revisions = [revision, ...(existing.revisions || [])].slice(0, 15); // Keep rolling 15 snapshots

    pages[index] = {
      ...existing,
      title: pageData.title || existing.title,
      slug: pageData.slug || existing.slug,
      status: pageData.status || existing.status,
      seo: {
        metaTitle: pageData.seo?.metaTitle ?? existing.seo?.metaTitle,
        metaDescription: pageData.seo?.metaDescription ?? existing.seo?.metaDescription,
        keywords: pageData.seo?.keywords ?? existing.seo?.keywords,
        ogImage: pageData.seo?.ogImage ?? existing.seo?.ogImage
      },
      blocks: updatedBlocks,
      publishedBlocks: isPublishing ? JSON.parse(JSON.stringify(updatedBlocks)) : (existing.publishedBlocks || []),
      revisions,
      updatedAt: new Date().toISOString(),
      publishedAt: isPublishing ? new Date().toISOString() : existing.publishedAt
    };

    writeJson('pages.json', pages);
    return pages[index];
  },

  revertPageRevision: (id, revisionId) => {
    const pages = readJson('pages.json', initialPages);
    const index = pages.findIndex(p => p.id === id);
    if (index === -1) return null;

    const page = pages[index];
    const targetRev = (page.revisions || []).find(r => r.id === revisionId);
    if (!targetRev) return null;

    page.blocks = JSON.parse(JSON.stringify(targetRev.blocks));
    page.updatedAt = new Date().toISOString();
    
    // Add revision record documenting the revert
    page.revisions.unshift({
      id: `rev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      savedBy: 'admin',
      summary: `Reverted to revision snapshot from ${new Date(targetRev.timestamp).toLocaleString()}`,
      blocks: JSON.parse(JSON.stringify(targetRev.blocks))
    });

    writeJson('pages.json', pages);
    return page;
  },

  deletePage: (id) => {
    const pages = readJson('pages.json', initialPages);
    const filtered = pages.filter(p => p.id !== id);
    if (filtered.length === pages.length) return false;
    writeJson('pages.json', filtered);
    return true;
  }
};

module.exports = db;

