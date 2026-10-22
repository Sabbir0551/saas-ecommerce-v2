export interface BusinessCategoryDefinition {
  id: string;
  name: string;
  group: 'retail' | 'services' | 'food' | 'real_estate' | 'professional';
  icon: string;
  shortDesc: string;
  archetype: 'PHYSICAL_STORE' | 'APPOINTMENT_BOOKING' | 'LEAD_GEN_REAL_ESTATE' | 'FOOD_MENU' | 'DIGITAL_DOWNLOAD' | 'PORTFOLIO';
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  defaultCategories: string[];
  sampleItems: {
    title: string;
    slug: string;
    shortDesc: string;
    price: number;
    comparePrice?: number;
    itemType: 'PHYSICAL_PRODUCT' | 'SERVICE_APPOINTMENT' | 'DIGITAL_ITEM';
    image: string;
  }[];
  defaultModules: {
    appointmentBooking: boolean;
    productReviews: boolean;
    disputeSystem: boolean;
    digitalDownloads: boolean;
  };
}

export const BUSINESS_CATEGORIES: BusinessCategoryDefinition[] = [
  // 1. Mobile Store
  {
    id: 'mobile_store',
    name: 'Mobile & Smartphone Store',
    group: 'retail',
    icon: 'Smartphone',
    shortDesc: 'Sell latest smartphones, flagships, smartwatches, and original accessories.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Official Mobile & Smartphone Hub',
    heroTitle: 'Latest Flagship Smartphones & Authentic Accessories',
    heroSubtitle: 'Explore genuine warranty-backed smartphones, fast chargers, and smart wearable gear with doorstep express delivery.',
    defaultCategories: ['Smartphones', 'Tablets', 'Chargers & Cables', 'Audio & Earbuds', 'Protective Cases'],
    sampleItems: [
      {
        title: 'iPhone 16 Pro Max 256GB - Natural Titanium',
        slug: 'iphone-16-pro-max-256gb',
        shortDesc: 'A18 Pro bionic chip, Grade 5 titanium enclosure, advanced 48MP fusion camera system.',
        price: 175000,
        comparePrice: 185000,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Samsung Galaxy S25 Ultra 512GB AI Phone',
        slug: 'samsung-galaxy-s25-ultra',
        shortDesc: 'Integrated S-Pen, Snapdragon 8 Elite, 200MP Quad Telephoto Camera with Galaxy AI.',
        price: 168000,
        comparePrice: 178000,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: false, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 2. Laptop & Computers
  {
    id: 'laptop_computers',
    name: 'Laptop & Computer Systems',
    group: 'retail',
    icon: 'Laptop',
    shortDesc: 'Workstations, gaming rigs, ultrabooks, and desktop accessories.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Premier Computing & PC Gallery',
    heroTitle: 'Cutting-Edge Laptops, Ultrabooks & Workstations',
    heroSubtitle: 'Enterprise laptops, custom desktop setups, and high-performance computing hardware backed by official warranty.',
    defaultCategories: ['Business Laptops', 'Gaming Laptops', 'Desktop Components', 'Monitors & Displays', 'Keyboards & Mice'],
    sampleItems: [
      {
        title: 'MacBook Pro 16" M3 Max 36GB Unified RAM',
        slug: 'macbook-pro-16-m3-max',
        shortDesc: 'Liquid Retina XDR display, up to 22 hours battery life, 1TB blazing fast SSD.',
        price: 345000,
        comparePrice: 360000,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'ASUS ROG Zephyrus G16 OLED Gaming Laptop',
        slug: 'asus-rog-zephyrus-g16',
        shortDesc: 'Intel Core Ultra 9, NVIDIA RTX 4080, 240Hz ROG Nebula OLED display.',
        price: 285000,
        comparePrice: 300000,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: false, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 3. Electric & Electronics
  {
    id: 'electronics',
    name: 'Electric & Electronics Business',
    group: 'retail',
    icon: 'Zap',
    shortDesc: 'Smart home appliances, circuit components, wiring, and electronics.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Certified Electrical & Smart Home Gear',
    heroTitle: 'Smart Home Electronics & Premium Electrical Gear',
    heroSubtitle: 'Heavy-duty wiring, smart automated switches, inverters, and high-efficiency home electrical solutions.',
    defaultCategories: ['Smart Home Automation', 'Circuit Breakers & Panels', 'Wiring & Cables', 'LED Lighting', 'Power Inverters & UPS'],
    sampleItems: [
      {
        title: 'Smart WiFi Touch Switch Panel (4 Gang)',
        slug: 'smart-wifi-touch-switch-4-gang',
        shortDesc: 'Tempered glass touch control with Alexa and Google Home voice control integration.',
        price: 3200,
        comparePrice: 3800,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: false, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 4. Jewelry & Luxury Ornaments
  {
    id: 'jewelry',
    name: 'Jewelry & Luxury Ornaments',
    group: 'retail',
    icon: 'Sparkles',
    shortDesc: 'Fine gold, diamond jewelry, bridal sets, and precious gemstones.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Certified Luxury Jewelry & Gold Craft',
    heroTitle: 'Timeless Elegance in Gold, Diamond & Bridal Jewelry',
    heroSubtitle: 'Hallmarked 22K gold, certified solitaires, and mastercrafted bridal ornaments crafted for eternity.',
    defaultCategories: ['Bridal Sets', 'Gold Necklaces', 'Diamond Rings', 'Bangles & Bracelets', 'Earrings'],
    sampleItems: [
      {
        title: 'Royal 22K Hallmarked Gold Bridal Choker Set',
        slug: 'royal-22k-gold-bridal-choker',
        shortDesc: 'Handcrafted antique floral motifs with certified hallmark stamp and secure storage box.',
        price: 385000,
        comparePrice: 410000,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: true, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 5. Luxury Watches & Horology
  {
    id: 'luxury_watches',
    name: 'Luxury Watches & Horology',
    group: 'retail',
    icon: 'Watch',
    shortDesc: 'Swiss luxury timepieces, automatic chronographs, sports watches, and horology accessories.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Certified Luxury Horology & Swiss Craft',
    heroTitle: 'Masterpieces of Precision, Craftsmanship & Timeless Heritage',
    heroSubtitle: 'Explore certified authentic Swiss chronographs, perpetual calendars, diver timepieces, and bespoke horological accessories.',
    defaultCategories: [
      'Automatic Chronographs',
      'Swiss Luxury Timepieces',
      'Diver & Sports Watches',
      'Classic Dress Watches',
      'Straps & Horology Accessories',
    ],
    sampleItems: [
      {
        title: 'Rolex Cosmograph Daytona - Oystersteel & Cerachrom',
        slug: 'rolex-cosmograph-daytona-oystersteel',
        shortDesc: 'Calibre 4131 automatic chronograph movement with high-performance Paraflex shock absorbers and black Cerachrom tachymetric bezel.',
        price: 2450000,
        comparePrice: 2600000,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Omega Speedmaster Professional Moonwatch Co-Axial',
        slug: 'omega-speedmaster-professional-moonwatch',
        shortDesc: 'Master Chronometer certified manual-wind Calibre 3861 with hesalite crystal and iconic step dial.',
        price: 890000,
        comparePrice: 940000,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1547996160-71dfa63582d8?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Patek Philippe Calatrava Clous de Paris Ref. 6119R',
        slug: 'patek-philippe-calatrava-6119r',
        shortDesc: '18K rose gold with guilloched hobnail bezel and hand-wound calibre 30-255 PS mechanical movement.',
        price: 4200000,
        comparePrice: 4500000,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: true, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 6. Fashion & Clothing Boutique
  {
    id: 'fashion_clothing',
    name: 'Fashion & Clothing Boutique',
    group: 'retail',
    icon: 'Shirt',
    shortDesc: 'Designer apparel, traditional sarees, menswear, and fashion accessories.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Exclusive Designer Fashion & Couture',
    heroTitle: 'Modern Elegance Meets Traditional Heritage',
    heroSubtitle: '100% authentic handwoven Jamdani, designer panjabis, festive bridal sarees, and contemporary apparel.',
    defaultCategories: ['Jamdani Sarees', 'Designer Panjabis', 'Party Wear', 'Casual Menswear', 'Kids Collection'],
    sampleItems: [
      {
        title: 'Handwoven Royal Dhakai Jamdani Saree (84 Count)',
        slug: 'handwoven-dhakai-jamdani-saree',
        shortDesc: 'Pure cotton and gold zari threads woven by master craftsmen in Narayanganj.',
        price: 8500,
        comparePrice: 10500,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: false, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 6. Pharmacy & Medicine
  {
    id: 'pharmacy_medicine',
    name: 'Pharmacy & Medicine Store',
    group: 'retail',
    icon: 'Pill',
    shortDesc: 'Prescription medicines, healthcare equipment, and baby care.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Licensed Pharmacy & Medical Supplies',
    heroTitle: 'Genuine Prescription Medicines & Diagnostic Devices',
    heroSubtitle: 'DGDA-approved authentic pharmaceuticals, digital BP monitors, glucometers, and fast delivery.',
    defaultCategories: ['Prescription Medicines', 'OTC Healthcare', 'Diagnostic Devices', 'Vitamins & Supplements', 'Baby Health'],
    sampleItems: [
      {
        title: 'Omron Digital Blood Pressure Monitor HEM-7120',
        slug: 'omron-digital-bp-monitor',
        shortDesc: 'Clinically validated accuracy with Intellisense technology and irregular heartbeat detector.',
        price: 3600,
        comparePrice: 4200,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: true, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 7. Travel Agency & Tour Packages
  {
    id: 'travel_agency',
    name: 'Travel Agency & Tour Packages',
    group: 'services',
    icon: 'Plane',
    shortDesc: 'Flight bookings, international holiday tours, visa processing, and umrah.',
    archetype: 'APPOINTMENT_BOOKING',
    badge: 'Authorized Travel & International Tour Partner',
    heroTitle: 'Explore The World with Tailored Tour Packages',
    heroSubtitle: 'All-inclusive international vacations, seamless visa processing, customized honeymoon trips, and flight booking.',
    defaultCategories: ['International Holidays', 'Domestic Getaways', 'Visa Assistance', 'Hajj & Umrah Packages', 'Air Tickets'],
    sampleItems: [
      {
        title: '5 Days 4 Nights Luxury Maldives Island Escape',
        slug: 'maldives-luxury-island-escape',
        shortDesc: 'Speedboat transfers, water villa stay, full-board gourmet meals, and complimentary snorkeling tour.',
        price: 125000,
        comparePrice: 145000,
        itemType: 'SERVICE_APPOINTMENT',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: true, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 8. Water Treatment & Water Filter
  {
    id: 'water_treatment',
    name: 'Water Treatment & Filter Business',
    group: 'retail',
    icon: 'Droplet',
    shortDesc: 'Domestic RO purifiers, industrial water treatment plants, and filter cartridges.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Certified Clean Water & RO Filtration',
    heroTitle: 'Pure, Safe & Mineral-Rich Drinking Water Systems',
    heroSubtitle: 'Advanced 6-stage reverse osmosis purifiers, alkaline boosters, UV sterilisers, and expert installation.',
    defaultCategories: ['Home RO Purifiers', 'Commercial Filters', 'Industrial WTP Plants', 'Replacement Cartridges', 'Testing Kits'],
    sampleItems: [
      {
        title: 'Aquafresh 6-Stage RO + Alkaline Water Purifier',
        slug: 'aquafresh-ro-alkaline-purifier',
        shortDesc: '100% arsenic, iron and chlorine elimination with automated TDS controller and 12-liter storage.',
        price: 16500,
        comparePrice: 19500,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: true, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 9. Restaurant, Cafe & Food Delivery
  {
    id: 'restaurant_food',
    name: 'Restaurant, Cafe & Food Delivery',
    group: 'food',
    icon: 'UtensilsCrossed',
    shortDesc: 'Dine-in table booking, online food ordering, bakery, and catering.',
    archetype: 'FOOD_MENU',
    badge: 'Artisanal Cuisine & Express Food Delivery',
    heroTitle: 'Freshly Prepared Gourmet Dishes Delivered Hot',
    heroSubtitle: 'Authentic recipes, organic ingredients, and lightning-fast packaging right from our master kitchen to your doorstep.',
    defaultCategories: ['Signature Mains', 'Wood-Fired Pizza', 'Artisanal Coffee & Drinks', 'Appetizers', 'Desserts'],
    sampleItems: [
      {
        title: 'Truffle Mushroom Angus Beef Burger & Hand-Cut Fries',
        slug: 'truffle-mushroom-angus-burger',
        shortDesc: 'Charbroiled Australian beef patty, melted aged cheddar, sauteed wild mushrooms, and truffle aioli on brioche.',
        price: 750,
        comparePrice: 850,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: true, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 10. Furniture & Home Decor
  {
    id: 'furniture_decor',
    name: 'Furniture & Home Decor',
    group: 'retail',
    icon: 'Armchair',
    shortDesc: 'Modern solid wood furniture, ergonomic office setups, and interior decor.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Premium Handcrafted Furniture & Living Decor',
    heroTitle: 'Architectural Furniture for Inspiring Living Spaces',
    heroSubtitle: 'Seasoned mahogany, Canadian oak, ergonomic executive chairs, and bespoke minimalist home furnishings.',
    defaultCategories: ['Living Room Sofas', 'Dining Tables', 'Executive Work Desks', 'Bedrooms & Mattresses', 'Lighting & Decor'],
    sampleItems: [
      {
        title: 'Nordic Minimalist Oak Dining Table with 6 Chairs',
        slug: 'nordic-minimalist-oak-dining-table',
        shortDesc: 'Kiln-dried solid oak wood, lacquer finish, ergonomic contoured chairs with stain-resistant fabric.',
        price: 68000,
        comparePrice: 75000,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: false, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 11. Agro Farm & Livestock
  {
    id: 'agro_farm',
    name: 'Agro Farm & Livestock',
    group: 'retail',
    icon: 'Tractor',
    shortDesc: 'Organic farm produce, dairy, poultry, cattle, and bio-fertilizers.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Pure Organic Farm & Quality Livestock',
    heroTitle: 'Fresh Dairy, Organic Farm Harvest & Certified Livestock',
    heroSubtitle: '100% antibiotic-free dairy milk, farm-fresh eggs, pure organic honey, and healthy livestock breeding.',
    defaultCategories: ['Fresh Dairy & Milk', 'Farm Organic Produce', 'Livestock & Cattle', 'Bio Fertilizer', 'Poultry & Feed'],
    sampleItems: [
      {
        title: '100% Pure Raw Wildflower Honey (1kg Glass Jar)',
        slug: 'pure-raw-wildflower-honey',
        shortDesc: 'Unprocessed, unpasteurized natural honey harvested directly from certified sundarbans apiaries.',
        price: 1400,
        comparePrice: 1600,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: false, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 12. Plant Nursery & Gardening
  {
    id: 'plant_nursery',
    name: 'Plant Nursery & Gardening',
    group: 'retail',
    icon: 'Trees',
    shortDesc: 'Indoor houseplants, exotic bonsai, potting soil, and garden planters.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Exotic Greenery & Plant Nursery',
    heroTitle: 'Breathe Fresh Air with Exotic Indoor Plants & Bonsai',
    heroSubtitle: 'Air-purifying houseplants, succulent collections, imported ceramic planters, and garden maintenance kits.',
    defaultCategories: ['Indoor Plants', 'Bonsai Trees', 'Succulents & Cacti', 'Pots & Planters', 'Organic Soil & Fertilizers'],
    sampleItems: [
      {
        title: 'Ficus Microcarpa Ginseng Bonsai (Ceramic Pot Included)',
        slug: 'ficus-ginseng-bonsai',
        shortDesc: '5-year-old sculpted hardy bonsai tree with glossy deep green foliage, ideal for living rooms and office desks.',
        price: 3200,
        comparePrice: 3800,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: false, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 13. Real Estate & Developer Company
  {
    id: 'real_estate',
    name: 'Real Estate & Developer Company',
    group: 'real_estate',
    icon: 'Building2',
    shortDesc: 'Luxury apartments, commercial offices, private villas, and land plots.',
    archetype: 'LEAD_GEN_REAL_ESTATE',
    badge: 'Luxury Property & Prime Real Estate',
    heroTitle: 'Architectural Masterpieces & Prime Living Properties',
    heroSubtitle: 'Verified legal clearance, prime residential addresses, private villas, and high-yield commercial property developments.',
    defaultCategories: ['Luxury Apartments', 'Private Country Estates', 'Commercial Spaces', 'Residential Plots', 'Penthouses'],
    sampleItems: [
      {
        title: 'Huntleigh Luxury Country Estate & Villa',
        slug: 'huntleigh-luxury-country-estate-villa',
        shortDesc: 'Gale Henderson-designed 10,000 sq ft mansion set across 3 private manicured acres with resort-style pool.',
        price: 5500000,
        itemType: 'PHYSICAL_PRODUCT',
        image: '/storage/products/DWrSTE77cUki5p8dIRY2OfOD6H4EIUCAkZEVZCyR.jpg',
      },
    ],
    defaultModules: { appointmentBooking: true, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 14. Doctor & Healthcare Clinic
  {
    id: 'healthcare_service',
    name: 'Doctor & Healthcare Clinic',
    group: 'services',
    icon: 'Stethoscope',
    shortDesc: 'Doctor consultations, dental surgeries, diagnostic tests, and slot appointments.',
    archetype: 'APPOINTMENT_BOOKING',
    badge: 'Specialized Healthcare & Clinical Care',
    heroTitle: 'Expert Doctor Appointments with Guaranteed 1-Hour Slots',
    heroSubtitle: 'Avoid clinic queues. Book confirmed time slots with top-tier specialized physicians, dental surgeons, and diagnostic specialists.',
    defaultCategories: ['Dental Care & Surgery', 'General Medicine', 'Pediatric Clinic', 'Cardiology Consultations', 'Diagnostic Ultrasound'],
    sampleItems: [
      {
        title: 'Senior Dental Consultation & Full OPG X-Ray Screening',
        slug: 'senior-dental-consultation',
        shortDesc: 'Comprehensive oral examination by FCPS dental surgeon including digital panoramic X-ray and treatment plan.',
        price: 1500,
        comparePrice: 2000,
        itemType: 'SERVICE_APPOINTMENT',
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: true, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 15. Barber Shop & Beauty Salon
  {
    id: 'barber_salon',
    name: 'Barber Shop & Beauty Salon',
    group: 'services',
    icon: 'Scissors',
    shortDesc: 'Hair styling, luxury facials, bridal makeover, and beard grooming.',
    archetype: 'APPOINTMENT_BOOKING',
    badge: 'Luxury Styling & Parlor Care',
    heroTitle: 'Elevate Your Personal Style & Grooming Excellence',
    heroSubtitle: 'Expert hair sculptors, rejuvenating organic facials, bridal packages, and precision beard sculpting.',
    defaultCategories: ['Hair Styling & Cut', 'Beard Sculpting', 'Skin & Facials', 'Bridal & Party Makeover', 'Scalp Therapy'],
    sampleItems: [
      {
        title: 'Royal Executive Grooming Package (Haircut, Beard Trim & Charcoal Facial)',
        slug: 'royal-executive-grooming',
        shortDesc: 'Signature haircut, hot towel beard styling, exfoliating charcoal facial mask, and relaxing shoulder massage.',
        price: 1800,
        comparePrice: 2400,
        itemType: 'SERVICE_APPOINTMENT',
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: true, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 16. Pet Food & Animal Care
  {
    id: 'pet_care',
    name: 'Pet Food & Animal Supplies',
    group: 'retail',
    icon: 'PawPrint',
    shortDesc: 'Cat & dog food, veterinary vitamins, grooming accessories, and pet toys.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Premium Pet Nutrition & Care',
    heroTitle: 'Nutritious Food, Toys & Healthcare for Your Beloved Pets',
    heroSubtitle: 'Imported veterinarian-approved dry food, wet pouches, chew treats, litter boxes, and grooming accessories.',
    defaultCategories: ['Cat Food & Treats', 'Dog Nutrition', 'Pet Toys & Harnesses', 'Litter & Hygiene', 'Health & Supplements'],
    sampleItems: [
      {
        title: 'Royal Canin Indoor Adult Cat Dry Food (4kg)',
        slug: 'royal-canin-indoor-adult-cat-food',
        shortDesc: 'Balanced nutritional profile designed specifically to support gut health and reduce stool odor for indoor felines.',
        price: 4800,
        comparePrice: 5200,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: true, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 17. Digital Marketing Agency
  {
    id: 'marketing_agency',
    name: 'Digital Marketing Agency',
    group: 'professional',
    icon: 'Megaphone',
    shortDesc: 'SEO, performance advertising, social media management, and web development.',
    archetype: 'PORTFOLIO',
    badge: 'Growth-Focused Digital Agency',
    heroTitle: 'Scale Your Business Revenue with Data-Driven Marketing',
    heroSubtitle: 'Performance Google Ads, high-converting social funnels, SEO rankings, and conversion-optimized websites.',
    defaultCategories: ['SEO Growth Engine', 'Performance Meta & Google Ads', 'Content Strategy & Design', 'Web Application Dev'],
    sampleItems: [
      {
        title: 'Complete 90-Day Omnichannel Growth Sprint',
        slug: 'omnichannel-growth-sprint',
        shortDesc: 'High-ROI ad creative production, automated retention emails, technical SEO overhaul, and daily analytics reporting.',
        price: 45000,
        comparePrice: 60000,
        itemType: 'SERVICE_APPOINTMENT',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: true, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 18. Digital Products & Software Licenses
  {
    id: 'digital_products',
    name: 'Digital Products & Software Licenses',
    group: 'professional',
    icon: 'Code2',
    shortDesc: 'Software licenses, website templates, digital ebooks, and media assets.',
    archetype: 'DIGITAL_DOWNLOAD',
    badge: 'Instant Digital Asset & License Downloads',
    heroTitle: 'Instant Access to Digital Tools, Code & Creative Assets',
    heroSubtitle: 'Production-ready codebases, UI kits, design system templates, and verified software activation keys with instant delivery.',
    defaultCategories: ['Software Licenses', 'UI/UX Kits & Figma', 'Next.js & React Templates', 'Audio & Video Assets'],
    sampleItems: [
      {
        title: 'Modern SaaS UI Kit & Design System (Figma + Next.js 15)',
        slug: 'modern-saas-ui-kit',
        shortDesc: '120+ responsive components, dark/light theme tokens, interactive prototype, and lifetime updates.',
        price: 4500,
        comparePrice: 6500,
        itemType: 'DIGITAL_ITEM',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: false, productReviews: true, disputeSystem: true, digitalDownloads: true },
  },

  // 19. Coaching Center & Education Services
  {
    id: 'coaching_education',
    name: 'Coaching Center & Education Services',
    group: 'services',
    icon: 'GraduationCap',
    shortDesc: 'Academic coaching, IELTS training, admission preparation, and live batches.',
    archetype: 'APPOINTMENT_BOOKING',
    badge: 'Certified Academic & Skill Coaching',
    heroTitle: 'Master Key Skills with Industry-Leading Mentors',
    heroSubtitle: 'Live interactive classes, comprehensive study materials, personalized mentoring, and mock test evaluations.',
    defaultCategories: ['IELTS Preparation', 'University Admission', 'Coding Bootcamp', 'Corporate English', 'Mock Exam Series'],
    sampleItems: [
      {
        title: 'IELTS Band 8+ Masterclass & 10 Full Mock Evaluations',
        slug: 'ielts-band-8-masterclass',
        shortDesc: '36 hours of live instruction, 1-on-1 speaking evaluations, and daily writing corrections by Cambridge certified trainers.',
        price: 12000,
        comparePrice: 15000,
        itemType: 'SERVICE_APPOINTMENT',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: true, productReviews: true, disputeSystem: true, digitalDownloads: true },
  },

  // 20. Professional Consultant & Portfolio
  {
    id: 'consultant_portfolio',
    name: 'Professional Consultant & Portfolio',
    group: 'professional',
    icon: 'Briefcase',
    shortDesc: 'Legal counsel, business advisors, chartered accountants, and executive leaders.',
    archetype: 'PORTFOLIO',
    badge: 'Executive Advisory & Professional Practice',
    heroTitle: 'Strategic Legal, Financial & Corporate Advisory',
    heroSubtitle: 'Decades of boardroom experience delivering high-impact corporate strategy, audit compliance, and investment governance.',
    defaultCategories: ['Corporate Law Advisory', 'Tax & Audit Planning', 'M&A Valuation', 'Executive Mentoring'],
    sampleItems: [
      {
        title: '1-Hour Confidential Strategic Consultation',
        slug: 'confidential-strategic-consultation',
        shortDesc: 'In-depth review of corporate governance, cross-border tax compliance, and business restructuring roadmap.',
        price: 10000,
        itemType: 'SERVICE_APPOINTMENT',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: true, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },
];

export function getCategoryDefinition(businessType: string): BusinessCategoryDefinition {
  const normalized = (businessType || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const found = BUSINESS_CATEGORIES.find(c => {
    const cNorm = c.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    const nameNorm = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cNorm === normalized || nameNorm.includes(normalized) || normalized.includes(cNorm);
  });
  if (found) return found;

  if (normalized.includes('watch') || normalized.includes('horology') || normalized.includes('timepiece') || normalized.includes('rolex') || normalized.includes('apex')) {
    const watchDef = BUSINESS_CATEGORIES.find(c => c.id === 'luxury_watches');
    if (watchDef) return watchDef;
  }

  return BUSINESS_CATEGORIES[0];
}

