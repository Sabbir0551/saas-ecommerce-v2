<?php

namespace App\Filament\Widgets;

use App\Enums\OrderStatus;
use App\Models\Order;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Widgets\TableWidget as BaseWidget;

class RecentOrdersWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected int | string | array $columnSpan = 'full';

    protected static ?string $heading = 'Recent Storefront Orders';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Order::query()->latest()->limit(5)
            )
            ->columns([
                TextColumn::make('order_number')
                    ->label('Order #')
                    ->weight('bold')
                    ->searchable(),

                TextColumn::make('customer_name')
                    ->label('Customer')
                    ->searchable(),

                TextColumn::make('customer_phone')
                    ->label('Phone Number'),

                TextColumn::make('total')
                    ->label('Amount')
                    ->formatStateUsing(fn ($state) => '৳' . number_format($state / 100, 0))
                    ->sortable(),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn ($state): string => match ($state instanceof OrderStatus ? $state->value : (string) ($state?->value ?? $state ?? '')) {
                        'delivered', 'completed' => 'success',
                        'processing', 'shipped' => 'info',
                        'cancelled' => 'danger',
                        default => 'warning',
                    })
                    ->formatStateUsing(function ($state): string {
                        $val = $state instanceof OrderStatus ? $state->value : (string) ($state?->value ?? $state ?? '');
                        return ucfirst($val);
                    }),

                TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime('M d, Y h:i A'),
            ])
            ->paginated(false);
    }
}
