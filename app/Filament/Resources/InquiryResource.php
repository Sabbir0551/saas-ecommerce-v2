<?php

namespace App\Filament\Resources;

use App\Filament\Resources\InquiryResource\Pages;
use App\Models\Inquiry;
use App\Models\StoreModule;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class InquiryResource extends Resource
{
    protected static ?string $model = Inquiry::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';

    protected static ?string $navigationLabel = 'Inquiries & Leads';

    protected static ?string $modelLabel = 'Inquiry';

    protected static ?string $pluralModelLabel = 'Inquiries & Leads';

    public static function shouldRegisterNavigation(): bool
    {
        $archetype = tenant('archetype') ?? 'physical_store';
        return in_array($archetype, ['lead', 'lead_gen', 'listing_inquiry']) || StoreModule::isEnabled('listing_inquiry');
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Inquiry & Client Message')->schema([
                Select::make('item_id')
                    ->label('Listing / Item')
                    ->relationship('item', 'name')
                    ->searchable(),

                TextInput::make('name')
                    ->label('Client Full Name')
                    ->required(),

                TextInput::make('phone')
                    ->label('Phone Number')
                    ->tel()
                    ->required(),

                TextInput::make('email')
                    ->label('Email Address')
                    ->email(),

                Select::make('status')
                    ->label('Status')
                    ->options([
                        'new'         => 'New Lead',
                        'contacted'   => 'Contacted / Follow-up',
                        'qualified'   => 'Qualified Prospect',
                        'closed_won'  => 'Closed (Deal Won)',
                        'closed_lost' => 'Closed (Lost)',
                    ])
                    ->default('new')
                    ->required(),

                Textarea::make('message')
                    ->label('Client Inquiry Message')
                    ->columnSpanFull()
                    ->rows(3),

                Textarea::make('agent_notes')
                    ->label('Internal Agent Follow-up Notes')
                    ->columnSpanFull()
                    ->rows(2),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->label('ID')->sortable(),
                TextColumn::make('name')->label('Client Name')->searchable()->weight('bold'),
                TextColumn::make('phone')->label('Phone Number')->searchable(),
                TextColumn::make('item.name')->label('Inquired Item / Property')->searchable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn ($state): string => match ((string) $state) {
                        'new'        => 'info',
                        'contacted'  => 'warning',
                        'qualified'  => 'primary',
                        'closed_won' => 'success',
                        default      => 'danger',
                    })
                    ->formatStateUsing(fn ($state): string => ucfirst(str_replace('_', ' ', (string) $state))),
                TextColumn::make('created_at')->label('Received Date')->dateTime('M d, Y h:i A')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Filter by Status')
                    ->options([
                        'new'         => 'New',
                        'contacted'   => 'Contacted',
                        'qualified'   => 'Qualified',
                        'closed_won'  => 'Closed Won',
                        'closed_lost' => 'Closed Lost',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListInquiries::route('/'),
            'edit'  => Pages\EditInquiry::route('/{record}/edit'),
        ];
    }
}
