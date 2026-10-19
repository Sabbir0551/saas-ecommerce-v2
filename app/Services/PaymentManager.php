<?php

namespace App\Services;

use App\Contracts\PaymentGatewayInterface;
use App\Services\Payments\BkashTokenizedPaymentDriver;
use App\Services\Payments\CashOnDeliveryDriver;
use App\Services\Payments\SslCommerzPaymentDriver;
use InvalidArgumentException;

class PaymentManager
{
    public static function driver(string $name = 'cod'): PaymentGatewayInterface
    {
        return match (strtolower($name)) {
            'bkash' => new BkashTokenizedPaymentDriver(),
            'sslcommerz', 'ssl' => new SslCommerzPaymentDriver(),
            'cod', 'cash_on_delivery' => new CashOnDeliveryDriver(),
            default => throw new InvalidArgumentException("Unsupported payment driver: {$name}"),
        };
    }
}
