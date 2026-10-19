<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Enums\OrderStatus;
use App\Filament\Resources\OrderResource;
use Filament\Resources\Pages\CreateRecord;

class CreateOrder extends CreateRecord
{
    protected static string $resource = OrderResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $subtotal = 0;

        if (!empty($data['items']) && is_array($data['items'])) {
            foreach ($data['items'] as $item) {
                $unitPrice = (int) ($item['unit_price'] ?? 0);
                $qty = (int) ($item['quantity'] ?? 1);
                $subtotal += ($unitPrice * $qty);
            }
        }

        $shipping = (int) ($data['shipping_fee'] ?? 6000);
        $discount = (int) ($data['discount'] ?? 0);
        $total = max(0, $subtotal + $shipping - $discount);

        $data['subtotal'] = $subtotal;
        $data['shipping_fee'] = $shipping;
        $data['discount'] = $discount;
        $data['total'] = $total;
        $data['status'] = OrderStatus::Pending->value;

        return $data;
    }

    protected function afterCreate(): void
    {
        // প্রাথমিক স্ট্যাটাস হিস্ট্রি যুক্ত করা
        $this->getRecord()->histories()->create([
            'from_status' => null,
            'to_status'   => OrderStatus::Pending->value,
            'reason'      => 'Order created from Admin Panel',
            'changed_by'  => auth()->id(),
        ]);
    }
}