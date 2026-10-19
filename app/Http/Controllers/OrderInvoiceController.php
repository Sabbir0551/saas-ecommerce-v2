<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderInvoiceController extends Controller
{
    public function print(Order $order)
    {
        $order->load(['items.product', 'items.variant']);

        return view('invoices.order-invoice', compact('order'));
    }
}