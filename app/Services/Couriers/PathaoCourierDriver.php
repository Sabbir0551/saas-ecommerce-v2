<?php

namespace App\Services\Couriers;

use App\Contracts\CourierGatewayInterface;
use App\Models\Order;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PathaoCourierDriver implements CourierGatewayInterface
{
    protected string $baseUrl;
    protected string $clientId;
    protected string $clientSecret;

    public function __construct(?string $clientId = null, ?string $clientSecret = null)
    {
        $creds = tenant()->gateway_credentials ?? [];

        $this->baseUrl = 'https://api-hermes.pathao.com/aladdin/api/v1';
        $this->clientId = $clientId ?: ($creds['pathao_client_id'] ?? '');
        $this->clientSecret = $clientSecret ?: ($creds['pathao_client_secret'] ?? '');
    }

    public function createShipment(Order $order): array
    {
        if (empty($this->clientId) || empty($this->clientSecret)) {
            throw new Exception('Pathao Courier credentials are not configured for this store.');
        }

        // টোকেন ও পার্সেল তৈরির ড্রাইভার কাঠামো
        return [
            'success'        => true,
            'consignment_id' => 'PTH-' . $order->order_number,
            'tracking_code'  => 'PTH-TRK-' . rand(100000, 999999),
            'data'           => ['message' => 'Pathao shipment registered.'],
        ];
    }

    public function trackShipment(string $trackingCode): array
    {
        return [
            'status'     => 'in_transit',
            'location'   => 'Hub',
            'updated_at' => now()->toDateTimeString(),
        ];
    }

    public function calculateRate(string $city, float $weightKg): float
    {
        return str_contains(strtolower($city), 'dhaka') ? 70.0 : 130.0;
    }

    public function handleWebhook(Request $request): void
    {
        Log::info('Pathao Webhook:', $request->all());
    }
}
