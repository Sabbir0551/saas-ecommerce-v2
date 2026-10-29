'use client';

import React, { useState } from 'react';
import {
  Scan,
  Camera,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Store,
  Layers,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Maximize2,
} from 'lucide-react';

interface PosProps {
  tenantSlug: string;
  tenantInfo: any;
  items: any[];
  isMedical?: boolean;
  isRealEstate?: boolean;
  isElectronics?: boolean;
}

export default function LivePosTerminalTab({
  tenantSlug,
  tenantInfo,
  items,
  isMedical,
  isRealEstate,
  isElectronics,
}: PosProps) {
  const storeName = tenantInfo?.name || tenantSlug.toUpperCase();

  // Demo inventory items if none supplied
  const defaultItems = [
    {
      id: 'p1',
      title: isMedical ? 'Paracetamol 500mg (10x10 Box)' : isElectronics ? 'Smart IoT Circuit Breaker 63A' : 'Premium Cotton Panjabi',
      sku: 'SKU-8012',
      barcode: '890123456789',
      price: isMedical ? 350 : isElectronics ? 3850 : 2450,
      stock: 45,
      category: isMedical ? 'Medicine' : isElectronics ? 'Automation' : 'Men Fashion',
      batch: 'B-2026-X',
      expiry: '12/2027',
      serial: 'SN-9982',
    },
    {
      id: 'p2',
      title: isMedical ? 'Digital Blood Pressure Monitor' : isElectronics ? 'Wi-Fi 6 Mesh Router Dual-Band' : 'Embroidered Silk Saree',
      sku: 'SKU-9023',
      barcode: '890987654321',
      price: isMedical ? 2850 : isElectronics ? 5400 : 7800,
      stock: 18,
      category: isMedical ? 'Medical Equipment' : isElectronics ? 'Networking' : 'Women Boutique',
      batch: 'B-2025-Q',
      expiry: '08/2029',
      serial: 'SN-4432',
    },
    {
      id: 'p3',
      title: isMedical ? 'Surgical Face Mask (Box of 50)' : isElectronics ? 'Industrial Surge Protector 40kA' : 'Casual Linen Shirt',
      sku: 'SKU-7731',
      barcode: '890554433221',
      price: isMedical ? 180 : isElectronics ? 2100 : 1650,
      stock: 120,
      category: isMedical ? 'Consumables' : isElectronics ? 'Protection' : 'Apparel',
      batch: 'B-2026-A',
      expiry: '04/2028',
      serial: 'SN-1102',
    },
    {
      id: 'p4',
      title: isMedical ? 'N95 Respirator Mask' : isElectronics ? 'Smart LED Zigbee Bulb 12W' : 'Slim Fit Denim Jeans',
      sku: 'SKU-6621',
      barcode: '890332211445',
      price: isMedical ? 120 : isElectronics ? 850 : 2150,
      stock: 65,
      category: isMedical ? 'Consumables' : isElectronics ? 'Smart Lighting' : 'Denim',
      batch: 'B-2026-N',
      expiry: '09/2028',
      serial: 'SN-5561',
    },
  ];

  const inventory = items && items.length > 0 ? items : defaultItems;

  // Search & Cart states
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([
    {
      ...defaultItems[0],
      qty: 1,
      serialInput: defaultItems[0].serial,
      batchInput: defaultItems[0].batch,
    },
  ]);

  // Scanner modal state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerFeedback, setScannerFeedback] = useState<string | null>(null);

  // Discount & Payment
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bkash' | 'card'>('cash');
  const [customerPhone, setCustomerPhone] = useState('01811223344');
  const [customerName, setCustomerName] = useState('Walk-in Customer');

  // Receipt Modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<any>(null);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) || 0) * item.qty, 0);
  const vat = Math.round(subtotal * 0.05); // 5% VAT
  const total = Math.max(0, subtotal + vat - discountAmount);

  // Add to cart
  const addToCart = (product: any) => {
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      setCart(cart.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i)));
    } else {
      setCart([
        ...cart,
        {
          ...product,
          qty: 1,
          serialInput: product.serial || `SN-${Math.floor(1000 + Math.random() * 9000)}`,
          batchInput: product.batch || 'B-2026',
        },
      ]);
    }
  };

  const updateQty = (id: string, delta: number) => {
    setCart(
      cart
        .map((i) => {
          if (i.id === id) {
            const newQty = i.qty + delta;
            return newQty > 0 ? { ...i, qty: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as any[]
    );
  };

  const removeItem = (id: string) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  // Barcode simulate scan
  const handleSimulateScan = (scannedBarcode: string) => {
    const matched = inventory.find((p) => p.barcode === scannedBarcode || p.sku === scannedBarcode);
    if (matched) {
      addToCart(matched);
      setScannerFeedback(`✅ স্ক্যান সফল: ${matched.title} যোগ করা হয়েছে!`);
      setTimeout(() => setScannerFeedback(null), 2500);
    } else {
      setScannerFeedback(`⚠️ বারকোড '${scannedBarcode}' সিস্টেমে পাওয়া যায়নি!`);
      setTimeout(() => setScannerFeedback(null), 3000);
    }
  };

  // Complete checkout
  const handleCompleteSale = () => {
    if (cart.length === 0) return;
    const orderData = {
      orderId: `POS-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString('en-GB'),
      items: [...cart],
      subtotal,
      vat,
      discount: discountAmount,
      total,
      paymentMethod,
      customerName,
      customerPhone,
      cashier: 'Tanvir (Counter 01)',
    };
    setLastCompletedOrder(orderData);
    setShowReceiptModal(true);
    setCart([]);
    setDiscountAmount(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-[#0B132B]/80 to-purple-950/70 border border-indigo-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Update 8 • POS & Barcode Scanner
              </span>
              <span className="flex items-center gap-1 text-[11px] text-amber-300 font-mono">
                <Store className="w-3.5 h-3.5" /> High-Speed Counter Terminal
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              ইন-স্টোর লাইভ POS ও বারকোড স্ক্যানার টার্মিনাল
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              ক্যামেরা ও বারকোড গান দিয়ে তাৎক্ষণিক প্রোডাক্ট স্ক্যান, আইএমইআই/ব্যাচ ট্র্যাকিং এবং ৮০মিমি থার্মাল প্রিন্টিং।
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-900/30 transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>ক্যামেরা স্ক্যানার অন করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* POS Grid: Products (7 cols) + Cart & Tender (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Catalog & Fast Search */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="প্রোডাক্ট নাম, SKU বা বারকোড দিয়ে খুঁজুন..."
                className="w-full bg-[#11172A] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>
            <button
              onClick={() => handleSimulateScan('890123456789')}
              className="px-3 py-2.5 rounded-xl bg-[#131B31] border border-indigo-500/30 hover:border-indigo-500 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
              title="Quick Scan SKU-8012"
            >
              <Scan className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">বারকোড সিমুলেট</span>
            </button>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {inventory
              .filter(
                (p) =>
                  !searchQuery ||
                  p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  p.barcode?.includes(searchQuery)
              )
              .map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-[#0D1322] border border-slate-800 hover:border-indigo-500/60 rounded-xl p-3.5 transition cursor-pointer group flex flex-col justify-between hover:shadow-lg hover:shadow-indigo-950/40"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1.5">
                      <span>{product.sku || 'SKU-000'}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        স্টক: {product.stock || 20}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition line-clamp-2">
                      {product.title}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-sm font-black text-amber-400 font-mono">
                      ৳{Number(product.price).toLocaleString()}
                    </span>
                    <button className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right: Cart, Archetype Serial Ledger & Checkout */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-400" />
                <span>কাউন্টার কার্ট ({cart.length} আইটেম)</span>
              </h3>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> ক্লিয়ার
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  কার্ট খালি। বাম পাশ থেকে প্রোডাক্ট যুক্ত করুন বা বারকোড স্ক্যান করুন।
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-[#11172A] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 truncate max-w-[170px]">{item.title}</span>
                      <span className="font-mono font-bold text-amber-400">
                        ৳{(Number(item.price) * item.qty).toLocaleString()}
                      </span>
                    </div>

                    {/* Archetype Field: Serial or Batch input */}
                    <div className="flex items-center gap-2 text-[10px]">
                      {isElectronics && (
                        <div className="flex-1 flex items-center gap-1 bg-[#090E1A] px-2 py-1 rounded border border-slate-800">
                          <span className="text-slate-400 font-mono">IMEI/SN:</span>
                          <input
                            type="text"
                            value={item.serialInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCart(cart.map((c) => (c.id === item.id ? { ...c, serialInput: val } : c)));
                            }}
                            className="bg-transparent text-indigo-300 font-mono w-full focus:outline-none"
                            placeholder="SN-1234"
                          />
                        </div>
                      )}
                      {isMedical && (
                        <div className="flex-1 flex items-center gap-1 bg-[#090E1A] px-2 py-1 rounded border border-slate-800">
                          <span className="text-slate-400 font-mono">Batch:</span>
                          <input
                            type="text"
                            value={item.batchInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCart(cart.map((c) => (c.id === item.id ? { ...c, batchInput: val } : c)));
                            }}
                            className="bg-transparent text-teal-300 font-mono w-full focus:outline-none"
                            placeholder="B-2026"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-mono font-bold text-xs text-white">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-5 h-5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-5 h-5 rounded text-rose-400 hover:text-rose-300 ml-1 flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations & Tender Methods */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>সাবটোটাল</span>
                <span className="font-mono text-white">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ভ্যাট (৫%)</span>
                <span className="font-mono text-white">৳{vat.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>ডিসকাউন্ট (৳)</span>
                <input
                  type="number"
                  value={discountAmount || ''}
                  onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-20 bg-[#11172A] border border-slate-700 rounded px-2 py-0.5 text-right font-mono text-amber-300 text-xs focus:outline-none"
                />
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>সর্বমোট প্রদেয়</span>
                <span className="text-lg font-black text-emerald-400 font-mono">৳{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-md'
                    : 'bg-[#12192C] text-slate-400 border-slate-800'
                }`}
              >
                <Banknote className="w-4 h-4 mb-1" />
                <span>ক্যাশ</span>
              </button>
              <button
                onClick={() => setPaymentMethod('bkash')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  paymentMethod === 'bkash'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500 shadow-md'
                    : 'bg-[#12192C] text-slate-400 border-slate-800'
                }`}
              >
                <QrCode className="w-4 h-4 mb-1" />
                <span>বিকাশ/নগদ</span>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500 shadow-md'
                    : 'bg-[#12192C] text-slate-400 border-slate-800'
                }`}
              >
                <CreditCard className="w-4 h-4 mb-1" />
                <span>কার্ড POS</span>
              </button>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleCompleteSale}
              disabled={cart.length === 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>পেমেন্ট গ্রহণ ও রসিদ প্রিন্ট করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Camera Scanner Viewfinder Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B101E] border border-slate-700 rounded-3xl p-6 max-w-md w-full text-center space-y-4 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>লাইভ ক্যামেরা বারকোড স্ক্যানার</span>
              </h3>
              <button
                onClick={() => setIsScannerOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {/* Scanner Viewfinder Box */}
            <div className="w-full h-56 bg-slate-950 rounded-2xl border-2 border-dashed border-indigo-500/60 relative overflow-hidden flex items-center justify-center">
              {/* Animated Laser Scanning Line */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_12px_#f43f5e] animate-pulse"></div>
              <div className="text-slate-400 text-xs space-y-2">
                <Scan className="w-12 h-12 text-indigo-400 mx-auto animate-bounce opacity-70" />
                <p>ক্যামেরার সামনে প্রোডাক্টের বারকোড বা QR কোড ধরুন</p>
              </div>
            </div>

            {scannerFeedback && (
              <p className="text-xs font-semibold text-emerald-400">{scannerFeedback}</p>
            )}

            {/* Quick Demo Scan Buttons */}
            <div className="space-y-1.5 pt-2">
              <p className="text-[11px] text-slate-400">অথবা দ্রুত ডেমো স্ক্যান টেস্ট করুন:</p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handleSimulateScan('890123456789')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-mono"
                >
                  স্ক্যান: SKU-8012
                </button>
                <button
                  onClick={() => handleSimulateScan('890987654321')}
                  className="px-3 py-1.5 rounded-lg bg-teal-950 text-teal-300 border border-teal-800 text-xs font-mono"
                >
                  স্ক্যান: SKU-9023
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsScannerOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* 80mm POS Thermal Receipt Modal */}
      {showReceiptModal && lastCompletedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl font-mono text-xs space-y-4">
            {/* Store Header */}
            <div className="text-center space-y-1 border-b-2 border-dashed border-slate-300 pb-3">
              <h2 className="text-base font-black tracking-tight uppercase text-slate-950">{storeName}</h2>
              <p className="text-[10px] text-slate-600">{tenantInfo?.address || 'Dhaka, Bangladesh'}</p>
              <p className="text-[10px] text-slate-600">Helpline: {tenantInfo?.phone || '+880 1811-223344'}</p>
              <p className="text-[10px] text-slate-500 font-bold mt-1">*** CASH COUNTER RECEIPT ***</p>
            </div>

            {/* Order meta */}
            <div className="space-y-0.5 text-[11px]">
              <div className="flex justify-between">
                <span>Order No:</span>
                <span className="font-bold">{lastCompletedOrder.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{lastCompletedOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Cashier:</span>
                <span>{lastCompletedOrder.cashier}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="uppercase font-bold">{lastCompletedOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Line items */}
            <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1.5">
              <div className="flex justify-between font-bold text-[10px] text-slate-600 uppercase">
                <span>Item</span>
                <span>Qty x Price</span>
                <span>Total</span>
              </div>
              {lastCompletedOrder.items.map((it: any, idx: number) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-semibold">
                    <span className="truncate max-w-[140px]">{it.title}</span>
                    <span>{it.qty} x ৳{it.price}</span>
                    <span>৳{it.qty * it.price}</span>
                  </div>
                  {it.serialInput && (
                    <p className="text-[9px] text-slate-500">SN: {it.serialInput}</p>
                  )}
                  {it.batchInput && (
                    <p className="text-[9px] text-slate-500">Batch: {it.batchInput}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-1 text-right">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>৳{lastCompletedOrder.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (5%):</span>
                <span>৳{lastCompletedOrder.vat.toLocaleString()}</span>
              </div>
              {lastCompletedOrder.discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount:</span>
                  <span>-৳{lastCompletedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black border-t-2 border-slate-900 pt-1">
                <span>NET TOTAL:</span>
                <span>৳{lastCompletedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Barcode Mock */}
            <div className="text-center pt-2 border-t border-dashed border-slate-300">
              <div className="h-10 bg-slate-900 mx-auto w-3/4 flex items-center justify-around px-2 text-[8px] text-white">
                |||| | |||||| || | |||| |||||
              </div>
              <p className="text-[9px] text-slate-500 mt-1">Thank you for shopping with us!</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> প্রিন্ট করুন (80mm)
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-3 py-2 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                বন্ধ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

