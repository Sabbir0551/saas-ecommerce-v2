<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\HtmlString;

class EditProduct extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('preview')
                ->label('Live Preview')
                ->icon('heroicon-o-eye')
                ->color('info')
                ->modalHeading('Storefront Live Preview (Pre-Save)')
                ->modalWidth('4xl')
                ->modalSubmitAction(false)
                ->modalCancelActionLabel('Close')
                ->modalContent(function (): HtmlString {
                    // সেভ ছাড়াও ফর্মের লাইভ স্টেট রিড করা
                    $state = $this->form->getRawState();

                    $name = htmlspecialchars($state['name'] ?? 'Untitled Product');
                    $price = !empty($state['sale_price']) ? $state['sale_price'] : ($state['price'] ?? 0);
                    $regPriceHtml = !empty($state['sale_price']) && !empty($state['price'])
                        ? "<span class='text-gray-400 line-through text-base mr-2'>৳" . number_format((float)$state['price'], 2) . "</span>" 
                        : "";

                    // ছবির পাথ হ্যান্ডলিং (নতুন আপলোড বা আগের ছবি)
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

                    // ভ্যারিয়েন্ট প্রসেসিং
                    $variants = $state['variants'] ?? [];
                    $variantsHtml = '';
                    $totalStock = 0;

                    if (!empty($variants) && is_array($variants)) {
                        $variantBadges = '';
                        foreach ($variants as $variant) {
                            $totalStock += (int)($variant['stock_quantity'] ?? 0);
                            $vTitle = $variant['title'] ?? '';
                            if (blank($vTitle) && !empty($variant['attributes_combination'])) {
                                $vTitle = implode(' / ', (array)$variant['attributes_combination']);
                            }
                            if (blank($vTitle)) {
                                $vTitle = 'Option';
                            }
                            $vPrice = !empty($variant['price']) ? " — ৳" . number_format((float)$variant['price'], 2) : "";

                            $variantBadges .= "
                                <div class='flex items-center justify-between px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs'>
                                    <span class='font-medium text-zinc-200'>" . htmlspecialchars($vTitle) . "</span>
                                    <span class='text-amber-400 font-semibold'>{$vPrice}</span>
                                </div>
                            ";
                        }

                        $variantsHtml = "
                            <div class='mt-5'>
                                <div class='flex items-center justify-between mb-2'>
                                    <span class='text-xs font-bold uppercase tracking-wider text-zinc-400'>Variants & Combinations</span>
                                    <span class='text-xs text-zinc-500'>" . count($variants) . " options</span>
                                </div>
                                <div class='grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1'>
                                    {$variantBadges}
                                </div>
                            </div>
                        ";
                    } else {
                        $totalStock = (int)($state['stock_quantity'] ?? 0);
                    }

                    $stockBadge = $totalStock > 0 
                        ? "<span class='px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full'>● In Stock ({$totalStock} units)</span>"
                        : "<span class='px-2.5 py-1 text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full'>● Out of Stock</span>";

                    return new HtmlString("
                        <div class='bg-zinc-950 text-white rounded-2xl border border-zinc-800 p-6 shadow-2xl'>
                            <div class='flex flex-col lg:flex-row gap-8'>
                                <div class='w-full lg:w-1/2 flex items-center justify-center bg-zinc-900/60 rounded-xl overflow-hidden border border-zinc-800 aspect-square'>
                                    <img src='{$firstImage}' alt='{$name}' class='object-cover w-full h-full'>
                                </div>
                                <div class='w-full lg:w-1/2 flex flex-col justify-between'>
                                    <div>
                                        <div class='flex items-center justify-between gap-2'>
                                            <span class='px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/30'>Storefront View</span>
                                            {$stockBadge}
                                        </div>
                                        <h2 class='text-2xl font-bold mt-3 text-zinc-100 leading-tight'>{$name}</h2>
                                        <div class='mt-3 flex items-baseline'>
                                            {$regPriceHtml}
                                            <span class='text-3xl font-black text-amber-400'>৳" . number_format((float)$price, 2) . "</span>
                                        </div>
                                        {$variantsHtml}
                                    </div>
                                    <div class='mt-6 pt-5 border-t border-zinc-800/80 flex items-center gap-3'>
                                        <button type='button' class='w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20'>
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ");
                }),

            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (isset($data['images']) && is_array($data['images'])) {
            $processedImages = [];

            foreach ($data['images'] as $image) {
                if ($image instanceof UploadedFile) {
                    $processedImages[] = $image->store('products', 'public');
                } elseif (is_string($image) && !empty($image)) {
                    $processedImages[] = $image;
                }
            }

            $data['images'] = array_values(array_filter($processedImages));
        }

        return $data;
    }
}