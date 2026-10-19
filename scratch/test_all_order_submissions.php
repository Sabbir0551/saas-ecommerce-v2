<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Tenant;
use App\Models\Product;
use App\Services\OrderService;
use App\Http\Controllers\StorefrontController;
use Illuminate\Http\Request;

echo "--- 1. Testing Fashion Order ---\n";
$fashionTenant = Tenant::find('meherhashion');
$fashionTenant->run(function () {
    $product = Product::where('slug', 'jamdani-saree')->first();
    $request = Request::create('/order/place', 'POST', [
        'product_id' => $product->id,
        'quantity' => 1,
        'selected_size' => 'L',
        'customer_name' => 'Fatima Begum',
        'customer_phone' => '01711223344',
        'shipping_address' => 'Mirpur 10, Dhaka',
        'delivery_zone' => 'inside_dhaka',
    ]);
    
    $controller = app(StorefrontController::class);
    $orderService = app(OrderService::class);
    $response = $controller->placeOrder($request, $orderService);
    echo "Fashion Order Response Status: " . $response->getStatusCode() . " (Redirected to: " . $response->headers->get('Location') . ")\n";
});

echo "\n--- 2. Testing Doctor Serial Booking ---\n";
$doctorTenant = Tenant::find('meradenralcare');
$doctorTenant->run(function () {
    $doctor = Product::where('slug', 'dr-mera-haque')->first();
    $request = Request::create('/order/place', 'POST', [
        'product_id' => $doctor->id,
        'customer_name' => 'Sabbir Rahman',
        'customer_phone' => '01811223344',
        'booking_date' => date('Y-m-d', strtotime('+1 day')),
        'booking_time' => '06:00 PM - 07:00 PM',
        'shipping_address' => 'Teeth cleaning and pain consultation',
    ]);

    $controller = app(StorefrontController::class);
    $orderService = app(OrderService::class);
    $response = $controller->placeOrder($request, $orderService);
    echo "Doctor Booking Response Status: " . $response->getStatusCode() . " (Redirected to: " . $response->headers->get('Location') . ")\n";
});

echo "\n--- 3. Testing Real Estate Site Visit Inquiry ---\n";
$realEstateTenant = Tenant::find('aebanproperty');
$realEstateTenant->run(function () {
    $property = Product::where('slug', 'price-upon-request')->first();
    $request = Request::create('/order/place', 'POST', [
        'product_id' => $property->id,
        'customer_name' => 'Engr. Kamal Hossain',
        'customer_phone' => '01911223344',
        'shipping_address' => 'Interested in 3-bedroom unit on 5th floor. Please arrange site visit.',
    ]);

    $controller = app(StorefrontController::class);
    $orderService = app(OrderService::class);
    $response = $controller->placeOrder($request, $orderService);
    echo "Real Estate Inquiry Response Status: " . $response->getStatusCode() . " (Redirected to: " . $response->headers->get('Location') . ")\n";
});
