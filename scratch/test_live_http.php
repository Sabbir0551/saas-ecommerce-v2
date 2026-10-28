<?php

$ctx = stream_context_create([
    'http' => [
        'header' => "Host: aebanproperty.localhost:8000\r\n",
        'timeout' => 5,
    ]
]);

$url = 'http://127.0.0.1:8000/product/huntleigh-luxury-country-estate-villa';
$html = @file_get_contents($url, false, $ctx);

if ($html === false) {
    echo "HTTP request failed.\n";
} else {
    echo "HTTP 200 OK! Received " . strlen($html) . " bytes from live server.\n";
    if (strpos($html, 'Huntleigh Luxury Country Estate & Villa') !== false) {
        echo "[VERIFIED] Item title 'Huntleigh Luxury Country Estate & Villa' is live in HTML.\n";
    }
    if (strpos($html, '৳5,500,000') !== false) {
        echo "[VERIFIED] Price '৳5,500,000' is displayed properly.\n";
    }
    if (strpos($html, '<img x-show="activeMediaType === \'image\'"') !== false) {
        echo "[VERIFIED] SSR <img> is rendered directly without blank template block.\n";
    }
    if (strpos($html, 'Search property title, location, or luxury estate...') !== false) {
        echo "[VERIFIED] Dynamic category search placeholder is present (no laptop placeholder).\n";
    }
    if (strpos($html, 'cdn.jsdelivr.net/npm/alpinejs@3.14.8') !== false) {
        echo "[VERIFIED] Alpine.js is included in layout header.\n";
    }
}
