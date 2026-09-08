'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Award,
  BarChart3,
  Loader2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { placementApi, roadmapApi, ApiResult } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth.store';
import { BAND_SCORE_RANGES, BandLevel } from '@toeic-master/shared-types';

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  questionText: string;
  type: 'grammar' | 'vocabulary' | 'reading';
  options: QuestionOption[];
  bandLevel: number;
}

interface PlacementResult {
  estimatedBand: string;
  estimatedScore: number;
  totalCorrect: number;
  totalQuestions: number;
  grammarScore: number;
  vocabularyScore: number;
  readingScore: number;
  listeningScore: number;
  breakdown: { correct: number; total: number; percentage: number };
}

export default function PlacementTestPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 25-minute timer = 1500 seconds
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch questions
  useEffect(() => {
    let isMounted = true;

    async function loadQuestions() {
      setIsLoadingQuestions(true);
      const res = await placementApi.getQuestions() as ApiResult<Question[]>;

      if (!isMounted) return;

      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setQuestions(res.data);
        setIsTimerRunning(true);
      } else {
        setErrorMessage('Không thể tải bộ câu hỏi kiểm tra. Vui lòng thử lại.');
      }
      setIsLoadingQuestions(false);
    }

    loadQuestions();

    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || result) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, result, answers, handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const currentQuestion = questions[currentIndex];
  const isTimeLow = timeLeft < 5 * 60; // Under 5 minutes

  const handleSubmit = useCallback(async () => {
    if (isSubmitting || questions.length === 0) return;

    setIsSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const res = await placementApi.submit(answers) as ApiResult<PlacementResult>;

    if (res.success) {
      setResult(res.data);
    } else {
      setErrorMessage(res.error.message || 'Lỗi khi chấm điểm bài thi.');
    }
    setIsSubmitting(false);
  }, [isSubmitting, questions.length, answers]);

  const handleGenerateRoadmapFromResult = async () => {
    if (!result) return;
    setIsSubmitting(true);

    const targetScore = user?.profile?.targetScore || 650;
    const targetBand = user?.profile?.targetBand || BandLevel.BAND_4;
    const dailyGoalMinutes = user?.profile?.dailyGoalMinutes || 30;

    await roadmapApi.generate({
      targetBand,
      targetScore,
      dailyGoalMinutes,
      currentBand: result.estimatedBand,
    });

    router.push('/roadmap');
  };

  if (isLoadingQuestions) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-rose-400 animate-spin" />
        <p className="text-sm font-semibold text-[#3F3355]">Đang chuẩn bị 100 câu hỏi kiểm tra năng lực... 🌸</p>
      </div>
    );
  }

  if (errorMessage && questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 glass rounded-3xl text-center border border-pink-200">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-[#3F3355] mb-2">Đã xảy ra sự cố</h2>
        <p className="text-sm text-[#8B7E9C] mb-6">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Thử lại
        </button>
      </div>
    );
  }

  // Result View when test is completed
  if (result) {
    const bandInfo = BAND_SCORE_RANGES[result.estimatedBand as BandLevel] ?? {
      label: result.estimatedBand,
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto py-6"
      >
        <div className="glass rounded-3xl p-8 sm:p-10 shadow-lg border border-pink-200 backdrop-blur-xl text-center relative overflow-hidden">
          {/* Top glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-20 bg-gradient-to-r from-rose-300/40 to-indigo-300/40 blur-2xl rounded-full" />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-400 to-rose-500 flex items-center justify-center text-white mx-auto mb-4 shadow-md shadow-rose-300/40">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3F3355] tracking-tight">
            Hoàn thành bài kiểm tra xếp lớp! 🎉
          </h2>
          <p className="text-sm text-[#8B7E9C] mt-1 max-w-lg mx-auto font-medium">
            Hệ thống đã phân tích kết quả bài làm và xác định band điểm ban đầu của bạn
          </p>

          {/* Primary Score Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 max-w-lg mx-auto">
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200/80 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Trình độ ước tính</span>
              <span className="text-2xl font-black text-rose-600 mt-1">
                {result.estimatedBand.replace('_', ' ')}
              </span>
              <span className="text-xs text-rose-500 mt-0.5 font-medium">{bandInfo.label}</span>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Điểm ước tính TOEIC</span>
              <span className="text-3xl font-black text-indigo-600 mt-1">
                {result.estimatedScore} <span className="text-base font-semibold text-indigo-400">/ 990</span>
              </span>
              <span className="text-xs text-indigo-500 mt-0.5 font-medium">
                Đúng {result.totalCorrect} / {result.totalQuestions} câu ({result.breakdown.percentage}%)
              </span>
            </div>
          </div>

          {/* Skill Breakdown */}
          <div className="bg-white/90 rounded-2xl p-6 border border-pink-200 mb-8 max-w-xl mx-auto text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3F3355] mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Chi tiết theo kỹ năng kiểm tra
            </h3>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#3F3355]">Ngữ pháp (Grammar)</span>
                  <span className="text-rose-500">{result.grammarScore}%</span>
                </div>
                <div className="h-2 rounded-full bg-pink-100 overflow-hidden">
                  <div
                    className="h-full bg-rose-400 rounded-full transition-all duration-700"
                    style={{ width: `${result.grammarScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#3F3355]">Từ vựng (Vocabulary)</span>
                  <span className="text-indigo-500">{result.vocabularyScore}%</span>
                </div>
                <div className="h-2 rounded-full bg-indigo-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full transition-all duration-700"
                    style={{ width: `${result.vocabularyScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#3F3355]">Đọc hiểu (Reading Comprehension)</span>
                  <span className="text-purple-500">{result.readingScore}%</span>
                </div>
                <div className="h-2 rounded-full bg-purple-100 overflow-hidden">
                  <div
                    className="h-full bg-purple-400 rounded-full transition-all duration-700"
                    style={{ width: `${result.readingScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <button
            onClick={handleGenerateRoadmapFromResult}
            disabled={isSubmitting}
            className="btn-primary px-8 py-3.5 text-base shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Đang kích hoạt lộ trình học...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Kích hoạt lộ trình ôn luyện dành riêng cho bạn
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  // Active Placement Test View
  return (
    <div className="max-w-4xl mx-auto py-2">
      {/* Top Header: Progress & Timer */}
      <div className="glass rounded-3xl p-4 mb-5 border border-pink-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Progress */}
        <div className="w-full sm:w-1/2">
          <div className="flex justify-between text-xs font-bold text-[#3F3355] mb-1.5">
            <span>Tiến độ bài làm</span>
            <span className="text-rose-500 font-extrabold">
              {answeredCount} / {questions.length} câu ({Math.round(progressPercent)}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-pink-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-400 to-indigo-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Timer & Finish button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-sm font-mono font-bold transition-all ${
              isTimeLow
                ? 'bg-rose-50 border-rose-300 text-rose-500 animate-pulse'
                : 'bg-white border-pink-200 text-[#3F3355]'
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimeLow ? 'text-rose-500' : 'text-indigo-400'}`} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary text-xs px-4 py-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            )}
            Nộp bài
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Question Card (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {currentQuestion && (
            <div className="glass rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-200 backdrop-blur-xl">
              {/* Question Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                  Câu {currentIndex + 1} / {questions.length} • {currentQuestion.type.toUpperCase()}
                </span>
                <span className="text-xs text-[#8B7E9C] font-semibold">
                  Band tương đương: {currentQuestion.bandLevel}
                </span>
              </div>

              {/* Question text */}
              <h2 className="text-base sm:text-lg font-bold text-[#3F3355] mb-6 leading-relaxed">
                {currentQuestion.questionText}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  const label = String.fromCharCode(65 + idx); // A, B, C, D

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                      className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-rose-400 bg-rose-50/80 shadow-xs shadow-rose-300/20'
                          : 'border-pink-200/80 bg-white/90 hover:border-pink-300 hover:bg-rose-50/30'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-rose-400 text-white'
                            : 'bg-pink-50 text-[#8B7E9C] border border-pink-200'
                        }`}
                      >
                        {label}
                      </span>
                      <span className="text-sm font-semibold text-[#3F3355] leading-snug pt-0.5">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation prev/next */}
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-pink-100">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-pink-200 bg-white text-xs font-semibold text-[#3F3355] hover:bg-rose-50/50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Câu trước
                </button>

                <button
                  type="button"
                  disabled={currentIndex === questions.length - 1}
                  onClick={() => setCurrentIndex((idx) => Math.min(questions.length - 1, idx + 1))}
                  className="btn-primary text-xs px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Câu tiếp
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Question Palette Sidebar (1 col) */}
        <div className="glass rounded-3xl p-5 border border-pink-200 shadow-sm backdrop-blur-xl h-fit">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3F3355]">
              Danh sách câu hỏi
            </h3>
            <span className="text-[11px] text-[#8B7E9C] font-semibold">
              Đã làm {answeredCount}/{questions.length}
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-1.5 max-h-[420px] overflow-y-auto pr-1">
            {questions.map((q, idx) => {
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
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-[11px] text-[#8B7E9C]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span>Đã trả lời</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-200" />
              <span>Chưa làm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
