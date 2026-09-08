'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Heart,
  Crown,
  Zap,
  ShieldCheck,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { subscriptionApi } from '@/lib/api-client';

interface SubscriptionData {
  tier: string;
  aiGradingsLimit: number;
  aiGradingsUsed: number;
  testAttemptsLimit: number;
  testAttemptsUsed: number;
}

export default function SubscriptionPage() {
  const [currentSub, setCurrentSub] = useState<SubscriptionData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'PRO_MONTHLY' | 'COUPLE_VIP_YEARLY'>('COUPLE_VIP_YEARLY');
  const [paymentMethod, setPaymentMethod] = useState<'VNPAY' | 'STRIPE' | 'MOMO'>('VNPAY');
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadSub() {
      try {
        const res = await subscriptionApi.getMySubscription();
        if (res.success && res.data) {
          setCurrentSub(res.data as unknown as SubscriptionData);
        }
      } catch (err) {
        console.error('Failed to load subscription info', err);
      } finally {
        // loading complete
      }
    }
    loadSub();
  }, []);

  const handleCheckout = async () => {
    setProcessing(true);
    setSuccessMsg(null);
    try {
      const res = await subscriptionApi.checkout({
        planId: selectedPlan,
        paymentMethod,
      });
      if (res.success && res.data) {
        setSuccessMsg(res.data.message);
        // Refresh sub info
        const updated = await subscriptionApi.getMySubscription();
        if (updated.success) setCurrentSub(updated.data as unknown as SubscriptionData);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi thanh toán');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
          <Crown className="w-4 h-4 text-brand-500" />
          Nâng Cấp Gói Học TOEIC Master VIP
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
          Chinh Phục 900+ TOEIC Cùng Người Thương 🌹
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          Mở khóa toàn bộ ngân hàng đề thi bản quyền ETS, không giới hạn lượt chấm Speaking & Writing AI, và đồng hành trong Couple Dashboard độc quyền!
        </p>
      </div>

      {/* Current Subscription Status Badge */}
      {currentSub && (
        <div className="p-4 rounded-2xl bg-white border border-pink-200 shadow-sm flex flex-wrap items-center justify-between gap-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              currentSub.tier === 'PREMIUM' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {currentSub.tier === 'PREMIUM' ? <Crown className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs text-gray-500">Gói hiện tại của bạn:</div>
              <div className="text-sm font-bold text-gray-800">
                {currentSub.tier === 'PREMIUM' ? '🌟 VIP PREMIUM ACTIVE' : '🌱 Gói Miễn Phí (Free)'}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-right">
            <div>Chấm AI còn lại: <strong>{currentSub.aiGradingsLimit - currentSub.aiGradingsUsed} lượt</strong></div>
            <div>Thi thử Full Test: <strong>{currentSub.testAttemptsLimit - currentSub.testAttemptsUsed} lượt</strong></div>
          </div>
        </div>
      )}

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* FREE PLAN */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
              Khởi Đầu
            </div>
            <h3 className="text-xl font-bold text-gray-800">Gói Miễn Phí</h3>
            <div className="text-3xl font-black text-gray-800">
              0đ <span className="text-xs font-normal text-gray-500">/ mãi mãi</span>
            </div>
            <ul className="space-y-2.5 text-xs text-gray-600 pt-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                Ôn 21 chủ đề Từ vựng cơ bản
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                Luyện Ngữ pháp & Bài tập ngắn
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                3 bài thi Mini Test 25 phút
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px] shrink-0">✕</span>
                Giới hạn 5 lượt chấm Speaking/Writing
              </li>
            </ul>
          </div>
          <button
            disabled
            className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-400 text-xs font-semibold cursor-not-allowed text-center"
          >
            Đang kích hoạt
          </button>
        </div>

        {/* PRO MONTHLY PLAN */}
        <div
          onClick={() => setSelectedPlan('PRO_MONTHLY')}
          className={`bg-white rounded-3xl p-6 md:p-8 border-2 shadow-sm flex flex-col justify-between space-y-6 cursor-pointer transition-all ${
            selectedPlan === 'PRO_MONTHLY'
              ? 'border-brand-500 ring-2 ring-brand-200 shadow-md'
              : 'border-pink-200 hover:border-brand-300'
          }`}
        >
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-semibold">
              Cá Nhân Pro
            </div>
            <h3 className="text-xl font-bold text-gray-800">Pro 1 Tháng</h3>
            <div className="text-3xl font-black text-brand-600">
              199.000đ <span className="text-xs font-normal text-gray-500">/ tháng</span>
            </div>
            <ul className="space-y-2.5 text-xs text-gray-600 pt-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-500 shrink-0" />
                Mở khóa tất cả 7 Part Listening & Reading
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-500 shrink-0" />
                Không giới hạn lượt chấm Speaking & Writing AI
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-500 shrink-0" />
                Full Test 200 câu giải thích chi tiết
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-500 shrink-0" />
                Sổ tay Mistake Notebook tự động
              </li>
            </ul>
          </div>
          <button
            type="button"
            className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${
              selectedPlan === 'PRO_MONTHLY'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-200'
                : 'bg-pink-50 text-brand-600 hover:bg-pink-100'
            }`}
          >
            {selectedPlan === 'PRO_MONTHLY' ? 'Đang chọn gói này' : 'Chọn gói Pro'}
          </button>
        </div>

        {/* COUPLE VIP YEARLY PLAN (BEST VALUE) */}
        <div
          onClick={() => setSelectedPlan('COUPLE_VIP_YEARLY')}
          className={`bg-gradient-to-b from-white via-pink-50/40 to-indigo-50/40 rounded-3xl p-6 md:p-8 border-2 shadow-lg flex flex-col justify-between space-y-6 cursor-pointer relative transition-all ${
            selectedPlan === 'COUPLE_VIP_YEARLY'
              ? 'border-brand-500 ring-4 ring-pink-200'
              : 'border-brand-300 hover:border-brand-500'
          }`}
        >
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white text-[11px] font-bold shadow-md flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-current" /> Gói Khuyên Dùng Cho 2 Bạn
          </span>

          <div className="space-y-4 pt-1">
            <div className="inline-block px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-xs font-semibold">
              Tặng 2 Tài Khoản VIP
            </div>
            <h3 className="text-xl font-bold text-gray-800">Couple VIP 1 Năm</h3>
            <div>
              <div className="text-3xl font-black text-brand-600">
                1.499.000đ <span className="text-xs font-normal text-gray-500">/ năm</span>
              </div>
              <span className="text-[11px] text-accent-600 font-semibold">
                Chỉ ~62.000đ/tháng cho mỗi người!
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-gray-700 pt-2">
              <li className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-brand-500 shrink-0" />
                Kích hoạt trọn vẹn quyền lợi VIP cho cả 2 bạn
              </li>
              <li className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-accent-500 shrink-0" />
                Couple Dashboard độc quyền Rose + Indigo
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-500 shrink-0" />
                Mục tiêu chung, chuỗi chung Streak & 7-Day Tick
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-500 shrink-0" />
                Không giới hạn chấm AI Speaking & Writing
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-500 shrink-0" />
                Hỗ trợ ưu tiên 24/7 từ Tech Lead
              </li>
            </ul>
          </div>

          <button
            type="button"
            className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
              selectedPlan === 'COUPLE_VIP_YEARLY'
                ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-200'
                : 'bg-white border border-pink-200 text-brand-600'
            }`}
          >
            {selectedPlan === 'COUPLE_VIP_YEARLY' ? 'Đang chọn gói Couple' : 'Chọn gói Couple'}
          </button>
        </div>
      </div>

      {/* Payment Selection & Checkout Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-pink-200 shadow-sm max-w-2xl mx-auto space-y-6">
        <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-brand-500" />
          Phương Thức Thanh Toán
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'VNPAY', label: 'Cổng VNPAY (QR/ATM)', icon: '🏦' },
            { id: 'MOMO', label: 'Ví MoMo', icon: '📱' },
            { id: 'STRIPE', label: 'Visa / Mastercard', icon: '💳' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setPaymentMethod(m.id as 'VNPAY' | 'STRIPE' | 'MOMO')}
              className={`p-3 rounded-2xl border text-center transition-all ${
                paymentMethod === m.id
                  ? 'border-brand-500 bg-brand-50 text-brand-700 font-semibold'
                  : 'border-gray-200 text-gray-600 hover:bg-pink-50/50'
              }`}
            >
              <div className="text-xl mb-1">{m.icon}</div>
              <div className="text-xs">{m.label}</div>
            </button>
          ))}
        </div>

        {/* Success Alert */}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        <button
          onClick={handleCheckout}
          disabled={processing}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-rose-600 hover:from-brand-600 hover:to-rose-700 text-white font-bold text-sm shadow-lg shadow-brand-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {processing ? 'Đang kích hoạt gói...' : 'Kích hoạt VIP Premium (Demo — Miễn phí)'}
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] text-amber-700 text-center font-medium bg-amber-50/90 py-2.5 px-3.5 rounded-xl border border-amber-200">
          💡 Đang ở chế độ demo, chưa kết nối cổng thanh toán thật — nâng cấp miễn phí để trải nghiệm tính năng Premium.
        </p>
      </div>
    </div>
  );
}
