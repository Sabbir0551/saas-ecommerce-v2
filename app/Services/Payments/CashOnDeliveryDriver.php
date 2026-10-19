<?php

namespace App\Services\Payments;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Order;
use Exception;
use Illuminate\Http\Request;

class CashOnDeliveryDriver implements PaymentGatewayInterface
{
    protected bool $isEnabled;
    protected bool $requiresOtp;
    protected float $maxLimit;

    public function __construct()
    {
        $creds = tenant()->gateway_credentials ?? [];
        $this->isEnabled = $creds['cod_enabled'] ?? true;
        $this->requiresOtp = $creds['cod_phone_otp'] ?? false;
        $this->maxLimit = (float)($creds['cod_max_limit'] ?? 20000);
    }

    public function createPayment(Order $order): array
    {
        if (!$this->isEnabled) {
            throw new Exception('এই দোকানে ক্যাশ অন ডেলিভারি (COD) সাময়িকভাবে বন্ধ আছে।');
        }

        $orderAmount = round($order->total / 100, 2);
        if ($orderAmount > $this->maxLimit) {
            throw new Exception("ক্যাশ অন ডেলিভারির সর্বোচ্চ সীমা ৳{$this->maxLimit}। অনুগ্রহ করে অনলাইন পেমেন্ট করুন।");
        }

        return [
            'success'      => true,
            'redirect_url' => null, // সরাসরি কনফার্মেশন
            'payment_id'   => 'COD-' . $order->order_number,
            'data'         => [
                'requires_otp' => $this->requiresOtp,
                'method'       => 'cod',
            ],
        ];
    }

    public function verifyPayment(Request $request): array
    {
        return [
            'success'        => true,
            'transaction_id' => 'COD-PENDING',
            'amount'         => 0,
            'message'        => 'Cash on Delivery selected. Payment will be collected upon parcel delivery.',
        ];
    }

    public function refund(string $transactionId, float $amount, string $reason = ''): bool
    {
        return true;
    }

    public function handleWebhook(Request $request): void
    {
        // COD-তে কুরিয়ার সেটেলমেন্ট থেকে পেমেন্ট কমপ্লিট হবে
    }
}
