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
  RefreshCw,
  BookOpen,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Layers,
  GraduationCap,
  FileText,
} from 'lucide-react';
import { adminApi } from '@/lib/api-client';
import AdminGrammarTab from './components/AdminGrammarTab';
import AdminTestsTab from './components/AdminTestsTab';

interface AdminStats {
  totalUsers: number;
  activeToday: number;
  totalTestAttempts: number;
  premiumUsers: number;
  totalVocabTopics: number;
  revenueEstimatedVnd: number;
}

interface AdminVocabTopic {
  id: string;
  title: string;
  description?: string;
  targetBand: string;
  cardCount: number;
  cards: {
    id: string;
    word: string;
    phonetic?: string;
    wordType: string;
    definition: string;
    definitionEn?: string;
    example?: string;
    exampleVi?: string;
  }[];
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

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'USERS' | 'VOCAB' | 'GRAMMAR' | 'TESTS'>('USERS');

  // Vocabulary CMS State
  const [vocabTopics, setVocabTopics] = useState<AdminVocabTopic[]>([]);
  const [loadingVocab, setLoadingVocab] = useState(false);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  // New Topic form state
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [newTopicBand, setNewTopicBand] = useState('BAND_2');

  // New Card form state
  const [showAddCardTopicId, setShowAddCardTopicId] = useState<string | null>(null);
  const [newCardWord, setNewCardWord] = useState('');
  const [newCardPhonetic, setNewCardPhonetic] = useState('');
  const [newCardType, setNewCardType] = useState('NOUN');
  const [newCardDef, setNewCardDef] = useState('');
  const [newCardDefEn, setNewCardDefEn] = useState('');
  const [newCardExample, setNewCardExample] = useState('');
  const [newCardExampleVi, setNewCardExampleVi] = useState('');

