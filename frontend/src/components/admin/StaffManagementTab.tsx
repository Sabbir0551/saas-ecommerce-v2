'use client';

import React, { useState } from 'react';
import {
  Users,
  Shield,
  UserPlus,
  Lock,
  Eye,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Activity,
  KeyRound,
  ShieldCheck,
  Smartphone,
  Mail,
  Clock,
  Sparkles,
} from 'lucide-react';

interface StaffProps {
  tenantSlug: string;
  tenantInfo: any;
  isMedical?: boolean;
  isRealEstate?: boolean;
  isElectronics?: boolean;
}

export default function StaffManagementTab({
  tenantSlug,
  tenantInfo,
  isMedical,
  isRealEstate,
  isElectronics,
}: StaffProps) {
  const storeName = tenantInfo?.name || tenantSlug.toUpperCase();

  // Current staff members
  const [staffList, setStaffList] = useState([
    {
      id: 'st_1',
      name: 'Tanvir Ahmed',
      email: `tanvir@${tenantSlug}.com`,
      phone: '01819-887766',
      role: 'Store Owner',
      roleKey: 'owner',
      accessModules: ['Dashboard', 'Orders', 'Inventory', 'Finance', 'Settings', 'Staff'],
      status: 'Active',
      lastActive: 'Just now',
    },
    {
      id: 'st_2',
      name: isMedical ? 'Dr. Rafiqul Islam (FCPS)' : isRealEstate ? 'Mahmudul Hasan (Sales Lead)' : 'Kamrul Hasan',
      email: `staff2@${tenantSlug}.com`,
      phone: '01712-334455',
      role: isMedical ? 'Consultant Doctor' : isRealEstate ? 'Property Sales Executive' : 'POS Cashier & Sales',
      roleKey: 'sales',
      accessModules: ['POS Terminal', 'Orders', 'Invoices'],
      status: 'Active',
      lastActive: '20 mins ago',
    },
    {
      id: 'st_3',
      name: 'Nasir Uddin',
      email: `nasir@${tenantSlug}.com`,
      phone: '01914-556677',
      role: 'Warehouse & Inventory Manager',
      roleKey: 'inventory',
      accessModules: ['Inventory', 'Products', 'IMEI Tracking'],
      status: 'Active',
      lastActive: '2 hours ago',
    },
    {
      id: 'st_4',
      name: 'Farhana Chowdhury',
      email: `farhana@${tenantSlug}.com`,
      phone: '01611-998822',
      role: 'Courier & Dispatch Operator',
      roleKey: 'dispatch',
      accessModules: ['Steadfast Hub', 'Orders', 'Shipping Labels'],
      status: 'Active',
      lastActive: 'Yesterday',
    },
  ]);

  // New Staff Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('sales');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Simulated "View As" staff role
  const [activePreviewRole, setActivePreviewRole] = useState<string>('owner');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newStaff = {
      id: `st_${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone || '01700-000000',
      role:
        newRole === 'sales'
          ? 'POS Cashier & Sales'
          : newRole === 'inventory'
          ? 'Warehouse Manager'
          : 'Courier Operator',
      roleKey: newRole,
      accessModules: newRole === 'sales' ? ['POS Terminal', 'Orders'] : ['Inventory', 'Products'],
      status: 'Active',
      lastActive: 'Never',
    };

    setStaffList([...staffList, newStaff]);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setIsInviteModalOpen(false);
    setFeedbackMsg(`✅ নতুন স্টাফ মেম্বার ${newName} সফলভাবে যুক্ত হয়েছে!`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#11192E] to-blue-950/80 border border-blue-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40">
                Update 11 • Enterprise Security & RBAC
              </span>
              <span className="flex items-center gap-1 text-[11px] text-amber-300 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> Role-Based Access Control
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              মার্চেন্ট টিম ও রোল-বেসড স্টাফ ম্যানেজমেন্ট
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              ক্যাশিয়ার, ইনভেন্টরি ম্যানেজার বা ডাক্তারের জন্য আলাদা রোল ও পারমিশন নির্ধারণ এবং সংবেদনশীল প্রফিট মার্জিন সুরক্ষিত রাখা।
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-900/30 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>নতুন স্টাফ যুক্ত করুন</span>
            </button>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-blue-950/80 border border-blue-500/50 rounded-xl text-xs text-blue-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Role Simulator Selector */}
      <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-300">
            মার্চেন্ট ভিউ সিমুলেটর (কোন স্টাফ কী দেখতে পাবে তা পরীক্ষা করুন):
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {['owner', 'sales', 'inventory', 'dispatch'].map((rk) => (
            <button
              key={rk}
              onClick={() => setActivePreviewRole(rk)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition cursor-pointer ${
                activePreviewRole === rk
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-[#12192C] text-slate-400 hover:text-white'
              }`}
            >
              {rk}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Members Table */}
      <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>সক্রিয় টিম মেম্বার ও পারমিশন ম্যাট্রিক্স</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">{staffList.length} Staff Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400 bg-[#0E1528]">
                <th className="py-3 px-3">নাম ও যোগাযোগ</th>
                <th className="py-3 px-3">নির্ধারিত রোল</th>
                <th className="py-3 px-3">অনুমোদিত মডিউলসমূহ</th>
                <th className="py-3 px-3">স্ট্যাটাস</th>
                <th className="py-3 px-3">সর্বশেষ সক্রিয়</th>
                <th className="py-3 px-3 text-right">ম্যানেজ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {staffList.map((st) => (
                <tr key={st.id} className="hover:bg-[#11172A] transition">
                  <td className="py-3 px-3 font-sans">
                    <p className="text-white font-bold text-xs">{st.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{st.email} • {st.phone}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                      <Shield className="w-3 h-3 text-blue-400" /> {st.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1 font-sans">
                      {st.accessModules.map((mod, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-[#131B31] text-[10px] text-slate-300 border border-slate-700/60">
                          {mod}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> {st.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-sans">{st.lastActive}</td>
                  <td className="py-3 px-3 text-right font-sans">
                    <button className="px-2.5 py-1 rounded bg-[#131B31] border border-slate-700 hover:border-slate-500 text-slate-300 text-[11px] cursor-pointer">
                      এডিট রোল
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Security & Audit Trail */}
      <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>সিকিউরিটি অডিট ট্রেইল (Recent Staff Actions)</span>
        </h3>
        <div className="space-y-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-[#11172A] border border-slate-800 flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span><strong>Tanvir Ahmed</strong> modified product price for SKU-8012</span>
            </span>
            <span className="text-slate-500">12 mins ago</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#11172A] border border-slate-800 flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span><strong>Kamrul Hasan</strong> generated 80mm POS Receipt #POS-88412</span>
            </span>
            <span className="text-slate-500">38 mins ago</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#11172A] border border-slate-800 flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span><strong>Farhana Chowdhury</strong> booked consignment ST-889104 to Steadfast</span>
            </span>
            <span className="text-slate-500">1 hour ago</span>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B101E] border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-400" />
                <span>নতুন টিম মেম্বার যুক্ত করুন</span>
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">স্টাফের পূর্ণ নাম</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেমন: মোঃ সাকিব হাসান"
                  className="w-full bg-[#11172A] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">অফিসিয়াল ইমেইল</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder={`shakib@${tenantSlug}.com`}
                  className="w-full bg-[#11172A] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">মোবাইল নম্বর</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full bg-[#11172A] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">নির্ধারিত ভূমিকা (Role)</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-[#11172A] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="sales">POS Cashier & Counter Sales (ক্যাশিয়ার)</option>
                  <option value="inventory">Warehouse & Inventory Manager (ইনভেন্টরি)</option>
                  <option value="dispatch">Courier & Dispatch Operator (কুরিয়ার)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  ইনভাইটেশন লিংক তৈরি করুন
                </button>
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
