'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronRight,
  AlertOctagon,
  Search,
  Plus,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { vocabularyApi, ApiResult } from '@/lib/api-client';

interface TopicItem {
  id: string;
  title: string;
  description: string;
  targetBand: string;
  cardCount: number;
  learnedCount: number;
  progressPercent: number;
}

interface NotebookItem {
  id: string;
  title: string;
  description: string;
  cardCount: number;
  isMistakeNotebook: boolean;
}


export default function VocabularyHubPage() {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [notebooks, setNotebooks] = useState<NotebookItem[]>([]);
  const [dueCardsCount, setDueCardsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'topics' | 'notebooks'>('topics');
  const [isLoading, setIsLoading] = useState(true);

  // New notebook modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const [topicsRes, dueRes, nbRes] = await Promise.all([
      vocabularyApi.getTopics() as Promise<ApiResult<TopicItem[]>>,
      vocabularyApi.getDueCards() as Promise<ApiResult<unknown[]>>,
      vocabularyApi.getNotebooks() as Promise<ApiResult<NotebookItem[]>>,
    ]);

    if (topicsRes.success) setTopics(topicsRes.data);
    if (dueRes.success) setDueCardsCount(dueRes.data.length);
    if (nbRes.success) setNotebooks(nbRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateNotebook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    const res = await vocabularyApi.createNotebook(newTitle, newDesc);
    if (res.success) {
      setShowNewModal(false);
      setNewTitle('');
      setNewDesc('');
      fetchData();
    }
    setIsCreating(false);
  };

  const filteredTopics = topics.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const mistakeNotebook = notebooks.find((n) => n.isMistakeNotebook);

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-rose-400 animate-spin" />
        <p className="text-sm font-semibold text-[#3F3355]">Đang chuẩn bị kho từ vựng TOEIC... 🌸</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Due banner */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-pink-200/80 shadow-xs relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-500 text-xs font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Kho từ vựng 20+ chủ đề cốt lõi & Spaced Repetition (SM-2)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#3F3355] tracking-tight">
              Luyện từ vựng thông minh 🌸
            </h1>
            <p className="text-xs sm:text-sm text-[#8B7E9C] mt-1 max-w-xl font-medium">
              Ôn luyện theo thuật toán ngắt quãng SM-2 giúp chuyển từ vựng vào trí nhớ dài hạn. Mọi từ làm sai sẽ được tự động lưu vào Mistake Notebook.
            </p>
          </div>

          {/* Quick Review Due CTA */}
          <div className="w-full md:w-auto p-4 rounded-2xl bg-white/90 border border-pink-200 flex items-center justify-between gap-6 shadow-xs">
            <div>
              <div className="text-xs font-bold text-[#8B7E9C]">Cần ôn hôm nay</div>
              <div className="text-2xl font-black text-rose-500">
                {dueCardsCount} <span className="text-xs font-semibold text-[#8B7E9C]">thẻ đến hạn</span>
              </div>
            </div>
            {dueCardsCount > 0 ? (
              <Link
                href={topics[0] ? `/vocabulary/${topics[0].id}?due=true` : '#'}
                className="btn-primary text-xs px-4 py-2.5 whitespace-nowrap"
              >
                Ôn ngay
              </Link>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Đã hoàn thành
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mistake Notebook Quick Alert Card */}
      {mistakeNotebook && mistakeNotebook.cardCount > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center font-bold">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#3F3355]">
                Sổ tay câu sai (Mistake Notebook): {mistakeNotebook.cardCount} từ
              </div>
              <div className="text-xs text-[#8B7E9C] font-medium">
                Tự động ghi nhận từ các câu bạn đã trả lời chưa chính xác để ôn tập lại.
              </div>
            </div>
          </div>
          <Link
            href={`/vocabulary/${mistakeNotebook.id}`}
            className="btn-primary text-xs px-4 py-2 whitespace-nowrap"
          >
            Ôn các từ sai
          </Link>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tab switchers */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/80 border border-pink-200 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('topics')}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'topics'
                ? 'bg-rose-400 text-white shadow-xs'
                : 'text-[#8B7E9C] hover:text-[#3F3355]'
            }`}
          >
            Chủ đề học ({topics.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notebooks')}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'notebooks'
                ? 'bg-rose-400 text-white shadow-xs'
                : 'text-[#8B7E9C] hover:text-[#3F3355]'
            }`}
          >
            Sổ tay của bạn ({notebooks.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7E9C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm chủ đề từ vựng..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-pink-200 bg-white/90 text-[#3F3355] placeholder:text-[#8B7E9C]/60 text-xs sm:text-sm focus:border-rose-400 outline-none font-medium"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'topics' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/vocabulary/${topic.id}`}
              className="glass rounded-3xl p-5 border border-pink-200/80 shadow-xs hover:border-rose-300 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-pink-50 text-rose-500 border border-pink-200">
                    {topic.targetBand.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-[#8B7E9C] font-semibold">
                    {topic.cardCount} từ
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-[#3F3355] group-hover:text-rose-500 transition-colors mb-1.5">
                  {topic.title}
                </h3>
                <p className="text-xs text-[#8B7E9C] line-clamp-2 leading-relaxed font-medium">
                  {topic.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-5 pt-4 border-t border-pink-100">
                <div className="flex justify-between text-[11px] font-bold text-[#8B7E9C] mb-1.5">
                  <span>Tiến độ ghi nhớ</span>
                  <span className="text-rose-500">{topic.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-400 to-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${topic.progressPercent}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Notebooks tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#3F3355]">
              Danh sách sổ tay từ vựng của bạn
            </h2>
            <button
              type="button"
              onClick={() => setShowNewModal(true)}
              className="btn-primary text-xs px-4 py-2"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Tạo sổ tay mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {notebooks.map((nb) => (
              <Link
                key={nb.id}
                href={`/vocabulary/${nb.id}`}
                className={`glass rounded-3xl p-5 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                  nb.isMistakeNotebook
                    ? 'border-rose-300 bg-rose-50/40'
                    : 'border-pink-200/80 hover:border-rose-300'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg mb-3 shadow-xs bg-gradient-to-tr from-rose-100 to-indigo-100 text-rose-500 font-bold">
                    {nb.isMistakeNotebook ? '⚠️' : '📖'}
                  </div>
                  <h3 className="font-bold text-base text-[#3F3355] mb-1">
                    {nb.title}
                  </h3>
                  <p className="text-xs text-[#8B7E9C] font-medium">
                    {nb.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-pink-100 flex items-center justify-between text-xs font-bold text-rose-500">
                  <span>{nb.cardCount} từ đã lưu</span>
                  <ChevronRight className="w-4 h-4 text-[#8B7E9C]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Modal Create Notebook */}
      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-3xl p-6 sm:p-8 max-w-md w-full border border-pink-200 shadow-xl backdrop-blur-xl"
            >
              <h3 className="text-lg font-bold text-[#3F3355] mb-1">
                Tạo sổ tay từ vựng mới 🌷
              </h3>
              <p className="text-xs text-[#8B7E9C] mb-5 font-medium">
                Tập hợp các từ vựng theo ý bạn để tiện ôn lại cùng nhau.
              </p>

              <form onSubmit={handleCreateNotebook} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#3F3355] mb-1">
                    Tên sổ tay
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="VD: Từ vựng họp với sếp..."
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 bg-white text-sm outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#3F3355] mb-1">
                    Mô tả (tùy chọn)
                  </label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Ghi chú thêm về sổ tay..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 bg-white text-sm outline-none focus:border-rose-400 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewModal(false)}
                    className="px-4 py-2 rounded-xl border border-pink-200 bg-white text-xs font-semibold text-[#8B7E9C]"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="btn-primary text-xs px-5 py-2"
                  >
                    {isCreating ? 'Đang tạo...' : 'Tạo sổ tay'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
