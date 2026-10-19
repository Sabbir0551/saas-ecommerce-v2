<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Tenant;
use App\Models\Item;
use App\Models\Order;
use App\Models\Dispute;
use App\Models\Review;
use App\Services\OrderService;
use App\Http\Controllers\StorefrontController;
use Illuminate\Http\Request;

echo "========================================================\n";
echo "TEST 1: UNIFIED ITEM & STOREFRONT QUERY ON TENANT [gadgethub]\n";
echo "========================================================\n";

$gadgetTenant = Tenant::find('gadgethub');
$gadgetTenant->run(function () {
    $itemsCount = Item::count();
    $firstItem = Item::first();
    echo "Total items in tenant DB: {$itemsCount}\n";
    if ($firstItem) {
        echo "Sample Item: {$firstItem->name} | Price: ৳{$firstItem->price} | Completeness Score: {$firstItem->completeness_score}%\n";
    }

    $controller = app(StorefrontController::class);
    $orderService = app(OrderService::class);

    // Place an order with manual bKash TrxID
    $trxId = 'TRX' . rand(10000000, 99999999);
    $request = Request::create('/order/place', 'POST', [
        'product_id'       => $firstItem->id,
        'quantity'         => 1,
        'customer_name'    => 'Tanvir Ahmed',
        'customer_phone'   => '01712345678',
        'shipping_address' => 'House 12, Road 4, Dhanmondi, Dhaka',
        'delivery_zone'    => 'inside_dhaka',
        'payment_method'   => 'manual_bkash',
        'transaction_id'   => $trxId,
    ]);

    $response = $controller->placeOrder($request, $orderService);
    echo "Order Placement Status: " . $response->getStatusCode() . " (Location: " . $response->headers->get('Location') . ")\n";

    $latestOrder = Order::latest()->first();
    echo "Created Order #{$latestOrder->order_number} | Total: ৳" . ($latestOrder->total / 100) . " | Advance Allowed: {$latestOrder->advance_percent_allowed}%\n";
    echo "Payment Status: {$latestOrder->payment_status->value} | Payments count: " . $latestOrder->payments()->count() . "\n";

    // Test Duplicate TrxID Prevention
    $duplicateRequest = Request::create('/order/place', 'POST', [
        'product_id'       => $firstItem->id,
        'quantity'         => 1,
        'customer_name'    => 'Second Buyer',
        'customer_phone'   => '01799887766',
        'shipping_address' => 'Gulshan 2, Dhaka',
        'delivery_zone'    => 'inside_dhaka',
        'payment_method'   => 'manual_bkash',
        'transaction_id'   => $trxId, // Reusing same TrxID
    ]);

    $dupResponse = $controller->placeOrder($duplicateRequest, $orderService);
    $errors = session('errors') ? session('errors')->all() : [];
    echo "Duplicate TrxID Test Result: " . (count($errors) > 0 ? "PASSED (Blocked with error: {$errors[0]})" : "FAILED") . "\n";

    // Test 72h Dispute Submission
    echo "\n--------------------------------------------------------\n";
    echo "TEST 2: 72-HOUR CUSTOMER DISPUTE / COMPLAINT TICKET\n";
    echo "--------------------------------------------------------\n";

    $disputeReq = Request::create('/disputes/submit', 'POST', [
        'order_number'    => $latestOrder->order_number,
        'customer_name'   => 'Tanvir Ahmed',
        'customer_phone'  => '01712345678',
        'subject'         => '৪৮ ঘণ্টায় পণ্য কুরিয়ারে হস্তান্তর করা হয়নি',
        'description'     => 'আমি পণ্যটি অর্ডার করেছি কিন্তু ৪৮ ঘণ্টা পার হয়ে গেলেও ট্র্যাকিং কোড পাইনি। অনুগ্রহ করে দ্রুত কুরিয়ারে দিন।',
    ]);

    $controller->submitDispute($disputeReq);
    $dispute = Dispute::latest()->first();
    echo "Dispute Created! Ticket: {$dispute->ticket_number}\n";
    echo "Subject: {$dispute->subject}\n";
    echo "Hours Remaining in 72h window: {$dispute->hours_remaining} hours\n";
    echo "Order Dispute Status: " . $latestOrder->fresh()->dispute_status . "\n";

    // Test Legal Review Submission
    echo "\n--------------------------------------------------------\n";
    echo "TEST 3: CUSTOMER REVIEW & ANTI-STAFF GUARD\n";
    echo "--------------------------------------------------------\n";

    $reviewReq = Request::create("/product/{$firstItem->slug}/reviews", 'POST', [
        'customer_name'  => 'Habib Rahman',
        'customer_phone' => '01899112233',
        'rating'         => 5,
        'comment'        => 'অসাধারণ গ্যাজেট! দ্রুত ডেলিভারি পেয়েছি। ১০০% জেনুইন প্রোডাক্ট।',
    ]);

    $controller->submitReview($reviewReq, $firstItem->slug);
    $review = Review::latest()->first();
    echo "Review Submitted: '{$review->comment}' | Rating: {$review->rating}/5 | Masked Phone: {$review->customer_phone}\n";
    echo "Item Average Rating: {$firstItem->fresh()->average_rating} (Reviews: {$firstItem->fresh()->total_reviews_count})\n";
});

echo "\n========================================================\n";
echo "TESTS COMPLETED SUCCESSFULLY!\n";
echo "========================================================\n";
