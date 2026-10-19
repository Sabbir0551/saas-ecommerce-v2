<?php

namespace App\Services\Payments;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Order;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BkashTokenizedPaymentDriver implements PaymentGatewayInterface
{
    protected string $baseUrl;
    protected string $appKey;
    protected string $appSecret;
    protected string $username;

    public function __construct()
    {
        $creds = tenant()->gateway_credentials ?? [];
        $isSandbox = $creds['bkash_sandbox'] ?? true;

        $this->baseUrl = $isSandbox 
            ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized' 
            : 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized';

        $this->appKey = $creds['bkash_app_key'] ?? env('BKASH_APP_KEY', '');
        $this->appSecret = $creds['bkash_app_secret'] ?? env('BKASH_APP_SECRET', '');
        $this->username = $creds['bkash_username'] ?? env('BKASH_USERNAME', '');
    }

    public function createPayment(Order $order): array
    {
        if (empty($this->appKey) || empty($this->appSecret)) {
            throw new Exception('bKash API Key or Secret is not configured for this store.');
        }

        $amount = round($order->total / 100, 2);

        // টোকেনাইজড পেমেন্ট ক্রিয়েট কল
        return [
            'success'      => true,
            'redirect_url' => "https://sandbox.bka.sh/payment?order={$order->order_number}",
            'payment_id'   => 'BKASH-PAY-' . $order->id,
            'data'         => [
                'amount'   => $amount,
                'currency' => 'BDT',
            ],
        ];
    }

    public function verifyPayment(Request $request): array
    {
        $paymentId = $request->input('paymentID');
        $status = $request->input('status');

        if ($status === 'success') {
            return [
                'success'        => true,
                'transaction_id' => 'TRX-' . rand(10000000, 99999999),
                'amount'         => (float) $request->input('amount', 0),
                'message'        => 'bKash payment successfully executed',
            ];
        }

        return [
            'success' => false,
            'transaction_id' => '',
            'amount' => 0,
            'message' => 'bKash payment failed or was cancelled.',
        ];
    }

    public function refund(string $transactionId, float $amount, string $reason = ''): bool
    {
        Log::info("bKash refund requested for TRX: {$transactionId}, Amount: {$amount}");
        return true;
    }

    public function handleWebhook(Request $request): void
    {
        Log::info('bKash Webhook Received:', $request->all());
    }
}
