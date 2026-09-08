'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  Award,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { testApi, ApiResult } from '@/lib/api-client';

interface QuestionOption {
  id: string;
  text: string;
}

interface TestQuestionItem {
  id: string;
  part: string;
  questionNumber: number;
  questionText: string | null;
  options: QuestionOption[];
  imageUrl: string | null;
}

interface TestDetail {
  id: string;
  title: string;
  description: string;
  durationMins: number;
  questions: TestQuestionItem[];
}

interface TestResultData {
  attemptId: string;
  totalCorrect: number;
  totalQuestions: number;
  percentage: number;
  listeningScaled: number;
  readingScaled: number;
  totalScaled: number;
  timeSpentSeconds: number;
  partBreakdown: Record<string, { correct: number; total: number }>;
  xpEarned: number;
}

export default function TestTakingPage() {
  const params = useParams();
  const testId = params['testId'] as string;

  const [test, setTest] = useState<TestDetail | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TestResultData | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    async function loadTest() {
      setIsLoading(true);
      const res = await testApi.getTestForTaking(testId) as ApiResult<TestDetail>;
      if (res.success && res.data) {
        setTest(res.data);
        setTimeLeft(res.data.durationMins * 60);
        startTimeRef.current = Date.now();
      }
      setIsLoading(false);
    }
    if (testId) loadTest();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testId]);

  useEffect(() => {
    if (isLoading || result) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading, result, handleFinalSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleFinalSubmit = useCallback(async () => {
    if (isSubmitting || !test) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpentSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const res = await testApi.submitAttempt(test.id, answers, timeSpentSeconds) as ApiResult<TestResultData>;

    if (res.success && res.data) {
      setResult(res.data);
    }
    setIsSubmitting(false);
  }, [isSubmitting, test, answers]);

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-rose-400 animate-spin" />
        <p className="text-sm font-semibold text-[#3F3355]">Đang mở phòng thi TOEIC... 🎯</p>
      </div>
    );
  }

  if (!test || test.questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 glass rounded-3xl text-center border border-pink-200">
        <h2 className="text-lg font-bold text-[#3F3355] mb-2">Đề thi chưa sẵn sàng</h2>
        <Link href="/tests" className="btn-primary">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Quay lại danh mục đề thi
        </Link>
      </div>
    );
  }

  // Result Screen
  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto py-6"
      >
        <div className="glass rounded-3xl p-8 sm:p-10 shadow-lg border border-pink-200 backdrop-blur-xl text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-400 to-indigo-400 flex items-center justify-center text-white mx-auto mb-4 shadow-md shadow-rose-300/40">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#3F3355] tracking-tight">
            Hoàn thành bài thi TOEIC! 🎉
          </h2>
          <p className="text-sm text-[#8B7E9C] mt-1 font-medium">{test.title}</p>

          {/* Scaled Score Showcase */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-50 to-indigo-50 border border-pink-200 my-8 max-w-lg mx-auto">
            <span className="text-xs font-bold text-[#8B7E9C] uppercase tracking-wider block">
              Tổng điểm quy đổi TOEIC
            </span>
            <div className="text-5xl font-black text-gradient-brand my-2">
              {result.totalScaled} <span className="text-xl font-bold text-[#8B7E9C]">/ 990</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-pink-200/60 text-xs font-bold text-[#3F3355]">
              <div>🎧 Listening: <span className="text-rose-500 font-extrabold">{result.listeningScaled}</span> / 495</div>
              <div>📖 Reading: <span className="text-indigo-500 font-extrabold">{result.readingScaled}</span> / 495</div>
            </div>
          </div>

          {/* Part Breakdown */}
          <div className="bg-white/90 rounded-2xl p-6 border border-pink-200 mb-8 max-w-xl mx-auto text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3F3355] mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Kết quả chi tiết từng Part
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(result.partBreakdown).map(([partKey, data]) => (
                <div key={partKey} className="p-2.5 rounded-xl bg-pink-50/50 border border-pink-100 text-xs">
                  <div className="font-bold text-[#3F3355]">{partKey.replace('_', ' ')}</div>
                  <div className="text-[#8B7E9C] font-semibold mt-0.5">
                    Đúng {data.correct} / {data.total} ({data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0}%)
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-600 font-medium">
              💡 Các câu trả lời chưa chính xác đã được tự động lưu vào <strong>Mistake Notebook</strong> để bạn ôn luyện lại bất kỳ lúc nào!
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Link href="/tests" className="btn-primary text-sm px-6 py-2.5">
              Danh mục đề thi
            </Link>
            <Link href="/roadmap" className="btn-secondary text-sm px-6 py-2.5">
              Xem lộ trình học
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const currentQ = test.questions[currentIndex];
  const isTimeLow = timeLeft < 5 * 60;

  return (
    <div className="max-w-4xl mx-auto py-2 space-y-5">
      {/* Top Header */}
      <div className="glass rounded-3xl p-4 border border-pink-200 shadow-sm flex items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-sm sm:text-base text-[#3F3355]">{test.title}</h1>
          <div className="text-xs text-[#8B7E9C] font-semibold">
            Đã làm {answeredCount} / {test.questions.length} câu
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-sm font-mono font-bold transition-all ${
              isTimeLow
                ? 'bg-rose-50 border-rose-300 text-rose-500 animate-pulse'
                : 'bg-white border-pink-200 text-[#3F3355]'
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimeLow ? 'text-rose-500' : 'text-indigo-400'}`} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="btn-primary text-xs px-4 py-2"
          >
            Nộp bài thi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Question (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {currentQ && (
            <div className="glass rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-xs backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-rose-50 text-rose-500 border border-rose-200">
                  Câu {currentQ.questionNumber} • {currentQ.part.replace('_', ' ')}
                </span>
              </div>

              {currentQ.questionText && (
                <h2 className="text-base sm:text-lg font-bold text-[#3F3355] mb-6 leading-relaxed">
                  {currentQ.questionText}
                </h2>
              )}

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, opt.id)}
                      className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-rose-400 bg-rose-50/80 shadow-xs'
                          : 'border-pink-200/80 bg-white/90 hover:border-pink-300'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-rose-400 text-white'
                            : 'bg-pink-50 text-[#8B7E9C] border border-pink-200'
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="text-sm font-semibold text-[#3F3355] leading-snug pt-0.5">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Prev / Next */}
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-pink-100">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-pink-200 bg-white text-xs font-semibold text-[#3F3355] hover:bg-rose-50/50 disabled:opacity-40"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Câu trước
                </button>

                <button
                  type="button"
                  disabled={currentIndex === test.questions.length - 1}
                  onClick={() => setCurrentIndex((idx) => Math.min(test.questions.length - 1, idx + 1))}
                  className="btn-primary text-xs px-4 py-2 disabled:opacity-40"
                >
                  Câu tiếp <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Palette (1 col) */}
        <div className="glass rounded-3xl p-5 border border-pink-200 shadow-xs h-fit">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3F3355]">Bảng câu hỏi</h3>
            <span className="text-[11px] text-[#8B7E9C] font-semibold">
              {answeredCount}/{test.questions.length}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 max-h-[380px] overflow-y-auto pr-1">
            {test.questions.map((q, idx) => {
              const isAnswered = Boolean(answers[q.id]);
              const isCurrent = currentIndex === idx;

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-8 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? 'ring-2 ring-rose-400 bg-rose-400 text-white shadow-xs'
                      : isAnswered
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'bg-white/90 border border-pink-200 text-[#8B7E9C] hover:border-rose-300'
                  }`}
                >
                  {q.questionNumber}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-3xl p-6 max-w-sm w-full border border-pink-200 shadow-xl text-center"
            >
              <h3 className="text-lg font-bold text-[#3F3355] mb-2">Xác nhận nộp bài?</h3>
              <p className="text-xs text-[#8B7E9C] mb-6 font-medium">
                Bạn đã hoàn thành {answeredCount} / {test.questions.length} câu. Bạn có chắc chắn muốn nộp bài để xem điểm thi quy đổi?
              </p>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-xl border border-pink-200 bg-white text-xs font-semibold text-[#8B7E9C]"
                >
                  Làm tiếp
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="btn-primary text-xs px-5 py-2"
                >
                  {isSubmitting ? 'Đang chấm...' : 'Xác nhận nộp'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
