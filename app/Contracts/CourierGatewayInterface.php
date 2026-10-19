<?php

namespace App\Contracts;

use App\Models\Order;
use Illuminate\Http\Request;

interface CourierGatewayInterface
{
    /**
     * কুরিয়ারে শিপমেন্ট / পার্সেল বুকিং তৈরি করা
     * @return array [ 'success' => bool, 'consignment_id' => string|null, 'tracking_code' => string|null, 'data' => array ]
     */
    public function createShipment(Order $order): array;

    /**
     * পার্সেলের বর্তমান লাইভ ট্র্যাকিং স্ট্যাটাস দেখা
     * @return array [ 'status' => string, 'location' => string|null, 'updated_at' => string ]
     */
    public function trackShipment(string $trackingCode): array;

    /**
     * ওজন ও গন্তব্য অনুযায়ী ডেলিভারি চার্জ হিসাব করা
     */
    public function calculateRate(string $city, float $weightKg): float;

    /**
     * কুরিয়ারের রিয়েলটাইম ডেলিভারি স্ট্যাটাস ওয়েবহুক প্রসেস করা
     */
    public function handleWebhook(Request $request): void;
}
