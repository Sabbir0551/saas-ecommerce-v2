<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StorefrontController extends Controller
{
    /** হোমপেজ: ক্যাটাগরি ও সক্রিয় প্রোডাক্টসমূহ প্রদর্শন */
    public function index(Request $request)
    {
        $categories = Category::where('is_active', true)
            ->whereNull('parent_id')
            ->with(['children' => fn ($q) => $q->where('is_active', true)])
            ->orderBy('sort_order')
            ->get();

        $productsQuery = Product::where('is_active', true)
            ->with(['variants' => fn ($q) => $q->where('is_active', true), 'categories']);

        // ক্যাটাগরি ফিল্টার (যদি URL-এ ?category=slug থাকে)
        if ($request->filled('category')) {
            $productsQuery->whereHas('categories', function ($q) use ($request) {
                $q->where('slug', $request->query('category'));
            });
        }

        // সার্চ কুয়েরি
        if ($request->filled('search')) {
            $productsQuery->where('name', 'like', '%' . $request->query('search') . '%');
        }

        $products = $productsQuery->latest()->paginate(12)->withQueryString();

        return $this->resolveView('index', compact('categories', 'products'));
    }

    /** প্রোডাক্ট ডিটেইল ও ফাস্ট চেকআউট পেজ */
    public function product(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->with(['variants' => fn ($q) => $q->where('is_active', true), 'categories'])
            ->firstOrFail();

        return $this->resolveView('product', compact('product'));
    }

    /**
     * Resolves category-specific or archetype-specific storefront view.
     */
    protected function resolveView(string $viewName, array $data = [])
    {
        $category = tenant('business_category') ?? 'default';
        $archetype = tenant('archetype') ?? 'physical_store';

        // 1. Direct Category Match (e.g. storefront.categories.fashion_clothing.index)
        if (view()->exists("storefront.categories.{$category}.{$viewName}")) {
            return view("storefront.categories.{$category}.{$viewName}", $data);
        }

        // 2. Category Alias Mapping
        $aliasMap = [
            'shoes_footwear' => 'fashion_clothing',
            'jewelry' => 'fashion_clothing',
            'mobile_gadgets' => 'laptop_computer',
            'bakery_pastry' => 'restaurant',
            'barber_salon' => 'doctor',
            'coaching_service' => 'doctor',
            'house_rental' => 'real_estate',
            'vehicle_dealership' => 'real_estate',
            'grocery_food' => 'pharmacy',
            'pet_food' => 'default',
        ];

        if (isset($aliasMap[$category]) && view()->exists("storefront.categories.{$aliasMap[$category]}.{$viewName}")) {
            return view("storefront.categories.{$aliasMap[$category]}.{$viewName}", $data);
        }

        // 3. Archetype Fallback Mapping
        $archetypeMap = [
            'food_menu' => 'restaurant',
            'service' => 'doctor',
            'service_booking' => 'doctor',
            'lead' => 'real_estate',
            'lead_gen' => 'real_estate',
            'listing_inquiry' => 'real_estate',
        ];

        if (isset($archetypeMap[$archetype]) && view()->exists("storefront.categories.{$archetypeMap[$archetype]}.{$viewName}")) {
            return view("storefront.categories.{$archetypeMap[$archetype]}.{$viewName}", $data);
        }

        // 4. Default Category View
        if (view()->exists("storefront.categories.default.{$viewName}")) {
            return view("storefront.categories.default.{$viewName}", $data);
        }

        // 5. Global Fallback
        return view("storefront.{$viewName}", $data);
    }

    /**
     * নির্দিষ্ট তারিখ ও ডাক্তারের visiting_hours অনুযায়ী ১ ঘন্টার স্লটের প্রাপ্যতা রিটার্ন করে
     * প্রতি ১ ঘন্টায় সর্বোচ্চ ১০ জন নির্ধারিত
     */
    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'date'       => 'required|date',
        ]);

        $product = Product::findOrFail($request->product_id);
        $specs = is_array($product->specs) ? $product->specs : (json_decode($product->specs, true) ?? []);
        $visitingHours = $specs['visiting_hours'] ?? '05:00 PM - 09:30 PM';

        // ১ ঘন্টার স্লট জেনারেশন (Visiting Hours পার্স করে)
        $slots = [];
        if (preg_match('/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm))/i', $visitingHours, $matches)) {
            $start = strtotime($matches[1]);
            $end = strtotime($matches[2]);
            if ($start && $end && $start < $end) {
                for ($t = $start; $t < $end; $t += 3600) {
                    $slotEnd = min($t + 3600, $end);
                    $slots[] = date('h:i A', $t) . ' - ' . date('h:i A', $slotEnd);
                }
            }
        }

        if (empty($slots)) {
            $slots = [
                '05:00 PM - 06:00 PM',
                '06:00 PM - 07:00 PM',
                '07:00 PM - 08:00 PM',
                '08:00 PM - 09:30 PM',
            ];
        }

        // ফিক্সড: Order-এ সরাসরি product_id না খুঁজে items টেবিলের মাধ্যমে গোনা
        $bookings = Order::whereHas('items', function ($q) use ($product) {
                $q->where('product_id', $product->id);
            })
            ->whereDate('booking_date', $request->date)
            ->selectRaw('booking_time, count(*) as total_booked')
            ->groupBy('booking_time')
            ->pluck('total_booked', 'booking_time')
            ->toArray();

        $maxCapacity = 10; // প্রতি ঘন্টায় সর্বোচ্চ ১০ জন
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
        $archetype = tenant('archetype') ?? 'commerce';

        // ইনপুট নরম্যালাইজেশন (যাতে বিভিন্ন ক্যাটাগরির ফিল্ড নেম মিসম্যাচ না হয়)
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

        $productTable = \Illuminate\Support\Facades\Schema::hasTable('items') ? 'items' : 'products';
        $variantTable = \Illuminate\Support\Facades\Schema::hasTable('item_variants') ? 'item_variants' : 'product_variants';

        // মৌলিক ভ্যালিডেশন রুলস
        $rules = [
            'product_id'         => "required|exists:{$productTable},id",
            'product_variant_id' => "nullable|exists:{$variantTable},id",
            'customer_name'      => 'required|string|max:150',
            'customer_phone'     => 'required|string|regex:/^(?:\+?88)?01[3-9]\d{8}$/',
            'customer_note'      => 'nullable|string|max:255',
        ];

        // ১. সাধারণ পণ্য বিক্রি (Physical Commerce)
        if (in_array($archetype, ['commerce', 'physical_store', 'food_menu', 'digital_course'])) {
            $rules['quantity']         = 'required|integer|min:1|max:50';
            $rules['district']         = 'required|string|in:Dhaka,Outside Dhaka';
            $rules['shipping_address'] = 'required|string|max:500';
            $rules['payment_method']   = 'required|string|in:cod,bkash,sslcommerz';
        }
        // ২. ডাক্তার বা চেম্বার সার্ভিস সিরিয়াল বুকিং (Service Archetype)
        elseif (in_array($archetype, ['service', 'service_booking'])) {
            $rules['quantity']         = 'nullable|integer';
            $rules['district']         = 'nullable|string';
            $rules['shipping_address'] = 'nullable|string|max:500';
            $rules['payment_method']   = 'nullable|string';
            $rules['booking_date']     = 'required|date';
            $rules['booking_time']     = 'required|string';

            // সার্ভার-সাইড সেফটি গার্ড: ১ ঘন্টার স্লটে ১০ জন পূর্ণ হয়ে গেছে কি না যাচাই
            $alreadyBooked = Order::whereHas('items', function ($q) use ($request) {
                    $q->where('product_id', $request->product_id);
                })
                ->whereDate('booking_date', $request->booking_date)
                ->where('booking_time', $request->booking_time)
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
            $rules['shipping_address'] = 'nullable|string|max:1000'; // ইউজারের মেসেজ/ইনকোয়ারি
        }

        $validated = $request->validate($rules, [
            'customer_phone.regex'  => 'একটি সঠিক ১১ ডিজিটের বাংলাদেশি ফোন নম্বর দিন (যেমন: 017xxxxxxxx)',
            'booking_date.required' => 'অ্যাপয়েন্টমেন্টের তারিখ নির্বাচন করুন।',
            'booking_time.required' => 'নির্দিষ্ট শিডিউল নির্বাচন করুন।',
        ]);

        $items = [
            [
                'product_id' => (int) $validated['product_id'],
                'variant_id' => !empty($validated['product_variant_id']) ? (int) $validated['product_variant_id'] : null,
                'quantity'   => (int) ($validated['quantity'] ?? 1),
            ],
        ];

        // ঠিকানা বা ইনকোয়ারি মেসেজ প্রসেস
        $addressNote = $validated['shipping_address'] ?? '';
        $isService = in_array($archetype, ['service', 'service_booking']);
        $isLead = in_array($archetype, ['lead', 'lead_gen', 'listing_inquiry', 'portfolio_content']);

        if ($isService && $request->filled('booking_date') && $request->filled('booking_time')) {
            $bookingDetails = "Date: {$request->booking_date} | Slot: {$request->booking_time}";
            $addressNote = $addressNote ? "{$bookingDetails} | Note: {$addressNote}" : $bookingDetails;
        }

        // ডিফল্ট জেলা/বিভাগ নির্ধারণ
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

        // ব্রাউজার ডাবল-ক্লিক বা নেটওয়ার্ক ল্যাগ রোধে আইডেমপোটেন্সি কি
        $idempotencyKey = hash('sha256', $validated['customer_phone'] . '|' . $validated['product_id'] . '|' . ($request->input('booking_time') ?? '') . '|' . now()->format('YmdHi'));

        try {
            $order = $orderService->create($orderData, $items, $idempotencyKey);

            // সার্ভিস বুকিং হলে ডেডিকেটেড bookings টেবিলে রেকর্ড সেভ
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

            // লিস্টিং ইনকোয়ারি হলে ডেডিকেটেড inquiries টেবিলে রেকর্ড সেভ
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
            ->with('items')
            ->firstOrFail();

        return view('storefront.success', compact('order'));
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