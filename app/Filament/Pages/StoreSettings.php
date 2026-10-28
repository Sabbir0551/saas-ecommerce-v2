<?php

namespace App\Filament\Pages;

use App\Models\StoreModule;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\HtmlString;

class StoreSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationLabel = 'Store Settings & Customization';

    protected static ?string $title = 'Store Settings, Branding & Payment Gateways';

    protected static string $view = 'filament.pages.store-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $tenant = tenant();
        $category = $tenant->business_category ?? 'default';
        $categoryDefaults = config("business_presets.category_defaults.{$category}")
            ?? config("business_presets.category_defaults.default", []);
        $creds = $tenant->gateway_credentials ?? [];
        $branding = $tenant->branding ?? $creds['branding'] ?? [];

        // Active modules
        $enabledModules = StoreModule::where('is_enabled', true)->pluck('module_key')->toArray();

        $this->form->fill([
            // Branding & Design
            'store_name'              => $branding['store_name'] ?? ($tenant->name ?? 'Official Store'),
            'store_tagline'           => $branding['store_tagline'] ?? ($categoryDefaults['store_tagline'] ?? 'Official Online Store'),
            'store_logo'              => $branding['store_logo'] ?? '',
            'primary_color'           => $branding['primary_color'] ?? ($categoryDefaults['theme_color'] ?? '#2563eb'),
            'currency_symbol'         => $branding['currency_symbol'] ?? 'BDT',

            // Navigation Bar & Trust Badges
            'nav_trust_tag_1'         => $branding['nav_trust_tag_1'] ?? ($categoryDefaults['nav_trust_tag_1'] ?? ''),
            'nav_trust_tag_2'         => $branding['nav_trust_tag_2'] ?? ($categoryDefaults['nav_trust_tag_2'] ?? ''),
            'nav_items'               => $branding['nav_items'] ?? ($categoryDefaults['nav_items'] ?? []),

            // Top Bar & Contact Info
            'top_announcement'        => $branding['top_announcement'] ?? ($categoryDefaults['top_announcement'] ?? '✨ Welcome to our official online store!'),
            'hotline_number'          => $branding['hotline_number'] ?? '+880 1700-000000',
            'whatsapp_number'         => $branding['whatsapp_number'] ?? '+880 1700-000000',
            'support_hours'           => $branding['support_hours'] ?? 'Mon - Sun: 9:00 AM - 10:00 PM',
            'showroom_address'        => $branding['showroom_address'] ?? ($categoryDefaults['showroom_address'] ?? 'Dhaka, Bangladesh'),
            'showroom_address_branch' => $branding['showroom_address_branch'] ?? '',

            // Hero Section
            'hero_badge'              => $branding['hero_badge'] ?? ($categoryDefaults['hero_badge'] ?? '🔥 HOT TECH ACCESSORIES'),
            'hero_title'              => $branding['hero_title'] ?? ($categoryDefaults['hero_title'] ?? 'Mobile Accessories & Electronic'),
            'hero_subtitle'           => $branding['hero_subtitle'] ?? ($categoryDefaults['hero_subtitle'] ?? ''),
            'hero_image'              => $branding['hero_image'] ?? '',
            'hero_btn_text'           => $branding['hero_btn_text'] ?? ($categoryDefaults['hero_btn_text'] ?? 'Shop Now'),
            'hero_btn_url'            => $branding['hero_btn_url'] ?? '#featured-gadgets',
            'hero_btn2_text'          => $branding['hero_btn2_text'] ?? ($categoryDefaults['hero_btn2_text'] ?? 'Discover More'),
            'hero_btn2_url'           => $branding['hero_btn2_url'] ?? ($categoryDefaults['hero_btn2_url'] ?? '#categories'),
            'hero_pills'              => $branding['hero_pills'] ?? ($categoryDefaults['hero_pills'] ?? [
                ['icon' => '⚡', 'label' => 'Fast Charger'],
                ['icon' => '📶', 'label' => 'Wireless'],
                ['icon' => '🎧', 'label' => 'Hi-Fi Audio'],
                ['icon' => '🔋', 'label' => 'Power Bank'],
                ['icon' => '⌚', 'label' => 'Smartwatch'],
                ['icon' => '🛡️', 'label' => 'Case & Glass'],
            ]),

            // 4 Trust Perks (Under Hero Section)
            'perk_1_title'            => $branding['perk_1_title'] ?? ($categoryDefaults['perk_1_title'] ?? '100% Satisfaction'),
            'perk_1_desc'             => $branding['perk_1_desc'] ?? ($categoryDefaults['perk_1_desc'] ?? 'Authentic & guaranteed genuine quality.'),
            'perk_2_title'            => $branding['perk_2_title'] ?? ($categoryDefaults['perk_2_title'] ?? 'Fast Nationwide Delivery'),
            'perk_2_desc'             => $branding['perk_2_desc'] ?? ($categoryDefaults['perk_2_desc'] ?? 'Express 24-48h dispatch across 64 districts.'),
            'perk_3_title'            => $branding['perk_3_title'] ?? ($categoryDefaults['perk_3_title'] ?? '7 Days Replacement'),
            'perk_3_desc'             => $branding['perk_3_desc'] ?? ($categoryDefaults['perk_3_desc'] ?? 'Hassle-free replacement for any defects.'),
            'perk_4_title'            => $branding['perk_4_title'] ?? ($categoryDefaults['perk_4_title'] ?? 'Secure Payment'),
            'perk_4_desc'             => $branding['perk_4_desc'] ?? ($categoryDefaults['perk_4_desc'] ?? 'Cash on delivery, bKash & verified cards.'),

            // Categories Grid Section ("Smart Gadget Categories")
            'cat_section_enabled'     => $branding['cat_section_enabled'] ?? true,
            'cat_section_badge'       => $branding['cat_section_badge'] ?? ($categoryDefaults['cat_section_badge'] ?? 'EXPLORE COLLECTION'),
            'cat_section_title'       => $branding['cat_section_title'] ?? ($categoryDefaults['cat_section_title'] ?? 'Smart Gadget Categories'),
            'cat_section_subtitle'    => $branding['cat_section_subtitle'] ?? ($categoryDefaults['cat_section_subtitle'] ?? 'Curated collection of authentic gear for daily productivity, fitness, travel and high-end audio.'),

            // Featured Products Section ("Featured Gadgets")
            'featured_section_enabled'   => $branding['featured_section_enabled'] ?? true,
            'featured_section_badge'     => $branding['featured_section_badge'] ?? ($categoryDefaults['featured_section_badge'] ?? 'HOT PRODUCTS OF THE WEEK'),
            'featured_section_title'     => $branding['featured_section_title'] ?? ($categoryDefaults['featured_section_title'] ?? 'Featured Gadgets'),
            'featured_section_link_text' => $branding['featured_section_link_text'] ?? ($categoryDefaults['featured_section_link_text'] ?? 'View All Products →'),

            // Mid-Page Promo Spotlight Banner ("The Ultimate Mobile Gaming Setup 2026")
            'promo_banner_enabled'    => $branding['promo_banner_enabled'] ?? true,
            'promo_badge'             => $branding['promo_badge'] ?? ($categoryDefaults['promo_badge'] ?? 'NEXT-GEN GAMING 2026'),
            'promo_title'             => $branding['promo_title'] ?? ($categoryDefaults['promo_title'] ?? 'The Ultimate Mobile Gaming Setup 2026'),
            'promo_desc'              => $branding['promo_desc'] ?? ($categoryDefaults['promo_desc'] ?? 'Transform your smartphone into a powerhouse console with ultra-low latency wireless controllers, cooling fans, and Hi-Res trigger audio.'),
            'promo_image'             => $branding['promo_image'] ?? '',
            'promo_btn_text'          => $branding['promo_btn_text'] ?? ($categoryDefaults['promo_btn_text'] ?? 'Explore Setup Now →'),
            'promo_btn_url'           => $branding['promo_btn_url'] ?? ($categoryDefaults['promo_btn_url'] ?? '#products'),

            // New Arrivals Section ("New Gadget Drops")
            'new_drops_enabled'       => $branding['new_drops_enabled'] ?? true,
            'new_drops_badge'         => $branding['new_drops_badge'] ?? ($categoryDefaults['new_drops_badge'] ?? 'FRESH IN STORE'),
            'new_drops_title'         => $branding['new_drops_title'] ?? ($categoryDefaults['new_drops_title'] ?? 'New Gadget Drops'),
            'new_drops_subtitle'      => $branding['new_drops_subtitle'] ?? ($categoryDefaults['new_drops_subtitle'] ?? 'Upgrade your routine with brand-new releases fresh off the production line.'),
            'new_drops_link_text'     => $branding['new_drops_link_text'] ?? ($categoryDefaults['new_drops_link_text'] ?? 'Explore All Drops →'),

            // VIP / First-Order Discount Coupon Banner ("Save 10% On Your First Order")
            'coupon_banner_enabled'   => $branding['coupon_banner_enabled'] ?? true,
            'coupon_badge'            => $branding['coupon_badge'] ?? ($categoryDefaults['coupon_badge'] ?? 'EXCLUSIVE MEMBER PRIVILEGE'),
            'coupon_title'            => $branding['coupon_title'] ?? ($categoryDefaults['coupon_title'] ?? 'Save 10% On Your First Order'),
            'coupon_desc'             => $branding['coupon_desc'] ?? ($categoryDefaults['coupon_desc'] ?? 'Join over 50,000 satisfied tech lovers across Bangladesh. Use voucher code FIRST10 at checkout.'),
            'coupon_code'             => $branding['coupon_code'] ?? ($categoryDefaults['coupon_code'] ?? 'FIRST10'),
            'coupon_btn_text'         => $branding['coupon_btn_text'] ?? ($categoryDefaults['coupon_btn_text'] ?? 'GET YOUR COUPON'),

            // 4 Service Highlights Strip (Bottom of page)
            'service_strip_enabled'   => $branding['service_strip_enabled'] ?? true,
            'service_1_title'         => $branding['service_1_title'] ?? ($categoryDefaults['service_1_title'] ?? 'Fast Dispatch'),
            'service_1_desc'          => $branding['service_1_desc'] ?? ($categoryDefaults['service_1_desc'] ?? 'Same-day processing across 64 districts'),
            'service_2_title'         => $branding['service_2_title'] ?? ($categoryDefaults['service_2_title'] ?? 'Genuine Warranty'),
            'service_2_desc'          => $branding['service_2_desc'] ?? ($categoryDefaults['service_2_desc'] ?? 'Authorized dealer replacement & warranty'),
            'service_3_title'         => $branding['service_3_title'] ?? ($categoryDefaults['service_3_title'] ?? '24/7 Expert Support'),
            'service_3_desc'          => $branding['service_3_desc'] ?? ($categoryDefaults['service_3_desc'] ?? 'Reach out anytime via phone or WhatsApp'),
            'service_4_title'         => $branding['service_4_title'] ?? ($categoryDefaults['service_4_title'] ?? '0% Bank EMI'),
            'service_4_desc'          => $branding['service_4_desc'] ?? ($categoryDefaults['service_4_desc'] ?? 'Flexible 3 to 12 months installment plans'),

            // Why Choose Us
            'why_1_title'             => $branding['why_1_title'] ?? 'Grade-A Certified Quality',
            'why_1_desc'              => $branding['why_1_desc'] ?? 'Every item is tested across diagnostic quality checkpoints.',
            'why_2_title'             => $branding['why_2_title'] ?? 'Direct Video Call / Inquiry',
            'why_2_desc'              => $branding['why_2_desc'] ?? 'Inspect your items or talk directly with our specialists.',
            'why_3_title'             => $branding['why_3_title'] ?? 'Flexible Payment & Assistance',
            'why_3_desc'              => $branding['why_3_desc'] ?? 'Cash on delivery, digital wallets, and bank transfers.',

            // Consultation Banner
            'consultation_title'      => $branding['consultation_title'] ?? 'Confused which option fits your needs?',
            'consultation_subtitle'   => $branding['consultation_subtitle'] ?? 'Talk directly to our specialists for personalized guidance.',
            'consultation_phone'      => $branding['consultation_phone'] ?? '+880 1700-000000',

            // Footer Customization
            'footer_about'            => $branding['footer_about'] ?? ($categoryDefaults['footer_about'] ?? ''),
            'footer_featured_title'   => $branding['footer_featured_title'] ?? ($categoryDefaults['footer_featured_title'] ?? 'Featured Categories'),
            'footer_featured_links'   => $branding['footer_featured_links'] ?? ($categoryDefaults['footer_featured_links'] ?? []),
            'footer_merchant_badge_text' => $branding['footer_merchant_badge_text'] ?? ($categoryDefaults['footer_merchant_badge_text'] ?? 'ব্যক্তিগত রিটেইল মার্চেন্ট একাউন্ট'),
            'footer_payment_methods'  => $branding['footer_payment_methods'] ?? ($categoryDefaults['footer_payment_methods'] ?? ['cod', 'bkash', 'nagad', 'visa_master']),
            'footer_logistics_text'   => $branding['footer_logistics_text'] ?? ($categoryDefaults['footer_logistics_text'] ?? 'Official Logistics: Steadfast Courier & Pathao Express'),

            // Payment Gateways
            'bkash_app_key'           => $this->maskSecret($creds['bkash_app_key'] ?? ''),
            'bkash_app_secret'        => $this->maskSecret($creds['bkash_app_secret'] ?? ''),
            'bkash_username'          => $creds['bkash_username'] ?? '',
            'bkash_sandbox'           => $creds['bkash_sandbox'] ?? true,

            'ssl_store_id'            => $creds['ssl_store_id'] ?? '',
            'ssl_store_password'      => $this->maskSecret($creds['ssl_store_password'] ?? ''),
            'ssl_sandbox'             => $creds['ssl_sandbox'] ?? true,

            'cod_enabled'             => $creds['cod_enabled'] ?? true,
            'cod_phone_otp'           => $creds['cod_phone_otp'] ?? false,
            'cod_max_limit'           => $creds['cod_max_limit'] ?? 50000,

            // Couriers
            'steadfast_api_key'       => $this->maskSecret($creds['steadfast_api_key'] ?? ''),
            'steadfast_secret_key'    => $this->maskSecret($creds['steadfast_secret_key'] ?? ''),

            'pathao_client_id'        => $creds['pathao_client_id'] ?? '',
            'pathao_client_secret'    => $this->maskSecret($creds['pathao_client_secret'] ?? ''),

            // Legal Identification & Compliance
            'trade_license_no'         => $tenant->trade_license_no ?? '',
            'tin_no'                   => $tenant->tin_no ?? '',
            'bin_no'                   => $tenant->bin_no ?? '',
            'pra_no'                   => $tenant->pra_no ?? '',
            'bmdc_reg_no'              => $tenant->bmdc_reg_no ?? '',
            'drug_license_no'          => $tenant->drug_license_no ?? '',

            // Modules
            'module_physical_store'    => in_array('physical_store', $enabledModules),
            'module_food_menu'         => in_array('food_menu', $enabledModules),
            'module_service_booking'   => in_array('service_booking', $enabledModules),
            'module_listing_inquiry'   => in_array('listing_inquiry', $enabledModules),
            'module_digital_course'    => in_array('digital_course', $enabledModules),
            'module_portfolio_content' => in_array('portfolio_content', $enabledModules),
        ]);
    }

    protected function maskSecret(string $value): string
    {
        if (blank($value)) return '';
        if (strlen($value) <= 4) return '****';
        return str_repeat('*', max(4, strlen($value) - 4)) . substr($value, -4);
    }

    public function form(Form $form): Form
    {
        $tenant = tenant();
        $isPharmacy = ($tenant->business_category === 'pharmacy');
        $isVerified = !blank($tenant->drug_license_verified_at);

        return $form->schema([
            Tabs::make('SettingsTabs')->tabs([
                // Tab 1: Branding & Theme Colors
                Tabs\Tab::make('Branding & Colors')
                    ->icon('heroicon-o-paint-brush')
                    ->schema([
                        Section::make('Store Identity & Theme Customization')->schema([
                            TextInput::make('store_name')
                                ->label('Store Name')
                                ->required()
                                ->placeholder('e.g., Best Laptop Gallery'),

                            TextInput::make('store_tagline')
                                ->label('Store Tagline / Slogan')
                                ->placeholder('e.g., Certified Gadget & Laptop Store'),

                            Select::make('primary_color')
                                ->label('Website Accent Color Theme')
                                ->options([
                                    '#2563eb' => 'Royal Blue (Recommended for Tech & Electronics)',
                                    '#059669' => 'Emerald Green (Modern & Trustworthy)',
                                    '#d97706' => 'Amber Gold (Premium & Luxury Look)',
                                    '#4f46e5' => 'Indigo Purple (Modern SaaS & Digital)',
                                    '#0f172a' => 'Dark Slate / Stealth Black',
                                    '#e11d48' => 'Crimson Red (Vibrant & Energetic)',
                                    '#0891b2' => 'Cyan Teal (Clean & Crisp)',
                                ])
                                ->default('#2563eb')
                                ->helperText('This dynamically controls buttons, badges, highlights, and borders across the entire storefront.'),

                            Select::make('currency_symbol')
                                ->label('Currency Display Format')
                                ->options([
                                    'BDT' => 'BDT (৳)',
                                    'USD' => 'USD ($)',
                                    'EUR' => 'EUR (€)',
                                    'GBP' => 'GBP (£)',
                                ])
                                ->default('BDT'),

                            FileUpload::make('store_logo')
                                ->label('Store Logo Image')
                                ->image()
                                ->imagePreviewHeight('120')
                                ->directory('branding')
                                ->helperText('Upload a clean PNG or SVG logo with transparent background.')
                                ->columnSpanFull(),
                        ])->columns(2),
                    ]),

                // Tab 2: Homepage & Hero Banner
                Tabs\Tab::make('Homepage & Hero')
                    ->icon('heroicon-o-home')
                    ->schema([
                        Section::make('Announcement Bar & Contact Numbers')->schema([
                            TextInput::make('top_announcement')
                                ->label('Top Header Announcement Bar Notice')
                                ->placeholder('Limited time offer or store alert...')
                                ->columnSpanFull(),

                            TextInput::make('hotline_number')
                                ->label('Official Hotline Phone Number')
                                ->placeholder('+880 1700-000000'),

                            TextInput::make('whatsapp_number')
                                ->label('WhatsApp Direct Support Number')
                                ->placeholder('+880 1700-000000'),

                            TextInput::make('support_hours')
                                ->label('Customer Support Hours')
                                ->placeholder('e.g., Mon - Sun: 9:00 AM - 10:00 PM'),

                            TextInput::make('consultation_phone')
                                ->label('Expert Consultation Hotline')
                                ->placeholder('+880 1700-000000'),
                        ])->columns(2),

                        Section::make('Hero Showcase Banner')->schema([
                            TextInput::make('hero_badge')
                                 ->label('Top Highlight Badge')
                                 ->placeholder('e.g., 🔥 HOT TECH ACCESSORIES'),

                            TextInput::make('hero_title')
                                 ->label('Main Hero Heading')
                                 ->placeholder('e.g., Mobile Accessories & Electronic'),

                            Textarea::make('hero_subtitle')
                                 ->label('Subheading & Brief Overview')
                                 ->rows(2)
                                 ->columnSpanFull(),

                            FileUpload::make('hero_image')
                                 ->label('Hero Showcase Image (ব্যানারের প্রধান ছবি)')
                                 ->image()
                                 ->imagePreviewHeight('160')
                                 ->directory('branding')
                                 ->helperText('Upload a custom hero banner product collage or graphic. Leave empty for default high-res composite.')
                                 ->columnSpanFull(),

                            TextInput::make('hero_btn_text')
                                 ->label('Primary Action Button Text')
                                 ->placeholder('Shop Now'),

                            TextInput::make('hero_btn_url')
                                 ->label('Primary Button Target URL')
                                 ->placeholder('#featured-gadgets'),

                            TextInput::make('hero_btn2_text')
                                 ->label('Secondary Action Button Text')
                                 ->placeholder('Discover More'),

                            TextInput::make('hero_btn2_url')
                                 ->label('Secondary Button Target Link')
                                 ->placeholder('#categories'),

                            Repeater::make('hero_pills')
                                 ->label('Quick Feature Badges / Pills (হিরো সেকশনের ফিচার পিলসমূহ)')
                                 ->schema([
                                     TextInput::make('icon')->label('Icon / Emoji')->placeholder('e.g., ⚡, 📶, 🎧')->default('⚡'),
                                     TextInput::make('label')->label('Feature Title')->placeholder('e.g., Fast Charger')->required(),
                                 ])
                                 ->columns(2)
                                 ->reorderable()
                                 ->collapsible()
                                 ->columnSpanFull()
                                 ->itemLabel(fn (array $state): ?string => ($state['icon'] ?? '') . ' ' . ($state['label'] ?? 'Feature')),
                        ])->columns(2),

                        Section::make('Physical Showroom Branches')->schema([
                            Textarea::make('showroom_address')
                                ->label('Main Showroom Address (Dhaka)')
                                ->rows(2),

                            Textarea::make('showroom_address_branch')
                                ->label('Branch Showroom Address (Chittagong / Other)')
                                ->rows(2),
                        ])->columns(2),
                    ]),

                // Tab: Homepage Banners & Promotional Sections
                Tabs\Tab::make('Homepage Banners & Drops')
                    ->icon('heroicon-o-sparkles')
                    ->schema([
                        Section::make('Smart Categories Showcase Grid (ক্যাটাগরি গ্রিড সেকশন)')
                            ->description('হোমপেজে ক্যাটাগরি কার্ড এবং এক্সপ্লোর বাটনসহ আকর্ষণীয় গ্রিড প্রদর্শন')
                            ->schema([
                                Toggle::make('cat_section_enabled')->label('Show Categories Grid on Homepage')->default(true)->columnSpanFull(),
                                TextInput::make('cat_section_badge')->label('Badge Tag')->placeholder('EXPLORE COLLECTION'),
                                TextInput::make('cat_section_title')->label('Heading Title')->placeholder('Smart Gadget Categories'),
                                Textarea::make('cat_section_subtitle')->label('Subtitle Description')->rows(2)->columnSpanFull(),
                            ])->columns(2),

                        Section::make('Featured Products Section ("Featured Gadgets" / বিশেষ গ্যাজেটসমূহ)')
                            ->schema([
                                Toggle::make('featured_section_enabled')->label('Show Featured Products Section')->default(true)->columnSpanFull(),
                                TextInput::make('featured_section_badge')->label('Badge Tag')->placeholder('HOT PRODUCTS OF THE WEEK'),
                                TextInput::make('featured_section_title')->label('Section Heading')->placeholder('Featured Gadgets'),
                                TextInput::make('featured_section_link_text')->label('Action Link Text')->placeholder('View All Products →')->columnSpanFull(),
                            ])->columns(2),

                        Section::make('Mid-Page High-Impact Promo Banner ("The Ultimate Mobile Gaming Setup 2026")')
                            ->description('ওয়েবসাইটের মাঝখানের বিশেষ হাইলাইট বা অফার ব্যানার')
                            ->schema([
                                Toggle::make('promo_banner_enabled')->label('Enable Mid-Page Promo Banner')->default(true)->columnSpanFull(),
                                TextInput::make('promo_badge')->label('Badge Tag')->placeholder('NEXT-GEN GAMING 2026'),
                                TextInput::make('promo_title')->label('Headline Title')->placeholder('The Ultimate Mobile Gaming Setup 2026'),
                                Textarea::make('promo_desc')->label('Banner Description')->rows(2)->columnSpanFull(),
                                FileUpload::make('promo_image')
                                    ->label('Promotional Image (বামপাশের প্রোডাক্ট বা সেটআপ ছবি)')
                                    ->image()
                                    ->directory('branding')
                                    ->columnSpanFull(),
                                TextInput::make('promo_btn_text')->label('Button Label')->placeholder('Explore Setup Now →'),
                                TextInput::make('promo_btn_url')->label('Target URL')->placeholder('#products'),
                            ])->columns(2),

                        Section::make('New Arrivals Section ("New Gadget Drops" / নতুন কালেকশন)')
                            ->schema([
                                Toggle::make('new_drops_enabled')->label('Show New Drops Section')->default(true)->columnSpanFull(),
                                TextInput::make('new_drops_badge')->label('Badge Tag')->placeholder('FRESH IN STORE'),
                                TextInput::make('new_drops_title')->label('Section Heading')->placeholder('New Gadget Drops'),
                                Textarea::make('new_drops_subtitle')->label('Subtitle Description')->rows(2)->columnSpanFull(),
                                TextInput::make('new_drops_link_text')->label('Action Link Text')->placeholder('Explore All Drops →')->columnSpanFull(),
                            ])->columns(2),

                        Section::make('VIP / First-Order Discount Coupon Banner ("Save 10% On Your First Order")')
                            ->description('প্রথম অর্ডারে ডিসকাউন্ট বা ভিআইপি মেম্বার ভাউচার ব্যানার')
                            ->schema([
                                Toggle::make('coupon_banner_enabled')->label('Enable VIP Coupon Banner')->default(true)->columnSpanFull(),
                                TextInput::make('coupon_badge')->label('Badge Tag')->placeholder('EXCLUSIVE MEMBER PRIVILEGE'),
                                TextInput::make('coupon_title')->label('Banner Headline')->placeholder('Save 10% On Your First Order'),
                                Textarea::make('coupon_desc')->label('Description')->rows(2)->columnSpanFull(),
                                TextInput::make('coupon_code')->label('Voucher Code (কুপন কোড)')->placeholder('FIRST10'),
                                TextInput::make('coupon_btn_text')->label('Button Text')->placeholder('GET YOUR COUPON'),
                            ])->columns(2),

                        Section::make('4 Service Highlights Strip (পেজের নিচের ৪টি সেবা নিশ্চয়তা)')
                            ->schema([
                                Toggle::make('service_strip_enabled')->label('Show Service Highlights Strip')->default(true)->columnSpanFull(),
                                TextInput::make('service_1_title')->label('Service 1 Title')->placeholder('Fast Dispatch'),
                                TextInput::make('service_1_desc')->label('Service 1 Description')->placeholder('Same-day processing across 64 districts'),

                                TextInput::make('service_2_title')->label('Service 2 Title')->placeholder('Genuine Warranty'),
                                TextInput::make('service_2_desc')->label('Service 2 Description')->placeholder('Authorized dealer replacement & warranty'),

                                TextInput::make('service_3_title')->label('Service 3 Title')->placeholder('24/7 Expert Support'),
                                TextInput::make('service_3_desc')->label('Service 3 Description')->placeholder('Reach out anytime via phone or WhatsApp'),

                                TextInput::make('service_4_title')->label('Service 4 Title')->placeholder('0% Bank EMI'),
                                TextInput::make('service_4_desc')->label('Service 4 Description')->placeholder('Flexible 3 to 12 months installment plans'),
                            ])->columns(2),
                    ]),

                // Tab 3: Trust Badges & Guarantee Perks
                Tabs\Tab::make('Trust Badges')
                    ->icon('heroicon-o-shield-check')
                    ->schema([
                        Section::make('4 Service Guarantee Cards (Under Hero Section)')->schema([
                            TextInput::make('perk_1_title')->label('Card 1 Title'),
                            TextInput::make('perk_1_desc')->label('Card 1 Description'),

                            TextInput::make('perk_2_title')->label('Card 2 Title'),
                            TextInput::make('perk_2_desc')->label('Card 2 Description'),

                            TextInput::make('perk_3_title')->label('Card 3 Title'),
                            TextInput::make('perk_3_desc')->label('Card 3 Description'),

                            TextInput::make('perk_4_title')->label('Card 4 Title'),
                            TextInput::make('perk_4_desc')->label('Card 4 Description'),
                        ])->columns(2),

                        Section::make('Why Choose Us (3 Highlight Value Proposition Cards)')->schema([
                            TextInput::make('why_1_title')->label('Feature 1 Title'),
                            TextInput::make('why_1_desc')->label('Feature 1 Description'),

                            TextInput::make('why_2_title')->label('Feature 2 Title'),
                            TextInput::make('why_2_desc')->label('Feature 2 Description'),

                            TextInput::make('why_3_title')->label('Feature 3 Title'),
                            TextInput::make('why_3_desc')->label('Feature 3 Description'),
                        ])->columns(2),

                        Section::make('Expert Consultation Call-To-Action Banner')->schema([
                            TextInput::make('consultation_title')->label('Banner Title')->columnSpanFull(),
                            Textarea::make('consultation_subtitle')->label('Banner Subtitle')->rows(2)->columnSpanFull(),
                        ]),
                    ]),

                // Tab: Header & Navigation
                Tabs\Tab::make('Header & Navigation')
                    ->icon('heroicon-o-bars-3-bottom-left')
                    ->schema([
                        Section::make('Category Navigation Bar Links (হেডার সাব-মেনু লিংকসমূহ)')
                            ->description('স্টোরফ্রন্টের উপরের সাব-নেভিগেশনে প্রদর্শিত ক্যাটাগরি বা ফিল্টার লিংকসমূহ। ফাঁকা রাখলে স্বয়ংক্রিয়ভাবে আপনার ব্যবসার ক্যাটাগরি অনুযায়ী প্রিসেট প্রদর্শিত হবে।')
                            ->schema([
                                Repeater::make('nav_items')
                                    ->label('Navigation Links (মেনু আইটেমসমূহ)')
                                    ->schema([
                                        TextInput::make('label')
                                            ->label('Menu Title (নাম)')
                                            ->required()
                                            ->placeholder('e.g., Ready Apartments or ThinkPad'),

                                        TextInput::make('url')
                                            ->label('Target Link / Search (ইউআরএল)')
                                            ->required()
                                            ->placeholder('e.g., /?search=ThinkPad or /properties'),

                                        TextInput::make('icon')
                                            ->label('Icon / Emoji')
                                            ->placeholder('e.g., 🏢, 💻, 👗'),
                                    ])
                                    ->columns(3)
                                    ->defaultItems(0)
                                    ->reorderable()
                                    ->collapsible()
                                    ->cloneable()
                                    ->itemLabel(fn (array $state): ?string => $state['label'] ?? null),
                            ]),

                        Section::make('Header Trust Badges (হেডার ট্রাস্ট ট্যাগসমূহ)')
                            ->description('নেভিগেশন বারের ডানপাশে প্রদর্শিত ২টি বিশেষ কোয়ালিটি বা নিশ্চয়তা ব্যাজ')
                            ->schema([
                                TextInput::make('nav_trust_tag_1')
                                    ->label('Trust Badge 1')
                                    ->placeholder('e.g., ● 100% Genuine Certified or ● 100% Verified Legal Titles'),

                                TextInput::make('nav_trust_tag_2')
                                    ->label('Trust Badge 2')
                                    ->placeholder('e.g., ● 2-Year Service Warranty or ● Bank Loan Support up to 80%'),
                            ])->columns(2),
                    ]),

                // Tab: Footer Customization
                Tabs\Tab::make('Footer Customization')
                    ->icon('heroicon-o-window')
                    ->schema([
                        Section::make('Store Bio & Overview (কলাম ১ - স্টোরের বিবরণ)')
                            ->schema([
                                Textarea::make('footer_about')
                                    ->label('Store About Description (ফুটার সংক্ষিপ্ত বিবরণ)')
                                    ->rows(3)
                                    ->placeholder('ওয়েবসাইটের ফুটারে আপনার প্রতিষ্ঠান সম্পর্কে সংক্ষিপ্ত বর্ণনা লিখুন...')
                                    ->columnSpanFull(),
                            ]),

                        Section::make('Quick Links & Featured Categories (কলাম ৩ - ফিচার্ড লিংকসমূহ)')
                            ->description('ফুটারে আপনার ব্যবসার ক্যাটাগরি বা জনপ্রিয় সেকশনের লিংকগুলো এডিট করুন')
                            ->schema([
                                TextInput::make('footer_featured_title')
                                    ->label('Column 3 Heading Title (শিরোনাম)')
                                    ->placeholder('e.g., Featured Properties, Popular Collections, Signature Menus')
                                    ->columnSpanFull(),

                                Repeater::make('footer_featured_links')
                                    ->label('Featured Links List (লিংকসমূহ)')
                                    ->schema([
                                        TextInput::make('label')
                                            ->label('Link Label (নাম)')
                                            ->required()
                                            ->placeholder('e.g., Ready Luxury Apartments or Chef Combos'),

                                        TextInput::make('url')
                                            ->label('Target URL / Search Filter (লিংক)')
                                            ->required()
                                            ->placeholder('e.g., /?search=Apartment or /menu'),
                                    ])
                                    ->columns(2)
                                    ->defaultItems(0)
                                    ->reorderable()
                                    ->collapsible()
                                    ->cloneable()
                                    ->itemLabel(fn (array $state): ?string => $state['label'] ?? null),
                            ]),

                        Section::make('Identity, Payment Badges & Logistics (কলাম ৪ - মার্চেন্ট পরিচয় ও পেমেন্ট)')
                            ->schema([
                                TextInput::make('footer_merchant_badge_text')
                                    ->label('Merchant Identity Note (ট্রেড লাইসেন্স না থাকলে যে পরিচয় দেখাবে)')
                                    ->placeholder('e.g., ব্যক্তিগত রিটেইল মার্চেন্ট একাউন্ট বা অনুমোদিত ডিলার'),

                                CheckboxList::make('footer_payment_methods')
                                    ->label('Accepted Payment Badges (ফুটারে যে পেমেন্ট ব্যাজগুলো প্রদর্শিত হবে)')
                                    ->options([
                                        'cod'           => '💵 Cash on Delivery',
                                        'bkash'         => 'bKash (বিকাশ)',
                                        'nagad'         => 'Nagad (নগদ)',
                                        'rocket'        => 'Rocket (রকেট)',
                                        'upay'          => 'Upay (উপায়)',
                                        'visa_master'   => 'Visa / Mastercard (কার্ড)',
                                        'bank_transfer' => '🏦 Bank Transfer / Cheque (ব্যাংক)',
                                    ])
                                    ->columns(2),

                                TextInput::make('footer_logistics_text')
                                    ->label('Delivery & Logistics Note (ডেলিভারি পার্টনার বা সার্ভিস নোট)')
                                    ->placeholder('e.g., Official Logistics: Steadfast Courier & Pathao Express')
                                    ->columnSpanFull(),
                            ]),
                    ]),

                // Tab 4: Payment Gateways
                Tabs\Tab::make('Payment Gateways')
                    ->icon('heroicon-o-credit-card')
                    ->schema([
                        Section::make('bKash Merchant Account (Tokenized API)')->schema([
                            TextInput::make('bkash_username')->label('bKash Username'),
                            TextInput::make('bkash_app_key')->label('App Key')->password()->revealable(),
                            TextInput::make('bkash_app_secret')->label('App Secret')->password()->revealable(),
                            Toggle::make('bkash_sandbox')->label('Sandbox / Test Mode')->default(true),
                        ])->columns(2),

                        Section::make('SSLCommerz Payment Gateway')->schema([
                            TextInput::make('ssl_store_id')->label('Store ID'),
                            TextInput::make('ssl_store_password')->label('Store Password')->password()->revealable(),
                            Toggle::make('ssl_sandbox')->label('Sandbox / Test Mode')->default(true),
                        ])->columns(2),

                        Section::make('Cash on Delivery (COD)')->schema([
                            Toggle::make('cod_enabled')->label('Enable Cash on Delivery')->default(true),
                            Toggle::make('cod_phone_otp')->label('Require Phone OTP Verification (Anti-Fraud)')->default(false),
                            TextInput::make('cod_max_limit')->label('Maximum COD Limit (BDT)')->numeric()->default(50000),
                        ])->columns(3),
                    ]),

                // Tab 5: Courier Services
                Tabs\Tab::make('Courier Services')
                    ->icon('heroicon-o-truck')
                    ->schema([
                        Section::make('Steadfast Courier')->schema([
                            TextInput::make('steadfast_api_key')->label('API Key')->password()->revealable(),
                            TextInput::make('steadfast_secret_key')->label('Secret Key')->password()->revealable(),
                        ])->columns(2),

                        Section::make('Pathao Courier')->schema([
                            TextInput::make('pathao_client_id')->label('Client ID'),
                            TextInput::make('pathao_client_secret')->label('Client Secret')->password()->revealable(),
                        ])->columns(2),
                    ]),

                // Tab 6: Business Modules
                Tabs\Tab::make('Store Modules')
                    ->icon('heroicon-o-squares-plus')
                    ->schema([
                        Placeholder::make('modules_info')
                            ->label('Hybrid Multi-Business Modules Control')
                            ->content('Enable or disable business capabilities for your online storefront.'),

                        Grid::make(2)->schema([
                            Toggle::make('module_physical_store')
                                ->label('1. Physical Products Store')
                                ->helperText('Catalog, cart, variants, and express checkout'),

                            Toggle::make('module_food_menu')
                                ->label('2. Food & Restaurant Menu')
                                ->helperText('Menu listings, food add-ons, and table ordering'),

                            Toggle::make('module_service_booking')
                                ->label('3. Appointment & Service Booking')
                                ->helperText('Doctors, consultants, salons with hourly time-slots'),

                            Toggle::make('module_listing_inquiry')
                                ->label('4. Listings & Lead Inquiries')
                                ->helperText('Real estate, properties, vehicles, and direct inquiries'),

                            Toggle::make('module_digital_course')
                                ->label('5. Digital Downloads & Courses')
                                ->helperText('E-books, digital assets, video lessons, and courses'),

                            Toggle::make('module_portfolio_content')
                                ->label('6. Portfolio & Case Studies')
                                ->helperText('Showcase creative work, client results, and agency leads'),
                        ]),
                    ]),

                // Tab 7: Legal Compliance & Licenses
                // Tab 7: Legal Compliance & Licenses
                Tabs\Tab::make('Legal & Policies')
                    ->icon('heroicon-o-shield-check')
                    ->schema([
                        Section::make('Business Identity & Compliance (ব্যবসার পরিচয় ও সনদ)')
                            ->description('বাংলাদেশ ডিজিটাল কমার্স নির্দেশিকা ২০২১ অনুযায়ী ওয়েবসাইটের ফুটারে ক্রেতাদের আস্থার জন্য প্রদর্শিত হবে')
                            ->schema([
                                TextInput::make('trade_license_no')
                                    ->label('Trade License Number (ট্রেড লাইসেন্স নং)')
                                    ->placeholder('e.g., TRAD/DNCC/12345/2026'),

                                TextInput::make('tin_no')
                                    ->label('TIN Certificate Number (TIN নং)')
                                    ->placeholder('e.g., 123456789012'),

                                TextInput::make('bin_no')
                                    ->label('VAT / BIN Number (ভ্যাট / বিআইএন নং)')
                                    ->placeholder('e.g., 001234567-0101'),

                                TextInput::make('pra_no')
                                    ->label('bKash Personal Retail Account (PRA No)')
                                    ->placeholder('e.g., PRA-017XXXXXXXX')
                                    ->helperText('ট্রেড লাইসেন্স না থাকলে bKash ব্যক্তিগত খুচরা বিক্রেতা (PRA) নম্বর দিতে পারেন'),

                                TextInput::make('bmdc_reg_no')
                                    ->label('BMDC Doctor Registration No (বিএমডিসি নম্বর)')
                                    ->placeholder('e.g., A-12345')
                                    ->visible($tenant->business_category === 'doctor' || $tenant->archetype === 'service_booking'),
                            ])->columns(2),

                        Section::make('Pharmacy Drug License Verification')
                            ->description('Required under Digital Commerce Directive for pharmaceutical sales')
                            ->schema([
                                TextInput::make('drug_license_no')
                                    ->label('Drug License Registration No')
                                    ->placeholder('e.g., DL-DHAKA-12345'),

                                Placeholder::make('license_status')
                                    ->label('License Status')
                                    ->content(new HtmlString($isVerified 
                                        ? "<span class='px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-bold text-xs'>● Verified by Drug Administration</span>"
                                        : "<span class='px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full font-bold text-xs'>● Pending Verification</span>"
                                    )),
                            ])
                            ->visible($isPharmacy),

                        Section::make('Automated Legal Pages')->schema([
                            Placeholder::make('legal_pages')
                                ->label('Standard legal policies generated automatically for your store:')
                                ->content(new HtmlString("
                                    <ul class='list-disc list-inside text-xs text-zinc-400 space-y-1.5'>
                                        <li><strong>Terms & Conditions:</strong> Governs customer rights, orders, and delivery obligations.</li>
                                        <li><strong>Return & Refund Policy:</strong> 3-7 day return and warranty claim conditions.</li>
                                        <li><strong>Privacy Policy:</strong> Compliant with Personal Data Protection Act.</li>
                                        <li><strong>Customer Dispute:</strong> 72-hour dispute and resolution ticketing system.</li>
                                    </ul>
                                ")),
                        ]),
                    ]),
            ]),
        ])->statePath('data');
    }

    public function submit(): void
    {
        $state = $this->form->getState();
        $tenant = tenant();
        $currentCreds = $tenant->gateway_credentials ?? [];

        // Retain unedited secret keys
        $updateCred = function ($key, $field) use ($state, $currentCreds) {
            $val = $state[$field] ?? '';
            if (str_starts_with($val, '****') && isset($currentCreds[$key])) {
                return $currentCreds[$key];
            }
            return $val;
        };

        $newCreds = [
            'bkash_username'       => $state['bkash_username'] ?? '',
            'bkash_app_key'        => $updateCred('bkash_app_key', 'bkash_app_key'),
            'bkash_app_secret'     => $updateCred('bkash_app_secret', 'bkash_app_secret'),
            'bkash_sandbox'        => $state['bkash_sandbox'] ?? true,

            'ssl_store_id'         => $state['ssl_store_id'] ?? '',
            'ssl_store_password'   => $updateCred('ssl_store_password', 'ssl_store_password'),
            'ssl_sandbox'          => $state['ssl_sandbox'] ?? true,

            'cod_enabled'          => $state['cod_enabled'] ?? true,
            'cod_phone_otp'        => $state['cod_phone_otp'] ?? false,
            'cod_max_limit'        => $state['cod_max_limit'] ?? 50000,

            'steadfast_api_key'    => $updateCred('steadfast_api_key', 'steadfast_api_key'),
            'steadfast_secret_key' => $updateCred('steadfast_secret_key', 'steadfast_secret_key'),

            'pathao_client_id'     => $state['pathao_client_id'] ?? '',
            'pathao_client_secret' => $updateCred('pathao_client_secret', 'pathao_client_secret'),
        ];

        // Collect all branding settings
        $brandingKeys = [
            'store_name', 'store_tagline', 'store_logo', 'primary_color', 'currency_symbol',
            'top_announcement', 'hotline_number', 'whatsapp_number', 'support_hours',
            'showroom_address', 'showroom_address_branch',
            'hero_badge', 'hero_title', 'hero_subtitle', 'hero_image', 'hero_btn_text', 'hero_btn_url',
            'hero_btn2_text', 'hero_btn2_url', 'hero_pills',
            'perk_1_title', 'perk_1_desc', 'perk_2_title', 'perk_2_desc',
            'perk_3_title', 'perk_3_desc', 'perk_4_title', 'perk_4_desc',
            'cat_section_enabled', 'cat_section_badge', 'cat_section_title', 'cat_section_subtitle',
            'featured_section_enabled', 'featured_section_badge', 'featured_section_title', 'featured_section_link_text',
            'promo_banner_enabled', 'promo_badge', 'promo_title', 'promo_desc', 'promo_image', 'promo_btn_text', 'promo_btn_url',
            'new_drops_enabled', 'new_drops_badge', 'new_drops_title', 'new_drops_subtitle', 'new_drops_link_text',
            'coupon_banner_enabled', 'coupon_badge', 'coupon_title', 'coupon_desc', 'coupon_code', 'coupon_btn_text',
            'service_strip_enabled', 'service_1_title', 'service_1_desc', 'service_2_title', 'service_2_desc', 'service_3_title', 'service_3_desc', 'service_4_title', 'service_4_desc',
            'consultation_title', 'consultation_subtitle', 'consultation_phone',
            'why_1_title', 'why_1_desc', 'why_2_title', 'why_2_desc', 'why_3_title', 'why_3_desc',
            'nav_trust_tag_1', 'nav_trust_tag_2', 'nav_items',
            'footer_about', 'footer_featured_title', 'footer_featured_links',
            'footer_merchant_badge_text', 'footer_payment_methods', 'footer_logistics_text',
        ];

        $brandingData = [];
        foreach ($brandingKeys as $bKey) {
            if (isset($state[$bKey])) {
                $brandingData[$bKey] = $state[$bKey];
            }
        }
        $newCreds['branding'] = $brandingData;

        // Save to tenant record
        $tenant->gateway_credentials = $newCreds;
        $tenant->branding = $brandingData;
        if (isset($state['store_name'])) {
            $tenant->name = $state['store_name'];
        }
        if (isset($state['trade_license_no'])) {
            $tenant->trade_license_no = $state['trade_license_no'];
        }
        if (isset($state['tin_no'])) {
            $tenant->tin_no = $state['tin_no'];
        }
        if (isset($state['bin_no'])) {
            $tenant->bin_no = $state['bin_no'];
        }
        if (isset($state['pra_no'])) {
            $tenant->pra_no = $state['pra_no'];
        }
        if (isset($state['bmdc_reg_no'])) {
            $tenant->bmdc_reg_no = $state['bmdc_reg_no'];
        }
        if (isset($state['drug_license_no'])) {
            $tenant->drug_license_no = $state['drug_license_no'];
        }
        $tenant->save();

        // Update modules
        $modulesMap = [
            'physical_store'    => $state['module_physical_store'] ?? false,
            'food_menu'         => $state['module_food_menu'] ?? false,
            'service_booking'   => $state['module_service_booking'] ?? false,
            'listing_inquiry'   => $state['module_listing_inquiry'] ?? false,
            'digital_course'    => $state['module_digital_course'] ?? false,
            'portfolio_content' => $state['module_portfolio_content'] ?? false,
        ];

        foreach ($modulesMap as $mKey => $isEnabled) {
            StoreModule::updateOrCreate(
                ['module_key' => $mKey],
                ['is_enabled' => $isEnabled]
            );
        }

        Notification::make()
            ->title('Store settings and branding updated successfully')
            ->success()
            ->send();
    }
}
