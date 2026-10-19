<?php

namespace App\Filament\Superadmin\Resources;

use App\Filament\Superadmin\Resources\TenantResource\Pages;
use App\Models\Tenant;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
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
                Section::make('Store Core Identity')->schema([
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
                            $archetype = $categories[$state]['archetype'] ?? 'physical_store';
                            $set('archetype', $archetype);
                        })
                        ->helperText('Select the niche type. The admin panel and storefront adapt automatically.'),

                    Hidden::make('archetype')
                        ->default('physical_store'),

                    Select::make('plan')
                        ->label('Subscription Plan')
                        ->options([
                            'free_trial' => 'Free Trial (14 Days)',
                            'starter'    => 'Starter Plan (৳৫০০/মাস)',
                            'pro'        => 'Pro Business (৳২,০০০/মাস)',
                            'enterprise' => 'Enterprise (৳৫,০০০/মাস)',
                        ])
                        ->default('free_trial')
                        ->required(),

                    Select::make('status')
                        ->label('Store Status')
                        ->options([
                            'active'    => 'Active & Operational',
                            'trial'     => 'Trial Period',
                            'suspended' => 'Suspended (Policy / Abuse Violation)',
                            'closed'    => 'Closed Permanently',
                        ])
                        ->default('active')
                        ->required(),

                    TextInput::make('suspended_reason')
                        ->label('Suspension Reason')
                        ->visible(fn ($get) => $get('status') === 'suspended'),
                ])->columns(2),

                Section::make('Store Owner Contacts')->schema([
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
                ])->columns(2),

                Section::make('Legal Compliance & Verification Queue (ডিজিটাল কমার্স ও সরকারি অনুমোদন)')->schema([
                    Select::make('verification_status')
                        ->label('Verification Status')
                        ->options([
                            'unverified' => 'Unverified (New Store)',
                            'pending'    => 'Pending Review (Documents Submitted)',
                            'verified'   => 'Verified (Trade License / NID / BMDC Validated)',
                            'rejected'   => 'Rejected (Invalid Documents)',
                        ])
                        ->default('unverified')
                        ->required(),

                    TextInput::make('trade_license_no')
                        ->label('Trade License Number')
                        ->placeholder('TRAD/DNCC/12345/2026'),

                    TextInput::make('nid_no')
                        ->label('Owner National ID (NID)')
                        ->placeholder('NID 10/17 digit number'),

                    TextInput::make('drug_license_no')
                        ->label('Pharmacy Drug License No')
                        ->placeholder('DL-DHK-98421'),

                    TextInput::make('bmdc_reg_no')
                        ->label('Doctor BMDC Registration No')
                        ->placeholder('BMDC A-12345'),

                    Textarea::make('verification_notes')
                        ->label('Admin Verification Review Notes')
                        ->placeholder('Details about document inspection...')
                        ->columnSpanFull(),
                ])->columns(2),
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

                TextColumn::make('verification_status')
                    ->label('Verification')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'verified' => 'success',
                        'pending'  => 'warning',
                        'rejected' => 'danger',
                        default    => 'gray',
                    })
                    ->sortable(),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'active'    => 'success',
                        'trial'     => 'info',
                        'suspended' => 'danger',
                        default     => 'gray',
                    }),

                TextColumn::make('domains.domain')
                    ->label('Domain')
                    ->badge()
                    ->color('gray')
                    ->url(function ($record) {
                        $domain = $record->domains->first()?->domain ?? ($record->id . '.localhost');
                        $port = request()->getPort() ? ':' . request()->getPort() : '';
                        return 'http://' . $domain . $port . '/admin';
                    }, true),

                TextColumn::make('owner_phone')
                    ->label('Owner Phone')
                    ->searchable(),

                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('d M, Y')
                    ->sortable(),
            ])
            ->actions([
                Action::make('verify_store')
                    ->label('Approve & Verify')
                    ->icon('heroicon-o-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (Tenant $record) => $record->verification_status !== 'verified')
                    ->action(function (Tenant $record) {
                        $record->forceFill([
                            'verification_status'       => 'verified',
                            'trade_license_verified_at' => now(),
                            'nid_verified_at'           => now(),
                            'drug_license_verified_at'  => !empty($record->drug_license_no) ? now() : null,
                            'bmdc_verified_at'          => !empty($record->bmdc_reg_no) ? now() : null,
                            'verification_notes'        => 'Documents verified by Superadmin on ' . now()->toFormattedDateString(),
                        ])->save();

                        \Filament\Notifications\Notification::make()
                            ->title('Store Verified Successfully')
                            ->body("Store {$record->name} is now verified with official badge.")
                            ->success()
                            ->send();
                    }),

                Action::make('suspend_store')
                    ->label('Suspend')
                    ->icon('heroicon-o-no-symbol')
                    ->color('danger')
                    ->visible(fn (Tenant $record) => $record->status !== 'suspended')
                    ->form([
                        TextInput::make('reason')
                            ->label('Suspension Reason (Abuse / Fraud / Gambling / Narcotics)')
                            ->required(),
                    ])
                    ->action(function (Tenant $record, array $data) {
                        $record->forceFill([
                            'status'           => 'suspended',
                            'suspended_reason' => $data['reason'],
                            'suspended_at'     => now(),
                        ])->save();

                        \Filament\Notifications\Notification::make()
                            ->title('Store Suspended')
                            ->body("Store {$record->name} has been suspended.")
                            ->danger()
                            ->send();
                    }),

                Action::make('open_admin')
                    ->label('Store Admin')
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->openUrlInNewTab()
                    ->url(function ($record) {
                        $domain = $record->domains->first()?->domain ?? ($record->id . '.localhost');
                        $port = request()->getPort() ? ':' . request()->getPort() : '';
                        return 'http://' . $domain . $port . '/admin';
                    }),

                EditAction::make(),
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