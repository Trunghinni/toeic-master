'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  BookOpen,
  Loader2,
  Lightbulb,
} from 'lucide-react';
import { grammarApi, ApiResult } from '@/lib/api-client';

interface GrammarExercise {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  difficulty: number;
}

interface GrammarTopicDetail {
  id: string;
  title: string;
  description: string;
  rule: string;
  formula: string;
  tips: string;
  targetBand: string;
  examples: { sentence: string; translation: string; highlight: string }[];
  exercises: GrammarExercise[];
}

export default function GrammarDetailPage() {
  const params = useParams();
  const topicId = params['topicId'] as string;

  const [topic, setTopic] = useState<GrammarTopicDetail | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [exerciseResults, setExerciseResults] = useState<
    Record<string, { isCorrect: boolean; explanation: string; isMistakeLogged: boolean }>
  >({});
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      setIsLoading(true);
      const res = await grammarApi.getTopicDetail(topicId) as ApiResult<GrammarTopicDetail>;
      if (res.success && res.data) {
        setTopic(res.data);
      }
      setIsLoading(false);
    }
    if (topicId) loadDetail();
  }, [topicId]);

  const handleSelectOption = (cardId: string, optionId: string) => {
    if (exerciseResults[cardId]) return; // already answered
    setSelectedAnswers((prev) => ({ ...prev, [cardId]: optionId }));
  };

  const handleSubmitCard = async (cardId: string) => {
    const answer = selectedAnswers[cardId];
    if (!answer || isSubmitting) return;

    setIsSubmitting(cardId);
    const res = await grammarApi.submitAnswer(cardId, answer) as ApiResult<{
      isCorrect: boolean;
      correctAnswer: string;
      explanation: string;
      isMistakeLogged: boolean;
    }>;

    if (res.success && res.data) {
      setExerciseResults((prev) => ({
        ...prev,
        [cardId]: {
          isCorrect: res.data.isCorrect,
          explanation: res.data.explanation,
          isMistakeLogged: res.data.isMistakeLogged,
        },
      }));
    }
    setIsSubmitting(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
        <p className="text-sm font-semibold text-[#3F3355]">Đang mở bài giảng ngữ pháp... 🌸</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 glass rounded-3xl text-center border border-pink-200">
        <h2 className="text-lg font-bold text-[#3F3355] mb-2">Không tìm thấy bài học</h2>
        <Link href="/grammar" className="btn-primary">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Quay lại danh mục ngữ pháp
        </Link>
      </div>
    );
  }

  const answeredCount = Object.keys(exerciseResults).length;
  const correctCount = Object.values(exerciseResults).filter((r) => r.isCorrect).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb */}
      <Link
        href="/grammar"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B7E9C] hover:text-rose-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại chuyên đề ngữ pháp</span>
      </Link>

      {/* Topic Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
            {topic.targetBand.replace('_', ' ')}
          </span>
          <span className="text-xs text-[#8B7E9C] font-semibold">
            {topic.exercises.length} câu thực hành
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#3F3355] tracking-tight">
          {topic.title}
        </h1>
        <p className="text-sm text-[#8B7E9C] mt-1 font-medium">{topic.description}</p>
      </div>

      {/* Concise Rule Card (≤ 150 words) */}
      <div className="glass rounded-3xl p-6 sm:p-7 border border-pink-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-indigo-500 mb-1 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Khái niệm trọng tâm (≤ 150 từ)
          </h2>
          <p className="text-sm text-[#3F3355] leading-relaxed font-medium mt-2">
            {topic.rule}
          </p>
        </div>

        {/* Formula */}
        {topic.formula && (
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              📐 Công thức ghi nhớ:
            </span>
            <code className="text-xs font-mono font-bold text-indigo-800 break-words">
              {topic.formula}
            </code>
          </div>
        )}

        {/* Examples */}
        {topic.examples && topic.examples.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-pink-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B7E9C]">
              Ví dụ thực tế trong đề thi:
            </span>
            <div className="space-y-2">
              {topic.examples.map((ex, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/90 border border-pink-100 text-xs">
                  <div className="font-bold text-[#3F3355]">{ex.sentence}</div>
                  <div className="text-[#8B7E9C] font-medium mt-0.5">{ex.translation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {topic.tips && (
          <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-200/70 text-xs text-[#3F3355] flex items-start gap-2 font-medium">
            <Lightbulb className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <span><strong>Mẹo thi TOEIC:</strong> {topic.tips}</span>
          </div>
        )}
      </div>

      {/* Exercises Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-[#3F3355]">
            Bài tập áp dụng ngay ({answeredCount}/{topic.exercises.length} đã làm)
          </h2>
          {answeredCount > 0 && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              Đúng: {correctCount}/{answeredCount}
            </span>
          )}
        </div>

        {topic.exercises.map((ex, exIdx) => {
          const result = exerciseResults[ex.id];
          const selected = selectedAnswers[ex.id];

          return (
            <div
              key={ex.id}
              className="glass rounded-3xl p-5 sm:p-6 border border-pink-200 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-pink-50 text-rose-500 border border-pink-200">
                  Câu {exIdx + 1}
                </span>
                {result && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg ${
                      result.isCorrect
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}
                  >
                    {result.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đúng (+5 XP)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Chưa đúng
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Question */}
              <h3 className="text-sm sm:text-base font-bold text-[#3F3355] leading-relaxed">
                {ex.question}
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {ex.options.map((opt) => {
                  const isSelected = selected === opt.id;
                  const isAnswered = Boolean(result);

                  let optClass =
                    'border-pink-200 bg-white/90 text-[#3F3355] hover:border-pink-300';
                  if (isAnswered) {
                    if (opt.id === ex.correctAnswer) {
                      optClass = 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold';
                    } else if (isSelected && result && !result.isCorrect) {
                      optClass = 'border-rose-400 bg-rose-50 text-rose-800 font-bold';
                    }
                  } else if (isSelected) {
                    optClass = 'border-indigo-400 bg-indigo-50/70 text-indigo-800 font-bold';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(ex.id, opt.id)}
                      className={`w-full p-3 rounded-2xl border-2 text-left text-xs sm:text-sm font-semibold transition-all flex items-center gap-2.5 ${optClass}`}
                    >
                      <span className="w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold border border-pink-200 bg-white">
                        {opt.id}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Submit Button or Explanation */}
              {!result ? (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    disabled={!selected || isSubmitting === ex.id}
                    onClick={() => handleSubmitCard(ex.id)}
                    className="btn-primary text-xs px-5 py-2 disabled:opacity-50"
                  >
                    {isSubmitting === ex.id ? 'Đang chấm...' : 'Kiểm tra đáp án'}
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-white/90 border border-pink-200 text-xs space-y-1">
                  <div className="font-bold text-[#3F3355]">
                    💡 Giải thích chi tiết:
                  </div>
                  <div className="text-[#8B7E9C] font-medium leading-relaxed">
                    {result.explanation}
                  </div>
                  {result.isMistakeLogged && (
                    <div className="text-[11px] text-rose-500 font-bold pt-1 flex items-center gap-1">
                      ⚠️ Đã tự động lưu câu này vào Mistake Notebook để ôn lại!
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
