<?php

namespace App\Services;

use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PaymentService
{
    /**
     * অর্ডারের বিপরীতে পেমেন্ট রেকর্ড করা এবং অর্ডারের স্ট্যাটাস আপডেট করা
     */
    public function recordPayment(Order $order, array $data): Payment
    {
        $trxId = trim($data['transaction_id'] ?? '');

        // ডুপ্লিকেট TrxID রোধ
        if (!empty($trxId)) {
            $duplicate = Payment::where('transaction_id', $trxId)
                ->where('status', 'success')
                ->exists();

            if ($duplicate) {
                throw ValidationException::withMessages([
                    'transaction_id' => "এই Transaction ID ({$trxId}) ইতোমধ্যে অন্য একটি পেমেন্টে ব্যবহার করা হয়েছে।",
                ]);
            }
        }

        return DB::transaction(function () use ($order, $data, $trxId) {
            $order = Order::whereKey($order->id)->lockForUpdate()->firstOrFail();

            // পেমেন্ট অ্যামাউন্ট পয়সায় (Cent) রূপান্তর
            $amount = (int) round(($data['amount'] ?? 0) * 100);

            if ($amount <= 0) {
                throw ValidationException::withMessages([
                    'amount' => 'পেমেন্ট অ্যামাউন্ট ০ এর চেয়ে বেশি হতে হবে।',
                ]);
            }

            $payment = $order->payments()->create([
                'payment_method' => $data['payment_method'] ?? 'bkash',
                'transaction_id' => $trxId ?: null,
                'amount'         => $amount,
                'status'         => 'success',
                'payload'        => $data['payload'] ?? null,
            ]);

            // অর্ডারের সর্বমোট পেইড অ্যামাউন্ট রিক্যালকুলেট করা
            $totalPaid = $order->payments()->where('status', 'success')->sum('amount');
            $netTotal = $order->total;

            $newPaymentStatus = match (true) {
                $totalPaid >= $netTotal => PaymentStatus::Paid,
                $totalPaid > 0          => PaymentStatus::Partial,
                default                 => PaymentStatus::Unpaid,
            };

            $order->update([
                'paid_amount'    => $totalPaid,
                'payment_status' => $newPaymentStatus,
            ]);

            return $payment;
        });
    }
}