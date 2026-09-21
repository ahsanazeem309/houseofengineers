export const portfolioCategories = [
  'All',
  'Solar Structures',
  'Industrial Machinery/Panels',
  'Cast Aluminum',
  'Custom Parts'
];

export const portfolioProjects = [
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
    details: 'Engineered for an active textile facility requiring rooftop panel elevation of 2.8 meters above ground to allow maintenance walkways and HVAC duct routing. Over 1,100 PV modules securely mounted with zero roof puncture points using chemical structural anchoring to building columns.',
    iconName: 'Sun'
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
    details: 'Fabricated in modular 6-meter bays at our Lahore workshop and transported directly to site. Designed with an unobstructed central driveway, internal electrical conduits for EV charger mounting, and concealed downspout drainage.',
    iconName: 'Building'
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
    details: 'Manufactured to replace imported OEM components prone to torsional fatigue. Balanced dynamically to 2,800 RPM operating speeds, resulting in 40% cost savings for client and immediate 48-hour local replacement support.',
    iconName: 'Cog'
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
    details: 'Engineered to withstand Lahore ambient heat and monsoon humidity without oxidization or paint peel. Cast with integral concealed anchoring lugs for seamless bolt-together assembly along a 45-meter perimeter terrace.',
    iconName: 'Layers'
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
    details: 'Designed in-house to convert a 3-step manual stamping process into a continuous automated feed strip operation, accelerating daily output from 600 pieces to 4,800 pieces per 8-hour shift.',
    iconName: 'Wrench'
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
    details: 'Protects the underlying bitumen water-proofing membrane while maintaining rigid array alignment under high monsoon storms. Rapidly assembled on site in 9 working days with modular quick-clamp rails.',
    iconName: 'Sun'
  },
  {
    id: 'industrial-sliding-gate',
    title: '12-Meter Heavy-Duty Industrial Automated Cantilever Gate',
    category: 'Industrial Machinery/Panels',
    clientType: 'Logistics Distribution Warehouse',
    location: 'Multan Road, Lahore',
    year: '2023',
    summary: 'Heavy structural trackless cantilever sliding security gate with reinforced crash barrier framework and industrial motor gear rack.',
    specs: {
      materialGauge: '200mm x 100mm heavy base girder channel (6.0mm wall)',
      processUsed: 'Heavy structural jig fabrication, dual-shield flux-cored arc welding, epoxy mastic primer',
      clearSpan: '12.0 meters clear gate opening + 4.5m cantilever counterbalance',
      finish: 'Industrial signal yellow and charcoal grey high-visibility polyurethane',
      automation: 'Integrated rack & pinion 1,500kg commercial drive gear plate'
    },
    details: 'Designed for 24/7 continuous operations with freight truck traffic. The trackless cantilever suspension prevents mud and gravel buildup typical in industrial delivery yards.',
    iconName: 'Shield'
  },
  {
    id: 'aluminum-ornamental-screen',
    title: 'Geometric Cast Aluminum Facade Louvers & Screens',
    category: 'Cast Aluminum',
    clientType: 'Corporate Office Building',
    location: 'MM Alam Road, Gulberg, Lahore',
    year: '2024',
    summary: 'Solar shading architectural facade panels featuring interlocking Islamic geometric fretwork pattern.',
    specs: {
      materialGauge: 'Foundry Grade LM6 Silicon-Aluminum Alloy',
      processUsed: 'Pattern molding, sand casting, manual de-burring, robotic powder coating',
      dimensions: '900mm x 1,800mm vertical screen panels',
      finish: 'Textured architectural bronze electrostatic coating',
      thermalBenefit: 'Reduces solar heat gain coefficient by 42% on western facade'
    },
    details: 'Custom mold fabricated from architect CAD vector drawings. The cast units provide both security and significant HVAC power reduction by shielding glazing from peak summer direct afternoon heat.',
    iconName: 'Grid'
  }
];
