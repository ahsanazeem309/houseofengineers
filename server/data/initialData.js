const initialSiteSettings = {
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

const initialServices = [
  {
    id: 'solar-mounting',
    title: 'Solar Mounting Structures',
    shortTitle: 'Solar Structural Engineering',
    tagline: 'Certified wind-load resilience & corrosion-protected solar mounting frameworks.',
    description: 'Complete engineering, CNC-grade roll-forming, punching, and on-site structural assembly for commercial plazas, industrial plants, and residential rooftop arrays across Punjab.',
    icon: 'Sun',
    accentColor: '#e48738',
    features: [
      'Commercial elevated frameworks & high-rise solar canopies',
      'Rooftop residential ballasted and fixed-tilt mounting frames',
      'Single & dual-axis custom motorized tracking mounts',
      'Wind-load certified up to 140 km/h wind shear ratings',
      'Hot-dip galvanized (HDG) coating up to 80-100 microns for 25+ years rust resistance',
      'Precision slotted and punched mounting rails for rapid bolt-on PV panel alignment',
      'Complete turnkey on-site structural erection & certified torque bolt tightening'
    ],
    specifications: [
      { label: 'Structural Steel Grade', value: 'ASTM A36 / Q235B / Cold-Formed High Tensile Steel' },
      { label: 'Corrosion Protection', value: 'Hot-Dip Galvanized (HDG) to ASTM A123 or Pre-Galvanized Z275' },
      { label: 'Material Thickness', value: '1.5mm to 4.0mm heavy gauge channels and purlins' },
      { label: 'Wind Load Rating', value: 'Designed & tested for 120 - 150 km/h gusts' },
      { label: 'Tilt Angle Range', value: 'Fixed 10° - 35° or customized site-optimized pitch' },
      { label: 'Fasteners & Hardware', value: 'SS304 / Grade 8.8 Dacromet coated anti-seize fasteners' }
    ],
    applications: [
      'Industrial Textile Mill Rooftops (Faisalabad, Lahore, Sheikhupura)',
      'Commercial Plazas & Multi-Storey Rooftop Arrays',
      'Solar Car Parking Sheds & Driveway Canopy Power Stations',
      'Agricultural Solar Tube Well Mounting Arrays across Punjab',
      'Residential Elevated Frames (ensuring usable roof area underneath)'
    ]
  },
  {
    id: 'precision-machining',
    title: 'Precision Machining & Dedicated Parts',
    shortTitle: 'Precision Parts & Tooling',
    tagline: 'High-tolerance lathe turning, die casting molds, and specialized machine tooling.',
    description: 'Custom fabrication for proprietary industrial machines, textile looms, agricultural implements, and specialized automotive / motorcycle replacement hardware with micron-level tolerances.',
    icon: 'Cog',
    accentColor: '#23588f',
    features: [
      'Custom fabrication for proprietary industrial machines & production equipment',
      'Micro-level components, specialized hardware, and bespoke mechanical fittings',
      'High-tolerance engine bushings, shafts, and motorcycle replacement parts',
      'Custom die design, progressive punch tooling, and blanking dies',
      'Precision lathe turning, threading, cylindrical milling, and gear cutting',
      'Batch production stamping on mechanical power presses (20T - 150T)',
      'Heat treatment & surface hardening (case hardening, nitriding, black oxide)'
    ],
    specifications: [
      { label: 'Machining Tolerances', value: 'Up to ±0.01mm (10 microns) on critical diameters' },
      { label: 'Workpiece Capacity', value: 'Turning up to Ø600mm x 2500mm length' },
      { label: 'Materials Processed', value: 'Mild Steel (EN8/EN9), Tool Steels (D2, H13), Stainless Steel (304/316), Brass, Bronze, Aluminum 6061' },
      { label: 'Press Stamping Tonnage', value: '20-Ton to 150-Ton mechanical eccentric presses' },
      { label: 'Surface Finishes', value: 'Ground, electroplated, black-oxide, or hard-chrome plated' },
      { label: 'Batch Volume', value: 'From single-piece R&D prototypes to 50,000+ unit production runs' }
    ],
    applications: [
      'Textile & Weaving Machine Replacement Parts & Cam Shafts',
      'Packaging Machinery Guides, Rollers & Bushings',
      'Custom Stamping Dies for Fan Blades, Electrical Boxes & Enclosures',
      'High-Durability Motorcycle Drive Sprockets & Suspension Sleeves',
      'Hydraulic Cylinder Rods, Pistons & Flanged Bushings'
    ]
  },
  {
    id: 'structural-fabrication',
    title: 'Structural Fabrication & Architectural Metalwork',
    shortTitle: 'Structural Fabrication & Aluminum Casting',
    tagline: 'Heavy-duty industrial car sheds, factory security systems, and ornamental aluminum casting.',
    description: 'Heavy structural steel fabrication coupled with artisanal aluminum foundry casting. We engineer robust corporate parking sheds, secure factory gates, and ornate architectural grills.',
    icon: 'Hammer',
    accentColor: '#e48738',
    features: [
      'Industrial cantilever & double-bay car parking sheds for corporate buildings & hospitals',
      'Heavy-duty automated factory sliding gates, crash barriers & security perimeter grilles',
      'Architectural window systems, decorative screens & thermal-expansion balcony railings',
      'Detailed aluminum casting featuring custom decorative grill designs & ornamental panels',
      'Argon (TIG) and heavy MIG/arc welding bays certified for high structural shear loads',
      'CAD drawing conversion into precision-cut metal assemblies and CNC pipe bending',
      'Full surface treatment including sandblasting, epoxy primer, and industrial polyurethane topcoats'
    ],
    specifications: [
      { label: 'Structural Steel Standards', value: 'IPE, HEA, RHS, SHS hollow structural sections (ASTM A500)' },
      { label: 'Welding Standards', value: 'AWS D1.1 structural welding code compliant bays' },
      { label: 'Aluminum Foundry', value: 'Gravity die casting & sand casting (LM6 / A356 alloys)' },
      { label: 'Roofing Sheeting', value: '0.5mm Corrugated Pre-Painted Galvanized Iron (PPGI) / Tensile Fabric' },
      { label: 'Paint & Coating Spec', value: 'Zinc-rich epoxy primer (75µm) + 2K polyurethane topcoat (50µm)' },
      { label: 'Erection Capacity', value: 'Multi-bay structural installations with mobile crane support' }
    ],
    applications: [
      'Corporate Headquarters & Hospital Car Parking Sheds (Lahore, Rawalpindi, Multan)',
      'Industrial Plant Boundary Gates & Heavy-Duty Truck Weighbridge Enclosures',
      'Commercial Bank Security Grills & Vault Frame Reinforcements',
      'Heritage & Modern Villa Architectural Cast Aluminum Balcony Rails',
      'Factory Overhead Crane Gantry Runways & Maintenance Walkways'
    ]
  }
];

const initialPortfolio = [
  {
    id: 'solar-elevated-mill',
    title: '500 kW Elevated Solar Canopy Structure',
    category: 'Solar Structures',
    clientType: 'Textile Manufacturing Plant',
    location: 'Sheikhupura Industrial Zone, Punjab',
    year: '2024',
    summary: 'Custom elevated cantilever hot-dip galvanized mounting structure designed for rooftop load distribution and unimpeded roof access.',
    specs: {
      materialGauge: '3.0mm & 2.5mm Cold-formed C-Channels (High Tensile Q235B)',
      processUsed: 'CNC punching, hydraulic brake bending, automated MIG welding & Hot-Dip Galvanizing',
      coating: 'HDG coating 85 microns to ASTM A123',
      windRating: 'Certified for 145 km/h gusts with 1.5 safety coefficient',
      hardware: 'Grade 8.8 Dacromet bolts with Belleville spring washers'
    },
    details: 'Engineered for an active textile facility requiring rooftop panel elevation of 2.8 meters above ground to allow maintenance walkways and HVAC duct routing. Over 1,100 PV modules securely mounted with zero roof puncture points using chemical structural anchoring to building columns.'
  },
  {
    id: 'parking-shed-corporate',
    title: 'Dual-Span Cantilever Corporate Parking Shed',
    category: 'Industrial Machinery/Panels',
    clientType: 'Commercial Corporate Headquarters',
    location: 'Gulberg III, Lahore',
    year: '2024',
    summary: '48-vehicle capacity heavy structural steel parking canopy with curved architectural profile and integrated rainwater channeling.',
    specs: {
      materialGauge: '6"x4" & 4"x4" RHS structural tubing (4.5mm wall thickness)',
      processUsed: 'Hydraulic mandrel tube bending, full penetration butt welding, 2K epoxy coating',
      sheeting: '0.50mm PPGI pre-painted corrugated steel with thermal underlay',
      dimensions: '96m total length x 5.8m cantilever overhang',
      weldingStandard: 'AWS D1.1 structural certification'
    },
    details: 'Fabricated in modular 6-meter bays at our Lahore workshop and transported directly to site. Designed with an unobstructed central driveway, internal electrical conduits for EV charger mounting, and concealed downspout drainage.'
  },
  {
    id: 'precision-lathe-shafts',
    title: 'Heavy Drive Shafts & Splined Coupling Assemblies',
    category: 'Custom Parts',
    clientType: 'Industrial Paper & Board Mill',
    location: 'Kot Lakhpat Industrial Area, Lahore',
    year: '2024',
    summary: 'High-tensile alloy steel drive shafts turned on heavy precision lathe with induction-hardened bearing seatings.',
    specs: {
      materialGauge: 'EN19 (AISI 4140) Alloy Steel round bar Ø180mm',
      processUsed: 'High-precision lathe turning, CNC thread chasing, keyway slotting & induction hardening',
      tolerance: '±0.008mm runout across 1,800mm length',
      hardness: '52-55 HRC at bearing landing journals',
      finish: 'Micro-finish Ra 0.4 µm cylindrical grinding'
    },
    details: 'Manufactured to replace imported OEM components prone to torsional fatigue. Balanced dynamically to 2,800 RPM operating speeds, resulting in 40% cost savings for client and immediate 48-hour local replacement support.'
  },
  {
    id: 'cast-aluminum-grills',
    title: 'Architectural Cast Aluminum Ornate Balcony Panels',
    category: 'Cast Aluminum',
    clientType: 'Executive Residential & Estate Project',
    location: 'DHA Phase 6, Lahore',
    year: '2023',
    summary: 'Custom patterned high-strength aluminum cast panels created from dedicated hand-carved wooden master molds.',
    specs: {
      materialGauge: 'A356 High-Purity Foundry Aluminum Alloy',
      processUsed: 'Gravity sand casting, precision fettling, bead blasting, electrostatic powder coating',
      dimensions: '1,200mm x 900mm modular panels (22mm relief depth)',
      finish: 'Architectural Matt Charcoal powder coat (100µm UV-resistant)',
      weightSavings: '65% lighter than traditional cast iron with zero rusting risk'
    },
    details: 'Engineered to withstand Lahore ambient heat and monsoon humidity without oxidization or paint peel. Cast with integral concealed anchoring lugs for seamless bolt-together assembly along a 45-meter perimeter terrace.'
  },
  {
    id: 'punch-stamping-die',
    title: 'Progressive Stamping Tooling & Piercing Dies',
    category: 'Custom Parts',
    clientType: 'Automotive & Motorcycle Hardware Vendor',
    location: 'Gujranwala Industrial Cluster',
    year: '2024',
    summary: 'Multi-stage progressive stamping die set for rapid batch punching of reinforced chassis brackets and vibration dampers.',
    specs: {
      materialGauge: 'AISI D2 High Carbon / High Chromium Tool Steel',
      processUsed: 'Vacuum heat treatment, precision surface grinding, CNC wire EDM contouring',
      pressCompatibility: '100-Ton mechanical eccentric power press',
      cycleLife: 'Engineered for 500,000+ strokes before regrinding',
      tolerance: 'Punch-to-die clearance maintained at 0.025mm'
    },
    details: 'Designed in-house to convert a 3-step manual stamping process into a continuous automated feed strip operation, accelerating daily output from 600 pieces to 4,800 pieces per 8-hour shift.'
  },
  {
    id: 'solar-rooftop-commercial',
    title: '150 kW Ballasted Commercial Rooftop PV Framework',
    category: 'Solar Structures',
    clientType: 'Commercial Shopping Plaza & Cold Storage',
    location: 'Ferozepur Road, Lahore',
    year: '2024',
    summary: 'Non-penetrating pre-galvanized framing structure for concrete flat roof with integrated aerodynamic wind deflectors.',
    specs: {
      materialGauge: '2.0mm High-Yield Pre-Galvanized C-channel (Z275 coating)',
      processUsed: 'Roll-forming, high-speed automated hydraulic hole punching, zinc-rich edge sealing',
      tiltAngle: 'Fixed 18° optimal seasonal solar azimuth angle',
      windRating: 'Tested up to 130 km/h with wind baffle integration',
      ballast: 'Reinforced concrete ballast blocks with rubber EPDM protective roof pads'
    },
    details: 'Protects the underlying bitumen water-proofing membrane while maintaining rigid array alignment under high monsoon storms. Rapidly assembled on site in 9 working days with modular quick-clamp rails.'
  }
];

const initialWorkshopInventory = [
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
];

const initialDistricts = [
  'Lahore (HQ & Works)', 'Faisalabad (Textile Belt)', 'Gujranwala (Industrial Hub)',
  'Sialkot (Export Sector)', 'Rawalpindi & Islamabad', 'Multan & South Punjab',
  'Sheikhupura & Muridke', 'Sahiwal & Okara', 'Kasur & Chunian'
];

const initialAdminUsers = [
  {
    id: 'admin_1',
    name: 'Chief Engineer / Super Admin',
    email: 'admin@houseofengineers.pk',
    // Hash for 'Admin@HOE2026!'
    passwordHash: '$2a$10$Z55fxJNSiNa1ijBRA0zjT.yWqKyMU5WS9DbTaPtVAf4c1WKTtxHb2',
    role: 'superadmin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'editor_1',
    name: 'Content Editor',
    email: 'editor@houseofengineers.pk',
    // Hash for 'Editor@HOE2026!'
    passwordHash: '$2a$10$KeBKDsH0ljKmyjj4EixgoOP.yaB1iPuLF.Bmdn51uzrnHfRnyUdVu',
    role: 'editor',
    createdAt: new Date().toISOString()
  }
];

const initialPages = [
  {
    id: 'page-home',
    slug: '/',
    title: 'Corporate Home',
    status: 'published',
    seo: {
      metaTitle: 'House of Engineers Pvt. Ltd. | Industrial Metal Fabrication Lahore',
      metaDescription: 'Precision industrial engineering, certified solar mount structures, lathe machining and heavy structural fabrication across Punjab.',
      keywords: ['industrial engineering', 'solar mounting structures', 'lahore fabrication', 'lathe machining'],
      ogImage: '/uploads/solar-mounting-c-channel.webp'
    },
    blocks: [
      {
        id: 'blk-hero-1',
        type: 'hero',
        order: 0,
        content: {
          badge: 'Lahore Industrial Workshop • Precision Metal Fabrication',
          headline: 'Precision Industrial Engineering & Custom Metal Fabrication',
          subheadline: 'From certified solar mount structures to precision lathe machining and bespoke architectural metalwork across Punjab.',
          primaryButton: { text: 'Explore Capabilities', url: '/services', variant: 'primary' },
          secondaryButton: { text: 'Request a Quote', url: '/quote', variant: 'accent' },
          mediaUrl: '',
          mediaAlt: 'House of Engineers Lahore Workshop'
        },
        styling: {
          paddingTop: 'xl',
          paddingBottom: 'xl',
          backgroundColor: '#1e293b',
          textColor: '#ffffff',
          alignment: 'left',
          containerWidth: 'wide'
        }
      },
      {
        id: 'blk-stats-2',
        type: 'stats-counter',
        order: 1,
        content: {
          items: [
            { title: 'Solar Frameworks', stat: '50+', suffix: ' MW', description: 'Fabricated Across Punjab' },
            { title: 'Press Stamping', stat: '150', suffix: ' Tons', description: 'Mechanical Press Fleet' },
            { title: 'Wind Resistance', stat: '145', suffix: ' km/h', description: 'Certified Structural Rating' },
            { title: 'HDG Rust Barrier', stat: '25+', suffix: ' Years', description: 'ASTM A123 Galvanizing' }
          ]
        },
        styling: {
          paddingTop: 'md',
          paddingBottom: 'md',
          backgroundColor: '#ffffff',
          textColor: '#1e293b',
          alignment: 'center',
          containerWidth: 'wide'
        }
      },
      {
        id: 'blk-cta-3',
        type: 'cta',
        order: 2,
        content: {
          badge: 'B2B Procurement Desk',
          headline: 'Have Technical CAD Drawings or Project Blueprints?',
          subheadline: 'Submit your AutoCAD DWG/PDF drawings, BOM (Bill of Materials), or request an on-site structural engineer consultation anywhere across Punjab.',
          primaryButton: { text: 'Launch Quote Estimator', url: '/quote', variant: 'accent' },
          secondaryButton: { text: 'WhatsApp Consultation', url: 'https://wa.me/923001234567', variant: 'outline' }
        },
        styling: {
          paddingTop: 'lg',
          paddingBottom: 'lg',
          backgroundColor: '#23588f',
          textColor: '#ffffff',
          alignment: 'left',
          containerWidth: 'wide'
        }
      }
    ],
    publishedBlocks: [],
    revisions: [
      {
        id: 'rev-init',
        timestamp: new Date().toISOString(),
        savedBy: 'admin_1',
        summary: 'Initial production baseline layout'
      }
    ],
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString()
  }
];

// Initialize publishedBlocks to match initial blocks
initialPages[0].publishedBlocks = JSON.parse(JSON.stringify(initialPages[0].blocks));

const initialMedia = [
  {
    id: 'asset-demo-1',
    filename: 'solar-mounting-c-channel.webp',
    originalName: 'solar-mounting-c-channel.png',
    url: '/uploads/solar-mounting-c-channel.webp',
    mimeType: 'image/webp',
    fileSize: 45200,
    dimensions: { width: 1200, height: 800 },
    altText: 'Hot-dip galvanized solar mounting purlin C-channel',
    uploadedAt: new Date().toISOString(),
    uploadedBy: 'admin_1'
  }
];

module.exports = {
  initialSiteSettings,
  initialServices,
  initialPortfolio,
  initialWorkshopInventory,
  initialDistricts,
  initialAdminUsers,
  initialPages,
  initialMedia
};
