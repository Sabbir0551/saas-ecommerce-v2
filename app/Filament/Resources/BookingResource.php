<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BookingResource\Pages;
use App\Models\Booking;
use App\Models\StoreModule;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';

    protected static ?string $navigationLabel = 'Bookings & Appointments';

    protected static ?string $modelLabel = 'Booking';

    protected static ?string $pluralModelLabel = 'Bookings & Appointments';

    public static function shouldRegisterNavigation(): bool
    {
        $archetype = tenant('archetype') ?? 'physical_store';
        return in_array($archetype, ['service', 'service_booking']) || StoreModule::isEnabled('service_booking');
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Booking Details')->schema([
                Select::make('item_id')
                    ->label('Service / Consultant')
                    ->relationship('item', 'name')
                    ->searchable()
                    ->required(),

                TextInput::make('customer_name')
                    ->label('Customer / Client Name')
                    ->required(),

                TextInput::make('customer_phone')
                    ->label('Mobile Phone Number')
                    ->tel()
                    ->required(),

                TextInput::make('customer_email')
                    ->label('Email Address')
                    ->email(),

                DatePicker::make('booking_date')
                    ->label('Appointment Date')
                    ->required(),

                TextInput::make('slot_start')
                    ->label('Start Time')
                    ->type('time')
                    ->required(),

                TextInput::make('slot_end')
                    ->label('End Time')
                    ->type('time'),

                TextInput::make('fee')
                    ->label('Consultation / Visit Fee')
                    ->numeric()
                    ->prefix('৳')
                    ->default(0),

                Select::make('status')
                    ->label('Booking Status')
                    ->options([
                        'pending'   => 'Pending',
                        'confirmed' => 'Confirmed',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ])
                    ->default('pending')
                    ->required(),

                Select::make('payment_status')
                    ->label('Payment Status')
                    ->options([
                        'unpaid'   => 'Unpaid',
                        'paid'     => 'Paid',
                        'refunded' => 'Refunded',
                    ])
                    ->default('unpaid')
                    ->required(),

                Textarea::make('notes')
                    ->label('Internal Notes / Prescription Reference')
                    ->columnSpanFull(),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->label('ID')->sortable(),
                TextColumn::make('customer_name')->label('Client Name')->searchable()->weight('bold'),
                TextColumn::make('customer_phone')->label('Phone')->searchable(),
                TextColumn::make('item.name')->label('Service / Doctor')->searchable(),
                TextColumn::make('booking_date')->label('Date')->date('M d, Y')->sortable(),
                TextColumn::make('slot_start')->label('Time'),
                TextColumn::make('fee')->label('Fee')->money('BDT'),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn ($state): string => match ((string) $state) {
                        'confirmed' => 'success',
                        'completed' => 'primary',
                        'cancelled' => 'danger',
                        default     => 'warning',
                    })
                    ->formatStateUsing(fn ($state): string => ucfirst((string) $state)),
                TextColumn::make('created_at')->label('Booked At')->dateTime('M d, h:i A')->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status Filter')
                    ->options([
                        'pending'   => 'Pending',
                        'confirmed' => 'Confirmed',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('confirm')
                    ->label('Confirm')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->visible(fn (Booking $record) => $record->status === 'pending')
                    ->action(fn (Booking $record) => $record->update(['status' => 'confirmed'])),
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
            'index'  => Pages\ListBookings::route('/'),
            'create' => Pages\CreateBooking::route('/create'),
            'edit'   => Pages\EditBooking::route('/{record}/edit'),
        ];
    }
}
