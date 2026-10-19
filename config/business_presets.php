<?php

return [
    /*
    |--------------------------------------------------------------------------
    | ব্যবসার ৬টি মূল আর্কিটাইপ (6 Business Archetypes)
    |--------------------------------------------------------------------------
    */
    'archetypes' => [
        'physical_store' => [
            'key' => 'physical_store',
            'name_bn' => 'পণ্য দোকান (Physical Store)',
            'name_en' => 'Physical Store',
            'description' => 'কার্ট, অর্ডার, ইনভেন্টরি, ডেলিভারি ও কুরিয়ার ট্র্যাকিং',
            'default_modules' => ['physical_store'],
            'item_label_bn' => 'পণ্যের নাম',
            'item_price_label_bn' => 'খুচরা মূল্য (টাকা)',
            'plural_label_bn' => 'পণ্য তালিকা',
            'navigation_icon' => 'heroicon-o-shopping-bag',
            'has_inventory' => true,
            'has_variants' => true,
            'has_shipping' => true,
        ],
        'food_menu' => [
            'key' => 'food_menu',
            'name_bn' => 'মেনু ও খাবার (Food & Menu)',
            'name_en' => 'Food & Menu',
            'description' => 'মেনু দেখে অর্ডার, অ্যাড-অন, টেবিল বুকিং ও ডেলিভারি',
            'default_modules' => ['food_menu'],
            'item_label_bn' => 'খাবারের নাম',
            'item_price_label_bn' => 'মূল্য (টাকা)',
            'plural_label_bn' => 'মেনু আইটেম তালিকা',
            'navigation_icon' => 'heroicon-o-cake',
            'has_inventory' => false,
            'has_variants' => true,
            'has_shipping' => true,
        ],
        'service_booking' => [
            'key' => 'service_booking',
            'name_bn' => 'সার্ভিস ও বুকিং (Service & Booking)',
            'name_en' => 'Service & Booking',
            'description' => 'সময় বা সেবা বেছে বুকিং, সাপ্তাহিক স্লট ও কনসালটেশন ফি',
            'default_modules' => ['service_booking'],
            'item_label_bn' => 'সেবা / বিশেষজ্ঞের নাম',
            'item_price_label_bn' => 'কনসালটেশন / সার্ভিস ফি (টাকা)',
            'plural_label_bn' => 'সেবা ও বুকিং তালিকা',
            'navigation_icon' => 'heroicon-o-calendar',
            'has_inventory' => false,
            'has_variants' => false,
            'has_shipping' => false,
        ],
        'listing_inquiry' => [
            'key' => 'listing_inquiry',
            'name_bn' => 'তালিকা ও ইনকোয়ারি (Listing & Inquiry)',
            'name_en' => 'Listing & Inquiry',
            'description' => 'তালিকা ফিল্টারিং, বিস্তারিত স্পেক্স ও ইনকোয়ারি পাঠানো',
            'default_modules' => ['listing_inquiry'],
            'item_label_bn' => 'তালিকা / প্রপার্টি / গাড়ির শিরোনাম',
            'item_price_label_bn' => 'আনুমানিক মূল্য / ভাড়া (টাকা)',
            'plural_label_bn' => 'লিস্টিং ও ইনকোয়ারি তালিকা',
            'navigation_icon' => 'heroicon-o-clipboard-document-list',
            'has_inventory' => false,
            'has_variants' => false,
            'has_shipping' => false,
        ],
        'digital_course' => [
            'key' => 'digital_course',
            'name_bn' => 'ডিজিটাল ও কোর্স (Digital & Courses)',
            'name_en' => 'Digital & Courses',
            'description' => 'ডিজিটাল ফাইল ডাউনলোড, অনলাইন লেসন ও কোর্স অ্যাক্সেস',
            'default_modules' => ['digital_course'],
            'item_label_bn' => 'কোর্স / ফাইলের নাম',
            'item_price_label_bn' => 'কোর্স ফি / মূল্য (টাকা)',
            'plural_label_bn' => 'ডিজিটাল আইটেম ও কোর্স',
            'navigation_icon' => 'heroicon-o-academic-cap',
            'has_inventory' => false,
            'has_variants' => false,
            'has_shipping' => false,
        ],
        'portfolio_content' => [
            'key' => 'portfolio_content',
            'name_bn' => 'পোর্টফোলিও ও কনটেন্ট (Portfolio & Content)',
            'name_en' => 'Portfolio & Content',
            'description' => 'কেস স্টাডি, রেজাল্ট, প্রজেক্ট গ্রিড ও ক্লায়েন্ট লিড',
            'default_modules' => ['portfolio_content'],
            'item_label_bn' => 'প্রজেক্ট / আর্টিকেলের নাম',
            'item_price_label_bn' => 'প্রজেক্ট বাজেট / ফি (টাকা)',
            'plural_label_bn' => 'প্রজেক্ট ও কনটেন্ট তালিকা',
            'navigation_icon' => 'heroicon-o-briefcase',
            'has_inventory' => false,
            'has_variants' => false,
            'has_shipping' => false,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | ব্যবসাভিত্তিক ক্যাটাগরি ও ডাইনামিক প্রিসেট ফিল্ডস
    |--------------------------------------------------------------------------
    */
    'categories' => [
        // -------------------------------------------------------------
        // আর্কিটাইপ ১: পণ্য দোকান (Physical Store)
        // -------------------------------------------------------------
        'mobile_gadgets' => [
            'name_bn' => 'মোবাইল ও গ্যাজেট',
            'archetype' => 'physical_store',
            'section_title' => 'মোবাইল ও ডিভাইসের স্পেসিফিকেশন',
            'fields' => [
                'brand' => ['label' => 'ব্র্যান্ড / প্রস্তুতকারক', 'type' => 'text', 'placeholder' => 'যেমন: Apple, Samsung, Xiaomi'],
                'ram' => ['label' => 'র‍্যাম (RAM)', 'type' => 'text', 'placeholder' => 'যেমন: 8GB, 12GB'],
                'storage' => ['label' => 'ইন্টারনাল স্টোরেজ', 'type' => 'text', 'placeholder' => 'যেমন: 128GB, 256GB'],
                'battery' => ['label' => 'ব্যাটারি ক্যাপাসিটি', 'type' => 'text', 'placeholder' => 'যেমন: 5000 mAh'],
                'warranty' => ['label' => 'ওয়ারেন্টি বিবরণ', 'type' => 'text', 'placeholder' => 'যেমন: ১ বছর অফিসিয়াল ওয়ারেন্টি'],
                'official_status' => [
                    'label' => 'অফিসিয়াল নাকি আনঅফিসিয়াল', 
                    'type' => 'select', 
                    'options' => ['Official BTRC Approved' => 'Official BTRC Approved', 'Unofficial / Global' => 'Unofficial / Global']
                ],
            ],
        ],

        'laptop_computer' => [
            'name_bn' => 'Laptops & Computers',
            'archetype' => 'physical_store',
            'section_title' => 'Technical Specifications & Hardware Details',
            'fields' => [
                // Quick Highlights (Rendered under price box)
                'brand' => ['label' => 'Brand', 'type' => 'select', 'options' => ['Lenovo' => 'Lenovo', 'Dell' => 'Dell', 'HP' => 'HP', 'Apple' => 'Apple', 'Asus' => 'Asus', 'Acer' => 'Acer', 'Microsoft' => 'Microsoft', 'MSI' => 'MSI']],
                'model' => ['label' => 'Model & Series', 'type' => 'text', 'placeholder' => 'e.g., ThinkPad T14 Gen 4, Latitude 7420, EliteBook 840 G8'],
                'condition' => ['label' => 'Condition', 'type' => 'select', 'options' => ['Brand New' => 'Brand New (Factory Sealed)', 'Certified Refurbished' => 'Certified Refurbished (Grade A)', 'Used' => 'Pre-Owned / Used']],
                'highlight_processor' => ['label' => 'Processor Highlight', 'type' => 'text', 'placeholder' => 'e.g., Intel Core i5-1335U (13th Gen, up to 4.60GHz, 10 Cores)'],
                'highlight_ram' => ['label' => 'RAM Highlight', 'type' => 'text', 'placeholder' => 'e.g., 16GB DDR5 5200MHz High-Speed RAM'],
                'highlight_storage' => ['label' => 'Storage Highlight', 'type' => 'text', 'placeholder' => 'e.g., 512GB PCIe Gen4 NVMe M.2 SSD'],
                'highlight_display' => ['label' => 'Display Highlight', 'type' => 'text', 'placeholder' => 'e.g., 14.0" WUXGA (1920x1200) IPS Anti-glare 300 nits'],
                'highlight_graphics' => ['label' => 'Graphics Highlight', 'type' => 'text', 'placeholder' => 'e.g., Intel Iris Xe Graphics / RTX 4050 6GB'],
                'highlight_battery' => ['label' => 'Battery Highlight', 'type' => 'text', 'placeholder' => 'e.g., Up to 7-8 Hours Battery Backup with 65W Rapid Charge'],
                'highlight_warranty' => ['label' => 'Warranty Highlight', 'type' => 'text', 'placeholder' => 'e.g., 15 Days Replacement + 2 Years Free Service Warranty'],

                // 1. Processor
                'processor_model' => ['label' => 'Processor Model & Variant', 'type' => 'text', 'placeholder' => 'e.g., Intel Core i5-1335U / AMD Ryzen 7 7730U'],
                'processor_gen' => ['label' => 'Processor Generation', 'type' => 'text', 'placeholder' => 'e.g., 13th Generation Raptor Lake'],
                'processor_speed' => ['label' => 'Clock Speed (Base & Turbo Boost)', 'type' => 'text', 'placeholder' => 'e.g., 1.30 GHz up to 4.60 GHz (10 Cores, 12 Threads)'],
                'processor_cache' => ['label' => 'Processor Cache Memory', 'type' => 'text', 'placeholder' => 'e.g., 12MB Intel Smart Cache'],

                // 2. Display
                'display_size' => ['label' => 'Display Size & Resolution', 'type' => 'text', 'placeholder' => 'e.g., 14.0" WUXGA (1920 x 1200) IPS Anti-glare'],
                'display_features' => ['label' => 'Display Features & Panel', 'type' => 'text', 'placeholder' => 'e.g., 300 nits, 45% NTSC, Narrow Bezel, 16:10 Aspect Ratio'],

                // 3. Memory / RAM
                'ram_installed' => ['label' => 'Installed RAM', 'type' => 'text', 'placeholder' => 'e.g., 16GB DDR5 5200MHz'],
                'ram_upgrade' => ['label' => 'RAM Upgrade Expansion', 'type' => 'text', 'placeholder' => 'e.g., Up to 32GB (1x Extra Slot Available)'],

                // 4. Storage
                'storage_installed' => ['label' => 'Installed Storage SSD/HDD', 'type' => 'text', 'placeholder' => 'e.g., 512GB PCIe Gen4 NVMe M.2 SSD'],
                'storage_upgrade' => ['label' => 'Storage Upgrade Slots', 'type' => 'text', 'placeholder' => 'e.g., Extra M.2 NVMe Slot Supported (up to 2TB)'],

                // 5. Graphics
                'graphics_chipset' => ['label' => 'Graphics Card (GPU)', 'type' => 'text', 'placeholder' => 'e.g., Intel Iris Xe Graphics / NVIDIA GeForce RTX 4050 6GB'],

                // 6. Keyboard & Security
                'keyboard' => ['label' => 'Keyboard & Touchpad', 'type' => 'text', 'placeholder' => 'e.g., Backlit Keyboard, Spill-resistant with TrackPoint'],
                'security' => ['label' => 'Security & Sensors', 'type' => 'text', 'placeholder' => 'e.g., Fingerprint Reader, Discrete TPM 2.0, Privacy Shutter'],

                // 7. Ports & Connectivity
                'ports' => ['label' => 'Connectivity & I/O Ports', 'type' => 'text', 'placeholder' => 'e.g., 2x Thunderbolt 4 / Type-C, 2x USB 3.2, 1x HDMI 2.1, 1x Audio combo jack'],
                'wireless' => ['label' => 'Wireless (Wi-Fi & Bluetooth)', 'type' => 'text', 'placeholder' => 'e.g., Intel Wi-Fi 6E AX211 + Bluetooth 5.1'],

                // 8. Camera, Audio & Battery
                'camera_audio' => ['label' => 'Webcam & Audio System', 'type' => 'text', 'placeholder' => 'e.g., 1080p FHD Webcam + Dolby Audio Stereo Speakers'],
                'battery' => ['label' => 'Battery Capacity & Charger', 'type' => 'text', 'placeholder' => 'e.g., 52.5Wh Li-Polymer Battery, 65W USB-C Fast Charger'],
                'os' => ['label' => 'Operating System', 'type' => 'text', 'placeholder' => 'e.g., Genuine Windows 11 Pro 64-bit Licensed'],
                'warranty' => ['label' => 'Warranty Terms', 'type' => 'text', 'placeholder' => 'e.g., 15 Days Replacement Guarantee + 2 Years Free Service Warranty'],
            ],
        ],

        'fashion_clothing' => [
            'name_bn' => 'ফ্যাশন ও পোশাক',
            'archetype' => 'physical_store',
            'section_title' => 'পোশাকের বিবরণ ও ম্যাটেরিয়াল',
            'fields' => [
                'fabric' => ['label' => 'ফেব্রিক / কাপড়', 'type' => 'text', 'placeholder' => 'যেমন: ১০০% পিওর সুতি (Cotton), প্রিমিয়াম সিল্ক'],
                'fit' => ['label' => 'ফিটিং টাইপ', 'type' => 'select', 'options' => ['Regular Fit' => 'Regular Fit', 'Slim Fit' => 'Slim Fit', 'Loose Fit' => 'Loose Fit']],
                'gender' => ['label' => 'জেন্ডার', 'type' => 'select', 'options' => ['Men' => 'পুরুষ', 'Women' => 'মহিলা', 'Unisex' => 'ইউনিসেক্স', 'Kids' => 'বাচ্চা']],
                'wash_care' => ['label' => 'ওয়াশ কেয়ার গাইড', 'type' => 'text', 'placeholder' => 'যেমন: কোল্ড ওয়াশ করুন, ড্রাই ওয়াশ'],
            ],
        ],

        'shoes_footwear' => [
            'name_bn' => 'জুতা ও ফুটওয়্যার',
            'archetype' => 'physical_store',
            'section_title' => 'জুতার ম্যাটেরিয়াল ও সোল বিবরণ',
            'fields' => [
                'sole_material' => ['label' => 'সোল ম্যাটেরিয়াল', 'type' => 'text', 'placeholder' => 'যেমন: রাবার, টিপিআর (TPR)'],
                'upper_material' => ['label' => 'আপার ম্যাটেরিয়াল', 'type' => 'text', 'placeholder' => 'যেমন: জেনুইন লেদার, মেশ ফেব্রিক'],
                'closure' => ['label' => 'টাইপ', 'type' => 'select', 'options' => ['Lace-up' => 'ফিতা (Lace-up)', 'Slip-on' => 'স্লিপ-অন (Slip-on)', 'Velcro' => 'বেল্ট (Velcro)']],
            ],
        ],

        'jewelry' => [
            'name_bn' => 'জুয়েলারি ও স্বর্ণ-রূপা',
            'archetype' => 'physical_store',
            'section_title' => 'স্বর্ণ / রৌপ্যের ক্যারেট ও ওজন',
            'fields' => [
                'metal_type' => ['label' => 'ধাতুর ধরন', 'type' => 'select', 'options' => ['Gold' => 'স্বর্ণ (Gold)', 'Diamond' => 'হীরা (Diamond)', 'Silver' => 'রূপা (Silver)', 'Platinum' => 'প্লাটিনাম']],
                'karat' => ['label' => 'ক্যারেট (Karat)', 'type' => 'select', 'options' => ['22K' => '২২ ক্যারেট (22K)', '21K' => '২১ ক্যারেট (21K)', '18K' => '১৮ ক্যারেট (18K)', 'Traditional' => 'সনাতন']],
                'weight_amount' => ['label' => 'ওজন (পরিমাণ)', 'type' => 'number', 'placeholder' => 'যেমন: ১.৫'],
                'weight_unit' => ['label' => 'ওজনের একক', 'type' => 'select', 'options' => ['vhori' => 'ভরি', 'gram' => 'গ্রাম', 'ana' => 'আনা', 'rotti' => 'রত্তি']],
                'making_charge' => ['label' => 'মেকিং চার্জ / মজুরি (টাকা)', 'type' => 'number', 'placeholder' => 'যেমন: ৩০০০'],
                'daily_rate' => ['label' => 'দৈনিক প্রতি ভরি/গ্রাম দর (টাকা)', 'type' => 'number', 'placeholder' => 'যেমন: ১৩৫০০০'],
                'hallmark_certified' => ['label' => 'হলমার্ক সার্টিফাইড কি না', 'type' => 'boolean'],
            ],
        ],

        'pharmacy' => [
            'name_bn' => 'ফার্মেসি ও ওষুধ',
            'archetype' => 'physical_store',
            'section_title' => 'ওষুধ ও হেলথকেয়ার বিবরণ',
            'fields' => [
                'generic_name' => ['label' => 'জেনেরিক নাম (Generic Name)', 'type' => 'text', 'placeholder' => 'যেমন: Paracetamol, Esomeprazole'],
                'dosage_form' => ['label' => 'ডোজেস ফর্ম', 'type' => 'select', 'options' => ['Tablet' => 'ট্যাবলেট', 'Syrup' => 'সিরাপ', 'Capsule' => 'ক্যাপসুল', 'Injection' => 'ইনজেকশন', 'Cream/Ointment' => 'মলম / ক্রিম', 'Drops' => 'ড্রপ']],
                'strength' => ['label' => 'শক্তি / পরিমাণ (Strength)', 'type' => 'text', 'placeholder' => 'যেমন: 500mg, 20mg, 100ml'],
                'manufacturer' => ['label' => 'প্রস্তুতকারক কোম্পানি', 'type' => 'text', 'placeholder' => 'যেমন: Square Pharmaceuticals, Beximco, Incepta'],
                'requires_prescription' => ['label' => 'প্রেসক্রিপশন আবশ্যক কি না?', 'type' => 'boolean'],
                'dar_number' => ['label' => 'ডিজিডিএ রেজিস্ট্রেশন (DAR No.)', 'type' => 'text', 'placeholder' => 'যেমন: DAR-123-456'],
            ],
        ],

        'grocery_food' => [
            'name_bn' => 'গ্রোসারি ও খাদ্যপণ্য',
            'archetype' => 'physical_store',
            'section_title' => 'খাদ্য উপদান ও প্যাকিং বিবরণ',
            'fields' => [
                'unit_weight' => ['label' => 'ওজন / পরিমাপ', 'type' => 'text', 'placeholder' => 'যেমন: ১ কেজি, ৫ লিটার, ৫০০ গ্রাম'],
                'expiry_date' => ['label' => 'মেয়াদ উত্তীর্ণের তারিখ', 'type' => 'text', 'placeholder' => 'যেমন: ৩১ ডিসেম্বর ২০২৭'],
                'origin' => ['label' => 'উৎপাদনকারী দেশ / অঞ্চল', 'type' => 'text', 'placeholder' => 'যেমন: বাংলাদেশ, অস্ট্রেলিয়া'],
                'organic' => ['label' => '১০০% অর্গানিক কি না?', 'type' => 'boolean'],
            ],
        ],

        'pet_food' => [
            'name_bn' => 'পোষা প্রাণীর খাবার ও সরঞ্জাম',
            'archetype' => 'physical_store',
            'section_title' => 'পেট আইটেম বিবরণ',
            'fields' => [
                'pet_type' => ['label' => 'প্রাণীর ধরন', 'type' => 'select', 'options' => ['Cat' => 'বিড়াল', 'Dog' => 'কুকুর', 'Bird' => 'পাখি', 'Fish' => 'মাছ', 'Rabbit' => 'খরগোশ']],
                'food_life_stage' => ['label' => 'বয়স ক্যাটাগরি', 'type' => 'select', 'options' => ['Kitten/Puppy' => 'ছোট বাচ্চা (Kitten/Puppy)', 'Adult' => 'পূর্ণবয়স্ক (Adult)', 'Senior' => 'বয়স্ক (Senior)']],
                'pack_size' => ['label' => 'প্যাক সাইজ', 'type' => 'text', 'placeholder' => 'যেমন: ১.২ কেজি'],
            ],
        ],

        // -------------------------------------------------------------
        // আর্কিটাইপ ২: মেনু ও খাবার (Food & Menu)
        // -------------------------------------------------------------
        'restaurant' => [
            'name_bn' => 'রেস্টুরেন্ট ও ফুড মেনু',
            'archetype' => 'food_menu',
            'section_title' => 'খাবারের স্পেসিফিকেশন ও প্রস্তুতি',
            'fields' => [
                'cuisine' => ['label' => 'রন্ধনশৈলী (Cuisine)', 'type' => 'text', 'placeholder' => 'যেমন: বাংলা, চায়নিজ, ইতালিয়ান, ফাস্টফুড'],
                'is_spicy' => ['label' => 'ঝালের মাত্রা', 'type' => 'select', 'options' => ['Mild' => 'হালকা ঝাল (Mild)', 'Medium' => 'মাঝারি ঝাল (Medium)', 'Extra Spicy' => 'তীব্র ঝাল (Extra Spicy)']],
                'is_vegetarian' => ['label' => 'নিরামিষ (Vegetarian) কি না?', 'type' => 'boolean'],
                'preparation_time' => ['label' => 'প্রস্তুতির আনুমানিক সময়', 'type' => 'text', 'placeholder' => 'যেমন: ২০-৩০ মিনিট'],
                'serving_size' => ['label' => 'পরিবেশন (সার্ভিং)', 'type' => 'text', 'placeholder' => 'যেমন: ১-২ জনের জন্য'],
                'available_time' => ['label' => 'কখন পাওয়া যায়', 'type' => 'select', 'options' => ['All Day' => 'সারাদিন', 'Breakfast' => 'সকালের নাস্তা', 'Lunch' => 'দুপুরের খাবার', 'Dinner' => 'রাতের খাবার']],
            ],
        ],

        'bakery_pastry' => [
            'name_bn' => 'বেকারি ও পেস্ট্রি শপ',
            'archetype' => 'food_menu',
            'section_title' => 'কেক ও বেকারির বিবরণ',
            'fields' => [
                'cake_flavor' => ['label' => 'ফ্লেভার', 'type' => 'text', 'placeholder' => 'যেমন: চকলেট ফাজ, ভ্যানিলা, রেড ভেলভেট'],
                'weight_pounds' => ['label' => 'ওজন (পাউন্ড)', 'type' => 'text', 'placeholder' => 'যেমন: ১ পাউন্ড, ২ পাউন্ড'],
                'eggless' => ['label' => 'ডিম ছাড়া (Eggless) কি না?', 'type' => 'boolean'],
                'custom_message_allowed' => ['label' => 'কেকে শুভেচ্ছা লেখা সম্ভব কি না?', 'type' => 'boolean'],
            ],
        ],

        // -------------------------------------------------------------
        // আর্কিটাইপ ৩: সার্ভিস ও বুকিং (Service & Booking)
        // -------------------------------------------------------------
        'doctor' => [
            'name_bn' => 'ডাক্তার ও চেম্বার কনসালটেশন',
            'archetype' => 'service_booking',
            'section_title' => 'চিকিৎসকের প্রোফাইল ও চেম্বার সূচি',
            'fields' => [
                'bmdc_reg_number' => ['label' => 'বিএমডিসি রেজিস্ট্রেশন নম্বর (BMDC Reg)', 'type' => 'text', 'placeholder' => 'যেমন: A-54321'],
                'degrees' => ['label' => 'ডিগ্রিসমূহ', 'type' => 'text', 'placeholder' => 'যেমন: MBBS, FCPS (Medicine), MD (Cardiology)'],
                'specialization' => ['label' => 'বিশেষজ্ঞতা (Specialization)', 'type' => 'text', 'placeholder' => 'যেমন: হৃদরোগ ও মেডিসিন বিশেষজ্ঞ'],
                'experience_years' => ['label' => 'অভিজ্ঞতা (বছর)', 'type' => 'text', 'placeholder' => 'যেমন: ১২ বছর'],
                'chamber_location' => ['label' => 'চেম্বার / হাসপাতালের ঠিকানা', 'type' => 'textarea', 'placeholder' => 'যেমন: চেম্বার নং ৩০৪, ধানমন্ডি, ঢাকা'],
                'visiting_hours' => ['label' => 'রোগী দেখার সময়সূচি', 'type' => 'text', 'placeholder' => 'যেমন: শনি-বৃহস্পতি: বিকাল ৫টা - রাত ৯টা'],
                'consultation_duration' => ['label' => 'রোগী প্রতি সময় (মিনিট)', 'type' => 'text', 'placeholder' => 'যেমন: ১৫ মিনিট'],
            ],
        ],

        'barber_salon' => [
            'name_bn' => 'সেলুন ও বিউটি পার্লার',
            'archetype' => 'service_booking',
            'section_title' => 'পার্লার ও গ্রুমিং সার্ভিসের বিবরণ',
            'fields' => [
                'service_duration' => ['label' => 'সেবার সময়কাল', 'type' => 'text', 'placeholder' => 'যেমন: ৪৫ মিনিট, ১ ঘন্টা'],
                'target_gender' => ['label' => 'কাদের জন্য', 'type' => 'select', 'options' => ['Women' => 'মহিলা', 'Men' => 'পুরুষ', 'Unisex' => 'উভয়']],
                'staff_name' => ['label' => 'বিশেষ স্পেশালিস্ট / স্টাইলিস্ট (যদি থাকে)', 'type' => 'text', 'placeholder' => 'যেমন: সিনিয়র স্টাইলিস্ট'],
                'home_service' => ['label' => 'হোম সার্ভিস দেওয়া হয় কি না?', 'type' => 'boolean'],
            ],
        ],

        'coaching_service' => [
            'name_bn' => 'কোচিং সেন্টার ও প্রাইভেট টিউশন',
            'archetype' => 'service_booking',
            'section_title' => 'ব্যাচ ও সিডিউল বিবরণ',
            'fields' => [
                'instructor_name' => ['label' => 'শিক্ষকের নাম ও যোগ্যতা', 'type' => 'text', 'placeholder' => 'যেমন: ড. রাশেদ (বুয়েট)'],
                'class_target' => ['label' => 'টার্গেট ক্লাস / লেভেল', 'type' => 'text', 'placeholder' => 'যেমন: এইচএসসি, অ্যাডমিশন, আইইএলটিএস'],
                'batch_schedule' => ['label' => 'সাপ্তাহিক ক্লাসের দিন ও সময়', 'type' => 'text', 'placeholder' => 'যেমন: রবি-মঙ্গল-বৃহস্পতি সকাল ৯টা'],
                'max_students' => ['label' => 'প্রতি ব্যাচে সর্বোচ্চ শিক্ষার্থী', 'type' => 'number', 'placeholder' => 'যেমন: ২০'],
            ],
        ],

        // -------------------------------------------------------------
        // আর্কিটাইপ ৪: তালিকা ও ইনকোয়ারি (Listing & Inquiry)
        // -------------------------------------------------------------
        'real_estate' => [
            'name_bn' => 'রিয়েল এস্টেট ও প্রপার্টি',
            'archetype' => 'listing_inquiry',
            'section_title' => 'প্রপার্টির বৈশিষ্ঠ্য ও আয়তন',
            'fields' => [
                'property_type' => ['label' => 'প্রপার্টি টাইপ', 'type' => 'select', 'options' => ['Apartment' => 'অ্যাপার্টমেন্ট', 'Commercial' => 'বাণিজ্যিক স্পেস', 'Plot' => 'জমি / প্লট', 'Duplex' => 'ডুপ্লেক্স']],
                'size_sqft' => ['label' => 'মোট আয়তন (স্কয়ার ফিট)', 'type' => 'number', 'placeholder' => 'যেমন: ১৪৫০'],
                'bedrooms' => ['label' => 'বেডরুমের সংখ্যা', 'type' => 'number', 'placeholder' => 'যেমন: ৩'],
                'bathrooms' => ['label' => 'বাথরুমের সংখ্যা', 'type' => 'number', 'placeholder' => 'যেমন: ৩'],
                'floor_number' => ['label' => 'ফ্লোর লেভেল', 'type' => 'text', 'placeholder' => 'যেমন: ৫ম তলা (G+8 ভবনে)'],
                'location' => ['label' => 'ঠিকানা / এলাকা', 'type' => 'text', 'placeholder' => 'যেমন: ব্লক সি, বসুন্ধরা আ/এ, ঢাকা'],
                'has_lift' => ['label' => 'লিফট সুবিধা আছে কি না?', 'type' => 'boolean'],
                'has_generator' => ['label' => 'জেনারেটর ব্যাকআপ আছে কি না?', 'type' => 'boolean'],
            ],
        ],

        'house_rental' => [
            'name_bn' => 'বাড়ি ও ফ্ল্যাট ভাড়া (House Rental)',
            'archetype' => 'listing_inquiry',
            'section_title' => 'ভাড়া ফ্ল্যাটের বিবরণ',
            'fields' => [
                'bedrooms' => ['label' => 'বেডরুম', 'type' => 'number', 'placeholder' => 'যেমন: ৩'],
                'bathrooms' => ['label' => 'বাথরুম', 'type' => 'number', 'placeholder' => 'যেমন: ২'],
                'balconies' => ['label' => 'বারান্দা সংখ্যা', 'type' => 'number', 'placeholder' => 'যেমন: ২'],
                'gas_connection' => ['label' => 'গ্যাস সংযোগ', 'type' => 'select', 'options' => ['Titas Line Gas' => 'তিতাস সরকারি গ্যাস', 'LPG Cylinder' => 'সিলিন্ডার গ্যাস', 'Central LPG' => 'সেন্ট্রাল এলপিজি']],
                'service_charge' => ['label' => 'মাসিক সার্ভিস চার্জ (টাকা)', 'type' => 'number', 'placeholder' => 'যেমন: ৪০০০'],
                'available_from' => ['label' => 'কবে থেকে উঠতে পারবে', 'type' => 'text', 'placeholder' => 'যেমন: আগামী মাসের ১ তারিখ থেকে'],
                'tenant_preference' => ['label' => 'ভাড়াটিয়া পছন্দ', 'type' => 'select', 'options' => ['Family Only' => 'শুধুমাত্র ফ্যামিলি', 'Bachelor' => 'ব্যাচেলর', 'Sublet' => 'সাবলেট']],
            ],
        ],

        'vehicle_dealership' => [
            'name_bn' => 'যানবাহন ও গাড়ি কেনাবেচা',
            'archetype' => 'listing_inquiry',
            'section_title' => 'গাড়ির কারিগরি স্পেসিফিকেশন',
            'fields' => [
                'model_year' => ['label' => 'মডেল বছর (Model Year)', 'type' => 'number', 'placeholder' => 'যেমন: 2019'],
                'registration_year' => ['label' => 'রেজিস্ট্রেশন বছর', 'type' => 'number', 'placeholder' => 'যেমন: 2021'],
                'mileage' => ['label' => 'মাইলেজ (কত কি.মি. চলেছে)', 'type' => 'text', 'placeholder' => 'যেমন: 38,000 km'],
                'engine_capacity' => ['label' => 'ইঞ্জিন ক্ষমতা (CC)', 'type' => 'text', 'placeholder' => 'যেমন: 1500 CC'],
                'fuel_type' => ['label' => 'জ্বালানি ধরন', 'type' => 'select', 'options' => ['Octane' => 'অকটেন', 'Hybrid' => 'হাইব্রিড', 'Electric' => 'ইলেকট্রিক (EV)', 'CNG' => 'সিএনজি']],
                'transmission' => ['label' => 'ট্রান্সমিশন', 'type' => 'select', 'options' => ['Automatic' => 'অটোমেটিক', 'Manual' => 'ম্যানুয়াল']],
                'car_condition' => ['label' => 'অবস্থা', 'type' => 'select', 'options' => ['Reconditioned' => 'রিকন্ডিশন্ড (Import)', 'Used' => 'ব্যবহৃত (Used)', 'Brand New' => 'একদম নতুন']],
            ],
        ],

        'matchmaker' => [
            'name_bn' => 'ম্যারেজ মিডিয়া ও পাত্র-পাত্রী বায়োডাটা',
            'archetype' => 'listing_inquiry',
            'section_title' => 'পাত্র / পাত্রীর পরিচয় ও বায়োডাটা',
            'fields' => [
                'candidate_type' => ['label' => 'প্রোফাইল টাইপ', 'type' => 'select', 'options' => ['Groom' => 'পাত্রের বায়োডাটা', 'Bride' => 'পাত্রীর বায়োডাটা']],
                'age' => ['label' => 'বয়স (বছর)', 'type' => 'number', 'placeholder' => 'যেমন: ২৭'],
                'height' => ['label' => 'উচ্চতা', 'type' => 'text', 'placeholder' => 'যেমন: ৫ ফুট ৬ ইঞ্চি'],
                'education' => ['label' => 'শিক্ষাগত যোগ্যতা', 'type' => 'text', 'placeholder' => 'যেমন: B.Sc in CSE, IBA MBA'],
                'profession' => ['label' => 'পেশা / কর্মসংস্থান', 'type' => 'text', 'placeholder' => 'যেমন: বিসিএস ক্যাডার, সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার'],
                'home_district' => ['label' => 'স্থায়ী ঠিকানা / জেলা', 'type' => 'text', 'placeholder' => 'যেমন: নোয়াখালী, চট্টগ্রাম, ঢাকা'],
                'marital_status' => ['label' => 'বৈবাহিক অবস্থা', 'type' => 'select', 'options' => ['Never Married' => 'অবিবাহিত', 'Divorced' => 'ডিভোর্সড', 'Widowed' => 'বিধবা / বিপত্নীক']],
            ],
        ],

        // -------------------------------------------------------------
        // আর্কিটাইপ ৫: ডিজিটাল ও কোর্স (Digital & Courses)
        // -------------------------------------------------------------
        'digital_product' => [
            'name_bn' => 'ডিজিটাল প্রোডাক্ট ও ইবুক',
            'archetype' => 'digital_course',
            'section_title' => 'ডিজিটাল ফাইল ও ডাউনলোড বিবরণ',
            'fields' => [
                'file_format' => ['label' => 'ফাইলের ফরম্যাট', 'type' => 'text', 'placeholder' => 'যেমন: PDF, ZIP, Figma, MP4'],
                'download_limit' => ['label' => 'সর্বোচ্চ ডাউনলোড সীমা', 'type' => 'number', 'placeholder' => 'যেমন: ৫ বার'],
                'license_type' => ['label' => 'লাইসেন্স টাইপ', 'type' => 'select', 'options' => ['Personal' => 'ব্যক্তিগত ব্যবহার', 'Commercial' => 'বাণিজ্যিক লাইসেন্স', 'Extended' => 'এক্সটেন্ডেড']],
            ],
        ],

        'online_course' => [
            'name_bn' => 'অনলাইন কোর্স ও ট্রেনিং',
            'archetype' => 'digital_course',
            'section_title' => 'কোর্স কারিকুলাম ও লেসন সংখ্যা',
            'fields' => [
                'instructor_name' => ['label' => 'প্রধান প্রশিক্ষকের নাম', 'type' => 'text', 'placeholder' => 'যেমন: এস এম জুবায়ের'],
                'total_hours' => ['label' => 'কোর্সের মোট সময়কাল', 'type' => 'text', 'placeholder' => 'যেমন: ২০ ঘন্টা'],
                'lessons_count' => ['label' => 'মোট লেসন সংখ্যা', 'type' => 'number', 'placeholder' => 'যেমন: ৪৫'],
                'has_certificate' => ['label' => 'কোর্স শেষে সার্টিফিকেট দেওয়া হবে কি না?', 'type' => 'boolean'],
            ],
        ],

        // -------------------------------------------------------------
        // আর্কিটাইপ ৬: পোর্টফোলিও ও কনটেন্ট (Portfolio & Content)
        // -------------------------------------------------------------
        'portfolio_content' => [
            'name_bn' => 'পোর্টফোলিও ও এজেন্সি প্রজেক্ট',
            'archetype' => 'portfolio_content',
            'section_title' => 'প্রজেক্টের বিবরণ ও ফলাফল',
            'fields' => [
                'client_name' => ['label' => 'ক্লায়েন্টের নাম / ব্র্যান্ড', 'type' => 'text', 'placeholder' => 'যেমন: Grameenphone, Acme Tech'],
                'project_role' => ['label' => 'আপনার ভূমিকা (Role)', 'type' => 'text', 'placeholder' => 'যেমন: UI/UX Designer, Lead Developer'],
                'technologies_used' => ['label' => 'ব্যবহৃত প্রযুক্তি / টুলস', 'type' => 'text', 'placeholder' => 'যেমন: Laravel, React, Tailwind, Figma'],
                'live_url' => ['label' => 'লাইভ প্রজেক্ট ইউআরএল', 'type' => 'text', 'placeholder' => 'https://...'],
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | ক্যাটাগরিভিত্তিক ডিফল্ট ব্র্যান্ডিং ও থিম সেটিংস
    |--------------------------------------------------------------------------
    */
    'category_defaults' => [
        'fashion_clothing' => [
            'theme_color' => '#e11d48',
            'store_tagline' => 'Trendy & Elegant Fashion Boutique',
            'hero_badge' => '✨ New Season Arrivals',
            'hero_title' => 'Curated Collections Designed for Elegance & Everyday Comfort',
            'hero_subtitle' => 'Explore premium hand-picked fabrics, chic silhouettes, and timeless clothing made with pure cotton and silk.',
            'hero_btn_text' => 'Shop New Arrivals',
            'hero_btn_url' => '#products',
            'top_announcement' => '🔥 Special Deal: Get Flat 15% OFF on New Season Arrivals! Free Delivery across Bangladesh.',
            'perk_1_title' => '100% Quality Fabric',
            'perk_1_desc' => 'Finest pure cotton, silk and georgette with durable stitching.',
            'perk_2_title' => '7 Days Easy Exchange',
            'perk_2_desc' => 'Hassle-free size and product exchange at your doorstep.',
            'perk_3_title' => 'Nationwide Fast COD',
            'perk_3_desc' => 'Delivered in 24 hours in Dhaka and 48 hours across Bangladesh.',
            'perk_4_title' => '100% Authentic Quality',
            'perk_4_desc' => 'Direct from verified fashion designers and craftsmen.',
            'footer_about' => 'Premier online fashion boutique offering curated collections of elegant apparel, designer wear, and daily essentials with prompt delivery.',
        ],
        'laptop_computer' => [
            'theme_color' => '#2563eb',
            'store_tagline' => 'Certified Brand-New & Business Laptops',
            'hero_badge' => '✨ Premium Certified Quality',
            'hero_title' => 'High-Performance & Certified Business Laptops',
            'hero_subtitle' => 'Buy original brand-new and certified laptops directly with up to 2 years official service warranty and 15 days replacement guarantee.',
            'hero_btn_text' => 'Explore Laptops',
            'hero_btn_url' => '#products',
            'top_announcement' => '🔥 Limited Time Deal: Get up to 10% OFF on all laptops! Free nationwide shipping + free wireless mouse.',
            'perk_1_title' => 'Nationwide Cash on Delivery',
            'perk_1_desc' => 'Fast delivery within 24 hours in Dhaka and 48 hours nationwide.',
            'perk_2_title' => '15 Days Replacement Guarantee',
            'perk_2_desc' => 'Hassle-free replacement for any hardware defects within 15 days.',
            'perk_3_title' => '2 Years Official Warranty',
            'perk_3_desc' => 'Free servicing and dedicated lifetime technical software support.',
            'perk_4_title' => '100% Genuine & Authentic',
            'perk_4_desc' => 'Certified authentic laptops with genuine OEM fast chargers.',
            'footer_about' => 'Authorized distributor of certified brand-new and enterprise laptops. Every laptop includes a 15-day replacement guarantee and 2 years of official service warranty.',
        ],
        'mobile_gadgets' => [
            'theme_color' => '#3b82f6',
            'store_tagline' => 'Official Smartphones & Smart Accessories',
            'hero_badge' => '📱 BTRC Approved Devices',
            'hero_title' => 'Latest Smartphones & Premium Tech Gadgets',
            'hero_subtitle' => 'Official BTRC approved smartphones, smartwatches, and audio gear with official brand warranty and instant delivery.',
            'hero_btn_text' => 'Explore Gadgets',
            'hero_btn_url' => '#products',
            'top_announcement' => '⚡ Flash Sale: Official Flagship Smartphones with 1 Year Official Brand Warranty!',
            'perk_1_title' => 'BTRC Approved Official',
            'perk_1_desc' => '100% official IMEI registered phones with official tax invoice.',
            'perk_2_title' => 'Official Brand Warranty',
            'perk_2_desc' => '1 Year official warranty valid at all authorized brand centers.',
            'perk_3_title' => 'Fast Express Delivery',
            'perk_3_desc' => 'Same-day express delivery in Dhaka and 48-hour nationwide delivery.',
            'perk_4_title' => '0% EMI Facility',
            'perk_4_desc' => 'Up to 12 months EMI on major credit cards.',
            'footer_about' => 'Official smartphones, wearables, and audio accessories with official warranty and nationwide cash on delivery.',
        ],
        'restaurant' => [
            'theme_color' => '#ea580c',
            'store_tagline' => 'Fresh, Delicious & Fast Food Delivery',
            'hero_badge' => '🔥 Fresh & Piping Hot',
            'hero_title' => 'Authentic Flavors, Handcrafted Meals Delivered Fast',
            'hero_subtitle' => 'Prepared fresh by master chefs using pure, organic ingredients. Enjoy gourmet food delivered hot to your door within 30-45 minutes.',
            'hero_btn_text' => 'Order Food Now',
            'hero_btn_url' => '#products',
            'top_announcement' => '🍕 Free Cold Drink with Every Combo Meal! Fast 30-minute delivery guaranteed.',
            'perk_1_title' => '100% Halal & Fresh',
            'perk_1_desc' => 'Prepared strictly with fresh, certified halal ingredients daily.',
            'perk_2_title' => '30-45 Min Fast Delivery',
            'perk_2_desc' => 'Insulated hot bags ensure your food arrives piping hot.',
            'perk_3_title' => 'Chef Special Recipes',
            'perk_3_desc' => 'Signature recipes perfected for memorable dining.',
            'perk_4_title' => 'Hygienic Kitchen Standard',
            'perk_4_desc' => 'Maintained under 100% sanitized, clean kitchen conditions.',
            'footer_about' => 'Delicious handcrafted dishes, combos, and beverages prepared fresh daily with lightning fast doorstep delivery.',
        ],
        'doctor' => [
            'theme_color' => '#0d9488',
            'store_tagline' => 'Dedicated Healthcare & Chamber Consultations',
            'hero_badge' => '🩺 BMDC Certified Specialists',
            'hero_title' => 'Trusted Specialist Doctor Appointments & Chamber Care',
            'hero_subtitle' => 'Book doctor appointment serials online with zero waiting time. Verified BMDC doctors, professional chambers, and dedicated care.',
            'hero_btn_text' => 'Book Appointment Serial',
            'hero_btn_url' => '#products',
            'top_announcement' => '🩺 Chamber Serial Open: Book your appointment online to avoid clinic queues.',
            'perk_1_title' => 'BMDC Verified Doctors',
            'perk_1_desc' => 'Consult with verified specialist physicians and consultants.',
            'perk_2_title' => 'Zero Waiting Serial',
            'perk_2_desc' => 'Pre-booked time slots ensure minimal waiting time at chamber.',
            'perk_3_title' => 'Chamber & Video Consult',
            'perk_3_desc' => 'In-person chamber visits and online follow-up consultations.',
            'perk_4_title' => 'Patient Care Support',
            'perk_4_desc' => 'Instant serial confirmation and SMS appointment reminders.',
            'footer_about' => 'Specialist doctor consultation and chamber appointment booking platform providing easy access to certified physicians with zero waiting queues.',
        ],
        'real_estate' => [
            'theme_color' => '#0f172a',
            'store_tagline' => 'Verified Properties, Luxury Apartments & Prime Plots',
            'hero_badge' => '🏢 100% Verified Legal Titles',
            'hero_title' => 'Discover Ready Apartments & Premium Commercial Spaces',
            'hero_subtitle' => 'Explore luxury ready flats, commercial floors, and residential plots in prime locations with clear titles and dedicated bank loan assistance.',
            'hero_btn_text' => 'Explore Properties',
            'hero_btn_url' => '#products',
            'top_announcement' => '🏢 Prime Ready Flats Available: RAJUK Approved, Bank Loan Support up to 80%!',
            'perk_1_title' => '100% Verified Titles',
            'perk_1_desc' => 'All properties undergo thorough legal and title verification.',
            'perk_2_title' => 'Bank Loan Assistance',
            'perk_2_desc' => 'Easy mortgage loan approval with leading commercial banks.',
            'perk_3_title' => 'Prime Dhaka Locations',
            'perk_3_desc' => 'Apartments in Gulshan, Banani, Dhanmondi, Uttara & Bashundhara.',
            'perk_4_title' => 'Free Site Visit Guide',
            'perk_4_desc' => 'Dedicated property specialist assists during on-site property tour.',
            'footer_about' => 'Premier real estate consultancy and listing portal connecting buyers with legally verified luxury apartments, commercial properties, and prime plots.',
        ],
        'pharmacy' => [
            'theme_color' => '#16a34a',
            'store_tagline' => 'Licensed Online Pharmacy & Health Essentials',
            'hero_badge' => '💊 DGDA Registered & Certified',
            'hero_title' => '100% Genuine Medicines & Healthcare Essentials Delivered',
            'hero_subtitle' => 'Order prescription medicines, baby care, surgical items, and healthcare essentials. Delivered in 2 hours with certified pharmacist support.',
            'hero_btn_text' => 'Browse Medicines',
            'hero_btn_url' => '#products',
            'top_announcement' => '💊 Emergency Medicine Delivery: Genuine medicines delivered within 2 hours in Dhaka!',
            'perk_1_title' => '100% Genuine Medicines',
            'perk_1_desc' => 'Sourced directly from top pharmaceutical manufacturers.',
            'perk_2_title' => '2-Hour Emergency Delivery',
            'perk_2_desc' => 'Fast emergency medicine delivery right to your door.',
            'perk_3_title' => 'DGDA Approved (DAR)',
            'perk_3_desc' => 'All products comply with Directorate General of Drug Administration.',
            'perk_4_title' => 'Prescription Verification',
            'perk_4_desc' => 'Certified pharmacists verify prescriptions before dispensing.',
            'footer_about' => 'Licensed digital pharmacy delivering authentic prescription medicines, wellness essentials, and medical devices with strict temperature control.',
        ],
        'default' => [
            'theme_color' => '#4f46e5',
            'store_tagline' => 'Premium Products & Dedicated Service',
            'hero_badge' => '✨ Official Online Store',
            'hero_title' => 'Discover Quality Products Crafted for Your Needs',
            'hero_subtitle' => 'Shop our curated collection with 100% authenticity guarantee, fast nationwide shipping, and dedicated customer support.',
            'hero_btn_text' => 'Explore Catalog',
            'hero_btn_url' => '#products',
            'top_announcement' => '✨ Welcome to our official store! Enjoy nationwide cash on delivery.',
            'perk_1_title' => 'Nationwide Delivery',
            'perk_1_desc' => 'Fast delivery across Bangladesh within 24-48 hours.',
            'perk_2_title' => 'Cash on Delivery',
            'perk_2_desc' => 'Inspect your parcel before completing payment.',
            'perk_3_title' => 'Authentic Guarantee',
            'perk_3_desc' => '100% genuine and verified product quality.',
            'perk_4_title' => 'Customer Support',
            'perk_4_desc' => 'Dedicated help via phone and WhatsApp messaging.',
            'footer_about' => 'Official online storefront offering authentic products, secure checkout, and prompt nationwide delivery.',
        ],
    ],
];
