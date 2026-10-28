<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Dispute;
use App\Models\Item;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;

class StorefrontController extends Controller
{
    /** হোমপেজ: ক্যাটাগরি, ব্র্যান্ড ও সক্রিয় আইটেমসমূহ প্রদর্শন */
    public function index(Request $request)
    {
        $categories = Category::where('is_active', true)
            ->whereNull('parent_id')
            ->with(['children' => fn ($q) => $q->where('is_active', true)])
            ->orderBy('sort_order')
            ->get();

        $brands = Schema::hasTable('brands')
            ? Brand::where('is_active', true)->orderBy('sort_order')->get()
            : collect();

        if (Schema::hasTable('items')) {
            $query = Item::where('is_active', true)
                ->with(['variants' => fn ($q) => $q->where('is_active', true), 'categories', 'brand', 'reviews']);

            if ($request->filled('category')) {
                $query->whereHas('categories', function ($q) use ($request) {
                    $q->where('slug', $request->query('category'));
                });
            }

            if ($request->filled('brand')) {
                $brandParam = $request->query('brand');
                $query->where(function ($q) use ($brandParam) {
                    $q->whereHas('brand', function ($bq) use ($brandParam) {
                        $bq->where('slug', $brandParam)
                           ->orWhere('name', $brandParam);
                    })->orWhere('item_attributes->brand', 'like', "%{$brandParam}%");
                });
            }

            if ($request->filled('search')) {
                $search = $request->query('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhereHas('brand', fn ($bq) => $bq->where('name', 'like', "%{$search}%"))
                      ->orWhere('item_attributes->brand', 'like', "%{$search}%");
                });
            }

            $products = $query->latest()->paginate(12)->withQueryString();

            // Featured items (is_featured = true or latest 8)
            $featuredBase = Item::where('is_active', true)
                ->with(['variants' => fn ($q) => $q->where('is_active', true), 'categories', 'brand', 'reviews']);
            $featuredProducts = (clone $featuredBase)->where('is_featured', true)->latest()->take(8)->get();
            if ($featuredProducts->isEmpty()) {
                $featuredProducts = (clone $featuredBase)->latest()->take(8)->get();
            }

            // New arrivals (latest 8 items)
            $newArrivals = (clone $featuredBase)->latest()->take(8)->get();
        } else {
            $productsQuery = Product::where('is_active', true)
                ->with(['variants' => fn ($q) => $q->where('is_active', true), 'categories', 'brand']);

            if ($request->filled('category')) {
                $productsQuery->whereHas('categories', function ($q) use ($request) {
                    $q->where('slug', $request->query('category'));
                });
            }

            if ($request->filled('brand')) {
                $brandParam = $request->query('brand');
                $productsQuery->where(function ($q) use ($brandParam) {
                    $q->whereHas('brand', function ($bq) use ($brandParam) {
                        $bq->where('slug', $brandParam)
                           ->orWhere('name', $brandParam);
                    });
                });
            }

            if ($request->filled('search')) {
                $productsQuery->where('name', 'like', '%' . $request->query('search') . '%');
            }

            $products = $productsQuery->latest()->paginate(12)->withQueryString();

            $featuredBase = Product::where('is_active', true)
                ->with(['variants' => fn ($q) => $q->where('is_active', true), 'categories', 'brand']);
            $featuredProducts = (clone $featuredBase)->latest()->take(8)->get();
            $newArrivals = (clone $featuredBase)->latest()->take(8)->get();
        }

