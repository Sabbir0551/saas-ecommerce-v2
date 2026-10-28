export interface BusinessCategoryDefinition {
  id: string;
  name: string;
  group: 'retail' | 'services' | 'food' | 'real_estate' | 'professional' | 'tech';
  icon: string;
  shortDesc: string;
  archetype: 'PHYSICAL_STORE' | 'APPOINTMENT_BOOKING' | 'LEAD_GEN_REAL_ESTATE' | 'FOOD_MENU' | 'DIGITAL_DOWNLOAD' | 'PORTFOLIO';
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  demoSlug?: string;
  keywords?: string[];
  features?: string[];
  color?: string;
  popularBrands?: string[];
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
    group: 'tech',
    icon: 'Smartphone',
    shortDesc: 'Sell latest smartphones, flagships, smartwatches, and original accessories.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Official Mobile & Smartphone Hub',
    heroTitle: 'Latest Flagship Smartphones & Authentic Accessories',
    heroSubtitle: 'Explore genuine warranty-backed smartphones, fast chargers, and smart wearable gear with doorstep express delivery.',
    demoSlug: 'smartvolt',
    color: 'blue',
    keywords: ['mobile', 'phone', 'smartphone', 'iphone', 'samsung', 'charger', 'case', 'airpods', 'gadget', 'xiaomi', 'pixel'],
    features: [
      'IMEI & Official BTRC Clearance Badges',
      'RAM / Storage & Color Variant Picker',
      'Doorstep Cash on Delivery (COD) & Tracking',
      '72-Hour Consumer Protection Support',
    ],
    popularBrands: ['Apple', 'Samsung', 'Google Pixel', 'Xiaomi', 'Anker'],
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
    group: 'tech',
    icon: 'Laptop',
    shortDesc: 'Workstations, gaming rigs, ultrabooks, and desktop accessories.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Premier Computing & PC Gallery',
    heroTitle: 'Cutting-Edge Laptops, Ultrabooks & Workstations',
    heroSubtitle: 'Enterprise laptops, custom desktop setups, and high-performance computing hardware backed by official warranty.',
    demoSlug: 'bestlaptop',
    color: 'indigo',
    keywords: ['laptop', 'computer', 'macbook', 'gaming', 'pc', 'ram', 'ssd', 'intel', 'ryzen', 'monitor', 'asus', 'dell', 'lenovo', 'hp'],
    features: [
      'Official Distributor Warranty Certificate',
      'Processor, GPU & RAM Configurator',
      'Instant POS Invoice Slip with Serial No.',
      'Corporate Purchase Orders & Bulk Pricing',
    ],
    popularBrands: ['Apple MacBook', 'ASUS ROG', 'Lenovo ThinkPad', 'Dell Latitude', 'HP Spectre'],
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
    group: 'tech',
    icon: 'Zap',
    shortDesc: 'Smart home appliances, circuit components, wiring, and electronics.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Certified Electrical & Smart Home Gear',
    heroTitle: 'Smart Home Electronics & Premium Electrical Gear',
    heroSubtitle: 'Heavy-duty wiring, smart automated switches, inverters, and high-efficiency home electrical solutions.',
    demoSlug: 'smartvolt',
    color: 'amber',
    keywords: ['electric', 'electronics', 'switch', 'wiring', 'cable', 'breaker', 'ac', 'tv', 'socket', 'inverter', 'led', 'schneider', 'gree', 'walton', 'mcb'],
    features: [
      'Compressor & Parts Warranty Tracking System',
      'Technical Specs (Voltage, Amperage, Wattage)',
      'High-Risk Fraud & Shipping Discrepancy Detection',
      'Thermal Receipt & Barcode POS Generation',
    ],
    popularBrands: ['Schneider Electric', 'Gree', 'Walton', 'Siemens', 'ABB', 'Hisense'],
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
    demoSlug: 'royaldiamond',
    color: 'yellow',
    keywords: ['jewelry', 'gold', 'diamond', 'necklace', 'ring', 'bridal', 'bangle', 'hallmark', 'earrings', 'gemstone'],
    features: [
      '22K/24K Hallmark Certified Badges',
      'Daily Gold Price & Carat Purity Calculator',
      'VIP In-Store Viewing Appointment Booking',
      'Insured Security Transit & Packaging',
    ],
    popularBrands: ['Cartier', 'Tanishq', 'Tiffany & Co.', 'Apan Jewellers'],
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
    demoSlug: 'apexwatches',
    color: 'cyan',
    keywords: ['watch', 'watches', 'rolex', 'omega', 'patek', 'chronograph', 'horology', 'swiss', 'timepiece', 'tag heuer'],
    features: [
      'Movement Calibre & Case Material Display',
      'Original Authenticity Guarantee Card',
      'VIP Private Showroom Viewing Appointments',
      'Serial & Movement Authentication Registry',
    ],
    popularBrands: ['Rolex', 'Omega', 'Patek Philippe', 'Audemars Piguet', 'TAG Heuer'],
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
    demoSlug: 'fashion',
    color: 'rose',
    keywords: ['fashion', 'clothing', 'saree', 'panjabi', 'dress', 'apparel', 'jamdani', 'boutique', 'kurti', 'shirt'],
    features: [
      'Multi-Variant Matrix (Size, Color, Fabric)',
      'High-Converting One-Page Cash on Delivery',
      'Barcode Shipping Consignment Generator',
      '72-Hour Government Dispute & Return Portal',
    ],
    popularBrands: ['Aarong', 'Yellow', 'Cats Eye', 'Sailor', 'Richman'],
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

  // 7. Pharmacy & Medicine Store
  {
    id: 'pharmacy_medicine',
    name: 'Pharmacy & Medicine Store',
    group: 'services',
    icon: 'Pill',
    shortDesc: 'Prescription medicines, healthcare equipment, and baby care.',
    archetype: 'PHYSICAL_STORE',
    badge: 'Licensed Pharmacy & Medical Supplies',
    heroTitle: 'Genuine Prescription Medicines & Diagnostic Devices',
    heroSubtitle: 'DGDA-approved authentic pharmaceuticals, digital BP monitors, glucometers, and fast delivery.',
    demoSlug: 'pharmaexpress',
    color: 'emerald',
    keywords: ['pharmacy', 'medicine', 'prescription', 'health', 'tablet', 'syrup', 'bp monitor', 'omron', 'insulin'],
    features: [
      'DGDA Drug License & Verification Badges',
      'Prescription Photo Upload with Pharmacist Verification',
      'Expiry Batch & Cold-Chain Storage Tracking',
      'Urgent Express 2-Hour Delivery Dispatch',
    ],
    popularBrands: ['Square Pharmaceuticals', 'Beximco Pharma', 'Incepta', 'Omron Healthcare', 'Accu-Chek'],
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

  // 8. Travel Agency & Tour Packages
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
    demoSlug: 'flybangla',
    color: 'sky',
    keywords: ['travel', 'tour', 'flight', 'visa', 'umrah', 'maldives', 'ticket', 'hotel', 'holiday', 'package'],
    features: [
      'Interactive Flight & Package Date Customizer',
      'Instant Visa Requirement & Document Checklist',
      'Secure Deposit & Installment Milestone Payments',
      '24/7 International Concierge & WhatsApp Travel Support',
    ],
    popularBrands: ['Biman Bangladesh', 'Emirates', 'Qatar Airways', 'Singapore Airlines', 'Fly Dubai'],
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

  // 9. Water Treatment & Water Filter
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
    demoSlug: 'aquapure',
    color: 'cyan',
    keywords: ['water', 'filter', 'ro', 'purifier', 'alkaline', 'membrane', 'wtp', 'arsenic', 'iron'],
    features: [
      'TDS Meter & Water Quality Comparison Calculator',
      'Doorstep Free Water Sample Testing Booking',
      'Automated 6-Month Filter Cartridge Replacement Reminder',
      'Heavy-Duty Industrial WTP Blueprint Consultation',
    ],
    popularBrands: ['Aquafresh', 'Kent RO', 'Pureit', 'Lan Shan', 'Hero Pure'],
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

  // 10. Restaurant, Cafe & Food Delivery
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
    demoSlug: 'chillibite',
    color: 'amber',
    keywords: ['food', 'restaurant', 'burger', 'pizza', 'cafe', 'dine-in', 'delivery', 'chef', 'catering'],
    features: [
      'Visual Interactive Digital Menu & Spice Level Selector',
      'Table Reservation & Private Dining Slot Booking',
      'Live Kitchen Order Tracking & SMS Delivery ETA',
      'Automated POS Kitchen Display System (KDS) Sync',
    ],
    popularBrands: ['Chillibite Master Kitchen', 'Lavazza Coffee', 'Anchor Dairy', 'Calvé Artisanal'],
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

  // 11. Furniture & Home Decor
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
    demoSlug: 'luxewood',
    color: 'amber',
    keywords: ['furniture', 'wood', 'sofa', 'table', 'chair', 'bed', 'decor', 'oak', 'interior', 'office'],
    features: [
      'Solid Kiln-Dried Wood 10-Year Anti-Pest Guarantee',
      'Fabric & Wood Polish Customization Matrix',
      'White-Glove In-Home Assembly & Installation',
      'Corporate Workspace Bulk Procurement Invoicing',
    ],
    popularBrands: ['Otobi', 'Hatil', 'Akhtar Furnishers', 'Navana Furniture', 'Regal'],
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

  // 12. Agro Farm & Livestock
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
    demoSlug: 'greenagro',
    color: 'emerald',
    keywords: ['agro', 'farm', 'honey', 'dairy', 'milk', 'livestock', 'organic', 'cow', 'cattle', 'fertilizer'],
    features: [
      '100% Certified Antibiotic-Free & Organic Badges',
      'Cold-Chain Temperature Controlled Morning Delivery',
      'Live Cattle & Qurbani Video Inspection Booking',
      'Bulk Farm-to-Table Wholesale Supply Contracts',
    ],
    popularBrands: ['Green Agro Organic', 'Sundarbans Pure Honey', 'Aarong Dairy', 'Pran Dairy'],
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

  // 13. Plant Nursery & Gardening
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
    demoSlug: 'bonsaibd',
    color: 'green',
    keywords: ['plant', 'nursery', 'bonsai', 'flower', 'pot', 'garden', 'succulent', 'indoor', 'soil'],
    features: [
      'Care Guide & Sunlight Requirement Badges',
      'Plant Survival & Healthy Root Guarantee on Transit',
      'Potting Soil & Fertilizer Delivery Bundle',
      'In-Home Landscape & Balcony Garden Consultation',
    ],
    popularBrands: ['Bonsai Garden BD', 'Green Living Plants', 'Imported Ceramic Studio', 'Miracle-Gro'],
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

  // 14. Real Estate & Developer Company
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
    demoSlug: 'aebanproperty',
    color: 'yellow',
    keywords: ['real estate', 'property', 'apartment', 'flat', 'land', 'plot', 'villa', 'estate', 'commercial'],
    features: [
      'High-Resolution Architectural Gallery & Floor Plans',
      'Private VIP Viewing Inquiry Booking Engine',
      'Verified RAJUK & Title Deed Clearance Badges',
      'Instant Lead Notification to Merchant WhatsApp/Email',
    ],
    popularBrands: ['Shanta Holdings', 'Building Technology & Ideas', 'Navana Real Estate', 'Concord Group'],
    defaultCategories: ['Luxury Apartments', 'Private Country Estates', 'Commercial Spaces', 'Residential Plots', 'Penthouses'],
    sampleItems: [
      {
        title: 'Huntleigh Luxury Country Estate & Villa',
        slug: 'huntleigh-luxury-country-estate-villa',
        shortDesc: 'Gale Henderson-designed 10,000 sq ft mansion set across 3 private manicured acres with resort-style pool.',
        price: 5500000,
        itemType: 'PHYSICAL_PRODUCT',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      },
    ],
    defaultModules: { appointmentBooking: true, productReviews: true, disputeSystem: true, digitalDownloads: false },
  },

  // 15. Doctor & Healthcare Clinic
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
    demoSlug: 'medicare',
    color: 'emerald',
    keywords: ['health', 'doctor', 'clinic', 'dental', 'medical', 'serial', 'appointment', 'chamber', 'dentist', 'physician'],
    features: [
      'Guaranteed 1-Hour Confirmed Slot Booking Engine',
      'Printable Daily Chamber Appointment & Token Sheet',
      'Doctor Degrees, Chambers & Visiting Hour Badges',
      'Automated SMS / WhatsApp Appointment Confirmation',
    ],
    popularBrands: ['Square Hospital', 'United Healthcare', 'Labaid Group', 'Apollo Clinics'],
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

  // 16. Barber Shop & Beauty Salon
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
    demoSlug: 'makeover',
    color: 'purple',
    keywords: ['salon', 'barber', 'haircut', 'facial', 'makeover', 'bridal', 'spa', 'massage', 'styling'],
    features: [
      'Stylist-Specific Hourly Slot Booking Calendar',
      'VIP Grooming Packages with Token Number Alert',
      'Sanitized Tool Hygiene & Disposable Kit Verification',
      'Automated Appointment Reminder via WhatsApp/SMS',
    ],
    popularBrands: ['L\'Oréal Professionnel', 'Schwarzkopf', 'Olaplex', 'Wahl Professional'],
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

  // 17. Pet Food & Animal Supplies
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
    demoSlug: 'petshopbd',
    color: 'orange',
    keywords: ['pet', 'dog', 'cat', 'kitten', 'puppy', 'royal canin', 'food', 'litter', 'veterinary'],
    features: [
      'Veterinary Batch Verification & Expiry Shield',
      'Auto-Replenish Monthly Pet Food Subscription',
      'Weight & Age Specific Nutrition Filter',
      'Express Delivery for Emergency Pet Nutrition',
    ],
    popularBrands: ['Royal Canin', 'Drools', 'Whiskas', 'Purina Pro Plan', 'Pedigree'],
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

  // 18. Digital Marketing Agency
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
    demoSlug: 'scaleup',
    color: 'blue',
    keywords: ['agency', 'marketing', 'seo', 'ads', 'google', 'facebook', 'growth', 'branding', 'leads'],
    features: [
      'Interactive Case Study & Live ROI Dashboard Portfolio',
      'Discovery Consultation Call Scheduler with Calendar Sync',
      'Monthly Retainer Service Tier Matrix & Milestone Billing',
      'NDA & Client Performance Service Level Agreements (SLA)',
    ],
    popularBrands: ['Google Premier Partner', 'Meta Business Partner', 'HubSpot Certified', 'Shopify Partner'],
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

  // 19. Digital Products & Software Licenses
  {
    id: 'digital_products',
    name: 'Digital Products & Software Licenses',
    group: 'professional',
    icon: 'Code2',
    shortDesc: 'Instant download software licenses, UI/UX design kits, and code templates.',
    archetype: 'DIGITAL_DOWNLOAD',
    badge: 'Verified Digital Assets & Licenses',
    demoSlug: 'devnexus',
    color: 'indigo',
    keywords: ['software', 'license', 'digital', 'theme', 'template', 'figma', 'code', 'ui kit'],
    features: [
      'Instant Download Link & License Key Engine',
      'Automated VAT / Invoicing for Digital Items',
      'Lifetime Updates & Documentation Viewer',
    ],
    popularBrands: ['JetBrains', 'Microsoft Cloud', 'Figma Community', 'Envato Market'],
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

  // 20. Coaching Center & Education Services
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
    demoSlug: 'eduexcel',
    color: 'indigo',
    keywords: ['education', 'coaching', 'ielts', 'admission', 'student', 'batch', 'tuition', 'mock test', 'class'],
    features: [
      'Live Batch Seat Reservation & Enrollment Engine',
      'Trainer Credentials & Student Scorecard Verification',
      'Free Diagnostic Assessment & Demo Class Booking',
      'Digital Study PDF Materials & LMS Access Portal',
    ],
    popularBrands: ['British Council Partner', 'Cambridge Assessment', 'Pearson PTE', 'IDP IELTS'],
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

  // 21. Professional Consultant & Portfolio
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
    demoSlug: 'advisorypro',
    color: 'slate',
    keywords: ['consultant', 'advisor', 'legal', 'tax', 'audit', 'lawyer', 'chartered accountant', 'corporate', 'counsel'],
    features: [
      'Confidential 1-on-1 Strategic Session Slot Booking',
      'Boardroom Advisory Credentials & Published Insights',
      'Automated Retainer Agreement & Retainer Invoicing',
      'Encrypted Document Vault for Client Financials',
    ],
    popularBrands: ['ICAB Chartered Practice', 'Supreme Court Bar', 'Deloitte Alumni Network', 'PwC Partner Circle'],
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
