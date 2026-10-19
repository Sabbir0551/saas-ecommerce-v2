<?php

namespace App\Filament\Resources;

use App\Enums\OrderStatus;
use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Repeater;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\SelectColumn;
use Filament\Tables\Actions\Action;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';

    public static function getNavigationLabel(): string
    {
        $archetype = tenant('archetype') ?? 'commerce';
        return match ($archetype) {
            'service' => 'Appointments & Schedules',
            'lead'    => 'Leads & Inquiries',
            default   => 'Orders & Deliveries',
        };
    }

    public static function getModelLabel(): string
    {
        $archetype = tenant('archetype') ?? 'commerce';
        return match ($archetype) {
            'service' => 'Appointment',
            'lead'    => 'Inquiry',
            default   => 'Order',
        };
    }

    public static function getPluralModelLabel(): string
    {
        return static::getNavigationLabel();
    }

    public static function form(Form $form): Form
    {
        $archetype = tenant('archetype') ?? 'commerce';

        $serviceStatusOptions = [
            'pending'      => 'Pending',
            'visited'      => 'Visited / Completed',
            'cancelled'    => 'Cancelled',
            'rescheduled'  => 'Re-Scheduled',
        ];

        return $form->schema([
            Grid::make(['default' => 1, 'lg' => 3])->schema([
                
                // Left Column: Customer & Details
                Grid::make(1)->columnSpan(['lg' => 2])->schema([
                    Section::make(match ($archetype) {
                        'service' => 'Patient & Booking Schedule Details',
                        'lead'    => 'Lead & Inquiry Information',
                        default   => 'Customer & Shipping Address',
                    })->schema([
                        TextInput::make('order_number')
                            ->label('Order / Token Number')
                            ->disabled(),

                        TextInput::make('customer_name')
                            ->label('Customer / Patient Name')
                            ->required(),

                        TextInput::make('customer_phone')
                            ->label('Mobile Phone Number')
                            ->tel()
                            ->required(),

                        DatePicker::make('booking_date')
                            ->label('Scheduled Date')
                            ->visible($archetype === 'service'),

                        TextInput::make('booking_time')
                            ->label('Time Slot')
                            ->visible($archetype === 'service'),

                        Textarea::make('shipping_address')
                            ->label(match ($archetype) {
                                'service' => 'Notes / Medical Complaints',
                                'lead'    => 'Inquiry Message',
                                default   => 'Full Shipping Address',
                            })
                            ->rows(3)
                            ->columnSpanFull(),
                    ])->columns(2),

                    Section::make(match ($archetype) {
                        'service' => 'Service / Doctor Profile',
                        default   => 'Ordered Items',
                    })->schema([
                        Repeater::make('items')
                            ->relationship()
                            ->schema([
                                TextInput::make('product_name')
                                    ->label('Item Title')
                                    ->disabled(),

                                TextInput::make('unit_price')
                                    ->label('Unit Price (BDT)')
                                    ->formatStateUsing(fn ($state) => '৳' . number_format($state / 100, 0))
                                    ->disabled(),
                            ])
                            ->addable(false)
                            ->deletable(false)
                            ->columns(2),
                    ]),
                ]),

                // Right Column: Order Status & Financials
                Grid::make(1)->columnSpan(['lg' => 1])->schema([
                    Section::make('Order Status & Summary')->schema([
                        Select::make('status')
                            ->label('Current Status')
                            ->options($archetype === 'service' ? $serviceStatusOptions : OrderStatus::class)
                            ->required(),

                        TextInput::make('total')
                            ->label('Total Payable Amount')
                            ->formatStateUsing(fn ($state) => '৳' . number_format($state / 100, 0))
                            ->disabled(),

                        TextInput::make('payment_method')
                            ->label('Payment Method')
                            ->formatStateUsing(fn ($state) => strtoupper($state ?? 'Cash on Delivery'))
                            ->disabled(),
                    ]),
                ]),

            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        $archetype = tenant('archetype') ?? 'commerce';

        $serviceStatusOptions = [
            'pending'     => 'Pending',
            'visited'     => 'Visited',
            'cancelled'   => 'Cancel',
            'rescheduled' => 'Re-Scheduled',
        ];

        $columns = [
            TextColumn::make('order_number')
                ->label('Order #')
                ->searchable()
                ->sortable()
                ->weight('bold')
                ->copyable(),

            TextColumn::make('customer_name')
                ->label('Customer Name')
                ->searchable()
                ->sortable(),

            TextColumn::make('customer_phone')
                ->label('Phone Number')
                ->searchable()
                ->copyable(),
        ];

        if ($archetype === 'service') {
            $columns[] = TextColumn::make('booking_date')
                ->label('Booking Date')
                ->date('M d, Y')
                ->sortable()
                ->badge()
                ->color('info');

            $columns[] = TextColumn::make('booking_time')
                ->label('Slot')
                ->badge()
                ->color('success');
        }

        $columns[] = TextColumn::make('total')
            ->label('Total (BDT)')
            ->formatStateUsing(fn ($state) => '৳' . number_format($state / 100, 0))
            ->sortable();

        $columns[] = SelectColumn::make('status')
            ->label('Status')
            ->options($archetype === 'service' ? $serviceStatusOptions : OrderStatus::class);

        return $table
            ->columns($columns)
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Filter by Status')
                    ->options($archetype === 'service' ? $serviceStatusOptions : OrderStatus::class),
            ])
            ->actions([
                Action::make('send_to_courier')
                    ->label('Dispatch Courier')
                    ->icon('heroicon-o-truck')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->modalHeading('Steadfast Courier Booking')
                    ->modalDescription('Do you want to dispatch this parcel directly to Steadfast Courier API?')
                    ->visible(fn (Order $record) => in_array($archetype, ['commerce', 'physical_store']) && empty($record->tracking_id))
                    ->action(function (Order $record) {
                        try {
                            $courierManager = app(\App\Services\Couriers\CourierManager::class);
                            $driver = $courierManager->driver('steadfast');

                            $result = $driver->createOrder([
                                'invoice'          => $record->order_number,
                                'recipient_name'   => $record->customer_name,
                                'recipient_phone'  => $record->customer_phone,
                                'recipient_address'=> $record->shipping_address ?? 'Dhaka, Bangladesh',
                                'cod_amount'       => ($record->payment_method === 'cod') ? ($record->total / 100) : 0,
                                'note'             => 'Handle with care - Laptop Gadget',
                            ]);

                            if ($result->success) {
                                $record->tracking_id = $result->trackingCode;
                                $record->status = OrderStatus::PROCESSING;
                                $record->save();

                                \Filament\Notifications\Notification::make()
                                    ->title('Parcel Dispatched Successfully')
                                    ->body("Steadfast Tracking Code: {$result->trackingCode}")
                                    ->success()
                                    ->send();
                            } else {
                                \Filament\Notifications\Notification::make()
                                    ->title('Courier Booking Failed')
                                    ->body($result->errorMessage)
                                    ->danger()
                                    ->send();
                            }
                        } catch (\Throwable $e) {
                            \Filament\Notifications\Notification::make()
                                ->title('Courier Service Error')
                                ->body($e->getMessage())
                                ->danger()
                                ->send();
                        }
                    }),

                Action::make('print_invoice')
                    ->label('Invoice')
                    ->icon('heroicon-o-printer')
                    ->color('gray')
                    ->url(fn (Order $record) => route('orders.invoice', $record->id))
                    ->openUrlInNewTab(),

                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}