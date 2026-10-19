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
            'section_title' => 'Device Specifications',
            'fields' => [
                ['name' => 'brand', 'label' => 'Brand / Manufacturer', 'type' => 'text'],
                ['name' => 'ram', 'label' => 'RAM (e.g. 8GB, 12GB)', 'type' => 'text'],
                ['name' => 'storage', 'label' => 'Internal Storage (e.g. 128GB, 256GB)', 'type' => 'text'],
                ['name' => 'battery', 'label' => 'Battery Capacity (mAh)', 'type' => 'text'],
                ['name' => 'warranty', 'label' => 'Warranty Details', 'type' => 'text'],
            ],
        ],

        // 2. Laptop & Computers
        'laptop_computer' => [
            'section_title' => 'System Specifications',
            'fields' => [
                ['name' => 'processor', 'label' => 'Processor / CPU', 'type' => 'text'],
                ['name' => 'ram', 'label' => 'Installed RAM', 'type' => 'text'],
                ['name' => 'storage_drive', 'label' => 'SSD / HDD Capacity', 'type' => 'text'],
                ['name' => 'graphics', 'label' => 'Graphics Card (GPU)', 'type' => 'text'],
                ['name' => 'screen_size', 'label' => 'Display Size (e.g. 15.6 Inch)', 'type' => 'text'],
                ['name' => 'warranty', 'label' => 'Warranty Duration', 'type' => 'text'],
            ],
        ],

        // 3. Pharmacy & Medicine
        'pharmacy' => [
            'section_title' => 'Medicine Details & Guidelines',
            'fields' => [
                ['name' => 'generic_name', 'label' => 'Generic Name', 'type' => 'text'],
                ['name' => 'dosage_form', 'label' => 'Dosage Form (Tablet, Syrup, Injection)', 'type' => 'text'],
                ['name' => 'strength', 'label' => 'Strength (e.g. 500mg, 10ml)', 'type' => 'text'],
                ['name' => 'manufacturer', 'label' => 'Pharmaceutical Company', 'type' => 'text'],
                ['name' => 'requires_prescription', 'label' => 'Prescription Required?', 'type' => 'boolean'],
            ],
        ],

        // 4. Doctor & Chamber Consultation
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

        // 5. Vehicle & Automobile Dealership
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

        // 6. Real Estate & House Rental
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

        // 7. House Rental
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

        // 8. Matrimonial / Matchmaker
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