<?php

namespace App\Services;

use App\Contracts\CourierGatewayInterface;
use App\Services\Couriers\PathaoCourierDriver;
use App\Services\Couriers\SteadfastCourierDriver;
use InvalidArgumentException;

class CourierManager
{
    public static function driver(string $name = 'steadfast'): CourierGatewayInterface
    {
        return match (strtolower($name)) {
            'steadfast' => new SteadfastCourierDriver(),
            'pathao'    => new PathaoCourierDriver(),
            default     => throw new InvalidArgumentException("Unsupported courier driver: {$name}"),
        };
    }
}
