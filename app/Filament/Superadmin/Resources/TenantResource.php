<?php

namespace App\Filament\Superadmin\Resources;

use App\Filament\Superadmin\Resources\TenantResource\Pages;
use App\Models\Tenant;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TenantResource extends Resource
{
    protected static ?string $model = Tenant::class;

    protected static ?string $navigationIcon = 'heroicon-o-building-storefront';
    protected static ?string $navigationLabel = 'Stores (Tenants)';
    protected static ?string $pluralModelLabel = 'Stores';
    protected static ?string $modelLabel = 'Store';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('id')
                    ->label('Subdomain / Store ID')
                    ->required()
                    ->alphaDash()
                    ->unique(Tenant::class, 'id', ignoreRecord: true)
                    ->disabled(fn (string $operation): bool => $operation === 'edit')
                    ->suffix('.localhost')
                    ->placeholder('e.g. gadgethub')
                    ->helperText('শুধুমাত্র ছোট হাতের ইংরেজি অক্ষর, সংখ্যা এবং হাইফেন (-) ব্যবহার করুন।'),

                TextInput::make('name')
                    ->label('Store / Website Name')
                    ->required()
                    ->maxLength(255)
                    ->placeholder('e.g. Gadget Hub BD or Dr. Rahman Chamber'),

                Select::make('business_category')
                    ->label('Business Category')
                    ->options(function () {
                        $categories = config('business_categories.categories', []);
                        return collect($categories)->mapWithKeys(function ($item, $key) {
                            return [$key => "{$item['name']} [" . strtoupper($item['archetype']) . "]"];
                        });
                    })
                    ->searchable()
                    ->preload()
                    ->default('mobile_gadgets')
                    ->required()
                    ->live()
                    ->afterStateUpdated(function (Set $set, ?string $state) {
                        $categories = config('business_categories.categories', []);
                        $archetype = $categories[$state]['archetype'] ?? 'commerce';
                        $set('archetype', $archetype);
                    })
                    ->helperText('Select the niche type. The admin panel layout will adapt automatically.'),

                Hidden::make('archetype')
                    ->default('commerce'),

                TextInput::make('owner_email')
                    ->label('Owner Email')
                    ->email()
                    ->required()
                    ->maxLength(255)
                    ->placeholder('admin@gadgethub.com'),

                TextInput::make('owner_phone')
                    ->label('Owner Phone')
                    ->tel()
                    ->maxLength(20)
                    ->placeholder('+8801XXXXXXXXX'),

                Select::make('plan')
                    ->label('Subscription Plan')
                    ->options([
                        'free_trial' => 'Free Trial (14 Days)',
                        'starter' => 'Starter Plan',
                        'pro' => 'Pro Business',
                        'enterprise' => 'Enterprise',
                    ])
                    ->default('free_trial')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('Subdomain')
                    ->badge()
                    ->color('primary')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('name')
                    ->label('Store Name')
                    ->searchable(),

                TextColumn::make('business_category')
                    ->label('Category')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => config("business_categories.categories.{$state}.name", $state ?? 'N/A'))
                    ->color('info')
                    ->sortable(),

                TextColumn::make('domains.domain')
                    ->label('Store Domain')
                    ->badge()
                    ->color('gray')
                    ->url(function ($record) {
                        $domain = $record->domains->first()?->domain ?? ($record->id . '.localhost');
                        $port = request()->getPort() ? ':' . request()->getPort() : '';
                        return 'http://' . $domain . $port . '/admin';
                    }, true),

                TextColumn::make('owner_email')
                    ->label('Owner Email')
                    ->searchable(),

                TextColumn::make('plan')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'free_trial' => 'warning',
                        'starter' => 'info',
                        'pro', 'enterprise' => 'success',
                        default => 'gray',
                    }),

                TextColumn::make('created_at')
                    ->label('Created Date')
                    ->dateTime('d M, Y')
                    ->sortable(),
            ])
            ->actions([
                EditAction::make(),
                Action::make('open_admin')
                    ->label('Store Admin')
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->openUrlInNewTab()
                    ->url(function ($record) {
                        $domain = $record->domains->first()?->domain ?? ($record->id . '.localhost');
                        $port = request()->getPort() ? ':' . request()->getPort() : '';
                        return 'http://' . $domain . $port . '/admin';
                    }),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListTenants::route('/'),
            'create' => Pages\CreateTenant::route('/create'),
            'edit'   => Pages\EditTenant::route('/{record}/edit'),
        ];
    }
}