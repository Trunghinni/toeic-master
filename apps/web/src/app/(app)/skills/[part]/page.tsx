'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  BookmarkCheck,
  ChevronRight,
} from 'lucide-react';
import { skillsApi } from '@/lib/api-client';

interface SkillItem {
  id: string;
  part: string;
  title: string;
  audioUrl?: string;
  imageUrl?: string;
  passageText?: string;
  transcript?: string;
  questions: {
    questionNumber: number;
    questionText: string;
    options: { id: string; text: string }[];
    correctAnswer: string;
    explanation: string;
  }[];
}

interface SubmitResult {
  itemId: string;
  part: string;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  autoSavedToMistakeNotebook: boolean;
  feedback: {
    questionNumber: number;
    chosenAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export default function SkillPartDetailPage() {
  const params = useParams();
  const router = useRouter();
  const part = (params.part as string)?.toUpperCase() || 'PART_1';

  const [items, setItems] = useState<SkillItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Audio player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);

  // Answering state
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await skillsApi.getItemsByPart(part);
        if (res.success && res.data?.items) {
          setItems(res.data.items as SkillItem[]);
        }
      } catch (err) {
        console.error('Failed to load items for part', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [part]);

  const currentItem = items[currentIndex];

  // Reset state when changing item
  useEffect(() => {
    setUserAnswers({});
    setResult(null);
    setShowTranscript(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [currentIndex, playbackSpeed]);

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const rewindAudio = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - seconds);
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleSelectOption = (questionNumber: number, optionId: string) => {
    if (result) return; // Prevent changing after submission
    setUserAnswers((prev) => ({ ...prev, [questionNumber]: optionId }));
  };

  const handleSubmit = async () => {
    if (!currentItem) return;
    setSubmitting(true);
    try {
      const res = await skillsApi.submitAnswer(currentItem.id, userAnswers);
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      console.error('Failed to submit answer', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.push('/skills');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-gray-500">
        <div className="animate-spin w-8 h-8 border-4 border-brand-400 border-t-transparent rounded-full mx-auto mb-3" />
        Đang tải câu hỏi kỹ năng {part}...
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <p className="text-gray-600 mb-4">Chưa có dữ liệu câu hỏi cho phần thi này.</p>
        <Link href="/skills" className="text-brand-600 font-semibold hover:underline">
          Quay lại danh mục kỹ năng
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/skills"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Danh mục kỹ năng
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
            {part.replace('_', ' ')}
          </span>
          <span className="text-xs text-gray-500">
            Bài {currentIndex + 1} / {items.length}
          </span>
        </div>
      </div>

      {/* Main Practice Container */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-pink-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-pink-100 pb-4">
          <h2 className="text-xl font-bold text-gray-800">{currentItem.title}</h2>
          <span className="text-xs text-gray-400">
            {currentItem.questions.length} câu hỏi
          </span>
        </div>

        {/* Audio Player for Listening Parts */}
        {currentItem.audioUrl && (
          <div className="bg-gradient-to-r from-brand-50/70 to-accent-50/70 p-4 rounded-2xl border border-pink-200 flex flex-wrap items-center justify-between gap-4">
            <audio
              ref={audioRef}
              src={currentItem.audioUrl}
              onEnded={() => setIsPlaying(false)}
            />
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayAudio}
                className="w-11 h-11 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-200 transition-transform active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                onClick={() => rewindAudio(5)}
                className="p-2 text-gray-600 hover:text-brand-600 hover:bg-white/80 rounded-xl transition-colors"
                title="Tua lại 5 giây"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium text-gray-600">
                {isPlaying ? 'Đang phát...' : 'Bấm để nghe audio'}
              </span>
            </div>

            {/* Playback Speed Controls */}
            <div className="flex items-center gap-1.5 bg-white/80 px-2 py-1 rounded-xl border border-pink-200 text-xs font-semibold">
              <span className="text-gray-400 mr-1">Tốc độ:</span>
              {[0.8, 1.0, 1.2, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => changeSpeed(speed)}
                  className={`px-2 py-0.5 rounded-lg transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-brand-500 text-white'
                      : 'text-gray-600 hover:bg-pink-50'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Transcript Toggle */}
            {currentItem.transcript && (
              <button
                onClick={() => setShowTranscript((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-600 hover:text-accent-700 bg-accent-50 hover:bg-accent-100 px-3 py-1.5 rounded-xl transition-colors"
              >
                {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showTranscript ? 'Ẩn Audio Script' : 'Hiện Audio Script'}
              </button>
            )}
          </div>
        )}

        {/* Audio Script Reveal */}
        {showTranscript && currentItem.transcript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-accent-50/50 rounded-2xl border border-accent-200 text-sm text-gray-700 leading-relaxed font-mono"
          >
            <span className="font-bold text-accent-700 block mb-1">📝 Audio Transcript:</span>
            {currentItem.transcript}
          </motion.div>
        )}

        {/* Image for Part 1 */}
        {currentItem.imageUrl && (
          <div className="relative w-full max-w-md mx-auto aspect-video rounded-2xl overflow-hidden border border-pink-200 shadow-sm">
            <Image
              src={currentItem.imageUrl}
              alt="Part 1 Photograph"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
        )}

        {/* Passage Text for Part 6 & 7 */}
        {currentItem.passageText && (
          <div className="p-5 bg-pink-50/30 rounded-2xl border border-pink-200 text-sm leading-relaxed text-gray-800 whitespace-pre-line font-serif shadow-inner">
            {currentItem.passageText}
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6 pt-2">
          {currentItem.questions.map((q) => {
            const chosen = userAnswers[q.questionNumber];
            const qFeedback = result?.feedback.find((f) => f.questionNumber === q.questionNumber);

            return (
              <div
                key={q.questionNumber}
                className="p-5 rounded-2xl bg-white border border-pink-100 shadow-sm space-y-3"
              >
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {q.questionNumber}
                  </span>
                  <p className="text-gray-800 font-medium text-sm md:text-base">
                    {q.questionText}
                  </p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 gap-2 pt-1 pl-8">
                  {q.options.map((opt) => {
                    const isSelected = chosen === opt.id;
                    let optStyle = 'bg-white hover:bg-pink-50/50 border-gray-200 text-gray-700';

                    if (result && qFeedback) {
                      if (opt.id === qFeedback.correctAnswer) {
                        optStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold';
                      } else if (isSelected && !qFeedback.isCorrect) {
                        optStyle = 'bg-rose-50 border-rose-400 text-rose-800 line-through';
                      }
                    } else if (isSelected) {
                      optStyle = 'bg-brand-50 border-brand-400 text-brand-700 font-semibold ring-2 ring-brand-200';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(q.questionNumber, opt.id)}
                        disabled={!!result}
                        className={`text-left p-3 rounded-xl border text-sm transition-all duration-150 flex items-center gap-3 ${optStyle}`}
                      >
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {qFeedback && (
                  <div
                    className={`mt-3 p-3.5 rounded-xl text-xs md:text-sm leading-relaxed ${
                      qFeedback.isCorrect
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border border-rose-200 text-rose-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      {qFeedback.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500" />
                      )}
                      <span>
                        {qFeedback.isCorrect ? 'Chính xác!' : `Đáp án đúng là (${qFeedback.correctAnswer})`}
                      </span>
                    </div>
                    <p className="text-gray-600">{qFeedback.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Auto Mistake Alert Banner */}
        {result?.autoSavedToMistakeNotebook && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-brand-50 border border-brand-200 rounded-2xl flex items-center gap-3 text-brand-700 text-xs md:text-sm font-medium"
          >
            <BookmarkCheck className="w-5 h-5 text-brand-500 shrink-0" />
            <span>
              Hệ thống đã <strong>tự động lưu câu trả lời sai</strong> vào sổ tay <strong>Mistake Notebook</strong> để bạn ôn tập định kỳ theo thuật toán SM-2!
            </span>
          </motion.div>
        )}

        {/* Actions Footer */}
        <div className="pt-4 border-t border-pink-100 flex items-center justify-between">
          {!result ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(userAnswers).length === 0}
              className="px-6 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-brand-200 transition-all active:scale-95 flex items-center gap-2 ml-auto"
            >
              {submitting ? 'Đang chấm...' : 'Kiểm tra đáp án'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-md shadow-brand-200 transition-all active:scale-95 flex items-center gap-2 ml-auto"
            >
              {currentIndex < items.length - 1 ? 'Bài tiếp theo' : 'Hoàn thành phần này'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
