<?php

namespace App\Contracts;

use App\Models\Order;
use Illuminate\Http\Request;

interface PaymentGatewayInterface
{
    /**
     * পেমেন্ট ইনিশিয়ালাইজ / তৈরি করা
     * @return array [ 'success' => bool, 'redirect_url' => string|null, 'payment_id' => string|null, 'data' => array ]
     */
    public function createPayment(Order $order): array;

    /**
     * পেমেন্ট যাচাই ও ক্যাপচার করা
     * @return array [ 'success' => bool, 'transaction_id' => string, 'amount' => float, 'message' => string ]
     */
    public function verifyPayment(Request $request): array;

    /**
     * পেমেন্ট রিফান্ড করা
     */
    public function refund(string $transactionId, float $amount, string $reason = ''): bool;

    /**
     * গেটওয়ে থেকে আসা ওয়েবহুক বা আইপিএন প্রসেস করা
     */
    public function handleWebhook(Request $request): void;
}