  const loadVocab = useCallback(async () => {
    setLoadingVocab(true);
    try {
      const res = await adminApi.getVocabularyTopics();
      if (res.success && res.data) {
        setVocabTopics(res.data as AdminVocabTopic[]);
      }
    } catch (err) {
      console.error('Failed to load vocab topics', err);
    } finally {
      setLoadingVocab(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'VOCAB') {
      loadVocab();
    }
  }, [activeTab, loadVocab]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    try {
      await adminApi.createVocabularyTopic({
        title: newTopicTitle.trim(),
        description: newTopicDesc.trim() || undefined,
        targetBand: newTopicBand,
      });
      setActionMsg(`Đã tạo chủ đề "${newTopicTitle}" thành công! 🌸`);
      setNewTopicTitle('');
      setNewTopicDesc('');
      setShowAddTopic(false);
      loadVocab();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi tạo chủ đề');
    }
  };

  const handleCreateCard = async (e: React.FormEvent, topicId: string) => {
    e.preventDefault();
    if (!newCardWord.trim() || !newCardDef.trim()) return;
    try {
      await adminApi.createVocabularyCard(topicId, {
        word: newCardWord.trim(),
        phonetic: newCardPhonetic.trim() || undefined,
        wordType: newCardType,
        definition: newCardDef.trim(),
        definitionEn: newCardDefEn.trim() || undefined,
        example: newCardExample.trim() || undefined,
        exampleVi: newCardExampleVi.trim() || undefined,
      });
      setActionMsg(`Đã thêm từ "${newCardWord}" vào chủ đề! 🃏`);
      setNewCardWord('');
      setNewCardPhonetic('');
      setNewCardDef('');
      setNewCardDefEn('');
      setNewCardExample('');
      setNewCardExampleVi('');
      setShowAddCardTopicId(null);
      loadVocab();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi thêm từ vựng');
    }
  };

  const handleDeleteTopic = async (topicId: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa chủ đề "${title}" và toàn bộ thẻ từ bên trong?`)) return;
    try {
      await adminApi.deleteVocabularyTopic(topicId);
      setActionMsg(`Đã xóa chủ đề "${title}" thành công.`);
      loadVocab();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi xóa chủ đề');
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

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-pink-200 pb-3">
        <button
          onClick={() => setActiveTab('USERS')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'USERS'
              ? 'bg-brand-500 text-white shadow-md shadow-brand-200'
              : 'bg-white text-gray-600 hover:bg-pink-50 border border-pink-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Quản Lý Người Dùng ({totalUsers})
        </button>

        <button
          onClick={() => setActiveTab('VOCAB')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'VOCAB'
              ? 'bg-brand-500 text-white shadow-md shadow-brand-200'
              : 'bg-white text-gray-600 hover:bg-pink-50 border border-pink-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Quản Lý Từ Vựng (Vocabulary CMS)
        </button>

        <button
          onClick={() => setActiveTab('GRAMMAR')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'GRAMMAR'
              ? 'bg-brand-500 text-white shadow-md shadow-brand-200'
              : 'bg-white text-gray-600 hover:bg-pink-50 border border-pink-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Quản Lý Ngữ Pháp (Grammar CMS)
        </button>

        <button
          onClick={() => setActiveTab('TESTS')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'TESTS'
              ? 'bg-brand-500 text-white shadow-md shadow-brand-200'
              : 'bg-white text-gray-600 hover:bg-pink-50 border border-pink-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Quản Lý Đề Thi (Tests CMS)
        </button>
      </div>

      {activeTab === 'USERS' ? (
        /* Users Table Card */
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
      ) : (
        /* Vocabulary CMS Card */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-pink-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-500" />
                Kho Chủ Đề Từ Vựng Hệ Thống ({vocabTopics.length})
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Tạo và quản lý danh mục từ vựng, flashcard 3D và các chủ đề học cho học viên.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={loadVocab}
                className="p-2.5 rounded-xl border border-pink-200 text-brand-600 hover:bg-pink-50 transition-colors"
                title="Tải lại danh sách"
              >
                <RefreshCw className={`w-4 h-4 ${loadingVocab ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowAddTopic(!showAddTopic)}
                className="px-4 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-200 transition-all"
              >
                <Plus className="w-4 h-4" />
                {showAddTopic ? 'Đóng Form' : 'Tạo Chủ Đề Mới'}
              </button>
            </div>
          </div>

          {/* Add Topic Form */}
          {showAddTopic && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleCreateTopic}
              className="bg-white rounded-3xl p-6 border-2 border-brand-200 shadow-md space-y-4"
            >
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-500" />
                Thêm Chủ Đề Từ Vựng Mới
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1 md:col-span-2">
                  <label className="font-semibold text-gray-700">Tên chủ đề (Tiếng Anh / Tiếng Việt) *</label>
                  <input
                    type="text"
                    required
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    placeholder="Ví dụ: Office Supplies & Equipment"
                    className="w-full p-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">Mục tiêu Band</label>
                  <select
                    value={newTopicBand}
                    onChange={(e) => setNewTopicBand(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                  >
                    <option value="BAND_1">Band 1 (0-250)</option>
                    <option value="BAND_2">Band 2 (255-400)</option>
                    <option value="BAND_3">Band 3 (405-600)</option>
                    <option value="BAND_4">Band 4 (605-750)</option>
                    <option value="BAND_5">Band 5 (755-900)</option>
                    <option value="BAND_6">Band 6 (905-990)</option>
                  </select>
                </div>
                <div className="space-y-1 md:col-span-3">
                  <label className="font-semibold text-gray-700">Mô tả chủ đề</label>
                  <input
                    type="text"
                    value={newTopicDesc}
                    onChange={(e) => setNewTopicDesc(e.target.value)}
                    placeholder="Mô tả tóm tắt nội dung chủ đề từ vựng..."
                    className="w-full p-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTopic(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm"
                >
                  Lưu Chủ Đề
                </button>
              </div>
            </motion.form>
          )}

          {/* Topics List */}
          {loadingVocab ? (
            <div className="p-12 text-center text-xs text-gray-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-400" />
              Đang tải danh sách chủ đề...
            </div>
          ) : vocabTopics.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border border-pink-200 text-center text-xs text-gray-400">
              Chưa có chủ đề từ vựng nào. Bấm &ldquo;Tạo Chủ Đề Mới&rdquo; ở trên để bắt đầu!
            </div>
          ) : (
            <div className="space-y-4">
              {vocabTopics.map((topic) => {
                const isExpanded = expandedTopicId === topic.id;
                const isAddingCard = showAddCardTopicId === topic.id;
                return (
                  <div
                    key={topic.id}
                    className="bg-white rounded-3xl border border-pink-200 shadow-sm p-5 space-y-4 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-bold text-gray-800 text-base">{topic.title}</h4>
                          <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-bold border border-brand-200">
                            {topic.targetBand}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-pink-50 text-rose-600 text-[10px] font-semibold">
                            {topic.cards?.length ?? topic.cardCount ?? 0} thẻ từ
                          </span>
                        </div>
                        {topic.description && (
                          <p className="text-xs text-gray-500 mt-1">{topic.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setShowAddCardTopicId(isAddingCard ? null : topic.id)}
                          className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-brand-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {isAddingCard ? 'Đóng Thêm Từ' : 'Thêm Từ'}
                        </button>
                        <button
                          onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                          className="px-3 py-1.5 rounded-xl border border-pink-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          {isExpanded ? 'Thu Gọn' : `Xem Thẻ (${topic.cards?.length || 0})`}
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(topic.id, topic.title)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Xóa chủ đề"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Add Card Form inside topic */}
                    {isAddingCard && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        onSubmit={(e) => handleCreateCard(e, topic.id)}
                        className="p-4 bg-pink-50/50 rounded-2xl border border-pink-200 space-y-3"
                      >
                        <h5 className="font-bold text-xs text-gray-700 flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5 text-brand-500" />
                          Thêm từ vựng mới vào chủ đề &ldquo;{topic.title}&rdquo;
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div className="space-y-1">
                            <label className="font-semibold text-gray-600">Từ vựng (Word) *</label>
                            <input
                              type="text"
                              required
                              value={newCardWord}
                              onChange={(e) => setNewCardWord(e.target.value)}
                              placeholder="e.g. stationery"
                              className="w-full p-2 rounded-xl border border-pink-200 focus:outline-none bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-semibold text-gray-600">Phiên âm (Phonetic)</label>
                            <input
                              type="text"
                              value={newCardPhonetic}
                              onChange={(e) => setNewCardPhonetic(e.target.value)}
                              placeholder="e.g. /ˈsteɪʃənri/"
                              className="w-full p-2 rounded-xl border border-pink-200 focus:outline-none bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-semibold text-gray-600">Từ loại</label>
                            <select
                              value={newCardType}
                              onChange={(e) => setNewCardType(e.target.value)}
                              className="w-full p-2 rounded-xl border border-pink-200 focus:outline-none bg-white"
                            >
                              <option value="NOUN">Danh từ (Noun)</option>
                              <option value="VERB">Động từ (Verb)</option>
                              <option value="ADJECTIVE">Tính từ (Adjective)</option>
                              <option value="ADVERB">Trạng từ (Adverb)</option>
                              <option value="PHRASE">Cụm từ (Phrase)</option>
                              <option value="OTHER">Khác (Other)</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="font-semibold text-gray-600">Nghĩa tiếng Việt *</label>
                            <input
                              type="text"
                              required
                              value={newCardDef}
                              onChange={(e) => setNewCardDef(e.target.value)}
                              placeholder="e.g. văn phòng phẩm"
                              className="w-full p-2 rounded-xl border border-pink-200 focus:outline-none bg-white"
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="font-semibold text-gray-600">Nghĩa tiếng Anh</label>
                            <input
                              type="text"
                              value={newCardDefEn}
                              onChange={(e) => setNewCardDefEn(e.target.value)}
                              placeholder="e.g. writing materials and office supplies"
                              className="w-full p-2 rounded-xl border border-pink-200 focus:outline-none bg-white"
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="font-semibold text-gray-600">Câu ví dụ (Example)</label>
                            <input
                              type="text"
                              value={newCardExample}
                              onChange={(e) => setNewCardExample(e.target.value)}
                              placeholder="e.g. We need to order more stationery."
                              className="w-full p-2 rounded-xl border border-pink-200 focus:outline-none bg-white"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowAddCardTopicId(null)}
                            className="px-3 py-1.5 rounded-xl text-xs text-gray-500 hover:bg-gray-100"
                          >
                            Hủy
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-xs hover:bg-brand-600"
                          >
                            Lưu Thẻ
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* Cards preview table when expanded */}
                    {isExpanded && (
                      <div className="border-t border-pink-100 pt-3">
                        {topic.cards && topic.cards.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-pink-100 text-gray-400 font-semibold bg-pink-50/20">
                                  <th className="p-2">Từ vựng</th>
                                  <th className="p-2">Phiên âm</th>
                                  <th className="p-2">Loại từ</th>
                                  <th className="p-2">Định nghĩa</th>
                                  <th className="p-2">Ví dụ</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-pink-50">
                                {topic.cards.map((card) => (
                                  <tr key={card.id} className="hover:bg-pink-50/20">
                                    <td className="p-2 font-bold text-gray-800">{card.word}</td>
                                    <td className="p-2 font-mono text-gray-500 text-[11px]">{card.phonetic || '—'}</td>
                                    <td className="p-2">
                                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-semibold">
                                        {card.wordType}
                                      </span>
                                    </td>
                                    <td className="p-2 text-gray-700 font-medium">{card.definition}</td>
                                    <td className="p-2 text-gray-500 italic text-[11px]">{card.example || '—'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 py-3 text-center">Chủ đề này chưa có thẻ từ nào. Hãy bấm &ldquo;Thêm Từ&rdquo; ở trên!</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: GRAMMAR CMS ──────────────────────────────────── */}
      {activeTab === 'GRAMMAR' && (
        <AdminGrammarTab setActionMsg={setActionMsg} />
      )}

      {/* ── TAB 4: TESTS CMS ────────────────────────────────────── */}
      {activeTab === 'TESTS' && (
        <AdminTestsTab setActionMsg={setActionMsg} />
      )}
    </div>
  );
}
