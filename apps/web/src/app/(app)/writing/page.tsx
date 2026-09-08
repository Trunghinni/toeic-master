'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Clock,
  Sparkles,
  Award,
  BookOpen,
  Send
} from 'lucide-react';
import { speakingWritingApi } from '@/lib/api-client';

interface WritingPrompt {
  id: string;
  type: string;
  title: string;
  instructions: string;
  timeLimitMinutes: number;
  imageUrl?: string;
  givenWords?: string[];
  emailContext?: {
    from: string;
    to: string;
    subject: string;
    body: string;
  };
  promptQuestion: string;
  minWords: number;
  sampleAnswer: string;
}

interface EvaluationResult {
  promptId: string;
  promptTitle: string;
  wordCount: number;
  minWords: number;
  scaledScore: number;
  writingLevel: number;
  rubrics: {
    grammar: number;
    vocabulary: number;
    organization: number;
    relevance: number;
  };
  suggestions: string[];
  sampleAnswer: string;
}

export default function WritingPracticePage() {
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(null);
  const [loading, setLoading] = useState(true);

  // Editor State
  const [essayText, setEssayText] = useState('');
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadPrompts() {
      try {
        const res = await speakingWritingApi.getWritingPrompts();
        if (res.success && res.data) {
          const list = res.data as WritingPrompt[];
          setPrompts(list);
          const first = list[0];
          if (first) {
            setSelectedPrompt(first);
            setTimeRemainingSeconds(first.timeLimitMinutes * 60);
          }
        }
      } catch (err) {
        console.error('Failed to load writing prompts', err);
      } finally {
        setLoading(false);
      }
    }
    loadPrompts();
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (timerRunning && timeRemainingSeconds > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemainingSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerRunning && timeRemainingSeconds === 0) {
      setTimerRunning(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerRunning, timeRemainingSeconds]);

  const handleSelectPrompt = (prompt: WritingPrompt) => {
    setSelectedPrompt(prompt);
    setEssayText('');
    setResult(null);
    setTimerRunning(false);
    setTimeRemainingSeconds(prompt.timeLimitMinutes * 60);
  };

  const words = essayText.trim().split(/\s+/).filter(Boolean);
  const currentWordCount = essayText.trim() === '' ? 0 : words.length;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleEvaluate = async () => {
    if (!selectedPrompt || !essayText.trim()) return;
    setEvaluating(true);
    setTimerRunning(false);
    try {
      const res = await speakingWritingApi.evaluateWriting({
        promptId: selectedPrompt.id,
        text: essayText,
      });
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      console.error('Failed to evaluate writing', err);
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-500">
        <div className="animate-spin w-8 h-8 border-4 border-brand-400 border-t-transparent rounded-full mx-auto mb-3" />
        Đang tải bài luyện viết TOEIC Writing...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-50 via-white to-accent-50 p-6 md:p-8 rounded-3xl border border-pink-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Phòng Luyện TOEIC Writing AI
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Luyện Viết & Chấm Điểm Bài Luận Tự Động ✍️
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Chấm theo 4 tiêu chí ETS: Ngữ pháp, Từ vựng, Bố cục, Phù hợp đề bài & quy đổi điểm 0 - 200!
          </p>
        </div>

        {/* Prompt Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {prompts.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPrompt(p)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all ${
                selectedPrompt?.id === p.id
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-200'
                  : 'bg-white text-gray-600 hover:bg-pink-50 border border-pink-100'
              }`}
            >
              {p.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {selectedPrompt && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Editor & Prompt Context (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-pink-200 shadow-sm space-y-6">
              {/* Question Header */}
              <div className="border-b border-pink-100 pb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedPrompt.title}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedPrompt.instructions}</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Timer display */}
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-600 bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-100">
                    <Clock className="w-3.5 h-3.5 text-brand-500" />
                    <span>{formatTimer(timeRemainingSeconds)}</span>
                  </div>

                  {!timerRunning ? (
                    <button
                      onClick={() => setTimerRunning(true)}
                      className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-semibold transition-colors"
                    >
                      Bắt đầu tính giờ
                    </button>
                  ) : (
                    <button
                      onClick={() => setTimerRunning(false)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold transition-colors"
                    >
                      Tạm dừng
                    </button>
                  )}
                </div>
              </div>

              {/* Image for Picture Sentence */}
              {selectedPrompt.imageUrl && (
                <div className="relative w-full max-w-lg mx-auto aspect-video rounded-2xl overflow-hidden border border-pink-200 shadow-sm">
                  <Image
                    src={selectedPrompt.imageUrl}
                    alt="Writing Prompt"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </div>
              )}

              {/* Given Words Requirement */}
              {selectedPrompt.givenWords && (
                <div className="p-4 bg-accent-50/60 rounded-2xl border border-accent-200 flex items-center gap-3 text-sm">
                  <span className="font-bold text-accent-800">Từ bắt buộc:</span>
                  <div className="flex gap-2">
                    {selectedPrompt.givenWords.map((word, idx) => {
                      const included = essayText.toLowerCase().includes(word.toLowerCase());
                      return (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-colors ${
                            included
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-white text-gray-700 border-accent-300'
                          }`}
                        >
                          {word} {included && '✓'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Email Context for Question 6-7 */}
              {selectedPrompt.emailContext && (
                <div className="p-5 bg-pink-50/40 rounded-2xl border border-pink-200 space-y-2 text-xs md:text-sm font-sans">
                  <div className="text-gray-500 border-b border-pink-100 pb-2 space-y-0.5">
                    <div><strong>From:</strong> {selectedPrompt.emailContext.from}</div>
                    <div><strong>To:</strong> {selectedPrompt.emailContext.to}</div>
                    <div><strong>Subject:</strong> {selectedPrompt.emailContext.subject}</div>
                  </div>
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed pt-1">
                    {selectedPrompt.emailContext.body}
                  </div>
                </div>
              )}

              {/* Prompt Question */}
              <div className="p-4 bg-pink-50/30 rounded-2xl border border-pink-200 text-sm font-medium text-gray-800">
                👉 <strong>Yêu cầu đề bài:</strong> {selectedPrompt.promptQuestion}
              </div>

              {/* Writing Textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Trình soạn thảo bài viết:</span>
                  <span className={`font-semibold ${
                    currentWordCount >= selectedPrompt.minWords ? 'text-emerald-600' : 'text-rose-500'
                  }`}>
                    {currentWordCount} / tối thiểu {selectedPrompt.minWords} từ
                  </span>
                </div>
                <textarea
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  placeholder="Nhập bài viết của bạn tại đây..."
                  rows={selectedPrompt.type === 'OPINION_ESSAY' ? 12 : 6}
                  className="w-full p-4 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm md:text-base text-gray-800 leading-relaxed font-sans resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-400">
                  Hệ thống AI sẽ tự động phân tích cấu trúc câu và từ vựng
                </span>
                <button
                  onClick={handleEvaluate}
                  disabled={evaluating || !essayText.trim()}
                  className="px-6 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-brand-200 transition-all active:scale-95 flex items-center gap-2"
                >
                  {evaluating ? 'AI đang chấm bài...' : 'Nộp bài & Chấm điểm'}
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Rubric Breakdown & Sample Answer (1 Col) */}
          <div className="space-y-6">
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-white to-brand-50/50 rounded-3xl p-6 border border-brand-200 shadow-md space-y-5"
              >
                <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-brand-500" />
                    <span className="font-bold text-gray-800 text-sm">Điểm TOEIC Writing</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700">
                    Level {result.writingLevel}
                  </span>
                </div>

                {/* Score Dial */}
                <div className="text-center py-1">
                  <div className="text-4xl font-black text-brand-600 tracking-tight">
                    {result.scaledScore} <span className="text-sm font-semibold text-gray-400">/ 200</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Độ dài bài viết: <strong>{result.wordCount} từ</strong> (Yêu cầu: {result.minWords})
                  </div>
                </div>

                {/* 4 Rubric Scores */}
                <div className="space-y-2.5 pt-2 border-t border-pink-100 text-xs">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600">Grammar & Mechanics:</span>
                      <span className="font-bold text-gray-800">{result.rubrics.grammar}/50</span>
                    </div>
                    <div className="w-full bg-pink-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-500 h-full rounded-full" style={{ width: `${(result.rubrics.grammar / 50) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600">Vocabulary & Range:</span>
                      <span className="font-bold text-gray-800">{result.rubrics.vocabulary}/50</span>
                    </div>
                    <div className="w-full bg-pink-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-accent-500 h-full rounded-full" style={{ width: `${(result.rubrics.vocabulary / 50) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600">Organization & Coherence:</span>
                      <span className="font-bold text-gray-800">{result.rubrics.organization}/50</span>
                    </div>
                    <div className="w-full bg-pink-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-pink-400 h-full rounded-full" style={{ width: `${(result.rubrics.organization / 50) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-600">Relevance & Completeness:</span>
                      <span className="font-bold text-gray-800">{result.rubrics.relevance}/50</span>
                    </div>
                    <div className="w-full bg-pink-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(result.rubrics.relevance / 50) * 100}%` }} />
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="pt-3 border-t border-pink-100 space-y-2">
                  <span className="text-xs font-bold text-gray-700 block">Nhận xét cải thiện:</span>
                  {result.suggestions.map((sug, idx) => (
                    <p key={idx} className="text-xs text-gray-600 flex items-start gap-1.5 leading-relaxed">
                      <span className="text-brand-500">•</span>
                      <span>{sug}</span>
                    </p>
                  ))}
                </div>

                {/* Sample Answer Box */}
                <div className="pt-3 border-t border-pink-100 space-y-2">
                  <span className="text-xs font-bold text-accent-700 block">💡 Bài viết mẫu Band 200:</span>
                  <div className="p-3 bg-white rounded-xl border border-pink-200 text-xs text-gray-700 font-serif leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line shadow-inner">
                    {result.sampleAnswer}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-3xl p-6 border border-pink-200 shadow-sm space-y-4 text-xs text-gray-500 leading-relaxed">
                <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-brand-500" />
                  Tiêu chí chấm điểm ETS
                </h4>
                <p>
                  • <strong>Grammar:</strong> Cấu trúc câu phong phú, không mắc lỗi chia động từ, mạo từ hay giới từ cơ bản.
                </p>
                <p>
                  • <strong>Vocabulary:</strong> Sử dụng từ vựng công sở chính xác, tự nhiên, đa dạng collocations.
                </p>
                <p>
                  • <strong>Organization:</strong> Kết cấu bài rõ ràng, chuyển ý mượt mà với các liên từ thích hợp.
                </p>
                <p>
                  • <strong>Relevance:</strong> Trả lời trúng trọng tâm câu hỏi và đáp ứng đủ các yêu cầu đề bài.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
