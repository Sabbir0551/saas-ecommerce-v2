<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ItemResource\Pages;
use App\Models\Category;
use App\Models\Item;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\Wizard;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Placeholder;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\IconColumn;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;

class ItemResource extends Resource
{
    protected static ?string $model = Item::class;

    protected static ?string $navigationIcon = 'heroicon-o-squares-2x2';

    public static function getNavigationLabel(): string
    {
        $category = tenant('business_category') ?? 'default';
        $archetype = tenant('archetype') ?? 'physical_store';

        return match ($category) {
            'fashion_clothing', 'shoes_footwear' => 'Apparel & Outfits',
            'restaurant', 'bakery_pastry'        => 'Menu & Food Items',
            'doctor'                             => 'Doctors & Chamber Serials',
            'barber_salon', 'coaching_service'   => 'Services & Appointments',
            'real_estate', 'house_rental'        => 'Properties & Listings',
            'vehicle_dealership'                 => 'Vehicles & Automobiles',
            'pharmacy'                           => 'Medicines & Health Items',
            'laptop_computer'                    => 'Laptops & Computers',
            'mobile_gadgets'                     => 'Smartphones & Gadgets',
            default => match ($archetype) {
                'service', 'service_booking'         => 'Services & Doctors',
                'lead_gen', 'lead', 'listing_inquiry' => 'Properties & Listings',
                'food_menu'                          => 'Menu & Food Items',
                'digital_course'                     => 'Digital Products & Courses',
                'portfolio_content'                  => 'Projects & Portfolio',
                default                              => 'Products & Inventory',
            },
        };
    }

    public static function getModelLabel(): string
    {
        $category = tenant('business_category') ?? 'default';
        $archetype = tenant('archetype') ?? 'physical_store';

        return match ($category) {
            'fashion_clothing' => 'Outfit',
            'restaurant'       => 'Food Item',
            'doctor'           => 'Doctor',
            'real_estate'      => 'Property',
            'pharmacy'         => 'Medicine',
            default => match ($archetype) {
                'service', 'service_booking'         => 'Service',
                'lead_gen', 'lead', 'listing_inquiry' => 'Listing',
                default                              => 'Product',
            },
        };
    }

    public static function getPluralModelLabel(): string
    {
        return static::getNavigationLabel();
    }

