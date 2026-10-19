<?php

declare(strict_types=1);

use App\Http\Controllers\OrderInvoiceController;
use App\Http\Controllers\StorefrontController;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    // পাবলিক স্টোরফ্রন্ট হোমপেজ
    Route::get('/', [StorefrontController::class, 'index'])->name('storefront.home');

    // প্রোডাক্ট / সার্ভিস ডিটেইল পেজ
    Route::get('/product/{slug}', [StorefrontController::class, 'product'])->name('storefront.product');

    // ১ ঘন্টার শিডিউল অনুযায়ী এভেইলেবল স্লট ফেচিং (রিয়েলটাইম ক্যাপাসিটি চেক)
    Route::get('/booking/available-slots', [StorefrontController::class, 'getAvailableSlots'])
        ->name('storefront.booking.slots');

    // অর্ডার / অ্যাপয়েন্টমেন্ট সাবমিশন (উভয় রুট নাম ডিফাইন করা হলো যাতে কোনো ভিউয়ে RouteNotFoundException না আসে)
    Route::post('/order/place', [StorefrontController::class, 'placeOrder'])->name('storefront.order.place');
    Route::post('/order/submit', [StorefrontController::class, 'placeOrder'])->name('storefront.order.submit');

    // অর্ডার / বুকিং সফল হওয়ার পর থ্যাংক ইউ পেজ
    Route::get('/order/success/{orderNumber}', [StorefrontController::class, 'orderSuccess'])->name('storefront.order.success');

    // ডিজিটাল কমার্স নির্দেশিকা অনুযায়ী আবশ্যক বাংলা পলিসি পেজসমূহ
    Route::get('/terms', [StorefrontController::class, 'terms'])->name('storefront.terms');
    Route::get('/privacy-policy', [StorefrontController::class, 'privacyPolicy'])->name('storefront.privacy');
    Route::get('/refund-policy', [StorefrontController::class, 'refundPolicy'])->name('storefront.refund');

    // টেন্যান্ট ইনভয়েস প্রিন্ট
    Route::get('/orders/{order}/invoice', [OrderInvoiceController::class, 'print'])
        ->name('orders.invoice')
        ->middleware('auth');

    // দৈনিক অ্যাপয়েন্টমেন্ট ও রোগী সিরিয়াল শিট (প্রিন্ট / PDF ভিউ)
    Route::get('/admin/daily-appointments-sheet', function (Request $request) {
        $date = $request->query('date', today()->toDateString());

        $appointments = Order::whereDate('booking_date', $date)
            ->where('status', '!=', 'cancelled')
            ->orderBy('booking_time', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();

        return view('admin.daily_sheet', [
            'date' => $date,
            'appointments' => $appointments,
        ]);
    })->name('admin.daily.appointments');
});