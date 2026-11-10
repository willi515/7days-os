'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  Lock,
  Unlock,
  UserCheck,
  CheckCircle2,
  Globe,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { SuperAdminLayout } from '@/components/ui/SuperAdminLayout';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CompanyTenant {
  id: string;
  name: string;
  subdomain: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  monthlyFee: number;
  repsCount: number;
  ordersCount: number;
  totalVolume: number;
  status: 'active' | 'trial' | 'suspended';
  adminPhone: string;
}

export default function SuperAdminTenantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newSubdomain, setNewSubdomain] = useState('');
  const [newPlan, setNewPlan] = useState<'Starter' | 'Pro' | 'Enterprise'>('Pro');

  const [tenants, setTenants] = useState<CompanyTenant[]>([
    {
      id: 't-1',
      name: 'شركة الأمل للتوزيع والتوريدات',
      subdomain: 'elamal.7daysos.com',
      plan: 'Pro',
      monthlyFee: 4500,
      repsCount: 12,
      ordersCount: 840,
      totalVolume: 680000,
      status: 'active',
      adminPhone: '01012345678',
    },
    {
      id: 't-2',
      name: 'شركة رويال كوزمتكس ومعدات الصالونات',
      subdomain: 'royal.7daysos.com',
      plan: 'Pro',
      monthlyFee: 4500,
      repsCount: 15,
      ordersCount: 1120,
      totalVolume: 940000,
      status: 'active',
      adminPhone: '01223344556',
    },
    {
      id: 't-3',
      name: 'مؤسسة كليوباترا فارما الدولية',
      subdomain: 'cleo.7daysos.com',
      plan: 'Enterprise',
      monthlyFee: 9500,
      repsCount: 30,
      ordersCount: 2450,
      totalVolume: 2100000,
      status: 'active',
      adminPhone: '01122334455',
    },
    {
      id: 't-4',
      name: 'شركة الأندلس لمستحضرات التجميل',
      subdomain: 'alandalus.7daysos.com',
      plan: 'Pro',
      monthlyFee: 4500,
      repsCount: 8,
      ordersCount: 340,
      totalVolume: 280000,
      status: 'suspended',
      adminPhone: '01511223344',
    },
  ]);

  const toggleTenantStatus = (id: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'active' ? 'suspended' : 'active';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    setTenants((prev) => [
      {
        id: `t-${Date.now()}`,
        name: newCompanyName,
        subdomain: `${newSubdomain.toLowerCase() || 'company'}.7daysos.com`,
        plan: newPlan,
        monthlyFee: newPlan === 'Starter' ? 1500 : newPlan === 'Pro' ? 4500 : 9500,
        repsCount: 3,
        ordersCount: 0,
        totalVolume: 0,
        status: 'active',
        adminPhone: '01000000000',
      },
      ...prev,
    ]);

    setShowAddModal(false);
    setNewCompanyName('');
    setNewSubdomain('');
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.includes(searchQuery) ||
      t.subdomain.includes(searchQuery) ||
      t.adminPhone.includes(searchQuery)
  );

  return (
    <SuperAdminLayout
      title="إدارة المشتركين والشركات (Tenants Management)"
      subtitle="التحكم الكامل في حسابات الشركات، باقات الاشتراك، والدخول المباشر كمدير شركة"
      actions={
        <Button
          variant="gold"
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => setShowAddModal(true)}
          className="text-xs w-auto px-4 font-black"
        >
          إضافة شركة توزيع جديدة 🏢
        </Button>
      }
    >
      {/* 1. نافذة إضافة شركة جديدة */}
      {showAddModal && (
        <div className="bg-slate-900 p-5 rounded-2xl border-2 border-brand-gold shadow-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="font-black text-white text-sm flex items-center gap-2">
              <Sparkles size={18} className="text-brand-gold" />
              <span>تهيئة واشتراك شركة جديدة في المنظومة (New Tenant)</span>
            </h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              إلغاء
            </button>
          </div>

          <form onSubmit={handleCreateTenant} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="اسم الشركة التجاري:"
                placeholder="مثلاً: شركة النور لتوزيع مستحضرات التجميل"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                className="bg-slate-800 text-white border-slate-700"
                required
              />

              <Input
                label="النطاق الفرعي المخصص (Subdomain):"
                placeholder="alnoor (سيكون: alnoor.7daysos.com)"
                value={newSubdomain}
                onChange={(e) => setNewSubdomain(e.target.value)}
                dir="ltr"
                className="bg-slate-800 text-white border-slate-700 font-mono text-left"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                باقة الاشتراك المعتمدة:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setNewPlan('Starter')}
                  className={`p-3 rounded-xl border transition-colors ${
                    newPlan === 'Starter'
                      ? 'border-brand-gold bg-brand-gold/20 text-brand-gold font-black'
                      : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}
                >
                  Starter (1,500 ج.م/ش)
                </button>
                <button
                  type="button"
                  onClick={() => setNewPlan('Pro')}
                  className={`p-3 rounded-xl border transition-colors ${
                    newPlan === 'Pro'
                      ? 'border-brand-gold bg-brand-gold/20 text-brand-gold font-black'
                      : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}
                >
                  Pro (4,500 ج.م/ش) ⭐
                </button>
                <button
                  type="button"
                  onClick={() => setNewPlan('Enterprise')}
                  className={`p-3 rounded-xl border transition-colors ${
                    newPlan === 'Enterprise'
                      ? 'border-brand-gold bg-brand-gold/20 text-brand-gold font-black'
                      : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}
                >
                  Enterprise (9,500 ج.م/ش)
                </button>
              </div>
            </div>

            <Button type="submit" variant="gold" size="md" className="font-black">
              تفعيل حساب الشركة وتوليد قاعدة البيانات المعزولة (RLS) 🚀
            </Button>
          </form>
        </div>
      )}

      {/* 2. شريط البحث والتصفية */}
      <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="ابحث باسم الشركة، النطاق Subdomain، أو هاتف المدير..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 text-white rounded-xl pr-10 pl-4 py-2.5 text-xs font-bold border border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-gold min-h-[44px]"
          />
        </div>
      </div>

      {/* 3. جدول الشركات المشتركة مع ميزة Impersonation والتعليق */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-black border-b border-slate-800">
              <tr>
                <th className="p-4">اسم الشركة والنطاق</th>
                <th className="p-4">الباقة والقيمة</th>
                <th className="p-4">المناديب المسجلين</th>
                <th className="p-4">حجم الفواتير</th>
                <th className="p-4">حالة الحساب</th>
                <th className="p-4 text-center">أدوات التحكم والـ Impersonation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-semibold text-slate-200">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4">
                    <strong className="block text-white text-sm font-black">
                      {tenant.name}
                    </strong>
                    <span className="font-mono text-brand-gold text-[11px] block mt-0.5">
                      {tenant.subdomain}
                    </span>
                    <span className="text-slate-400 text-[10px] block mt-0.5">
                      هاتف الإدارة: {tenant.adminPhone}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="inline-block bg-slate-800 text-slate-200 text-xs font-black px-2.5 py-1 rounded-md border border-slate-700">
                      {tenant.plan}
                    </span>
                    <span className="block font-mono text-xs text-brand-gold font-bold mt-1">
                      {tenant.monthlyFee.toLocaleString('ar-EG')} ج.م/شهرياً
                    </span>
                  </td>

                  <td className="p-4 font-mono font-bold text-slate-300">
                    {tenant.repsCount} مندوب مبيعات
                  </td>

                  <td className="p-4">
                    <MoneyDisplay amount={tenant.totalVolume} size="sm" className="text-white" />
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                      {tenant.ordersCount} طلبية منفذة
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                        tenant.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {tenant.status === 'active' ? 'نشط ويعمل ✅' : 'معلق بالسداد ⛔'}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* ميزة الدخول كمدير شركة (Impersonation) */}
                      <Link
                        href="/admin/dashboard"
                        className="px-3 py-1.5 rounded-xl bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-gold border border-brand-gold/40 text-xs font-black transition-colors flex items-center gap-1.5"
                        title="الدخول لحساب الشركة مباشرة دون طلب كلمة مرور"
                      >
                        <UserCheck size={14} />
                        <span>دخول كمدير (Login As)</span>
                      </Link>

                      {/* زر تخصيص الميزات */}
                      <Link
                        href="/super-admin/features"
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                        title="تخصيص ميزات الباقة"
                      >
                        <Sliders size={16} />
                      </Link>

                      {/* زر التعليق / التفعيل */}
                      <button
                        onClick={() => toggleTenantStatus(tenant.id)}
                        className={`p-2 rounded-xl transition-colors ${
                          tenant.status === 'active'
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        }`}
                        title={tenant.status === 'active' ? 'إيقاف مؤقت' : 'تفعيل الحساب'}
                      >
                        {tenant.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
