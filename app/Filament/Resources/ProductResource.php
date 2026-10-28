<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\IconColumn;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static bool $shouldRegisterNavigation = false;

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    /**
     * টেন্যান্ট আর্কিটাইপ অনুযায়ী নেভিগেশন লেবেল পরিবর্তন
     */
    public static function getNavigationLabel(): string
    {
        $archetype = tenant('archetype') ?? 'commerce';
        return match ($archetype) {
            'service' => 'ডাক্তার / সার্ভিস প্রোফাইল',
            'lead'    => 'প্রপার্টি / লিস্টিং',
            default   => 'পণ্য / প্রোডাক্টস',
        };
    }

    public static function getModelLabel(): string
    {
        $archetype = tenant('archetype') ?? 'commerce';
        return match ($archetype) {
            'service' => 'সার্ভিস / ডাক্তার',
            'lead'    => 'প্রপার্টি',
            default   => 'প্রোডাক্ট',
        };
    }

    public static function getPluralModelLabel(): string
    {
        $archetype = tenant('archetype') ?? 'commerce';
        return match ($archetype) {
            'service' => 'সার্ভিস ও ডাক্তার তালিকা',
            'lead'    => 'প্রপার্টি ও লিস্টিং তালিকা',
            default   => 'পণ্য তালিকা',
        };
    }

    public static function form(Form $form): Form
    {
        $archetype = tenant('archetype') ?? 'commerce';
        $category = tenant('business_category') ?? 'fashion_clothing';

        // ক্যাটাগরি কনফিগ থেকে স্পেক্স স্কিমা আনা
        $categorySpecsConfig = config("business_specs.specs.{$category}.fields", []);

        // ডায়নামিক নাম ও প্রাইস লেবেল
        $nameLabel = match ($archetype) {
            'service' => 'ডাক্তার / প্রোভাইডারের নাম',
            'lead'    => 'প্রপার্টি / আইটেমের শিরোনাম',
            default   => 'পণ্যের নাম',
        };

        $priceLabel = match ($category) {
            'doctor' => 'কনসালটেশন ফি (টাকা)',
            'real_estate', 'vehicle_dealership' => 'আনুমানিক বা শুরু মূল্য (টাকা)',
            'barber_salon', 'tailors', 'coaching_service' => 'সার্ভিস চার্জ (টাকা)',
            'house_rental' => 'মাসিক ভাড়া (টাকা)',
            default => 'নিয়মিত মূল্য (টাকা)',
        };

        // ক্যাটাগরিভিত্তিক specs কম্পোনেন্ট তৈরি
        $specsComponents = [];
        foreach ($categorySpecsConfig as $fieldKey => $fieldMeta) {
            $label = $fieldMeta['label'] ?? ucfirst(str_replace('_', ' ', $fieldKey));
            $type = $fieldMeta['type'] ?? 'text';

            if ($type === 'boolean') {
                $specsComponents[] = Toggle::make("specs.{$fieldKey}")
                    ->label($label)
                    ->default(false);
            } elseif ($type === 'select') {
                $options = array_combine($fieldMeta['options'] ?? [], $fieldMeta['options'] ?? []);
                $specsComponents[] = Select::make("specs.{$fieldKey}")
                    ->label($label)
                    ->options($options);
            } elseif ($type === 'number') {
                $specsComponents[] = TextInput::make("specs.{$fieldKey}")
                    ->label($label)
                    ->numeric();
            } else {
                $specsComponents[] = TextInput::make("specs.{$fieldKey}")
                    ->label($label)
                    ->placeholder($fieldMeta['placeholder'] ?? null);
            }
        }

        return $form->schema([
            Grid::make(['default' => 1, 'lg' => 3])->schema([
                
                // বাম পাশ (২ কলাম): মূল পরিচিতি ও মিডিয়া
                Grid::make(1)->columnSpan(['lg' => 2])->schema([
                    
                    Section::make('মৌলিক তথ্য')->schema([
                        TextInput::make('name')
                            ->label($nameLabel)
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),

                        TextInput::make('slug')
                            ->label('ইউআরএল স্লাগ (Slug)')
                            ->required()
                            ->unique(Product::class, 'slug', ignoreRecord: true),

                        RichEditor::make('description')
                            ->label('বিস্তারিত বিবরণ')
                            ->columnSpanFull(),
                    ])->columns(2),

                    // স্পেসিফিকেশন সেকশন (যদি ক্যাটাগরির জন্য নির্ধারিত specs থাকে)
                    Section::make(config("business_specs.specs.{$category}.section_title", 'মূল বৈশিষ্ট্য ও স্পেসিফিকেশন'))
                        ->description('ক্যাটাগরি অনুযায়ী অতিরিক্ত তথ্য পূরণ করুন')
                        ->schema($specsComponents)
                        ->columns(2)
                        ->visible(!empty($specsComponents)),

                    // মিডিয়া গ্যালারি ও ভিডিও
                    Section::make('ছবি ও ভিডিও গ্যালারি')->schema([
                        FileUpload::make('images')
                            ->label('ছবি আপলোড')
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->panelLayout('grid')
                            ->imagePreviewHeight('140')
                            ->directory('products')
                            ->columnSpanFull(),

                        TextInput::make('video_title')
                            ->label('ভিডিওর শিরোনাম')
                            ->placeholder('যেমন: চেম্বার পরিচিতি অথবা প্রপার্টি ভার্চুয়াল ট্যুর')
                            ->columnSpanFull(),

                        FileUpload::make('video_path')
                            ->label('সরাসরি ভিডিও ফাইল আপলোড')
                            ->helperText('MP4, WebM অথবা MOV ফাইল আপলোড করুন (সর্বোচ্চ ১০০MB)')
                            ->directory('products/videos')
                            ->acceptedFileTypes(['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg'])
                            ->maxSize(102400)
                            ->columnSpan(1),

                        TextInput::make('embed_video_url')
                            ->label('ইউটিউব / ভিডিও এমবেড ইউআরএল')
                            ->placeholder('https://www.youtube.com/embed/...')
                            ->helperText('ইউটিউব বা অন্য কোনো ভিডিও লিংক')
                            ->columnSpan(1),
                    ])->columns(2),

                    // ফিজিক্যাল কমার্সের জন্য ভ্যারিয়েন্ট রিপিটার
                    Section::make('পণ্য ভ্যারিয়েন্ট (রং / সাইজ)')
                        ->schema([
                            Repeater::make('variants')
                                ->relationship()
                                ->schema([
                                    TextInput::make('title')->label('ভ্যারিয়েন্ট নাম')->required(),
                                    TextInput::make('price')->label('দাম')->numeric(),
                                    TextInput::make('stock_quantity')->label('স্টক সংখ্যা')->numeric()->default(0),
                                    Toggle::make('is_active')->label('সক্রিয়')->default(true),
                                ])
                                ->columns(4)
                        ])
                        ->visible($archetype === 'commerce'),
                ]),

                // ডান পাশ (১ কলাম): মূল্য, স্ট্যাটাস ও ইনভেন্টরি
                Grid::make(1)->columnSpan(['lg' => 1])->schema([
                    
                    Section::make('ক্যাটাগরি ও ব্র্যান্ড')->schema([
                        Select::make('category_id')
                            ->label('ক্যাটাগরি')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload()
                            ->createOptionForm([
                                TextInput::make('name')->label('ক্যাটাগরির নাম')->required(),
                                TextInput::make('slug')->label('Slug')->required(),
                            ]),

                        Select::make('brand_id')
                            ->label('ব্র্যান্ড / প্রস্তুতকারক')
                            ->relationship('brand', 'name')
                            ->searchable()
                            ->preload()
                            ->createOptionForm([
                                TextInput::make('name')->label('ব্র্যান্ডের নাম')->required(),
                                TextInput::make('slug')->label('Slug')->required(),
                                FileUpload::make('logo')->label('ব্র্যান্ড লোগো')->image()->directory('brands'),
                            ]),
                    ]),

                    Section::make('মূল্য ও চার্জ')->schema([
                        TextInput::make('price')
                            ->label($priceLabel)
                            ->numeric()
                            ->prefix('৳')
                            ->required(),

                        TextInput::make('sale_price')
                            ->label('অফার / ডিসকাউন্ট মূল্য (যদি থাকে)')
                            ->numeric()
                            ->prefix('৳')
                            ->visible($archetype === 'commerce' || $archetype === 'service'),
                    ]),

                    // শুধুমাত্র ফিজিক্যাল কমার্সের ক্ষেত্রে স্টক সেকশন দেখাবে
                    Section::make('ইনভেন্টরি ও স্টক')->schema([
                        TextInput::make('stock_quantity')
                            ->label('মজুদ পণ্য সংখ্যা (Stock)')
                            ->numeric()
                            ->default(0)
                            ->required($archetype === 'commerce'),

                        TextInput::make('sku')
                            ->label('এসকেইউ (SKU Code)')
                            ->placeholder('PROD-001'),
                    ])->visible($archetype === 'commerce'),

                    Section::make('পাবলিশিং সেটিংস')->schema([
                        Toggle::make('is_active')
                            ->label('ওয়েবসাইটে প্রদর্শন করুন')
                            ->default(true),

                        Toggle::make('is_featured')
                            ->label('হোমপেজে হাইলাইট করুন')
                            ->default(false),
                    ]),
                ]),

            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        $archetype = tenant('archetype') ?? 'commerce';

        $columns = [
            ImageColumn::make('images')
                ->label('ছবি')
                ->circular()
                ->stacked()
                ->limit(2),

            TextColumn::make('name')
                ->label(match ($archetype) {
                    'service' => 'নাম ও প্রোফাইল',
                    'lead'    => 'প্রপার্টি শিরোনাম',
                    default   => 'পণ্যের নাম',
                })
                ->searchable()
                ->sortable(),

            TextColumn::make('brand.name')
                ->label('ব্র্যান্ড')
                ->badge()
                ->color('info')
                ->placeholder('ব্র্যান্ড নেই')
                ->sortable()
                ->searchable(),

            TextColumn::make('category.name')
                ->label('ক্যাটাগরি')
                ->badge()
                ->color('gray')
                ->placeholder('সাধারণ')
                ->sortable()
                ->searchable(),

            TextColumn::make('price')
                ->label('মূল্য/ফি')
                ->money('BDT')
                ->sortable(),
        ];

        // কমার্স হলে স্টক কলাম যুক্ত হবে
        if ($archetype === 'commerce') {
            $columns[] = TextColumn::make('stock_quantity')
                ->label('স্টক')
                ->sortable()
                ->color(fn (int $state): string => $state > 0 ? 'success' : 'danger');
        }

        $columns[] = IconColumn::make('is_active')
            ->label('সক্রিয়')
            ->boolean();

        $columns[] = TextColumn::make('created_at')
            ->label('তৈরির তারিখ')
            ->dateTime('d M, Y')
            ->toggleable(isToggledHiddenByDefault: true);

        return $table
            ->columns($columns)
            ->filters([
                Tables\Filters\SelectFilter::make('brand')->relationship('brand', 'name')->label('ব্র্যান্ড ফিল্টার')->preload(),
                Tables\Filters\SelectFilter::make('category')->relationship('category', 'name')->label('ক্যাটাগরি ফিল্টার')->preload(),
                Tables\Filters\TernaryFilter::make('is_active')->label('সক্রিয় স্ট্যাটাস'),
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

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit'   => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}