    public static function form(Form $form): Form
    {
        $archetype = tenant('archetype') ?? 'physical_store';
        $category = tenant('business_category') ?? 'laptop_computer';

        // Load preset fields from configuration
        $categoryConfig = config("business_presets.categories.{$category}", []);
        $categoryPresetFields = $categoryConfig['fields'] ?? [];
        $presetSectionTitle = $categoryConfig['section_title'] ?? 'Technical Specifications & Attributes';

        // Dynamic labels matching Category and Archetype
        $nameLabel = match ($category) {
            'fashion_clothing', 'shoes_footwear' => 'Outfit / Apparel Title',
            'restaurant', 'bakery_pastry'        => 'Dish / Food Item Name',
            'doctor'                             => 'Doctor Full Name & Designation',
            'real_estate', 'house_rental'        => 'Property / Unit Title',
            'pharmacy'                           => 'Medicine Brand & Generic Name',
            'vehicle_dealership'                 => 'Vehicle Model & Year',
            'laptop_computer'                    => 'Laptop Model / Machine Title',
            'mobile_gadgets'                     => 'Device / Gadget Model',
            default => match ($archetype) {
                'service', 'service_booking'         => 'Service / Doctor Title',
                'lead', 'lead_gen', 'listing_inquiry' => 'Property / Listing Title',
                'food_menu'                          => 'Dish / Food Item Name',
                default                              => 'Product Name / Title',
            },
        };

        $priceLabel = match ($category) {
            'fashion_clothing', 'shoes_footwear' => 'Retail Price (BDT)',
            'restaurant', 'bakery_pastry'        => 'Portion / Dish Price (BDT)',
            'doctor'                             => 'Consultation / Serial Fee (BDT)',
            'real_estate', 'house_rental'        => 'Asking / Rent Price (BDT)',
            'pharmacy'                           => 'MRP Price / Strip (BDT)',
            'vehicle_dealership'                 => 'Asking Price (BDT)',
            'laptop_computer'                    => 'Base Device Price (BDT)',
            default => match ($archetype) {
                'service', 'service_booking'         => 'Consultation / Service Fee (BDT)',
                'lead', 'lead_gen', 'listing_inquiry' => 'Listing Price (BDT)',
                'food_menu'                          => 'Item Price (BDT)',
                default                              => 'Regular Price (BDT)',
            },
        };

        // Dynamic Variant Repeater labels by category
        $variantsTitle = match ($category) {
            'fashion_clothing', 'shoes_footwear' => 'Size & Color Variations',
            'restaurant', 'bakery_pastry'        => 'Portion Sizes & Customizations',
            'pharmacy'                           => 'Packaging / Unit Variations (Strip, Box, Bottle)',
            'mobile_gadgets'                     => 'Storage & Color Variations',
            default                              => 'Product Variants & Stock Options',
        };

        $variantsDesc = match ($category) {
            'fashion_clothing', 'shoes_footwear' => 'Add clothing sizes (S, M, L, XL, XXL) and color options with individual stock & price',
            'restaurant', 'bakery_pastry'        => 'Specify portion sizes (e.g. 1:1, 1:2, Large, Family Pack) and optional extra pricing',
            'pharmacy'                           => 'Add pack sizes (e.g. 1 Strip 10 pcs, Full Box 100 pcs) with individual price & stock',
            default                              => 'Define selectable variants (RAM, Storage, Color) with separate pricing and inventory',
        };

        $variantTitleLabel = match ($category) {
            'fashion_clothing', 'shoes_footwear' => 'Size / Color (e.g., Black - L, Navy - M)',
            'restaurant', 'bakery_pastry'        => 'Portion / Size (e.g., Full, Half, 1:2)',
            'pharmacy'                           => 'Unit / Pack (e.g., 1 Strip [10 Tabs], 1 Box [100 Tabs])',
            default                              => 'Variant Title (e.g., 16GB RAM / 512GB SSD)',
        };

        // Generate dynamic preset fields
        $presetComponents = [];
        foreach ($categoryPresetFields as $fieldKey => $fieldMeta) {
            $label = $fieldMeta['label'] ?? ucfirst(str_replace('_', ' ', $fieldKey));
            $type = $fieldMeta['type'] ?? 'text';
            $placeholder = $fieldMeta['placeholder'] ?? null;

            if ($type === 'boolean') {
                $presetComponents[] = Toggle::make("item_attributes.{$fieldKey}")
                    ->label($label)
                    ->default(false);
            } elseif ($type === 'select') {
                $options = $fieldMeta['options'] ?? [];
                $presetComponents[] = Select::make("item_attributes.{$fieldKey}")
                    ->label($label)
                    ->options($options);
            } elseif ($type === 'number') {
                $presetComponents[] = TextInput::make("item_attributes.{$fieldKey}")
                    ->label($label)
                    ->numeric()
                    ->placeholder($placeholder);
            } elseif ($type === 'textarea') {
                $presetComponents[] = Textarea::make("item_attributes.{$fieldKey}")
                    ->label($label)
                    ->placeholder($placeholder)
                    ->rows(2);
            } else {
                $presetComponents[] = TextInput::make("item_attributes.{$fieldKey}")
                    ->label($label)
                    ->placeholder($placeholder);
            }
        }

        return $form->schema([
            Wizard::make([
                // -------------------------------------------------------------
                // Step 1: Basic Information
                // -------------------------------------------------------------
                Wizard\Step::make('Basic Essentials')
                    ->description('Title, pricing, media & category')
                    ->icon('heroicon-o-document-text')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('name')
                                ->label($nameLabel)
                                ->required()
                                ->maxLength(255)
                                ->live(onBlur: true)
                                ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state)))
                                ->columnSpan(2),

                            TextInput::make('slug')
                                ->label('URL Slug')
                                ->required()
                                ->unique(Item::class, 'slug', ignoreRecord: true)
                                ->columnSpan(1),
                        ]),

                        Grid::make(3)->schema([
                            TextInput::make('price')
                                ->label($priceLabel)
                                ->numeric()
                                ->prefix('৳')
                                ->required()
                                ->columnSpan(1),

                            TextInput::make('sale_price')
                                ->label('Offer / Discount Price (Optional)')
                                ->numeric()
                                ->prefix('৳')
                                ->columnSpan(1),

                            Select::make('category_id')
                                ->label('Category')
                                ->relationship('category', 'name')
                                ->searchable()
                                ->preload()
                                ->createOptionForm([
                                    TextInput::make('name')->label('Category Name')->required(),
                                    TextInput::make('slug')->label('Slug')->required(),
                                ])
                                ->columnSpan(1),
                        ]),

                        FileUpload::make('images')
                            ->label('Product Gallery Images')
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->panelLayout('grid')
                            ->imagePreviewHeight('140')
                            ->directory('items')
                            ->maxFiles(8)
                            ->columnSpanFull(),

