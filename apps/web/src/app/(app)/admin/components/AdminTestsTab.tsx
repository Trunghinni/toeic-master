'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Layers,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { adminApi } from '@/lib/api-client';

interface TestQuestionItem {
  id: string;
  part: string;
  questionNumber: number;
  questionText: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation?: string;
}

interface TestItem {
  id: string;
  title: string;
  description?: string;
  mode: string;
  durationMins: number;
  totalQuestions: number;
  parts: string[];
  bandRange: string[];
  questions: TestQuestionItem[];
}

interface AdminTestsTabProps {
  setActionMsg: (msg: string) => void;
}

export default function AdminTestsTab({ setActionMsg }: AdminTestsTabProps) {
  const [testsList, setTestsList] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // New Test form
  const [showAddTest, setShowAddTest] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newMode, setNewMode] = useState('PRACTICE');
  const [newDuration, setNewDuration] = useState(15);
  const [newPart, setNewPart] = useState('PART_5');

  // New Question form
  const [showAddQTestId, setShowAddQTestId] = useState<string | null>(null);
  const [newQPart, setNewQPart] = useState('PART_5');
  const [newQNumber, setNewQNumber] = useState(101);
  const [newQText, setNewQText] = useState('');
  const [newOptA, setNewOptA] = useState('');
  const [newOptB, setNewOptB] = useState('');
  const [newOptC, setNewOptC] = useState('');
  const [newOptD, setNewOptD] = useState('');
  const [newCorrect, setNewCorrect] = useState('A');
  const [newExplanation, setNewExplanation] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getTests();
      if (res.success && res.data) {
        setTestsList(res.data as TestItem[]);
      }
    } catch (err) {
      console.error('Failed to load tests', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await adminApi.createTest({
        title: newTitle.trim(),
        description: newDesc.trim() || undefined,
        mode: newMode,
        durationMins: Number(newDuration) || 15,
        parts: [newPart],
        bandRange: ['BAND_3'],
      });
      setActionMsg(`Đã tạo đề thi "${newTitle}" thành công! 📝`);
      setNewTitle('');
      setNewDesc('');
      setShowAddTest(false);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi tạo đề thi');
    }
  };

  const handleAddQuestion = async (e: React.FormEvent, testId: string) => {
    e.preventDefault();
    if (!newQText.trim() || !newOptA.trim() || !newOptB.trim()) return;
    try {
      const options = [
        { id: 'A', text: newOptA.trim() },
        { id: 'B', text: newOptB.trim() },
      ];
      if (newOptC.trim()) options.push({ id: 'C', text: newOptC.trim() });
      if (newOptD.trim()) options.push({ id: 'D', text: newOptD.trim() });

      await adminApi.createTestQuestion(testId, {
        part: newQPart,
        questionNumber: Number(newQNumber) || 1,
        questionText: newQText.trim(),
        options,
        correctOptionId: newCorrect,
        explanation: newExplanation.trim() || undefined,
      });
      setActionMsg(`Đã thêm câu hỏi #${newQNumber} vào đề thi! 🎯`);
      setNewQText('');
      setNewOptA('');
      setNewOptB('');
      setNewOptC('');
      setNewOptD('');
      setNewExplanation('');
      setNewQNumber((prev) => prev + 1);
      setShowAddQTestId(null);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi thêm câu hỏi');
    }
  };

  const handleDeleteTest = async (testId: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xoá đề thi "${title}" và toàn bộ câu hỏi bên trong?`)) return;
    try {
      await adminApi.deleteTest(testId);
      setActionMsg(`Đã xoá đề thi "${title}".`);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Lỗi xoá đề thi');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-pink-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-500" />
            Quản Lý Đề Thi & Ngân Hàng Câu Hỏi (Tests CMS)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Quản lý đề thi Full Test, Mini Test và ngân hàng câu hỏi Part 1-7 chuẩn ETS.
          </p>
        </div>
        <button
          onClick={() => setShowAddTest(!showAddTest)}
          className="px-4 py-2 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tạo Đề Thi Mới
        </button>
      </div>

      {/* Add Test Form */}
      {showAddTest && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreateTest}
          className="bg-white rounded-3xl p-6 border-2 border-brand-200 shadow-md space-y-4 text-xs"
        >
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-500" />
            Thêm Đề Thi Mới
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="font-semibold text-gray-700">Tên đề thi *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ví dụ: ETS Mini Test 04 — Luyện Phản Xạ Part 5 & 6"
                className="w-full p-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Chế độ thi (Mode)</label>
              <select
                value={newMode}
                onChange={(e) => setNewMode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-pink-200 bg-white"
              >
                <option value="PRACTICE">Practice (Luyện tập)</option>
                <option value="MINI_TEST">Mini Test (Thu nhỏ)</option>
                <option value="FULL_TEST">Full Test (200 câu)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Thời gian (Phút)</label>
              <input
                type="number"
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                min={5}
                max={180}
                className="w-full p-2.5 rounded-xl border border-pink-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Phần thi chính</label>
              <select
                value={newPart}
                onChange={(e) => setNewPart(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-pink-200 bg-white"
              >
                <option value="PART_1">Part 1: Photos</option>
                <option value="PART_2">Part 2: Q-Response</option>
                <option value="PART_3">Part 3: Conversations</option>
                <option value="PART_4">Part 4: Talks</option>
                <option value="PART_5">Part 5: Incomplete Sentences</option>
                <option value="PART_6">Part 6: Text Completion</option>
                <option value="PART_7">Part 7: Reading Comprehension</option>
              </select>
            </div>
            <div className="space-y-1 md:col-span-3">
              <label className="font-semibold text-gray-700">Mô tả đề thi</label>
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Mô tả nội dung, mục tiêu của đề thi..."
                className="w-full p-2.5 rounded-xl border border-pink-200"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddTest(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm"
            >
              Lưu Đề Thi
            </button>
          </div>
        </motion.form>
      )}

      {/* Tests List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-400" />
          Đang tải danh sách đề thi...
        </div>
      ) : testsList.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-pink-200 text-center text-xs text-gray-400">
          Chưa có đề thi nào trong hệ thống. Bấm &ldquo;Tạo Đề Thi Mới&rdquo; ở trên để bắt đầu!
        </div>
      ) : (
        <div className="space-y-4">
          {testsList.map((test) => {
            const isExpanded = expandedId === test.id;
            const isAddingQ = showAddQTestId === test.id;
            return (
              <div
                key={test.id}
                className="bg-white rounded-3xl border border-pink-200 shadow-sm p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className="font-bold text-gray-800 text-base">{test.title}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-bold border border-accent-200">
                        {test.mode}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-pink-50 text-rose-600 text-[10px] font-semibold">
                        {test.questions?.length ?? test.totalQuestions ?? 0} câu hỏi
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {test.durationMins} phút
                      </span>
                      {test.parts && (
                        <span className="text-[11px] text-gray-400 font-mono">
                          Parts: {test.parts.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => {
                        setShowAddQTestId(isAddingQ ? null : test.id);
                        if (!isExpanded) setExpandedId(test.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-brand-600 text-xs font-semibold flex items-center gap-1 border border-pink-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Thêm Câu Hỏi
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : test.id)}
                      className="px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium flex items-center gap-1 border border-gray-200"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      {isExpanded ? 'Thu gọn' : 'Xem câu hỏi'}
                    </button>
                    <button
                      onClick={() => handleDeleteTest(test.id, test.title)}
                      className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Xóa đề thi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isAddingQ && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={(e) => handleAddQuestion(e, test.id)}
                    className="bg-brand-50/40 border border-brand-200 rounded-2xl p-4 space-y-3 text-xs"
                  >
                    <div className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-brand-500" />
                      Thêm Câu Hỏi Mới Vào &ldquo;{test.title}&rdquo;
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600">Phần thi (Part) *</label>
                        <select
                          value={newQPart}
                          onChange={(e) => setNewQPart(e.target.value)}
                          className="w-full p-2 rounded-xl border border-pink-200 bg-white"
                        >
                          <option value="PART_1">Part 1: Photos</option>
                          <option value="PART_2">Part 2: Question-Response</option>
                          <option value="PART_3">Part 3: Conversations</option>
                          <option value="PART_4">Part 4: Talks</option>
                          <option value="PART_5">Part 5: Incomplete Sentences</option>
                          <option value="PART_6">Part 6: Text Completion</option>
                          <option value="PART_7">Part 7: Reading Comprehension</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600">Số thứ tự câu (Question #) *</label>
                        <input
                          type="number"
                          required
                          value={newQNumber}
                          onChange={(e) => setNewQNumber(Number(e.target.value))}
                          className="w-full p-2 rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600">Đáp án đúng</label>
                        <select
                          value={newCorrect}
                          onChange={(e) => setNewCorrect(e.target.value)}
                          className="w-full p-2 rounded-xl border border-pink-200 bg-white font-bold text-brand-600"
                        >
                          <option value="A">Lựa chọn A</option>
                          <option value="B">Lựa chọn B</option>
                          <option value="C">Lựa chọn C</option>
                          <option value="D">Lựa chọn D</option>
                        </select>
                      </div>
                      <div className="space-y-1 sm:col-span-3">
                        <label className="font-semibold text-gray-600">Nội dung câu hỏi / Đoạn văn (Prompt or Passage) *</label>
                        <textarea
                          required
                          rows={2}
                          value={newQText}
                          onChange={(e) => setNewQText(e.target.value)}
                          placeholder="Nhập nội dung câu hỏi hoặc đoạn văn đọc hiểu..."
                          className="w-full p-2 rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600">Phương án A *</label>
                        <input
                          type="text"
                          required
                          value={newOptA}
                          onChange={(e) => setNewOptA(e.target.value)}
                          placeholder="Lựa chọn A..."
                          className="w-full p-2 rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600">Phương án B *</label>
                        <input
                          type="text"
                          required
                          value={newOptB}
                          onChange={(e) => setNewOptB(e.target.value)}
                          placeholder="Lựa chọn B..."
                          className="w-full p-2 rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600">Phương án C</label>
                        <input
                          type="text"
                          value={newOptC}
                          onChange={(e) => setNewOptC(e.target.value)}
                          placeholder="Lựa chọn C..."
                          className="w-full p-2 rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600">Phương án D</label>
                        <input
                          type="text"
                          value={newOptD}
                          onChange={(e) => setNewOptD(e.target.value)}
                          placeholder="Lựa chọn D..."
                          className="w-full p-2 rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="font-semibold text-gray-600">Giải thích đáp án</label>
                        <input
                          type="text"
                          value={newExplanation}
                          onChange={(e) => setNewExplanation(e.target.value)}
                          placeholder="Giải thích ngữ pháp / từ vựng..."
                          className="w-full p-2 rounded-xl border border-pink-200 bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddQTestId(null)}
                        className="px-3 py-1.5 rounded-xl text-xs text-gray-500 hover:bg-gray-100"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-xs hover:bg-brand-600"
                      >
                        Lưu Câu Hỏi
                      </button>
                    </div>
                  </motion.form>
                )}

                {isExpanded && (
                  <div className="border-t border-pink-100 pt-3 space-y-3">
                    {test.questions && test.questions.length > 0 ? (
                      <div className="space-y-2">
                        {test.questions.map((q) => (
                          <div key={q.id} className="p-3 bg-pink-50/20 rounded-2xl border border-pink-100 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-gray-800">
                                Câu #{q.questionNumber} ({q.part})
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                                Đáp án: {q.correctOptionId}
                              </span>
                            </div>
                            <div className="text-xs text-gray-700 whitespace-pre-line">
                              {q.questionText}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                              {q.options.map((opt) => (
                                <span
                                  key={opt.id}
                                  className={`px-2 py-1 rounded-lg text-[11px] border ${
                                    opt.id === q.correctOptionId
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                                      : 'bg-white text-gray-600 border-gray-200'
                                  }`}
                                >
                                  ({opt.id}) {opt.text}
                                </span>
                              ))}
                            </div>
                            {q.explanation && (
                              <div className="text-[10px] text-gray-500 italic pt-0.5">
                                💡 {q.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 py-3 text-center">Chưa có câu hỏi nào trong đề thi này. Hãy bấm &ldquo;Thêm Câu Hỏi&rdquo; ở trên!</p>
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
