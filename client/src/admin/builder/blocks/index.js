import {
  Sparkles,
  FileText,
  LayoutGrid,
  Image as ImageIcon,
  Megaphone,
  BarChart3,
  Table
} from 'lucide-react';

import HeroBlock from './HeroBlock';
import RichTextBlock from './RichTextBlock';
import ColumnsGridBlock from './ColumnsGridBlock';
import MediaDisplayBlock from './MediaDisplayBlock';
import CtaBlock from './CtaBlock';
import StatsBlock from './StatsBlock';
import SpecsTableBlock from './SpecsTableBlock';

export const BLOCK_DEFINITIONS = [
  {
    type: 'hero',
    label: 'Hero Showcase',
    icon: Sparkles,
    description: 'Impactful headline, badges, dual action buttons, and hero visual.',
    component: HeroBlock,
    createDefault: () => ({
      id: `block-hero-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'hero',
      content: {
        badge: 'HOUSE OF ENGINEERS',
        heading: 'High-Precision Engineering & Industrial Manufacturing',
        highlightWord: 'Engineering',
        subheading: 'Delivering turnkey solar mounting structures, pre-engineered steel buildings, and heavy fabrication solutions across Pakistan.',
        primaryCtaText: 'Explore Capabilities',
        primaryCtaLink: '/services',
        secondaryCtaText: 'Request Consultation',
        secondaryCtaLink: '/contact',
        featuredImage: '',
        featuredImageAlt: 'Engineering Showcase',
        alignment: 'center'
      },
      styling: {
        paddingY: 'lg',
        containerWidth: 'boxed',
        backgroundPreset: 'gradient'
      }
    })
  },
  {
    type: 'richText',
    label: 'Rich Text Section',
    icon: FileText,
    description: 'Formatted copy, headings, bullet lists, and highlight callouts.',
    component: RichTextBlock,
    createDefault: () => ({
      id: `block-rich-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'richText',
      content: {
        badge: 'ENGINEERING STANDARD',
        title: 'Engineered for Performance and Durability',
        leadText: 'Certified manufacturing with rigid tolerance controls and automated CNC processing.',
        html: '<p>Our precision manufacturing processes integrate strict ASTM, DIN, and ISO standards to guarantee structural integrity across every fabrication cycle.</p>',
        callout: 'All structural components undergo comprehensive ultrasonic weld inspection prior to site dispatch.',
        alignment: 'left'
      },
      styling: {
        paddingY: 'md',
        containerWidth: 'boxed',
        backgroundPreset: 'default'
      }
    })
  },
  {
    type: 'columnsGrid',
    label: 'Multi-Column Grid',
    icon: LayoutGrid,
    description: '2, 3, or 4 column feature cards with icons, images, and links.',
    component: ColumnsGridBlock,
    createDefault: () => ({
      id: `block-grid-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'columnsGrid',
      content: {
        badge: 'CAPABILITIES',
        title: 'Industrial Solutions Built to Scale',
        description: 'Engineered infrastructure designed for long operating life in harsh environmental conditions.',
        columns: 3,
        cardStyle: 'glass',
        items: [
          {
            title: 'Solar Mounting Systems',
            description: 'Hot-dip galvanized mounting structures engineered for high wind load resistance (up to 160 km/h).',
            iconName: 'lightning',
            linkText: 'Learn More',
            linkUrl: '/services'
          },
          {
            title: 'Pre-Engineered Steel Sheds',
            description: 'Rapid-deployment industrial buildings, warehouses, and factories with customized clear spans.',
            iconName: 'cube',
            linkText: 'Learn More',
            linkUrl: '/services'
          },
          {
            title: 'CNC Plasma & Laser Cutting',
            description: 'High-precision CNC cutting for carbon steel, stainless steel, and alloy plates up to 30mm thickness.',
            iconName: 'cog',
            linkText: 'Learn More',
            linkUrl: '/services'
          }
        ]
      },
      styling: {
        paddingY: 'lg',
        containerWidth: 'boxed',
        backgroundPreset: 'navy'
      }
    })
  },
  {
    type: 'mediaDisplay',
    label: 'Media Showcase',
    icon: ImageIcon,
    description: 'High-resolution image displays, side-by-side comparisons, or wide banners.',
    component: MediaDisplayBlock,
    createDefault: () => ({
      id: `block-media-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'mediaDisplay',
      content: {
        badge: 'FACILITY TOUR',
        title: 'Our Modern Industrial Workshop',
        caption: 'Automated fabrication bay equipped with robotic submerged arc welding and CNC shearing.',
        layout: 'single',
        primaryImage: '',
        primaryAlt: 'Manufacturing Facility',
        secondaryImage: '',
        secondaryAlt: '',
        aspectRatio: '16/9'
      },
      styling: {
        paddingY: 'md',
        containerWidth: 'boxed',
        backgroundPreset: 'default'
      }
    })
  },
  {
    type: 'cta',
    label: 'Call to Action Banner',
    icon: Megaphone,
    description: 'High-conversion banner with bold headline and proposal request triggers.',
    component: CtaBlock,
    createDefault: () => ({
      id: `block-cta-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'cta',
      content: {
        badge: 'START YOUR PROJECT',
        heading: 'Ready to Build With Pakistan’s Leading Engineering Facility?',
        description: 'Consult directly with our structural engineers. We provide precision CAD modeling and rapid proposal estimates.',
        primaryButtonText: 'Request Formal Proposal',
        primaryButtonLink: '/contact',
        secondaryButtonText: 'Direct Hotline',
        secondaryButtonLink: 'tel:+923000000000'
      },
      styling: {
        paddingY: 'xl',
        containerWidth: 'boxed',
        backgroundPreset: 'default'
      }
    })
  },
  {
    type: 'stats',
    label: 'Stats & Numbers Counter',
    icon: BarChart3,
    description: 'Metrics counters showcasing scale, project counts, and quality rates.',
    component: StatsBlock,
    createDefault: () => ({
      id: `block-stats-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'stats',
      content: {
        badge: 'BY THE NUMBERS',
        title: 'Proven Track Record of Excellence',
        stats: [
          { value: '500+', label: 'Projects Completed', description: 'Utility-scale & commercial builds' },
          { value: '150 MW+', label: 'Solar Structures Fabricated', description: 'Fixed tilt & elevated canopy mounting' },
          { value: '99.8%', label: 'Quality Acceptance Rate', description: 'Zero defect tolerance inspection' },
          { value: '25+ Yrs', label: 'Design Service Life', description: 'Hot-dip galvanized ASTM A123' }
        ]
      },
      styling: {
        paddingY: 'lg',
        containerWidth: 'boxed',
        backgroundPreset: 'dark'
      }
    })
  },
  {
    type: 'specsTable',
    label: 'Technical Specs Table',
    icon: Table,
    description: 'Engineering tolerances, material grades, standards, and notes table.',
    component: SpecsTableBlock,
    createDefault: () => ({
      id: `block-specs-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: 'specsTable',
      content: {
        badge: 'ENGINEERING STANDARDS',
        title: 'Manufacturing & Tolerances Breakdown',
        description: 'Certified to exceed ASTM, DIN, and ISO requirements.',
        rows: [
          {
            parameter: 'Structural Material',
            specification: 'Hot-Rolled Carbon & High-Strength Alloy Steel',
            standard: 'ASTM A36 / ASTM A572 Gr 50',
            note: 'Certificates with Heat Numbers provided'
          },
          {
            parameter: 'Corrosion Protection',
            specification: 'Hot-Dip Galvanization (85–100 microns)',
            standard: 'ASTM A123 / ISO 1461',
            note: 'Salt spray resistance > 1000 hrs'
          },
          {
            parameter: 'Wind Load Engineering',
            specification: 'Designed for Wind Velocities up to 160 km/h',
            standard: 'ASCE 7-16 / UBC 97',
            note: '3D FEA wind tunnel simulation'
          }
        ]
      },
      styling: {
        paddingY: 'md',
        containerWidth: 'boxed',
        backgroundPreset: 'navy'
      }
    })
  }
];

export const BLOCK_MAP = BLOCK_DEFINITIONS.reduce((acc, def) => {
  acc[def.type] = def.component;
  return acc;
}, {});

export const getBlockDefinition = (type) =>
  BLOCK_DEFINITIONS.find(def => def.type === type) || null;
