import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link, Outlet } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { SiteContentProvider } from './context/SiteContentContext';

// Public Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Public Pages & Dedicated Silos
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import WorkshopPage from './pages/WorkshopPage';
import QualityStandards from './pages/QualityStandards';
import QuoteEstimator from './pages/QuoteEstimator';
import Contact from './pages/Contact';

// Admin Layout & Pages
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import InquiriesManager from './admin/pages/InquiriesManager';
import SiteSettingsEditor from './admin/pages/SiteSettingsEditor';
import ServicesManager from './admin/pages/ServicesManager';
import PortfolioManager from './admin/pages/PortfolioManager';
import WorkshopManager from './admin/pages/WorkshopManager';
import AccountSecurity from './admin/pages/AccountSecurity';

// Scroll to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Public Storefront Layout Wrapper
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-neutral font-sans selection:bg-brand-blue selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

// 404 Fallback
function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
      <div className="text-6xl font-extrabold text-brand-blue font-mono">404</div>
      <h1 className="text-2xl font-bold text-brand-slate">Engineering Page Not Found</h1>
      <p className="text-sm text-brand-charcoal max-w-md mx-auto">
        The requested technical page or route does not exist.
      </p>
      <div className="pt-4 flex justify-center gap-3">
        <Link to="/" className="btn-primary text-xs py-2.5 px-5">
          Return to Corporate Home
        </Link>
        <Link to="/admin" className="btn-outline text-xs py-2.5 px-5">
          Go to Admin Console
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteContentProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Shopify-Style Admin Dashboard */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="inquiries" element={<InquiriesManager />} />
              <Route path="settings" element={<SiteSettingsEditor />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="portfolio" element={<PortfolioManager />} />
              <Route path="workshop" element={<WorkshopManager />} />
              <Route path="security" element={<AccountSecurity />} />
            </Route>

            {/* Public Storefront & Dedicated Silo Structure */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              
              {/* Services Hub & Dedicated Silos */}
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceId" element={<ServiceDetail />} />
              
              {/* Portfolio Hub & Dedicated Case Study Silos */}
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:projectId" element={<ProjectDetail />} />
              
              {/* Facility & Quality Silos */}
              <Route path="/workshop" element={<WorkshopPage />} />
              <Route path="/quality-standards" element={<QualityStandards />} />
              
              {/* Interactive Quotation Silo */}
              <Route path="/quote" element={<QuoteEstimator />} />
              <Route path="/rfq" element={<QuoteEstimator />} />
              
              {/* Direct Contact */}
              <Route path="/contact" element={<Contact />} />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </SiteContentProvider>
    </AuthProvider>
  );
}
