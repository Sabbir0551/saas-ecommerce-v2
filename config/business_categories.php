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
        'commerce' => 'Physical Commerce',
        'service'  => 'Appointment & Booking Services',
        'lead_gen' => 'Lead Generation & Inquiries',
        'content'  => 'Showcase & Content Portfolio',
    ],

    'categories' => [
        // Commerce Group
        'mobile_gadgets'     => ['name' => 'Mobile & Gadgets Shop', 'archetype' => 'commerce'],
        'laptop_computer'    => ['name' => 'Laptop & Computer Shop', 'archetype' => 'commerce'],
        'electronics'        => ['name' => 'Electric & Electronic Products', 'archetype' => 'commerce'],
        'fashion_clothing'   => ['name' => 'Fashion & Clothing Store', 'archetype' => 'commerce'],
        'jewelry'            => ['name' => 'Jewelry & Ornaments', 'archetype' => 'commerce'],
        'pharmacy'           => ['name' => 'Pharmacy & Medicine Store', 'archetype' => 'commerce'],
        'grocery'            => ['name' => 'Grocery & Super Shop', 'archetype' => 'commerce'],
        'cosmetics'          => ['name' => 'Cosmetics & Beauty Products', 'archetype' => 'commerce'],
        'footwear'           => ['name' => 'Footwear & Shoes Store', 'archetype' => 'commerce'],
        'furniture'          => ['name' => 'Furniture Showroom', 'archetype' => 'commerce'],
        'sanitary'           => ['name' => 'Sanitary & Hardware Store', 'archetype' => 'commerce'],
        'agro_farm'          => ['name' => 'Agro & Farm Products', 'archetype' => 'commerce'],
        'nursery'            => ['name' => 'Plant Nursery & Gardening', 'archetype' => 'commerce'],
        'handicrafts'        => ['name' => 'Handicrafts & Artistry', 'archetype' => 'commerce'],
        'pet_food'           => ['name' => 'Pet Food & Accessories', 'archetype' => 'commerce'],
        'sports_items'       => ['name' => 'Sports Equipment & Gear', 'archetype' => 'commerce'],
        'library_stationery' => ['name' => 'Bookstore & Stationery', 'archetype' => 'commerce'],

        // Service & Booking Group
        'doctor'             => ['name' => 'Doctor & Chamber Consultation', 'archetype' => 'service'],
        'barber_salon'       => ['name' => 'Barber Shop & Salon Spa', 'archetype' => 'service'],
        'tailors'            => ['name' => 'Tailoring & Custom Clothing', 'archetype' => 'service'],
        'coaching_service'   => ['name' => 'Coaching Center & Education', 'archetype' => 'service'],
        'matchmaker'         => ['name' => 'Matrimonial & Matchmaking', 'archetype' => 'service'],
        'restaurant'         => ['name' => 'Restaurant & Cafe', 'archetype' => 'service'],

        // Lead Gen & High Ticket Group
        'vehicle_dealership' => ['name' => 'Vehicle & Automobile Dealership', 'archetype' => 'lead_gen'],
        'real_estate'        => ['name' => 'Real Estate & Property Developer', 'archetype' => 'lead_gen'],
        'house_rental'       => ['name' => 'House Rental & To-Let Service', 'archetype' => 'lead_gen'],
        'travel_agency'      => ['name' => 'Travel Agency & Tour Operator', 'archetype' => 'lead_gen'],
        'water_treatment'    => ['name' => 'Water Treatment & Filter Solutions', 'archetype' => 'lead_gen'],
        'printing_press'     => ['name' => 'Printing Press & Packaging', 'archetype' => 'lead_gen'],
        'digital_agency'     => ['name' => 'Digital Marketing Agency', 'archetype' => 'lead_gen'],

        // Content & Portfolio Group
        'blogger_influencer' => ['name' => 'Blogger & Social Media Influencer', 'archetype' => 'content'],
        'teacher_student'    => ['name' => 'Teacher & Academic Profile', 'archetype' => 'content'],
        'portfolio'          => ['name' => 'Professional Career Portfolio', 'archetype' => 'content'],
    ],
];