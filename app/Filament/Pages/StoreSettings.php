<?php

namespace App\Filament\Pages;

use App\Models\StoreModule;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
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
        $creds = $tenant->gateway_credentials ?? [];
        $branding = $tenant->branding ?? $creds['branding'] ?? [];

        // Active modules
        $enabledModules = StoreModule::where('is_enabled', true)->pluck('module_key')->toArray();

        $this->form->fill([
            // Branding & Design
            'store_name'              => $branding['store_name'] ?? ($tenant->name ?? 'Best Laptop Gallery'),
            'store_tagline'           => $branding['store_tagline'] ?? 'Certified Gadget & Laptop Store',
            'store_logo'              => $branding['store_logo'] ?? '',
            'primary_color'           => $branding['primary_color'] ?? '#2563eb', // Default: Royal Blue
            'currency_symbol'         => $branding['currency_symbol'] ?? 'BDT',

            // Top Bar & Contact Info
            'top_announcement'        => $branding['top_announcement'] ?? '🔥 Limited Time Deal: Get up to 10% OFF on all laptops! Free nationwide shipping + free wireless mouse.',
            'hotline_number'          => $branding['hotline_number'] ?? '+880 1700-000000',
            'whatsapp_number'         => $branding['whatsapp_number'] ?? '+880 1700-000000',
            'support_hours'           => $branding['support_hours'] ?? 'Mon - Sun: 9:00 AM - 10:00 PM',
            'showroom_address'        => $branding['showroom_address'] ?? 'Shop #502, 5th Floor, Multiplan Center, New Elephant Road, Dhaka-1205',
            'showroom_address_branch' => $branding['showroom_address_branch'] ?? 'Shop #314, 3rd Floor, Akhtaruzzaman Center, Agrabad, Chittagong',

            // Hero Section
            'hero_badge'              => $branding['hero_badge'] ?? '✨ Premium Certified Quality',
            'hero_title'              => $branding['hero_title'] ?? 'High-Performance & Certified Business Laptops',
            'hero_subtitle'           => $branding['hero_subtitle'] ?? 'Buy original brand-new and certified laptops directly with up to 2 years official service warranty and 15 days replacement guarantee.',
            'hero_btn_text'           => $branding['hero_btn_text'] ?? 'Explore Laptops',
            'hero_btn_url'            => $branding['hero_btn_url'] ?? '#products',

            // 4 Trust Perks
            'perk_1_title'            => $branding['perk_1_title'] ?? 'Nationwide Cash on Delivery',
            'perk_1_desc'             => $branding['perk_1_desc'] ?? 'Fast delivery within 24 hours in Dhaka and 48 hours nationwide.',
            'perk_2_title'            => $branding['perk_2_title'] ?? '15 Days Replacement Guarantee',
            'perk_2_desc'             => $branding['perk_2_desc'] ?? 'Hassle-free replacement for any hardware defects within 15 days.',
            'perk_3_title'            => $branding['perk_3_title'] ?? '2 Years Official Warranty',
            'perk_3_desc'             => $branding['perk_3_desc'] ?? 'Free servicing and dedicated lifetime technical software support.',
            'perk_4_title'            => $branding['perk_4_title'] ?? '100% Genuine & Authentic',
            'perk_4_desc'             => $branding['perk_4_desc'] ?? 'Certified authentic laptops with genuine OEM fast chargers.',

            // Why Choose Us
            'why_1_title'             => $branding['why_1_title'] ?? 'Certified Grade-A Quality',
            'why_1_desc'              => $branding['why_1_desc'] ?? 'Every machine is tested across 30+ diagnostic hardware checkpoints.',
            'why_2_title'             => $branding['why_2_title'] ?? 'Live Video Call Inspection',
            'why_2_desc'              => $branding['why_2_desc'] ?? 'Inspect your selected laptop via WhatsApp video call before dispatch.',
            'why_3_title'             => $branding['why_3_title'] ?? '0% EMI & Flexible Payment',
            'why_3_desc'              => $branding['why_3_desc'] ?? 'Easy 3 to 12-month EMI plans across 31 leading bank credit cards.',

            // Consultation Banner
            'consultation_title'      => $branding['consultation_title'] ?? 'Confused which laptop fits your needs?',
            'consultation_subtitle'   => $branding['consultation_subtitle'] ?? 'Talk directly to our hardware specialists for personalized guidance and budget-friendly model selection.',
            'consultation_phone'      => $branding['consultation_phone'] ?? '+880 1700-000000',

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

            // Pharmacy Compliance
            'drug_license_no'         => $tenant->drug_license_no ?? '',

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
                                ->placeholder('e.g., ✨ Premium Certified Quality'),

                            TextInput::make('hero_title')
                                ->label('Main Hero Heading')
                                ->placeholder('e.g., High-Performance & Certified Business Laptops'),

                            Textarea::make('hero_subtitle')
                                ->label('Subheading & Brief Overview')
                                ->rows(2)
                                ->columnSpanFull(),

                            TextInput::make('hero_btn_text')
                                ->label('Primary Action Button Text')
                                ->placeholder('Explore Laptops'),

                            TextInput::make('hero_btn_url')
                                ->label('Button Target URL / Section')
                                ->placeholder('#products'),
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
                Tabs\Tab::make('Legal & Policies')
                    ->icon('heroicon-o-shield-check')
                    ->schema([
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
            'hero_badge', 'hero_title', 'hero_subtitle', 'hero_btn_text', 'hero_btn_url',
            'perk_1_title', 'perk_1_desc', 'perk_2_title', 'perk_2_desc',
            'perk_3_title', 'perk_3_desc', 'perk_4_title', 'perk_4_desc',
            'consultation_title', 'consultation_subtitle', 'consultation_phone',
            'why_1_title', 'why_1_desc', 'why_2_title', 'why_2_desc', 'why_3_title', 'why_3_desc',
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
