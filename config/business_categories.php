<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Business Archetypes & Specific Categories Registry
    |--------------------------------------------------------------------------
    | Archetypes:
    | 1. commerce    -> Physical products with cart, variants, delivery charges
    | 2. service     -> Appointments, slots, visit fees (Doctors, Salons, etc.)
    | 3. lead_gen    -> Catalogs, quotation, WhatsApp/Call CTA (Cars, Real Estate)
    | 4. content     -> Portfolio, blogs, articles (Bloggers, Teachers, Students)
    */

    'archetypes' => [
        'physical_store'    => 'Physical Store (Retail & Commerce)',
        'food_menu'         => 'Food & Restaurant Menu',
        'service_booking'   => 'Appointment & Booking Services',
        'listing_inquiry'   => 'Listing & Inquiries (Real Estate, Vehicles)',
        'digital_course'    => 'Digital Downloads & Online Courses',
        'portfolio_content' => 'Portfolio, Showcase & Content',
    ],

    'categories' => [
        // 1. Physical Store Group
        'mobile_gadgets'     => ['name' => 'Mobile & Gadgets Shop', 'archetype' => 'physical_store'],
        'laptop_computer'    => ['name' => 'Laptop & Computer Shop', 'archetype' => 'physical_store'],
        'electronics'        => ['name' => 'Electric & Electronic Products', 'archetype' => 'physical_store'],
        'fashion_clothing'   => ['name' => 'Fashion & Clothing Store', 'archetype' => 'physical_store'],
        'shoes_footwear'     => ['name' => 'Footwear & Shoes Store', 'archetype' => 'physical_store'],
        'jewelry'            => ['name' => 'Jewelry & Ornaments', 'archetype' => 'physical_store'],
        'pharmacy'           => ['name' => 'Pharmacy & Medicine Store', 'archetype' => 'physical_store'],
        'grocery_food'       => ['name' => 'Grocery & Super Shop', 'archetype' => 'physical_store'],
        'grocery'            => ['name' => 'Grocery & Super Shop', 'archetype' => 'physical_store'],
        'cosmetics'          => ['name' => 'Cosmetics & Beauty Products', 'archetype' => 'physical_store'],
        'footwear'           => ['name' => 'Footwear & Shoes Store', 'archetype' => 'physical_store'],
        'furniture'          => ['name' => 'Furniture Showroom', 'archetype' => 'physical_store'],
        'sanitary'           => ['name' => 'Sanitary & Hardware Store', 'archetype' => 'physical_store'],
        'agro_farm'          => ['name' => 'Agro & Farm Products', 'archetype' => 'physical_store'],
        'nursery'            => ['name' => 'Plant Nursery & Gardening', 'archetype' => 'physical_store'],
        'handicrafts'        => ['name' => 'Handicrafts & Artistry', 'archetype' => 'physical_store'],
        'pet_food'           => ['name' => 'Pet Food & Accessories', 'archetype' => 'physical_store'],
        'sports_items'       => ['name' => 'Sports Equipment & Gear', 'archetype' => 'physical_store'],
        'library_stationery' => ['name' => 'Bookstore & Stationery', 'archetype' => 'physical_store'],

        // 2. Food & Menu Group
        'restaurant'         => ['name' => 'Restaurant & Cafe Menu', 'archetype' => 'food_menu'],
        'bakery_pastry'      => ['name' => 'Bakery & Pastry Shop', 'archetype' => 'food_menu'],

        // 3. Service & Booking Group
        'doctor'             => ['name' => 'Doctor & Chamber Consultation', 'archetype' => 'service_booking'],
        'barber_salon'       => ['name' => 'Barber Shop & Salon Spa', 'archetype' => 'service_booking'],
        'tailors'            => ['name' => 'Tailoring & Custom Clothing', 'archetype' => 'service_booking'],
        'coaching_service'   => ['name' => 'Coaching Center & Education', 'archetype' => 'service_booking'],
        'matchmaker'         => ['name' => 'Matrimonial & Matchmaking', 'archetype' => 'service_booking'],

        // 4. Listing & Inquiry Group
        'vehicle_dealership' => ['name' => 'Vehicle & Automobile Dealership', 'archetype' => 'listing_inquiry'],
        'real_estate'        => ['name' => 'Real Estate & Property Developer', 'archetype' => 'listing_inquiry'],
        'house_rental'       => ['name' => 'House Rental & To-Let Service', 'archetype' => 'listing_inquiry'],
        'travel_agency'      => ['name' => 'Travel Agency & Tour Operator', 'archetype' => 'listing_inquiry'],
        'water_treatment'    => ['name' => 'Water Treatment & Filter Solutions', 'archetype' => 'listing_inquiry'],
        'printing_press'     => ['name' => 'Printing Press & Packaging', 'archetype' => 'listing_inquiry'],
        'digital_agency'     => ['name' => 'Digital Marketing Agency', 'archetype' => 'listing_inquiry'],

        // 5. Digital & Courses
        'digital_course'     => ['name' => 'Digital Products & Courses', 'archetype' => 'digital_course'],

        // 6. Portfolio & Content Group
        'blogger_influencer' => ['name' => 'Blogger & Social Media Influencer', 'archetype' => 'portfolio_content'],
        'teacher_student'    => ['name' => 'Teacher & Academic Profile', 'archetype' => 'portfolio_content'],
        'portfolio'          => ['name' => 'Professional Career Portfolio', 'archetype' => 'portfolio_content'],
    ],
];