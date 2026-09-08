'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Layers,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '@/lib/api-client';

interface GrammarCardItem {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  difficulty: number;
}

interface GrammarTopicItem {
  id: string;
  title: string;
  description?: string;
  rule: string;
  formula?: string;
  tips?: string;
  targetBand?: string;
  exercises: GrammarCardItem[];
}

interface AdminGrammarTabProps {
  setActionMsg: (msg: string) => void;
}

export default function AdminGrammarTab({ setActionMsg }: AdminGrammarTabProps) {
  const [grammarTopics, setGrammarTopics] = useState<GrammarTopicItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // New Topic form
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newRule, setNewRule] = useState('');
  const [newFormula, setNewFormula] = useState('');
  const [newTips, setNewTips] = useState('');
  const [newBand, setNewBand] = useState('BAND_3');

  // New Exercise form
  const [showAddExTopicId, setShowAddExTopicId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptA, setNewOptA] = useState('');
  const [newOptB, setNewOptB] = useState('');
  const [newOptC, setNewOptC] = useState('');
  const [newOptD, setNewOptD] = useState('');
  const [newCorrect, setNewCorrect] = useState('A');
  const [newExplanation, setNewExplanation] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getGrammarTopics();
      if (res.success && res.data) {
        setGrammarTopics(res.data as GrammarTopicItem[]);
      }
    } catch (err) {
      console.error('Failed to load grammar topics', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newRule.trim()) return;
    try {
      await adminApi.createGrammarTopic({
        title: newTitle.trim(),
        description: newDesc.trim() || undefined,
        rule: newRule.trim(),
        formula: newFormula.trim() || undefined,
        tips: newTips.trim() || undefined,
        targetBand: newBand,
      });
      setActionMsg(`Đã tạo chủ điểm ngữ pháp "${newTitle}"! 📖`);
      setNewTitle('');
      setNewDesc('');
      setNewRule('');
      setNewFormula('');
      setNewTips('');
      setShowAddTopic(false);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi tạo chủ điểm');
    }
  };

  const handleAddExercise = async (e: React.FormEvent, topicId: string) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newOptA.trim() || !newOptB.trim()) return;
    try {
      const options = [
        { id: 'A', text: newOptA.trim() },
        { id: 'B', text: newOptB.trim() },
      ];
      if (newOptC.trim()) options.push({ id: 'C', text: newOptC.trim() });
      if (newOptD.trim()) options.push({ id: 'D', text: newOptD.trim() });

      const correctOpt = options.find((o) => o.id === newCorrect);
      const correctAnswer = correctOpt ? correctOpt.text : newOptA.trim();

      await adminApi.createGrammarCard(topicId, {
        question: newQuestion.trim(),
        options,
        correctAnswer,
        explanation: newExplanation.trim(),
        difficulty: 2,
      });
      setActionMsg('Đã thêm bài tập ngữ pháp mới! ✍️');
      setNewQuestion('');
      setNewOptA('');
      setNewOptB('');
      setNewOptC('');
      setNewOptD('');
      setNewExplanation('');
      setShowAddExTopicId(null);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi thêm bài tập');
    }
  };

  const handleDeleteTopic = async (topicId: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa chủ điểm "${title}" và các bài tập đi kèm?`)) return;
    try {
      await adminApi.deleteGrammarTopic(topicId);
      setActionMsg(`Đã xóa chủ điểm "${title}".`);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi xóa chủ điểm');
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-pink-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-500" />
            Quản Lý Chủ Điểm Ngữ Pháp (Grammar CMS)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Biên tập quy tắc, công thức và ngân hàng câu hỏi trắc nghiệm ngữ pháp TOEIC.
          </p>
        </div>
        <button
          onClick={() => setShowAddTopic(!showAddTopic)}
          className="px-4 py-2 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tạo Chủ Điểm Mới
        </button>
      </div>

      {/* Add Topic Form */}
      {showAddTopic && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreateTopic}
          className="bg-white rounded-3xl p-6 border-2 border-brand-200 shadow-md space-y-4 text-xs"
        >
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-500" />
            Thêm Chủ Điểm Ngữ Pháp Mới
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="font-semibold text-gray-700">Tên chủ điểm *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ví dụ: Câu Bị Động Trong Ngữ Cảnh Thương Mại"
                className="w-full p-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Mục tiêu Band</label>
              <select
                value={newBand}
                onChange={(e) => setNewBand(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-pink-200 focus:outline-none bg-white"
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
              <label className="font-semibold text-gray-700">Quy tắc ngữ pháp (Markdown) *</label>
              <textarea
                required
                rows={3}
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Giải thích chi tiết quy tắc ngữ pháp..."
                className="w-full p-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="font-semibold text-gray-700">Công thức cấu trúc</label>
              <input
                type="text"
                value={newFormula}
                onChange={(e) => setNewFormula(e.target.value)}
                placeholder="Ví dụ: S + be + V3/ed + by O"
                className="w-full p-2.5 rounded-xl border border-pink-200 focus:outline-none font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Mẹo làm bài nhanh</label>
              <input
                type="text"
                value={newTips}
                onChange={(e) => setNewTips(e.target.value)}
                placeholder="Mẹo nhận diện trong Part 5..."
                className="w-full p-2.5 rounded-xl border border-pink-200 focus:outline-none"
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
              Lưu Chủ Điểm
            </button>
          </div>
        </motion.form>
      )}

      {/* Topics List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-400" />
          Đang tải danh sách ngữ pháp...
        </div>
      ) : grammarTopics.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-pink-200 text-center text-xs text-gray-400">
          Chưa có chủ điểm ngữ pháp nào. Bấm &ldquo;Tạo Chủ Điểm Mới&rdquo; ở trên để bắt đầu!
        </div>
      ) : (
        <div className="space-y-4">
          {grammarTopics.map((topic) => {
            const isExpanded = expandedId === topic.id;
            const isAddingEx = showAddExTopicId === topic.id;
            return (
              <div
                key={topic.id}
                className="bg-white rounded-3xl border border-pink-200 shadow-sm p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className="font-bold text-gray-800 text-base">{topic.title}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-bold border border-brand-200">
                        {topic.targetBand}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] font-semibold border border-teal-200">
                        {topic.exercises?.length ?? 0} bài tập
                      </span>
                    </div>
                    {topic.formula && (
                      <div className="text-[11px] font-mono text-gray-600 mt-1 bg-gray-50 px-2 py-0.5 rounded-md w-fit">
                        📐 {topic.formula}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => {
                        setShowAddExTopicId(isAddingEx ? null : topic.id);
                        if (!isExpanded) setExpandedId(topic.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-brand-600 text-xs font-semibold flex items-center gap-1 border border-pink-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Thêm Bài Tập
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : topic.id)}
                      className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium flex items-center gap-1 border border-gray-200"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      {isExpanded ? 'Thu gọn' : 'Xem bài tập'}
                    </button>
                    <button
                      onClick={() => handleDeleteTopic(topic.id, topic.title)}
                      className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Xóa chủ điểm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isAddingEx && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={(e) => handleAddExercise(e, topic.id)}
                    className="bg-brand-50/40 border border-brand-200 rounded-2xl p-4 space-y-3 text-xs"
                  >
                    <div className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-brand-500" />
                      Thêm Bài Tập Trắc Nghiệm Mới
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-600">Câu hỏi trắc nghiệm (Chỗ trống dùng &ldquo;_______&rdquo;) *</label>
                      <input
                        type="text"
                        required
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Ví dụ: The contract _______ signed by both parties tomorrow."
                        className="w-full p-2.5 rounded-xl border border-pink-200 focus:outline-none bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600">Đáp án A *</label>
                        <input
                          type="text"
                          required
                          value={newOptA}
                          onChange={(e) => setNewOptA(e.target.value)}
                          placeholder="e.g. will be"
                          className="w-full p-2 rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600">Đáp án B *</label>
                        <input
                          type="text"
                          required
                          value={newOptB}
                          onChange={(e) => setNewOptB(e.target.value)}
                          placeholder="e.g. was"
                          className="w-full p-2 rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600">Đáp án C</label>
                        <input
                          type="text"
                          value={newOptC}
                          onChange={(e) => setNewOptC(e.target.value)}
                          placeholder="e.g. has"
                          className="w-full p-2 rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600">Đáp án D</label>
                        <input
                          type="text"
                          value={newOptD}
                          onChange={(e) => setNewOptD(e.target.value)}
                          placeholder="e.g. is"
                          className="w-full p-2 rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600">Đáp án đúng</label>
                        <select
                          value={newCorrect}
                          onChange={(e) => setNewCorrect(e.target.value)}
                          className="w-full p-2 rounded-xl border border-pink-200 bg-white"
                        >
                          <option value="A">Đáp án A</option>
                          <option value="B">Đáp án B</option>
                          <option value="C">Đáp án C</option>
                          <option value="D">Đáp án D</option>
                        </select>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="font-semibold text-gray-600">Giải thích chi tiết</label>
                        <input
                          type="text"
                          value={newExplanation}
                          onChange={(e) => setNewExplanation(e.target.value)}
                          placeholder="Lý do vì sao đáp án này đúng..."
                          className="w-full p-2 rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddExTopicId(null)}
                        className="px-3 py-1.5 rounded-xl text-xs text-gray-500 hover:bg-gray-100"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-xs hover:bg-brand-600"
                      >
                        Lưu Bài Tập
                      </button>
                    </div>
                  </motion.form>
                )}

                {isExpanded && (
                  <div className="border-t border-pink-100 pt-3 space-y-3">
                    {topic.exercises && topic.exercises.length > 0 ? (
                      <div className="space-y-2">
                        {topic.exercises.map((ex, idx) => (
                          <div key={ex.id} className="p-3 bg-pink-50/20 rounded-2xl border border-pink-100 space-y-1.5">
                            <div className="font-bold text-gray-800">
                              #{idx + 1}. {ex.question}
                            </div>
                            <div className="flex flex-wrap gap-2 text-[11px]">
                              {ex.options.map((opt) => (
                                <span
                                  key={opt.id}
                                  className={`px-2 py-0.5 rounded-md border ${
                                    opt.text === ex.correctAnswer || opt.id === ex.correctAnswer
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                                      : 'bg-white text-gray-600 border-gray-200'
                                  }`}
                                >
                                  ({opt.id}) {opt.text}
                                </span>
                              ))}
                            </div>
                            {ex.explanation && (
                              <div className="text-[10px] text-gray-500 italic">
                                💡 {ex.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 py-3 text-center">Chưa có bài tập nào. Hãy bấm &ldquo;Thêm Bài Tập&rdquo; ở trên!</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
