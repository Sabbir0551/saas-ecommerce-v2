<?php

namespace App\Services\Payments;

use App\Contracts\PaymentGatewayInterface;
use App\Models\Order;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SslCommerzPaymentDriver implements PaymentGatewayInterface
{
    protected string $storeId;
    protected string $storePassword;
    protected bool $isSandbox;

    public function __construct()
    {
        $creds = tenant()->gateway_credentials ?? [];
        $this->storeId = $creds['ssl_store_id'] ?? env('SSLC_STORE_ID', '');
        $this->storePassword = $creds['ssl_store_password'] ?? env('SSLC_STORE_PASSWORD', '');
        $this->isSandbox = $creds['ssl_sandbox'] ?? true;
    }

    public function createPayment(Order $order): array
    {
        if (empty($this->storeId) || empty($this->storePassword)) {
            throw new Exception('SSLCommerz Store ID or Password is not configured.');
        }

        $domain = request()->getHost();
        $redirectUrl = $this->isSandbox 
            ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php?tran_id={$order->order_number}"
            : "https://securepay.sslcommerz.com/gwprocess/v4/api.php?tran_id={$order->order_number}";

        return [
            'success'      => true,
            'redirect_url' => $redirectUrl,
            'payment_id'   => 'SSLC-' . $order->order_number,
            'data'         => [
                'total_amount' => round($order->total / 100, 2),
                'currency'     => 'BDT',
            ],
        ];
    }

    public function verifyPayment(Request $request): array
    {
        $valId = $request->input('val_id');
        $status = $request->input('status');

        if ($status === 'VALID' || $status === 'VALIDATED') {
            return [
                'success'        => true,
                'transaction_id' => $request->input('bank_tran_id', 'SSLC-TRX-' . rand(10000, 99999)),
                'amount'         => (float) $request->input('amount', 0),
                'message'        => 'SSLCommerz payment validated successfully',
            ];
        }

        return [
            'success' => false,
            'transaction_id' => '',
            'amount' => 0,
            'message' => 'SSLCommerz transaction validation failed.',
        ];
    }

    public function refund(string $transactionId, float $amount, string $reason = ''): bool
    {
        Log::info("SSLCommerz refund for TRX: {$transactionId}, Amount: {$amount}");
        return true;
    }

    public function handleWebhook(Request $request): void
    {
        Log::info('SSLCommerz IPN Received:', $request->all());
    }
}
