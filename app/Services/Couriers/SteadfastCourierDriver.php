<?php

namespace App\Services\Couriers;

use App\Contracts\CourierGatewayInterface;
use App\Models\Order;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SteadfastCourierDriver implements CourierGatewayInterface
{
    protected string $baseUrl;
    protected string $apiKey;
    protected string $secretKey;

    public function __construct(?string $apiKey = null, ?string $secretKey = null)
    {
        $creds = tenant()->gateway_credentials ?? [];

        $this->baseUrl = 'https://portal.packzy.com/api/v1';
        $this->apiKey = $apiKey ?: ($creds['steadfast_api_key'] ?? env('STEADFAST_API_KEY', ''));
        $this->secretKey = $secretKey ?: ($creds['steadfast_secret_key'] ?? env('STEADFAST_SECRET_KEY', ''));
    }

    public function createShipment(Order $order): array
    {
        if (empty($this->apiKey) || empty($this->secretKey)) {
            throw new Exception('Steadfast API Key or Secret Key is not configured for this store.');
        }

        $codAmount = ($order->payment_status->value === 'paid') ? 0 : round($order->total / 100);

        $payload = [
            'invoice'           => $order->order_number,
            'recipient_name'    => $order->customer_name,
            'recipient_phone'   => $order->customer_phone,
            'recipient_address' => $order->shipping_address,
            'cod_amount'        => (int) $codAmount,
            'note'              => $order->customer_note ?? 'Handle with care',
        ];

        $response = Http::withHeaders([
            'Api-Key'      => $this->apiKey,
            'Secret-Key'   => $this->secretKey,
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/create_order", $payload);

        $result = $response->json();
        Log::info('Steadfast Shipment Response:', ['order_id' => $order->id, 'response' => $result]);

        if ($response->successful() && isset($result['status']) && $result['status'] === 200) {
            $consignment = $result['consignment'] ?? [];
            return [
                'success'        => true,
                'consignment_id' => $consignment['consignment_id'] ?? null,
                'tracking_code'  => $consignment['tracking_code'] ?? null,
                'data'           => $result,
            ];
        }

        throw new Exception($result['message'] ?? 'Failed to book parcel with Steadfast.');
    }

    public function trackShipment(string $trackingCode): array
    {
        $response = Http::withHeaders([
            'Api-Key'    => $this->apiKey,
            'Secret-Key' => $this->secretKey,
        ])->get("{$this->baseUrl}/status_by_trackingcode/{$trackingCode}");

        $result = $response->json();
        return [
            'status'      => $result['delivery_status'] ?? 'pending',
            'location'    => null,
            'updated_at'  => now()->toDateTimeString(),
        ];
    }

    public function calculateRate(string $city, float $weightKg): float
    {
        // ঢাকা শহরের ভিতরে ৮০ টাকা, ঢাকার বাইরে ১৩০ টাকা
        return str_contains(strtolower($city), 'dhaka') ? 80.0 : 130.0;
    }

    public function handleWebhook(Request $request): void
    {
        $consignmentId = $request->input('consignment_id');
        $status = $request->input('status');

        Log::info('Steadfast Webhook Received:', $request->all());

        if ($consignmentId && $status) {
            Order::where('consignment_id', $consignmentId)->update([
                'delivery_status' => $status,
            ]);
        }
    }
}
