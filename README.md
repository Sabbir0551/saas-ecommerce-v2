# Multi-Tenant SaaS E-commerce & Service Engine (V2)

একটি আধুনিক, স্কেলেবল এবং অত্যন্ত দ্রুতগতির মাল্টি-টেন্যান্ট ই-কমার্স ও ১-ঘণ্টা সার্ভিস শিডিউলিং প্ল্যাটফর্ম।

## 🛠️ ব্যবহৃত আধুনিক প্রযুক্তি (Tech Stack)

- **Frontend**: Next.js 15 (React 19, App Router, TypeScript, Tailwind CSS, Lucide Icons)
- **Backend**: Node.js, Express, TypeScript, REST APIs
- **Database ORM**: Prisma ORM (PostgreSQL & Redis ক্যাশিং সাপোর্ট সহ)
- **Multi-Tenancy**: সাবডোমেন (`fashion.localhost:3000`), কাস্টম ডোমেন এবং ডাইনামিক টেন্যান্ট কনটেক্সট আইসোলেশন
- **Compliance**: বাংলাদেশ সরকারের ডিজিটাল কমার্স নির্দেশিকা ও ভোক্তা অধিকার সুরক্ষা আইন অনুবর্তী (৭২ ঘণ্টার অনলাইন ডিসপুট রেজোলিউশন ও বাংলা পলিসিসমূহ)

---

## 📁 প্রজেক্ট আর্কিটেকচার (Folder Structure)

```
saas-ecommerce-v2/
├── backend/                       # Node.js + Express + Prisma API Engine
│   ├── prisma/
│   │   ├── schema.prisma          # PostgreSQL Multi-tenant স্কিমা
│   │   └── seed.ts                # প্রাক-নির্মিত ডেমো ডাটা (ফ্যাশন ও ক্লিনিক)
│   ├── src/
│   │   ├── config/                # Database (Prisma) ও Redis কনফিগারেশন
│   │   ├── middlewares/           # Tenant Identification ও Auth মিডলওয়্যার
│   │   ├── modules/
│   │   │   ├── tenants/           # টেন্যান্ট প্রোভিশনিং ও থিম API
│   │   │   ├── catalog/           # পণ্য ও ক্যাটাগরি ক্যাটালগ API
│   │   │   ├── bookings/          # ১-ঘণ্টা রিয়েলটাইম ক্যাপাসিটি স্লট ইঞ্জিন
│   │   │   ├── orders/            # চেকআউট, অর্ডার প্লেসমেন্ট ও ইনভয়েস API
│   │   │   ├── compliance/        # ৭২-ঘণ্টা অভিযোগ ও বাংলা পলিসি API
│   │   │   └── analytics/         # মার্চেন্ট অ্যানালিটিক্স ও দৈনিক শিট API
│   │   └── index.ts               # এক্সপ্রেস সার্ভার এন্ট্রি পয়েন্ট
│   └── package.json
│
├── frontend/                      # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (storefront)/      # মাল্টি-টেন্যান্ট স্টোরফ্রন্ট রুটসমূহ
│   │   │   │   ├── page.tsx       # থিমভিত্তিক ডায়নামিক হোমপেজ
│   │   │   │   ├── booking/       # ১-ঘণ্টা ডাক্তার/সার্ভিস শিডিউল সিলেক্টর
│   │   │   │   ├── checkout/      # হাই-কনভার্টিং ওয়ান-পেজ চেকআউট
│   │   │   │   ├── order-success/ # কনফার্মেশন ও প্রিন্টযোগ্য ইনভয়েস
│   │   │   │   ├── policies/      # শর্তাবলী, প্রাইভেসি ও রিফান্ড নীতি
│   │   │   │   └── disputes/      # ৭২-ঘণ্টার কাস্টমার কমপ্লেইন পোর্টাল
│   │   │   └── (admin)/
│   │   │       └── admin/dashboard # টেন্যান্ট ড্যাশবোর্ড ও দৈনিক সিরিয়াল শিট
│   │   ├── components/            # প্রিমিয়াম গ্লাস-প্যানেল নেভিগেশন ও ফুটার
│   │   └── lib/                   # API ক্লায়েন্ট ও কার্ট কনটেক্সট
│   └── package.json
└── README.md
```

---

## 🚀 কীভাবে চালু করবেন (Getting Started)

### ১. ব্যাকএন্ড চালু করা (Backend Setup)

```bash
cd backend

# ডিপেনডেন্সি ইনস্টল (যদি ইতিমধ্যে না হয়ে থাকে)
npm install

# Prisma ক্লায়েন্ট জেনারেট করা
npx prisma generate

# ডাটাবেস পুশ (PostgreSQL চালু থাকলে)
npm run prisma:push

# সার্ভার ডেভেলপমেন্ট মোডে রান করা
npm run dev
```
সার্ভার চালু হবে: `http://localhost:5000` এ।

### ২. ফ্রন্টএন্ড চালু করা (Frontend Setup)

```bash
cd frontend

# ডিপেনডেন্সি ইনস্টল (যদি ইতিমধ্যে না হয়ে থাকে)
npm install

# নেক্সট.জেএস রান করা
npm run dev
```
স্টোরফ্রন্ট চালু হবে: `http://localhost:3000` এ।

---

## 🌐 মাল্টি-টেন্যান্ট ডেমো পরীক্ষা করার নিয়ম

1. **ফ্যাশন ও বুটিক স্টোর**:
   - হোমপেজ: `http://localhost:3000/?tenant=fashion`
   - চেকআউট: `http://localhost:3000/checkout?tenant=fashion`
2. **ডেন্টাল ও হেলথ ক্লিনিক (১-ঘণ্টা স্লট বুকিং)**:
   - ক্লিনিক হোমপেজ: `http://localhost:3000/?tenant=medicare`
   - ডাক্তার সিরিয়াল পেজ: `http://localhost:3000/booking?tenant=medicare`
3. **মার্চেন্ট ড্যাশবোর্ড ও দৈনিক অ্যাপয়েন্টমেন্ট শিট**:
   - `http://localhost:3000/admin/dashboard?tenant=medicare`
4. **৭২-ঘণ্টার অভিযোগ দাখিল (ডিজিটাল কমার্স নির্দেশিকা)**:
   - `http://localhost:3000/disputes?tenant=fashion`
