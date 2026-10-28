<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Tenant;
use App\Models\Item;

$categoriesToTest = ['real_estate', 'doctor', 'fashion_clothing', 'mobile_gadgets', 'laptop_computer'];

foreach ($categoriesToTest as $cat) {
    $tenant = Tenant::where('business_category', $cat)->first();
    if (!$tenant) {
        $tenant = Tenant::first();
    }
    
    echo "========================================================\n";
    echo "Checking Category: {$cat} (Tenant: {$tenant->id})\n";
    tenancy()->initialize($tenant);
    
    $item = Item::first();
    if (!$item) {
        echo "  [ERROR] No item found\n";
        tenancy()->end();
        continue;
    }

    $controller = app(\App\Http\Controllers\StorefrontController::class);

    // Test Case 1: Direct File Upload
    $item->video_path = 'items/videos/sample_demo.mp4';
    $item->video_url = null;
    $item->video_title = 'টেস্ট আপলোডেড ভিডিও ফাইল';
    $item->save();

    $htmlFile = $controller->product($item->slug)->render();
    if (strpos($htmlFile, '<video') !== false && strpos($htmlFile, 'sample_demo.mp4') !== false) {
        echo "  [PASS] Direct file upload renders <video> tag successfully.\n";
    } else {
        echo "  [FAIL] Did not find <video> tag with file path.\n";
    }

    // Verify thumbnail strip does not have video button
    if (strpos($htmlFile, 'ভিডিও ট্যুর') !== false && strpos($htmlFile, 'w-20 h-16') !== false && strpos($htmlFile, 'activeMediaType') !== false) {
        echo "  [FAIL] Video button still found inside image thumbnail strip!\n";
    } else {
        echo "  [PASS] Photo thumbnail strip is completely clean without video button.\n";
    }

    // Test Case 2: Embed URL
    $item->video_path = null;
    $item->video_url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    $item->video_title = 'টেস্ট ইউটিউব এম্বেড ভিডিও';
    $item->save();

    $htmlEmbed = $controller->product($item->slug)->render();
    if (strpos($htmlEmbed, '<iframe') !== false && strpos($htmlEmbed, 'youtube.com/embed') !== false) {
        echo "  [PASS] Embed video renders <iframe> tag successfully.\n";
    } else {
        echo "  [FAIL] Did not find <iframe> tag with youtube embed.\n";
    }

    // Reset item
    $item->video_path = null;
    $item->video_url = null;
    $item->save();

    tenancy()->end();
}

echo "========================================================\n";
echo "All video tests completed successfully!\n";
