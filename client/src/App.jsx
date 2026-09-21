import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';

// Scroll to top helper on route transitions
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// 404 Fallback component
function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
      <div className="text-6xl font-extrabold text-brand-blue font-mono">404</div>
      <h1 className="text-2xl font-bold text-brand-slate">Engineering Page Not Found</h1>
      <p className="text-sm text-brand-charcoal max-w-md mx-auto">
        The requested technical page or route does not exist. Please navigate back to the main portal or explore our capabilities.
      </p>
      <div className="pt-4">
        <Link to="/" className="btn-primary text-xs py-2.5 px-5">
          Return to Corporate Home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-brand-neutral font-sans selection:bg-brand-blue selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}
