'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Users,
  Activity,
  DollarSign,
  Crown,
  Search,
  RefreshCw
} from 'lucide-react';
import { adminApi } from '@/lib/api-client';

interface AdminStats {
  totalUsers: number;
  activeToday: number;
  totalTestAttempts: number;
  premiumUsers: number;
  totalVocabTopics: number;
  revenueEstimatedVnd: number;
}

interface UserItem {
  id: string;
  email: string;
  username: string;
  role: 'ADMIN' | 'CONTENT_EDITOR' | 'USER';
  isActive: boolean;
  displayName: string;
  avatarUrl?: string;
  streak: number;
  totalXp: number;
  targetScore: number;
  subscriptionTier: 'FREE' | 'PREMIUM';
  subscriptionEnd?: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- pagination reserved for future
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- loading shown via RefreshCw spinner in button
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers({ page, limit: 15, search }),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
      if (usersRes.success && usersRes.data) {
        setUsers(usersRes.data.users);
        setTotalUsers(usersRes.data.total);
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, loadData]);

  const handleToggleRole = async (user: UserItem) => {
    const nextRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await adminApi.updateUserRole(user.id, nextRole);
      setActionMsg(`Đã cập nhật role của ${user.displayName} thành ${nextRole}`);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi cập nhật role');
    }
  };

  const handleToggleStatus = async (user: UserItem) => {
    try {
      await adminApi.updateUserStatus(user.id, !user.isActive);
      setActionMsg(`Đã ${user.isActive ? 'khóa' : 'mở khóa'} tài khoản ${user.displayName}`);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi cập nhật trạng thái');
    }
  };

  const handleGrantVIP = async (userId: string, months: number = 1) => {
    try {
      await adminApi.grantPremium(userId, months);
      setActionMsg(`Đã cấp thành công ${months} tháng VIP Premium! 🌟`);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi cấp VIP');
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-50 via-white to-accent-50 p-6 md:p-8 rounded-3xl border border-pink-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Hệ Thống Quản Trị Trung Tâm (CMS)
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Admin Management Console 🛠️
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Theo dõi KPIs thời gian thực, quản lý phân quyền người dùng và cấp phát gói cước VIP!
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 rounded-2xl bg-white hover:bg-pink-50 border border-pink-200 text-brand-600 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Làm mới dữ liệu
        </button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
              <span>Tổng Học Viên</span>
              <Users className="w-4 h-4 text-brand-500" />
            </div>
            <div className="text-2xl font-black text-gray-800 font-mono">
              {stats.totalUsers}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium">
              +{stats.activeToday} hoạt động hôm nay
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
              <span>Lượt Thi Thử</span>
              <Activity className="w-4 h-4 text-accent-500" />
            </div>
            <div className="text-2xl font-black text-gray-800 font-mono">
              {stats.totalTestAttempts}
            </div>
            <div className="text-[11px] text-accent-600 font-medium">
              Mini-test & Full-test
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
              <span>Thành Viên VIP</span>
              <Crown className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 font-mono">
              {stats.premiumUsers}
            </div>
            <div className="text-[11px] text-gray-500">
              Gói Pro & Couple VIP
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-pink-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
              <span>Doanh Thu Ước Tính</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 font-mono">
              {stats.revenueEstimatedVnd.toLocaleString('vi-VN')}đ
            </div>
            <div className="text-[11px] text-gray-500">
              VNPAY & Thẻ quốc tế
            </div>
          </div>
        </div>
      )}

      {/* Action Notification Toast */}
      {actionMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-brand-50 border border-brand-200 rounded-2xl text-xs font-semibold text-brand-700 flex items-center justify-between"
        >
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg(null)} className="text-brand-500 font-bold ml-2">✕</button>
        </motion.div>
      )}

      {/* Users Table Card */}
      <div className="bg-white rounded-3xl p-6 border border-pink-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-500" />
            Danh Sách Người Dùng ({totalUsers})
          </h2>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo email, username..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600 border-collapse">
            <thead>
              <tr className="border-b border-pink-100 text-gray-400 font-semibold bg-pink-50/40">
                <th className="p-3 rounded-l-xl">Học Viên</th>
                <th className="p-3">Email</th>
                <th className="p-3">Quyền hạn</th>
                <th className="p-3">Gói cước</th>
                <th className="p-3">Tiến độ</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3 rounded-r-xl text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-pink-50/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-bold flex items-center justify-center text-xs">
                        {u.displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{u.displayName}</div>
                        <div className="text-[10px] text-gray-400">@{u.username}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 font-mono text-gray-600">{u.email}</td>

                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                      u.role === 'ADMIN' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] flex items-center gap-1 w-fit ${
                      u.subscriptionTier === 'PREMIUM'
                        ? 'bg-amber-100 text-amber-700 font-bold'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {u.subscriptionTier === 'PREMIUM' && <Crown className="w-3 h-3" />}
                      {u.subscriptionTier}
                    </span>
                  </td>

                  <td className="p-3">
                    <div>🔥 {u.streak} ngày</div>
                    <div className="text-[10px] text-gray-400">{u.totalXp} XP • Mục tiêu: {u.targetScore}</div>
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      u.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {u.isActive ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>

                  <td className="p-3 text-right space-x-1.5">
                    <button
                      onClick={() => handleGrantVIP(u.id, 1)}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold text-[11px] transition-colors"
                      title="Cấp 1 tháng VIP"
                    >
                      + VIP 1M
                    </button>
                    <button
                      onClick={() => handleToggleRole(u)}
                      className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px] transition-colors"
                    >
                      {u.role === 'ADMIN' ? 'Hạ USER' : 'Nâng ADMIN'}
                    </button>
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`px-2 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
                        u.isActive ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {u.isActive ? 'Khóa' : 'Mở'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
