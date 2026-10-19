<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use App\Models\Order;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Support\HtmlString;

class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('customerInsights')
                ->label('Customer Health & Score')
                ->icon('heroicon-o-shield-check')
                ->color('info')
                ->modalHeading('Customer Order History Score')
                ->modalSubmitAction(false)
                ->modalCancelActionLabel('Close')
                ->modalContent(function (): HtmlString {
                    /** @var Order $record */
                    $record = $this->getRecord();
                    $phone = $record->customer_phone;

                    $stats = Order::where('customer_phone', $phone)
                        ->selectRaw("
                            COUNT(*) as total,
                            SUM(status = 'delivered') as delivered,
                            SUM(status IN ('cancelled', 'returned')) as failed
                        ")->first();

                    $total = $stats->total ?? 1;
                    $delivered = $stats->delivered ?? 0;
                    $failed = $stats->failed ?? 0;
                    $successRate = round(($delivered / $total) * 100);

                    $colorClass = $successRate >= 70 ? 'text-emerald-400' : ($successRate >= 40 ? 'text-amber-400' : 'text-rose-400');

                    return new HtmlString("
                        <div class='p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-white'>
                            <p class='text-sm text-gray-400 mb-4'>Order history for phone: <strong class='text-white'>{$phone}</strong></p>
                            <div class='grid grid-cols-3 gap-4 text-center'>
                                <div class='p-3 bg-zinc-900 border border-zinc-800 rounded-lg'>
                                    <span class='text-xs text-gray-400 uppercase font-semibold'>Total Orders</span>
                                    <p class='text-2xl font-bold mt-1 text-white'>{$total}</p>
                                </div>
                                <div class='p-3 bg-zinc-900 border border-zinc-800 rounded-lg'>
                                    <span class='text-xs text-gray-400 uppercase font-semibold'>Delivered</span>
                                    <p class='text-2xl font-bold mt-1 text-emerald-400'>{$delivered}</p>
                                </div>
                                <div class='p-3 bg-zinc-900 border border-zinc-800 rounded-lg'>
                                    <span class='text-xs text-gray-400 uppercase font-semibold'>Cancelled / Returned</span>
                                    <p class='text-2xl font-bold mt-1 text-rose-400'>{$failed}</p>
                                </div>
                            </div>
                            <div class='mt-5 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between'>
                                <span class='text-xs font-semibold uppercase tracking-wider text-gray-400'>Delivery Success Rate</span>
                                <span class='text-xl font-extrabold {$colorClass}'>{$successRate}%</span>
                            </div>
                        </div>
                    ");
                }),

            Actions\EditAction::make(),
        ];
    }
}