        return $this->resolveView('index', compact('categories', 'brands', 'products', 'featuredProducts', 'newArrivals'));
    }

    /** প্রোডাক্ট / আইটেম ডিটেইল ও ফাস্ট চেকআউট পেজ */
    public function product(string $slug)
    {
        $product = null;

        if (Schema::hasTable('items')) {
            $product = Item::where('slug', $slug)
                ->where('is_active', true)
                ->with(['variants' => fn ($q) => $q->where('is_active', true), 'categories', 'reviews'])
                ->first();
        }

        if (!$product && Schema::hasTable('products')) {
            $product = Product::where('slug', $slug)
                ->where('is_active', true)
                ->with(['variants' => fn ($q) => $q->where('is_active', true), 'categories'])
                ->firstOrFail();
        } elseif (!$product) {
            abort(404);
        }

        return $this->resolveView('product', compact('product'));
    }

    /**
     * Resolves category-specific or archetype-specific storefront view.
     */
    protected function resolveView(string $viewName, array $data = [])
    {
        $data['errors'] = $data['errors'] ?? session('errors') ?? new \Illuminate\Support\ViewErrorBag();
        $category = tenant('business_category') ?? 'default';
        $archetype = tenant('archetype') ?? 'physical_store';

        // 1. Direct Category Match
        if (view()->exists("storefront.categories.{$category}.{$viewName}")) {
            return view("storefront.categories.{$category}.{$viewName}", $data);
        }

        // 2. Category Alias Mapping
        $aliasMap = [
            'shoes_footwear'     => 'fashion_clothing',
            'jewelry'            => 'fashion_clothing',
            'mobile_gadgets'     => 'laptop_computer',
            'bakery_pastry'      => 'restaurant',
            'barber_salon'       => 'doctor',
            'coaching_service'   => 'doctor',
            'matchmaker'         => 'doctor',
            'house_rental'       => 'real_estate',
            'vehicle_dealership' => 'real_estate',
            'travel_agency'      => 'real_estate',
            'grocery_food'           => 'pharmacy',
            'cosmetics_beauty'       => 'pharmacy',
            'electronics_appliances' => 'laptop_computer',
            'pet_food'               => 'default',
        ];

        if (isset($aliasMap[$category]) && view()->exists("storefront.categories.{$aliasMap[$category]}.{$viewName}")) {
            return view("storefront.categories.{$aliasMap[$category]}.{$viewName}", $data);
        }

        // 3. Archetype Fallback Mapping
        $archetypeMap = [
            'food_menu'         => 'restaurant',
            'service'           => 'doctor',
            'service_booking'   => 'doctor',
            'lead'              => 'real_estate',
            'lead_gen'          => 'real_estate',
            'listing_inquiry'   => 'real_estate',
            'portfolio_content' => 'real_estate',
        ];

        if (isset($archetypeMap[$archetype]) && view()->exists("storefront.categories.{$archetypeMap[$archetype]}.{$viewName}")) {
            return view("storefront.categories.{$archetypeMap[$archetype]}.{$viewName}", $data);
        }

        // 4. Default Category View
        if (view()->exists("storefront.categories.default.{$viewName}")) {
            return view("storefront.categories.default.{$viewName}", $data);
        }

        // 5. General Theme Fallback
        if ($archetype === 'service' || $archetype === 'service_booking') {
            return view("storefront.themes.service.{$viewName}", $data);
        }

        if (in_array($archetype, ['lead', 'lead_gen', 'listing_inquiry', 'portfolio_content'], true)) {
            return view("storefront.themes.lead.{$viewName}", $data);
        }

        if (view()->exists("storefront.themes.commerce.{$viewName}")) {
            return view("storefront.themes.commerce.{$viewName}", $data);
        }

        return view("storefront.{$viewName}", $data);
    }

    /**
     * ডাক্তার বা সেলুনের এক ঘন্টার স্লটের লাইভ এভেইলেবিলিটি
     */
    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
        ]);

        $slots = [
            '09:00 AM - 10:00 AM',
            '10:00 AM - 11:00 AM',
            '11:00 AM - 12:00 PM',
            '12:00 PM - 01:00 PM',
            '04:00 PM - 05:00 PM',
            '05:00 PM - 06:00 PM',
            '06:00 PM - 07:00 PM',
            '07:00 PM - 08:00 PM',
            '08:00 PM - 09:00 PM',
        ];

        $bookings = Order::whereDate('booking_date', $request->date)
            ->where('status', '!=', 'cancelled')
            ->selectRaw('booking_time, count(*) as total_booked')
            ->groupBy('booking_time')
            ->pluck('total_booked', 'booking_time')
            ->toArray();

        $maxCapacity = 10;
        $slotData = [];

        foreach ($slots as $slot) {
            $booked = $bookings[$slot] ?? 0;
            $available = max(0, $maxCapacity - $booked);
            $isFull = $booked >= $maxCapacity;

            $slotData[] = [
                'time'      => $slot,
                'booked'    => $booked,
                'available' => $available,
                'is_full'   => $isFull,
                'label'     => $isFull 
                                ? "{$slot} — [হাউজফুল: ১০/১০ জন বুকড]" 
                                : "{$slot} — [{$booked}/10 জন বুকড | খালি আছে {$available} টি]",
            ];
        }

        return response()->json([
            'date'  => $request->date,
            'slots' => $slotData,
        ]);
    }

    /** ১-পেজ সরাসরি এক্সপ্রেস চেকআউট, সার্ভিস বুকিং ও রিয়েল এস্টেট লিড ইনকোয়ারি প্লেসমেন্ট */
    public function placeOrder(Request $request, OrderService $orderService)
    {
        $archetype = tenant('archetype') ?? 'physical_store';

        // ইনপুট নরম্যালাইজেশন
        if (!$request->filled('product_id') && $request->filled('item_id')) {
            $request->merge(['product_id' => $request->input('item_id')]);
        }
        if (!$request->filled('product_variant_id') && $request->filled('selected_variant_id')) {
            $request->merge(['product_variant_id' => $request->input('selected_variant_id')]);
        }
        if (!$request->filled('customer_note') && $request->filled('order_note')) {
            $request->merge(['customer_note' => $request->input('order_note')]);
        }
        if (!$request->filled('district')) {
            $zone = $request->input('delivery_zone');
            $district = ($zone === 'outside_dhaka') ? 'Outside Dhaka' : 'Dhaka';
            $request->merge(['district' => $district]);
        }
        if (!$request->filled('payment_method')) {
            $request->merge(['payment_method' => 'cod']);
        }
        if ($request->filled('selected_size')) {
            $sizeNote = "Size: " . $request->input('selected_size');
            $existingNote = $request->input('customer_note');
            $request->merge(['customer_note' => $existingNote ? "{$sizeNote} | {$existingNote}" : $sizeNote]);
        }
        if ($request->filled('spice_level')) {
            $spiceNote = "Spice: " . $request->input('spice_level');
            $existingNote = $request->input('customer_note');
            $request->merge(['customer_note' => $existingNote ? "{$spiceNote} | {$existingNote}" : $spiceNote]);
        }

        $catalogTable = Schema::hasTable('items') ? 'items' : 'products';
        $variantTable = Schema::hasTable('item_variants') ? 'item_variants' : 'product_variants';

        $rules = [
            'product_id'         => "required|exists:{$catalogTable},id",
            'product_variant_id' => "nullable|exists:{$variantTable},id",
            'customer_name'      => 'required|string|max:150',
            'customer_phone'     => 'required|string|regex:/^(?:\+?88)?01[3-9]\d{8}$/',
            'customer_note'      => 'nullable|string|max:255',
            'transaction_id'     => 'nullable|string|min:6|max:40',
        ];

        // ১. সাধারণ পণ্য বিক্রি (Physical Commerce & Food)
        if (in_array($archetype, ['commerce', 'physical_store', 'food_menu', 'digital_course'], true)) {
            $rules['quantity']         = 'required|integer|min:1|max:50';
            $rules['district']         = 'required|string|in:Dhaka,Outside Dhaka';
            $rules['shipping_address'] = 'required|string|max:500';
            $rules['payment_method']   = 'required|string|in:cod,bkash,sslcommerz,manual_bkash,manual_nagad';

            if (in_array($request->input('payment_method'), ['manual_bkash', 'manual_nagad'], true)) {
                $rules['transaction_id'] = 'required|string|min:6|max:40';
            }
        }
        // ২. ডাক্তার বা চেম্বার সার্ভিস সিরিয়াল বুকিং (Service Archetype)
        elseif (in_array($archetype, ['service', 'service_booking'], true)) {
            $rules['quantity']         = 'nullable|integer';
            $rules['district']         = 'nullable|string';
            $rules['shipping_address'] = 'nullable|string|max:500';
            $rules['payment_method']   = 'nullable|string';
            $rules['booking_date']     = 'required|date';
            $rules['booking_time']     = 'required|string';

            $alreadyBooked = Order::where(function ($q) use ($request) {
                    $q->whereHas('items', fn ($sub) => $sub->where('product_id', $request->product_id)->orWhere('item_id', $request->product_id));
                })
                ->whereDate('booking_date', $request->booking_date)
                ->where('booking_time', $request->booking_time)
                ->where('status', '!=', 'cancelled')
                ->count();

            if ($alreadyBooked >= 10) {
                return back()->withInput()->withErrors([
                    'booking_time' => 'দুঃখিত! এই শিডিউলে কোটা পূর্ণ হয়ে গেছে। অনুগ্রহ করে অন্য সময় বেছে নিন।'
                ]);
            }
        }
        // ৩. রিয়েল এস্টেট, রেন্টাল ও লিড ইনকোয়ারি (Listing & Inquiry Archetype)
        else {
            $rules['quantity']         = 'nullable|integer';
            $rules['district']         = 'nullable|string';
            $rules['payment_method']   = 'nullable|string';
            $rules['shipping_address'] = 'nullable|string|max:1000';
        }

        $validated = $request->validate($rules, [
            'customer_phone.regex'     => 'একটি সঠিক ১১ ডিজিটের বাংলাদেশি ফোন নম্বর দিন (যেমন: 017xxxxxxxx)',
            'booking_date.required'    => 'অ্যাপয়েন্টমেন্টের তারিখ নির্বাচন করুন।',
            'booking_time.required'    => 'নির্দিষ্ট শিডিউল নির্বাচন করুন।',
            'transaction_id.required'  => 'ম্যানুয়াল পেমেন্টের ক্ষেত্রে bKash / Nagad Transaction ID (TrxID) দেওয়া আবশ্যক।',
        ]);

        // TrxID Duplication Security Guard
        if (!empty($validated['transaction_id'])) {
            $cleanTrx = trim($validated['transaction_id']);
            $existingPayment = Payment::where('transaction_id', $cleanTrx)->exists();
            if ($existingPayment) {
                return back()->withInput()->withErrors([
                    'transaction_id' => 'এই ট্রানজ্যাকশন আইডিটি (TrxID) ইতোমধ্যে ব্যবহৃত হয়েছে। সঠিক ও অপ্রযুক্ত TrxID দিন।'
                ]);
            }
        }

        $items = [
            [
                'item_id'    => (int) $validated['product_id'],
                'variant_id' => !empty($validated['product_variant_id']) ? (int) $validated['product_variant_id'] : null,
                'quantity'   => (int) ($validated['quantity'] ?? 1),
            ],
        ];

        $addressNote = $validated['shipping_address'] ?? '';
        $isService = in_array($archetype, ['service', 'service_booking'], true);
        $isLead = in_array($archetype, ['lead', 'lead_gen', 'listing_inquiry', 'portfolio_content'], true);

        if ($isService && $request->filled('booking_date') && $request->filled('booking_time')) {
            $bookingDetails = "Date: {$request->booking_date} | Slot: {$request->booking_time}";
            $addressNote = $addressNote ? "{$bookingDetails} | Note: {$addressNote}" : $bookingDetails;
        }

        $defaultDistrict = match (true) {
            $isService => 'Service Booking',
            $isLead    => 'Lead Inquiry',
            default    => 'Dhaka',
        };

        $orderData = [
            'customer_name'    => $validated['customer_name'],
            'customer_phone'   => $validated['customer_phone'],
            'district'         => $validated['district'] ?? $defaultDistrict,
            'shipping_address' => $addressNote ?: ($isLead ? 'Site Visit / Inquiry Request' : 'Chamber / Service Visit'),
            'customer_note'    => $validated['customer_note'] ?? null,
            'payment_method'   => $validated['payment_method'] ?? ($isLead ? 'inquiry' : 'cod'),
            'booking_date'     => $request->input('booking_date'),
            'booking_time'     => $request->input('booking_time'),
            'ip_address'       => $request->ip(),
        ];

        $idempotencyKey = hash('sha256', $validated['customer_phone'] . '|' . $validated['product_id'] . '|' . ($request->input('booking_time') ?? '') . '|' . now()->format('YmdHi'));

        try {
            $order = $orderService->create($orderData, $items, $idempotencyKey);

            // Manual bKash/Nagad Payment Tracking
            if (!empty($validated['transaction_id'])) {
                Payment::create([
                    'order_id'       => $order->id,
                    'method'         => $validated['payment_method'],
                    'transaction_id' => trim($validated['transaction_id']),
                    'amount'         => $order->total,
                    'status'         => 'pending',
                    'gateway_response' => [
                        'type'        => 'manual_merchant_verification_required',
                        'submitted_at'=> now()->toDateTimeString(),
                    ],
                ]);
            }

            if ($isService) {
                \App\Models\Booking::create([
                    'item_id'        => (int) $validated['product_id'],
                    'customer_name'  => $validated['customer_name'],
                    'customer_phone' => $validated['customer_phone'],
                    'booking_date'   => $request->input('booking_date'),
                    'slot_start'     => explode(' - ', $request->input('booking_time', ''))[0] ?? '05:00 PM',
                    'slot_end'       => explode(' - ', $request->input('booking_time', ''))[1] ?? null,
                    'fee'            => round($order->total / 100, 2),
                    'status'         => 'pending',
                    'payment_status' => 'unpaid',
                    'notes'          => $addressNote,
                ]);
            }

            if ($isLead) {
                \App\Models\Inquiry::create([
                    'item_id' => (int) $validated['product_id'],
                    'name'    => $validated['customer_name'],
                    'phone'   => $validated['customer_phone'],
                    'message' => $validated['shipping_address'] ?? 'Site visit request',
                    'status'  => 'new',
                    'notes'   => $validated['customer_note'] ?? null,
                ]);
            }

            return redirect()->route('storefront.order.success', $order->order_number);
        } catch (\Throwable $e) {
            return back()->withInput()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /** অর্ডার সাকসেস থ্যাংক ইউ পেজ */
    public function orderSuccess(string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->with(['items.item', 'payments'])
            ->firstOrFail();

        return view('storefront.success', compact('order'));
    }

    /**
     * ডিজিটাল কমার্স নির্দেশিকা ২০২১ অনুযায়ী ৭২ ঘণ্টার অভিযোগ দাখিল ফর্ম
     */
    public function showDisputeForm(Request $request)
    {
        $orderNumber = $request->query('order');
        return view('storefront.dispute', compact('orderNumber'));
    }

    /**
     * গ্রাহক অভিযোগ বা ডিস্পিউট সাবমিট
     */
    public function submitDispute(Request $request)
    {
        $validated = $request->validate([
            'order_number'    => 'nullable|string|max:50',
            'customer_name'   => 'required|string|max:100',
            'customer_phone'  => 'required|string|regex:/^(?:\+?88)?01[3-9]\d{8}$/',
            'customer_email'  => 'nullable|email|max:100',
            'subject'         => 'required|string|max:200',
            'description'     => 'required|string|min:15|max:2000',
        ], [
            'customer_phone.regex' => 'একটি সঠিক ১১ ডিজিটের ফোন নম্বর দিন (যেমন: 017xxxxxxxx)',
            'description.min'      => 'অভিযোগের বিবরণ কমপক্ষে ১৫ অক্ষরে লিখুন যাতে বিষয়টি খতিয়ে দেখা যায়।',
        ]);

        $order = null;
        if (!empty($validated['order_number'])) {
            $order = Order::where('order_number', trim($validated['order_number']))->first();
        }

        $dispute = Dispute::create([
            'order_id'       => $order?->id,
            'customer_name'  => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_email' => $validated['customer_email'] ?? null,
            'subject'        => $validated['subject'],
            'description'    => $validated['description'],
            'status'         => 'open',
            'deadline_at'    => now()->addHours(72),
        ]);

        if ($order) {
            $order->update(['dispute_status' => 'open_dispute']);
        }

        return back()->with('success', "আপনার অভিযোগটি সফলভাবে নিবন্ধিত হয়েছে (টিকেট: {$dispute->ticket_number})। ডিজিটাল কমার্স নির্দেশিকা অনুযায়ী ৭২ ঘণ্টার মধ্যে সমাধান প্রক্রিয়া সম্পন্ন করা হবে।");
    }

    /**
     * আইনি কমপ্লায়েন্ট কাস্টমার রিভিউ সাবমিশন (মালিক ও স্টাফের স্ব-রিভিউ প্রযুক্তিগতভাবে নিষিদ্ধ)
     */
    public function submitReview(Request $request, string $slug)
    {
        $item = Item::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'customer_name'  => 'required|string|max:100',
            'customer_phone' => 'required|string|regex:/^(?:\+?88)?01[3-9]\d{8}$/',
            'rating'         => 'required|integer|min:1|max:5',
            'comment'        => 'nullable|string|max:1000',
        ]);

        // Anti-Fake / Staff Review Prevention: Block if reviewer phone belongs to tenant staff
        $cleanPhone = preg_replace('/[^0-9]/', '', $validated['customer_phone']);
        $ownerPhone = preg_replace('/[^0-9]/', '', (string) tenant('owner_phone'));
        if (!empty($ownerPhone) && str_ends_with($cleanPhone, substr($ownerPhone, -10))) {
            return back()->withErrors(['review' => 'দোকানের মালিক বা কর্মী নিজের স্টোরের পণ্যে রিভিউ দিতে পারবেন না (ডিজিটাল কমার্স নির্দেশিকা ২০২১)।']);
        }

        Review::create([
            'item_id'        => $item->id,
            'customer_name'  => $validated['customer_name'],
            'customer_phone' => substr($validated['customer_phone'], 0, 3) . '****' . substr($validated['customer_phone'], -4),
            'rating'         => (int) $validated['rating'],
            'comment'        => $validated['comment'] ?? null,
            'is_hidden'      => false,
        ]);

        return back()->with('review_success', 'আপনার মূল্যবান পর্যালোচনার জন্য ধন্যবাদ!');
    }

    /** ব্যবহারের শর্তাবলী (Terms & Conditions) */
    public function terms()
    {
        return view('storefront.legal', [
            'title' => 'ব্যবহারের শর্তাবলী (Terms & Conditions)',
            'type'  => 'terms',
        ]);
    }

    /** গোপনীয়তা নীতি (Privacy Policy) */
    public function privacyPolicy()
    {
        return view('storefront.legal', [
            'title' => 'গোপনীয়তা নীতি (Privacy Policy)',
            'type'  => 'privacy',
        ]);
    }

    /** রিটার্ন ও রিফান্ড নীতি (Return & Refund Policy) */
    public function refundPolicy()
    {
        return view('storefront.legal', [
            'title' => 'রিটার্ন ও রিফান্ড পলিসি (Return Policy)',
            'type'  => 'refund',
        ]);
    }
}