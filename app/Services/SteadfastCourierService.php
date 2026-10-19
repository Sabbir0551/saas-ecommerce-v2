<?php

namespace App\Services;

use App\Models\Order;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SteadfastCourierService
{
    protected string $baseUrl;
    protected string $apiKey;
    protected string $secretKey;

    public function __construct()
    {
        $this->baseUrl = config('services.steadfast.base_url', 'https://portal.steadfast.com.bd/api/v1');
        $this->apiKey = config('services.steadfast.api_key', env('STEADFAST_API_KEY', ''));
        $this->secretKey = config('services.steadfast.secret_key', env('STEADFAST_SECRET_KEY', ''));
    }

    /**
     * Steadfast-এ অর্ডার পাঠানো
     */
    public function createOrder(Order $order): array
    {
        if (empty($this->apiKey) || empty($this->secretKey)) {
            throw new Exception('Steadfast API Key or Secret Key is not configured in .env file.');
        }

        // COD কালেকশন অ্যামাউন্ট (টাকায়)
        $codAmount = ($order->payment_status->value === 'paid') ? 0 : round($order->total / 100);

        $payload = [
            'invoice' => $order->order_number,
            'recipient_name' => $order->customer_name,
            'recipient_phone' => $order->customer_phone,
            'recipient_address' => $order->shipping_address,
            'cod_amount' => (int) $codAmount,
            'note' => $order->customer_note ?? 'Handle with care',
        ];

        $response = Http::withHeaders([
            'Api-Key' => $this->apiKey,
            'Secret-Key' => $this->secretKey,
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/create_order", $payload);

        $result = $response->json();

        Log::info('Steadfast Booking Response:', ['order_id' => $order->id, 'response' => $result]);

        if ($response->successful() && isset($result['status']) && $result['status'] === 200) {
            $consignment = $result['consignment'] ?? [];
            return [
                'success' => true,
                'tracking_code' => $consignment['tracking_code'] ?? null,
                'consignment_id' => $consignment['consignment_id'] ?? null,
                'data' => $result,
            ];
        }

        throw new Exception($result['message'] ?? 'Failed to book courier parcel with Steadfast.');
    }
}