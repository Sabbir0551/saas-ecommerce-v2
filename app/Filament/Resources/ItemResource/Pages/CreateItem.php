<?php

namespace App\Filament\Resources\ItemResource\Pages;

use App\Filament\Resources\ItemResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\HtmlString;

class CreateItem extends CreateRecord
{
    protected static string $resource = ItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('preview')
                ->label('লাইভ প্রিভিউ (Live Preview)')
                ->icon('heroicon-o-eye')
                ->color('info')
                ->modalHeading('স্টোরফ্রন্ট লাইভ প্রিভিউ (সংরক্ষণ করার পূর্বরূপ)')
                ->modalWidth('4xl')
                ->modalSubmitAction(false)
                ->modalCancelActionLabel('বন্ধ করুন')
                ->modalContent(function (): HtmlString {
                    $state = $this->form->getRawState();

                    $name = htmlspecialchars($state['name'] ?? 'নতুন আইটেম');
                    $price = !empty($state['sale_price']) ? $state['sale_price'] : ($state['price'] ?? 0);
                    $regPriceHtml = !empty($state['sale_price']) && !empty($state['price'])
                        ? "<span class='text-gray-400 line-through text-base mr-2'>৳" . number_format((float)$state['price'], 2) . "</span>" 
                        : "";

                    $images = $state['images'] ?? [];
                    if (is_string($images)) {
                        $images = json_decode($images, true) ?: [$images];
                    }
                    $firstImage = 'https://placehold.co/600x600/18181b/ffffff?text=No+Image';

                    if (!empty($images) && is_array($images)) {
                        $img = reset($images);
                        if ($img instanceof UploadedFile) {
                            $firstImage = $img->temporaryUrl();
                        } elseif (is_string($img)) {
                            $firstImage = asset('storage/' . ltrim($img, '/'));
                        }
                    }

                    $stock = (int)($state['stock_quantity'] ?? 0);
                    $stockBadge = $stock > 0 
                        ? "<span class='px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full'>● মজুত আছে ({$stock} টি)</span>"
                        : "<span class='px-2.5 py-1 text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full'>● স্টক আউট</span>";

                    return new HtmlString("
                        <div class='bg-zinc-950 text-white rounded-2xl border border-zinc-800 p-6 shadow-2xl'>
                            <div class='flex flex-col lg:flex-row gap-8'>
                                <div class='w-full lg:w-1/2 flex items-center justify-center bg-zinc-900/60 rounded-xl overflow-hidden border border-zinc-800 aspect-square'>
                                    <img src='{$firstImage}' alt='{$name}' class='object-cover w-full h-full'>
                                </div>
                                <div class='w-full lg:w-1/2 flex flex-col justify-between'>
                                    <div>
                                        <div class='flex items-center justify-between gap-2'>
                                            <span class='px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/30'>স্টোরফ্রন্ট প্রিভিউ</span>
                                            {$stockBadge}
                                        </div>
                                        <h2 class='text-2xl font-bold mt-3 text-zinc-100 leading-tight'>{$name}</h2>
                                        <div class='mt-3 flex items-baseline'>
                                            {$regPriceHtml}
                                            <span class='text-3xl font-black text-amber-400'>৳" . number_format((float)$price, 2) . "</span>
                                        </div>
                                    </div>
                                    <div class='mt-6 pt-5 border-t border-zinc-800/80'>
                                        <div class='text-xs text-zinc-400'>মোবাইলে ক্রেতারা এই ফরম্যাটেই আপনার আইটেম দেখতে পাবেন।</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ");
                }),
        ];
    }
}
