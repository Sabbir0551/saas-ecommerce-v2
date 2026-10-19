<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - {{ $order->order_number }}</title>
    <style>
        * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { padding: 30px; color: #1e293b; background: #fff; max-width: 800px; margin: auto; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
        .invoice-title { font-size: 24px; font-weight: 800; color: #0f172a; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; }
        .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; }
        .box-title { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px 14px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
        th { background: #f1f5f9; font-weight: 700; color: #475569; }
        .text-right { text-align: right; }
        .totals { margin-top: 20px; width: 300px; margin-left: auto; }
        .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
        .net-total { font-size: 18px; font-weight: 800; border-top: 2px solid #0f172a; padding-top: 8px; color: #0f172a; }
        .print-btn { display: inline-block; background: #0f172a; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; margin-bottom: 20px; border: none; cursor: pointer; }
        @media print {
            .no-print { display: none !important; }
            body { padding: 0; }
        }
    </style>
</head>
<body>
    <div class="no-print">
        <button class="print-btn" onclick="window.print()">🖨️ Print / Download Invoice</button>
    </div>

    <div class="header">
        <div>
            <div class="invoice-title">INVOICE</div>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">#{{ $order->order_number }}</div>
            <div style="font-size: 12px; color: #64748b;">Date: {{ $order->created_at->format('d M Y, h:i A') }}</div>
        </div>
        <div class="text-right">
            <h2 style="margin: 0; font-size: 20px; font-weight: 800;">STORE INVOICE</h2>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Payment: {{ strtoupper($order->payment_method) }} ({{ strtoupper($order->payment_status->value) }})</div>
        </div>
    </div>

    <div class="meta-grid">
        <div class="box">
            <div class="box-title">Customer Details</div>
            <strong>{{ $order->customer_name }}</strong><br>
            Phone: {{ $order->customer_phone }}<br>
            @if($order->customer_email) Email: {{ $order->customer_email }}<br> @endif
        </div>
        <div class="box">
            <div class="box-title">Shipping Address</div>
            {{ $order->shipping_address }}<br>
            {{ $order->area ? $order->area . ', ' : '' }}{{ $order->district }}
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Item Description</th>
                <th>Variant</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Line Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
                <tr>
                    <td><strong>{{ $item->product_name }}</strong></td>
                    <td>{{ $item->variant ?: '—' }}</td>
                    <td class="text-right">৳ {{ number_format($item->unit_price / 100, 2) }}</td>
                    <td class="text-right">{{ $item->quantity }}</td>
                    <td class="text-right">৳ {{ number_format($item->line_total / 100, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <div class="total-row">
            <span>Subtotal:</span>
            <span>৳ {{ number_format($order->subtotal / 100, 2) }}</span>
        </div>
        <div class="total-row">
            <span>Delivery Charge:</span>
            <span>৳ {{ number_format($order->shipping_fee / 100, 2) }}</span>
        </div>
        @if($order->discount > 0)
        <div class="total-row" style="color: #10b981;">
            <span>Discount:</span>
            <span>- ৳ {{ number_format($order->discount / 100, 2) }}</span>
        </div>
        @endif
        <div class="total-row net-total">
            <span>Net Payable:</span>
            <span>৳ {{ number_format($order->total / 100, 2) }}</span>
        </div>
    </div>
</body>
</html>
