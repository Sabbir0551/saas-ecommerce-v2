<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected string $provider;
    protected string $token;
    protected ?string $senderId;

    public function __construct()
    {
        $this->provider = config('services.sms.provider', env('SMS_PROVIDER', 'greenweb'));
        $this->token = config('services.sms.token', env('SMS_TOKEN', ''));
        $this->senderId = config('services.sms.sender_id', env('SMS_SENDER_ID', null));
    }

    /**
     * ফোন নম্বরে SMS পাঠানো
     */
    public function send(string $phone, string $message): bool
    {
        // ফোন নম্বর ১১ ডিজিট বাংলাদেশী ফরম্যাটে নিশ্চিত করা
        $phone = $this->formatNumber($phone);

        if (blank($this->token)) {
            Log::info("SMS Gateway Token not set. Dummy SMS to {$phone}: {$message}");
            return true;
        }

        try {
            if ($this->provider === 'greenweb') {
                return $this->sendGreenweb($phone, $message);
            }

            // অন্যান্য প্রোভাইডারের লজিক এখানে যুক্ত করা যাবে
            return false;
        } catch (Exception $e) {
            Log::error('SMS Sending Failed: ' . $e->getMessage(), ['phone' => $phone]);
            return false;
        }
    }

    protected function sendGreenweb(string $phone, string $message): bool
    {
        $response = Http::asForm()->post('https://api.greenweb.com.bd/api.php', [
            'token' => $this->token,
            'to' => $phone,
            'message' => $message,
        ]);

        $body = $response->body();
        Log::info("Greenweb SMS Response for {$phone}: " . $body);

        return str_contains($body, 'Ok:');
    }

    protected function formatNumber(string $phone): string
    {
        $clean = preg_replace('/[^0-9]/', '', $phone);
        if (str_starts_with($clean, '880')) {
            return $clean;
        }
        if (str_starts_with($clean, '01')) {
            return '88' . $clean;
        }
        return $clean;
    }
}