                        Section::make('Product Video (Upload or Embed Link)')
                            ->description('ভিডিও আপলোড করুন অথবা ইউটিউব/ফেসবুক ভিডিও লিংক দিন')
                            ->schema([
                                TextInput::make('video_title')
                                    ->label('ভিডিওর শিরোনাম (Video Title)')
                                    ->placeholder('যেমন: প্রপার্টি ভার্চুয়াল ট্যুর অথবা প্রোডাক্ট আনবক্সিং ও রিভিউ')
                                    ->columnSpanFull(),

                                FileUpload::make('video_path')
                                    ->label('সরাসরি ভিডিও ফাইল আপলোড (Direct Video Upload)')
                                    ->helperText('MP4, WebM অথবা MOV ফাইল আপলোড করুন (সর্বোচ্চ ১০০ মেগাবাইট)')
                                    ->directory('items/videos')
                                    ->acceptedFileTypes(['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg'])
                                    ->maxSize(102400)
                                    ->columnSpan(1),

                                TextInput::make('video_url')
                                    ->label('অথবা ইউটিউব / ভিডিও লিংক (YouTube / Video URL)')
                                    ->placeholder('https://www.youtube.com/watch?v=...')
                                    ->helperText('ইউটিউব, ভিমিও বা ফেসবুক ভিডিও লিংক পেস্ট করুন')
                                    ->columnSpan(1),
                            ])
                            ->columns(2)
                            ->collapsible()
                            ->columnSpanFull(),

