import React, { createContext, useContext, useState, useEffect } from 'react';
import { servicesCategories as defaultServices } from '../data/servicesData';
import { portfolioProjects as defaultPortfolio } from '../data/portfolioData';

const defaultSettings = {
  companyName: 'House of Engineers Pvt. Ltd.',
  brandTagline: 'Industrial Engineering & Custom Metal Fabrication',
  heroHeadline: 'Precision Industrial Engineering & Custom Metal Fabrication',
  heroSubheadline: 'From certified solar mount structures to precision lathe machining and bespoke architectural metalwork across Punjab.',
  primaryPhone: '+92 300 123 4567',
  whatsappNumber: '923001234567',
  procurementEmail: 'info@houseofengineers.pk',
  secondaryEmail: 'procurement@houseofengineers.pk',
  workshopAddress: 'Industrial Sector, Lahore, Punjab, Pakistan',
  workingHours: 'Monday – Saturday: 08:00 – 18:00 PKT',
  coordinates: '31.5204° N, 74.3587° E',
  metricBadges: [
    { title: 'Turnkey Installation', desc: 'Active Across All Punjab Districts' },
    { title: 'Custom Die & Mold', desc: 'High-Tolerance Micron Lathe Turning' },
    { title: 'Commercial & Residential', desc: 'Heavy Gantry & High-Tensile Framing' }
  ],
  cadBanner: {
    badge: 'B2B Procurement & Engineering Consultation',
    headline: 'Have Technical CAD Drawings or Project Blueprints?',
    description: 'Submit your AutoCAD DWG/PDF drawings, BOM (Bill of Materials), or request an on-site structural engineer consultation anywhere across Punjab. Our estimating desk provides itemized quotes within 24 hours.'
  }
};

const defaultWorkshop = {
  inventory: [
    {
      id: 'presses',
      name: 'Mechanical Power Presses (20T - 150T)',
      category: 'Stamping & Batch Punching',
      specs: 'Stroke length: 60mm - 180mm | Die bolster area: up to 1000mm x 750mm',
      description: 'Dedicated fleet of eccentric mechanical presses engineered for high-speed strip feeding, heavy sheet blanking, progressive piercing, and structural bracket embossing.',
      applications: 'Solar mounting rail brackets, automotive hardware, base plates, electrical fittings.',
      icon: 'Factory'
    },
    {
      id: 'lathes',
      name: 'Heavy Industrial Lathe Centers',
      category: 'Precision Turning & Milling',
      specs: 'Turning diameter: up to Ø600mm | Bed length: up to 2,500mm | Accuracy: ±0.01mm',
      description: 'Heavy geared-head lathes equipped with digital readout (DRO) systems for high-tolerance cylindrical turning, external/internal metric & inch thread chasing, taper turning, and precision boring.',
      applications: 'Industrial rollers, textile shafts, flanged bushings, splined spindles, coupling sleeves.',
      icon: 'Cog'
    },
    {
      id: 'welding',
      name: 'Certified Welding Bays (Argon TIG & Heavy MIG)',
      category: 'Structural Jointing',
      specs: 'AWS D1.1 structural welding code compliant | AC/DC TIG & 400A MIG/MAG systems',
      description: 'Specialized fabrication bays for high-load structural joints. Includes specialized argon gas shielding for stainless steel and non-ferrous metals, plus multi-pass submerged arc rigs.',
      applications: 'Heavy parking shed trusses, cantilever frames, factory gate hinges, pressurized vessels.',
      icon: 'Hammer'
    },
    {
      id: 'foundry',
      name: 'Foundry & Aluminum Casting Bay',
      category: 'Foundry & Mold Development',
      specs: 'Alloys: LM6 / A356 foundry grade | Sand casting & gravity die molding setups',
      description: 'Integrated pattern shop and aluminum foundry capable of pouring bespoke architectural panels, intricate decorative grills, and custom machine housings directly from client CAD or physical samples.',
      applications: 'Estate balcony railings, geometric facade louvers, machinery casings, ornamental brackets.',
      icon: 'Layers'
    }
  ],
  districts: [
    'Lahore (HQ & Works)', 'Faisalabad (Textile Belt)', 'Gujranwala (Industrial Hub)',
    'Sialkot (Export Sector)', 'Rawalpindi & Islamabad', 'Multan & South Punjab',
    'Sheikhupura & Muridke', 'Sahiwal & Okara', 'Kasur & Chunian'
  ]
};

const SiteContentContext = createContext(null);

export const SiteContentProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [services, setServices] = useState(defaultServices);
  const [portfolio, setPortfolio] = useState(defaultPortfolio);
  const [workshop, setWorkshop] = useState(defaultWorkshop);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content/all');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          if (result.data.settings) setSettings(result.data.settings);
          if (result.data.services && result.data.services.length > 0) setServices(result.data.services);
          if (result.data.portfolio && result.data.portfolio.length > 0) setPortfolio(result.data.portfolio);
          if (result.data.workshop) setWorkshop(result.data.workshop);
        }
      }
    } catch (err) {
      console.warn('[SiteContent] Using local default content:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <SiteContentContext.Provider
      value={{
        settings,
        services,
        portfolio,
        workshop,
        isLoading,
        refreshContent: fetchContent
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
