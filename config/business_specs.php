<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Niche-Specific Form Fields Configuration
    |--------------------------------------------------------------------------
    | Dynamic specifications schema for different business categories.
    | Types supported: text, number, select, textarea, boolean
    */

    'specs' => [
        // 1. Mobile & Gadgets
        'mobile_gadgets' => [
            'section_title' => 'Device Specifications & Authenticity',
            'fields' => [
                ['name' => 'brand', 'label' => 'Brand / Manufacturer', 'type' => 'text'],
                ['name' => 'ram', 'label' => 'RAM (e.g. 8GB, 12GB)', 'type' => 'text'],
                ['name' => 'storage', 'label' => 'Internal Storage (e.g. 128GB, 256GB)', 'type' => 'text'],
                ['name' => 'battery', 'label' => 'Battery Capacity (mAh)', 'type' => 'text'],
                ['name' => 'official_status', 'label' => 'Official BTRC Status', 'type' => 'select', 'options' => ['Official BTRC Approved', 'Unofficial / Global']],
                ['name' => 'warranty', 'label' => 'Warranty Details', 'type' => 'text'],
            ],
        ],

        // 2. Laptop & Computers (Star Tech + Laptop Point BD inspired)
        'laptop_computer' => [
            'section_title' => 'System Specifications, Warranty & Gifts',
            'fields' => [
                ['name' => 'brand', 'label' => 'Brand', 'type' => 'select', 'options' => ['Lenovo', 'Dell', 'HP', 'Apple', 'Asus', 'Acer', 'Microsoft', 'MSI']],
                ['name' => 'model', 'label' => 'Model & Series', 'type' => 'text'],
                ['name' => 'condition', 'label' => 'Condition', 'type' => 'select', 'options' => ['Brand New (Factory Sealed)', 'Certified Refurbished (Grade A+)', 'Pre-Owned / Used']],
                ['name' => 'processor', 'label' => 'Processor / CPU', 'type' => 'text'],
                ['name' => 'ram', 'label' => 'Installed RAM', 'type' => 'text'],
                ['name' => 'storage_drive', 'label' => 'SSD / HDD Capacity', 'type' => 'text'],
                ['name' => 'graphics', 'label' => 'Graphics Card (GPU)', 'type' => 'text'],
                ['name' => 'screen_size', 'label' => 'Display Size & Resolution', 'type' => 'text'],
                ['name' => 'battery_backup', 'label' => 'Battery Health & Backup', 'type' => 'text'],
                ['name' => 'free_gifts', 'label' => 'Free Gifts Bundle (e.g. Backpack + Mouse + Pad)', 'type' => 'text'],
                ['name' => 'replacement_warranty', 'label' => 'Replacement Guarantee (e.g. 15 Days)', 'type' => 'text'],
                ['name' => 'service_warranty', 'label' => 'Service Warranty (e.g. 5 Years Free Service)', 'type' => 'text'],
                ['name' => 'emi_facility', 'label' => '0% EMI Facility (e.g. Up to 12 Months EMI on 30+ Banks)', 'type' => 'text'],
                ['name' => 'warranty', 'label' => 'Official Warranty Duration', 'type' => 'text'],
            ],
        ],

        // 3. Fashion & Bespoke Clothing (Zaiyan Bespoke inspired)
        'fashion_clothing' => [
            'section_title' => 'Fabric, Tailoring & Garment Specifications',
            'fields' => [
                ['name' => 'fabric', 'label' => 'Fabric & Material Origin (e.g. 100% Egyptian Giza Cotton, Italian Wool)', 'type' => 'text'],
                ['name' => 'fit', 'label' => 'Fitting Silhouette', 'type' => 'select', 'options' => ['Slim Fit', 'Tailored Bespoke Fit', 'Classic Regular Fit', 'Relaxed Loose Fit']],
                ['name' => 'gender', 'label' => 'Target Gender', 'type' => 'select', 'options' => ['Men', 'Women', 'Unisex', 'Kids']],
                ['name' => 'weave_type', 'label' => 'Weave & Texture (e.g. Oxford, Twill, Linen Weave)', 'type' => 'text'],
                ['name' => 'wash_care', 'label' => 'Wash & Maintenance Care Guide', 'type' => 'text'],
                ['name' => 'custom_tailoring', 'label' => 'Custom Bespoke Tailoring Available?', 'type' => 'boolean'],
                ['name' => 'bespoke_note', 'label' => 'Bespoke Customization Details (Collar, Monogram, Cuff)', 'type' => 'text'],
            ],
        ],

        // 4. Beauty, Cosmetics & Skincare (Shajgoj inspired)
        'cosmetics_beauty' => [
            'section_title' => 'Cosmetics & Skincare Specifications',
            'fields' => [
                ['name' => 'authenticity_badge', 'label' => '100% Authentic Product Guarantee Seal?', 'type' => 'boolean'],
                ['name' => 'skin_concern', 'label' => 'Primary Concern (Acne, Brightening, Hair Fall, Anti-Aging, Dry Skin)', 'type' => 'select', 'options' => ['Acne & Blemish Treatment', 'Brightening & Glow', 'Hair Fall & Dandruff', 'Anti-Aging & Wrinkles', 'Pore Care & Blackheads', 'Dry & Sensitive Skin', 'Oil Control & Mattifying', 'Sun Protection & Tan Removal']],
                ['name' => 'skin_type', 'label' => 'Suitable Skin Type', 'type' => 'select', 'options' => ['All Skin Types', 'Oily & Acne-Prone', 'Dry & Dehydrated', 'Sensitive Skin', 'Combination Skin']],
                ['name' => 'key_ingredients', 'label' => 'Key Active Ingredients (e.g. Niacinamide 10%, Hyaluronic Acid, Centella)', 'type' => 'text'],
                ['name' => 'how_to_use', 'label' => 'How to Use / Daily Routine Application Guide', 'type' => 'textarea'],
                ['name' => 'volume_weight', 'label' => 'Net Volume / Weight (e.g. 50ml / 1.7 fl. oz.)', 'type' => 'text'],
                ['name' => 'country_of_origin', 'label' => 'Country of Origin (e.g. South Korea, USA, France, UK)', 'type' => 'text'],
            ],
        ],

        // 5. Electronics & Home Appliances (Best Electronics inspired)
        'electronics_appliances' => [
            'section_title' => 'Appliance Capacity, Energy Rating & Warranty',
            'fields' => [
                ['name' => 'capacity', 'label' => 'Capacity / Size (e.g. 1.5 Ton, 350 Liters, 55 Inch 4K)', 'type' => 'text'],
                ['name' => 'energy_rating', 'label' => 'Energy Rating (e.g. 5-Star Inverter Power Saving)', 'type' => 'text'],
                ['name' => 'compressor_warranty', 'label' => 'Compressor / Motor Warranty (e.g. 10 Years)', 'type' => 'text'],
                ['name' => 'panel_warranty', 'label' => 'Panel / Parts Warranty (e.g. 4 Years)', 'type' => 'text'],
                ['name' => 'service_warranty', 'label' => 'Free Home Service Warranty (e.g. 5 Years)', 'type' => 'text'],
                ['name' => 'installation_policy', 'label' => 'Installation & Delivery Policy', 'type' => 'text'],
                ['name' => 'emi_available', 'label' => 'EMI Monthly Facility (e.g. EMI from ৳2,500/month)', 'type' => 'text'],
            ],
        ],

        // 6. Pharmacy & Medicine
        'pharmacy' => [
            'section_title' => 'Medicine Details & Guidelines',
            'fields' => [
                ['name' => 'generic_name', 'label' => 'Generic Name', 'type' => 'text'],
                ['name' => 'dosage_form', 'label' => 'Dosage Form (Tablet, Syrup, Injection)', 'type' => 'text'],
                ['name' => 'strength', 'label' => 'Strength (e.g. 500mg, 10ml)', 'type' => 'text'],
                ['name' => 'manufacturer', 'label' => 'Pharmaceutical Company', 'type' => 'text'],
                ['name' => 'requires_prescription', 'label' => 'Prescription Required?', 'type' => 'boolean'],
                ['name' => 'authenticity_badge', 'label' => '100% Genuine Pharmacy Certified?', 'type' => 'boolean'],
                ['name' => 'how_to_use', 'label' => 'Dosage & Consumption Guidelines', 'type' => 'textarea'],
            ],
        ],

        // 7. Doctor & Chamber Consultation
        'doctor' => [
            'section_title' => 'Doctor Profile & Chamber Information',
            'fields' => [
                ['name' => 'degrees', 'label' => 'Educational Degrees (e.g. MBBS, FCPS)', 'type' => 'text'],
                ['name' => 'specialization', 'label' => 'Specialization (e.g. Cardiologist, Dermatologist)', 'type' => 'text'],
                ['name' => 'experience_years', 'label' => 'Years of Experience', 'type' => 'text'],
                ['name' => 'chamber_location', 'label' => 'Chamber / Hospital Address', 'type' => 'textarea'],
                ['name' => 'visiting_hours', 'label' => 'Visiting Schedule (e.g. Sat-Wed: 5PM - 9PM)', 'type' => 'text'],
            ],
        ],

        // 8. Vehicle & Automobile Dealership
        'vehicle_dealership' => [
            'section_title' => 'Vehicle Technical Specifications',
            'fields' => [
                ['name' => 'model_year', 'label' => 'Registration / Model Year', 'type' => 'number'],
                ['name' => 'mileage', 'label' => 'Mileage (e.g. 45,000 km)', 'type' => 'text'],
                ['name' => 'fuel_type', 'label' => 'Fuel Type (Octane, Hybrid, EV)', 'type' => 'text'],
                ['name' => 'engine_capacity', 'label' => 'Engine Capacity (CC)', 'type' => 'text'],
                ['name' => 'transmission', 'label' => 'Transmission (Automatic/Manual)', 'type' => 'text'],
            ],
        ],

        // 9. Real Estate & House Rental
        'real_estate' => [
            'section_title' => 'Property Features & Dimensions',
            'fields' => [
                ['name' => 'property_type', 'label' => 'Type (Apartment, Commercial, Plot)', 'type' => 'text'],
                ['name' => 'size_sqft', 'label' => 'Total Area (Sq Ft)', 'type' => 'number'],
                ['name' => 'bedrooms', 'label' => 'Bedrooms', 'type' => 'number'],
                ['name' => 'bathrooms', 'label' => 'Bathrooms', 'type' => 'number'],
                ['name' => 'facing', 'label' => 'Facing Direction (North, South, etc.)', 'type' => 'text'],
            ],
        ],

        // 10. House Rental
        'house_rental' => [
            'section_title' => 'Rental Unit Details',
            'fields' => [
                ['name' => 'floor_number', 'label' => 'Floor Level', 'type' => 'text'],
                ['name' => 'bedrooms', 'label' => 'Number of Bedrooms', 'type' => 'number'],
                ['name' => 'bathrooms', 'label' => 'Number of Bathrooms', 'type' => 'number'],
                ['name' => 'gas_connection', 'label' => 'Gas Connection Type', 'type' => 'text'],
                ['name' => 'service_charge', 'label' => 'Monthly Service Charge (BDT)', 'type' => 'number'],
            ],
        ],

        // 11. Matrimonial / Matchmaker
        'matchmaker' => [
            'section_title' => 'Biodata & Candidate Profile',
            'fields' => [
                ['name' => 'age', 'label' => 'Age (Years)', 'type' => 'number'],
                ['name' => 'height', 'label' => 'Height (e.g. 5ft 8in)', 'type' => 'text'],
                ['name' => 'education', 'label' => 'Highest Education Degree', 'type' => 'text'],
                ['name' => 'profession', 'label' => 'Current Profession / Organization', 'type' => 'text'],
                ['name' => 'home_district', 'label' => 'Permanent Home District', 'type' => 'text'],
            ],
        ],
    ],
];