                        RichEditor::make('description')
                            ->label('Detailed Description & Features')
                            ->toolbarButtons([
                                'bold', 'italic', 'underline', 'strike',
                                'bulletList', 'orderedList', 'link', 'blockquote',
                            ])
                            ->columnSpanFull(),
                    ]),

                // -------------------------------------------------------------
                // Step 2: Technical Specifications & Variants
                // -------------------------------------------------------------
                Wizard\Step::make('Specifications & Variants')
                    ->description('Hardware details & inventory options')
                    ->icon('heroicon-o-adjustments-horizontal')
                    ->schema([
                        Section::make($presetSectionTitle)
                            ->description('Fill in technical specs and key bullet highlights for storefront display')
                            ->schema($presetComponents)
                            ->columns(2)
                            ->visible(!empty($presetComponents)),

                        Section::make($variantsTitle)
                            ->description($variantsDesc)
                            ->schema([
                                Repeater::make('variants')
                                    ->relationship()
                                    ->schema([
                                        TextInput::make('title')->label($variantTitleLabel)->required(),
                                        TextInput::make('price')->label('Variant Price (BDT)')->numeric()->prefix('৳'),
                                        TextInput::make('stock_quantity')->label('Stock Count')->numeric()->default(10),
                                        TextInput::make('sku')->label('Variant SKU')->placeholder('VAR-001'),
                                        Toggle::make('is_active')->label('Active')->default(true),
                                    ])
                                    ->columns(5)
                                    ->defaultItems(0),

                                Grid::make(2)->schema([
                                    TextInput::make('stock_quantity')
                                        ->label('Total Base Stock')
                                        ->numeric()
                                        ->default(0),

                                    TextInput::make('sku')
                                        ->label('Base SKU Code')
                                        ->placeholder('ITEM-001'),
                                ]),
                            ])
                            ->visible(in_array($archetype, ['physical_store', 'commerce'])),

                        Section::make('Weekly Visiting / Booking Slots')
                            ->description('Configure schedule times and capacities')
                            ->schema([
                                Repeater::make('bookingSlots')
                                    ->relationship()
                                    ->schema([
                                        Select::make('day_of_week')
                                            ->label('Day of Week')
                                            ->options([
                                                0 => 'Sunday',
                                                1 => 'Monday',
                                                2 => 'Tuesday',
                                                3 => 'Wednesday',
                                                4 => 'Thursday',
                                                5 => 'Friday',
                                                6 => 'Saturday',
                                            ])
                                            ->required(),

                                        TextInput::make('start_time')->label('Start Time')->type('time')->required(),
                                        TextInput::make('end_time')->label('End Time')->type('time')->required(),
                                        TextInput::make('capacity')->label('Capacity Limit')->numeric()->default(1),
                                        Toggle::make('is_active')->label('Active')->default(true),
                                    ])
                                    ->columns(5)
                                    ->defaultItems(0),
                            ])
                            ->visible(in_array($archetype, ['service', 'service_booking'])),
                    ]),

                // -------------------------------------------------------------
                // Step 3: SEO, Media & Publishing
                // -------------------------------------------------------------
                Wizard\Step::make('SEO & Publishing')
                    ->description('Search engine optimization & visibility')
                    ->icon('heroicon-o-globe-alt')
                    ->schema([
                        Section::make('Listing Completeness Score')
                            ->schema([
                                Placeholder::make('completeness_display')
                                    ->label('Product Quality Score')
                                    ->content(function ($record): HtmlString {
                                        $score = $record ? $record->completeness_score : 50;
                                        $color = $score >= 80 ? 'bg-emerald-500 text-emerald-100' : ($score >= 50 ? 'bg-amber-500 text-amber-100' : 'bg-rose-500 text-rose-100');
                                        return new HtmlString("
                                            <div class='flex items-center gap-4'>
                                                <div class='w-full bg-zinc-800 rounded-full h-3.5 overflow-hidden border border-zinc-700'>
                                                    <div class='{$color} h-3.5 rounded-full transition-all duration-500' style='width: {$score}%'></div>
                                                </div>
                                                <span class='font-bold text-sm text-zinc-200 whitespace-nowrap'>{$score}% Complete</span>
                                            </div>
                                            <p class='text-xs text-zinc-400 mt-1.5'>High quality specs, images, and video reviews directly increase sales conversion rates.</p>
                                        ");
                                    }),
                            ]),

                        Section::make('Search Engine Optimization (SEO Metadata)')
                            ->schema([
                                TextInput::make('seo_metadata.meta_title')
                                    ->label('Meta Title')
                                    ->placeholder('Appears as heading in Google search results'),

                                Textarea::make('seo_metadata.meta_description')
                                    ->label('Meta Description')
                                    ->placeholder('Brief summary displayed below title in search results')
                                    ->rows(2),
                            ])->columns(2),

                        Section::make('Product Video Embed')
                            ->schema([
                                TextInput::make('video_title')
                                    ->label('Video Title')
                                    ->placeholder('e.g., Unboxing & Performance Review'),

                                TextInput::make('video_url')
                                    ->label('YouTube / Video Embed URL')
                                    ->placeholder('https://www.youtube.com/watch?v=...'),
                            ])->columns(2),

                        Section::make('Custom Merchant Attributes')
                            ->description('Add any additional custom fields not covered in standard presets')
                            ->schema([
                                Repeater::make('custom_fields')
                                    ->schema([
                                        TextInput::make('field_name')->label('Attribute Name (e.g., Battery Cycle)')->required(),
                                        TextInput::make('field_value')->label('Value (e.g., Under 50 Cycles)')->required(),
                                    ])
                                    ->columns(2)
                                    ->defaultItems(0),
                            ]),

                        Section::make('Publishing & Visibility')
                            ->schema([
                                Toggle::make('is_active')
                                    ->label('Visible on Storefront')
                                    ->default(true),

                                Toggle::make('is_featured')
                                    ->label('Feature on Homepage Top Deals')
                                    ->default(false),
                            ])->columns(2),
                    ]),
            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        $archetype = tenant('archetype') ?? 'physical_store';

        $columns = [
            ImageColumn::make('images')
                ->label('Image')
                ->circular()
                ->stacked()
                ->limit(2),

            TextColumn::make('name')
                ->label('Product Title')
                ->searchable()
                ->sortable()
                ->weight('bold'),

            TextColumn::make('price')
                ->label('Price')
                ->money('BDT')
                ->sortable(),

            TextColumn::make('completeness_score')
                ->label('Score')
                ->formatStateUsing(fn ($state) => "{$state}%")
                ->badge()
                ->color(fn (int $state): string => match (true) {
                    $state >= 80 => 'success',
                    $state >= 50 => 'warning',
                    default => 'danger',
                })
                ->sortable(),
        ];

        if (in_array($archetype, ['physical_store', 'commerce'])) {
            $columns[] = TextColumn::make('stock_quantity')
                ->label('Stock')
                ->sortable()
                ->color(fn (int $state): string => $state > 0 ? 'success' : 'danger');
        }

        $columns[] = IconColumn::make('is_active')
            ->label('Active')
            ->boolean();

        $columns[] = TextColumn::make('created_at')
            ->label('Created')
            ->dateTime('M d, Y')
            ->sortable()
            ->toggleable(isToggledHiddenByDefault: true);

        return $table
            ->columns($columns)
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active Status'),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Featured Items'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListItems::route('/'),
            'create' => Pages\CreateItem::route('/create'),
            'edit' => Pages\EditItem::route('/{record}/edit'),
        ];
    }
}
