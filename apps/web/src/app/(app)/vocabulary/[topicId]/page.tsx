'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Volume2,
  RotateCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  List,
  Layers,
  HelpCircle as QuizIcon,
  Loader2,
} from 'lucide-react';
import { vocabularyApi, ApiResult } from '@/lib/api-client';

interface CardItem {
  id: string;
  word: string;
  phonetic: string | null;
  wordType: string;
  definition: string;
  definitionEn: string | null;
  example: string | null;
  exampleVi: string | null;
  audioUsUrl: string | null;
  audioUkUrl: string | null;
  tags: string[];
  progress?: {
    repetitions: number;
    interval: number;
    easinessFactor: number;
    isLearned: boolean;
  } | null;
}

interface TopicDetail {
  id: string;
  title: string;
  description: string;
  cardCount: number;
}

export default function TopicStudyPage() {
  const params = useParams();
  const topicId = params['topicId'] as string;

  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<'flashcard' | 'quiz' | 'list'>('flashcard');
  const [isLoading, setIsLoading] = useState(true);

  // Quiz state
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizIsAnswered, setQuizIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const fetchTopicData = async () => {
    setIsLoading(true);
    const res = await vocabularyApi.getTopicCards(topicId) as ApiResult<{
      topic: TopicDetail;
      cards: CardItem[];
    }>;

    if (res.success && res.data) {
      setTopic(res.data.topic);
      setCards(res.data.cards);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (topicId) fetchTopicData();
  }, [topicId]);

  const currentCard = cards[currentIndex];

  const playAudio = (url: string | null) => {
    if (!url) return;
    try {
      const audio = new Audio(url);
      audio.play();
    } catch {
      // Audio playback fallback
    }
  };

  // SM-2 Review response
  const handleReview = async (quality: number) => {
    if (!currentCard) return;

    await vocabularyApi.reviewCard(currentCard.id, quality);

    // Reset flip and go to next card
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  // Quiz helper: generate 4 options
  const getQuizOptions = () => {
    if (!currentCard || cards.length === 0) return [];
    const correct = currentCard.definition;
    const others = cards
      .filter((c) => c.id !== currentCard.id)
      .map((c) => c.definition);

    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    return [correct, ...shuffledOthers].sort(() => 0.5 - Math.random());
  };

  const handleQuizAnswer = async (selected: string) => {
    if (quizIsAnswered || !currentCard) return;
    setQuizSelectedOption(selected);
    setQuizIsAnswered(true);

    const isCorrect = selected === currentCard.definition;
    if (isCorrect) {
      setQuizScore((s) => s + 1);
      await vocabularyApi.reviewCard(currentCard.id, 4); // Good
    } else {
      // Automatic Mistake Notebook logging via reviewCard(q=1)
      await vocabularyApi.reviewCard(currentCard.id, 1); // Again
    }
  };

  const handleNextQuiz = () => {
    setQuizSelectedOption(null);
    setQuizIsAnswered(false);
    setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-rose-400 animate-spin" />
        <p className="text-sm font-semibold text-[#3F3355]">Đang mở thẻ từ vựng... 🌸</p>
      </div>
    );
  }

  if (!topic || cards.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 glass rounded-3xl text-center border border-pink-200">
        <h2 className="text-lg font-bold text-[#3F3355] mb-2">Chưa có từ vựng</h2>
        <p className="text-sm text-[#8B7E9C] mb-6">Chủ đề này hiện đang được chuẩn bị thêm bài học.</p>
        <Link href="/vocabulary" className="btn-primary">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Quay lại kho từ vựng
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb & Controls */}
      <div className="flex items-center justify-between">
        <Link
          href="/vocabulary"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B7E9C] hover:text-rose-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Danh sách chủ đề</span>
        </Link>

        {/* Mode switcher */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/90 border border-pink-200 shadow-xs">
          <button
            type="button"
            onClick={() => { setStudyMode('flashcard'); setIsFlipped(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              studyMode === 'flashcard'
                ? 'bg-rose-400 text-white shadow-xs'
                : 'text-[#8B7E9C] hover:text-[#3F3355]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Thẻ 3D</span>
          </button>
          <button
            type="button"
            onClick={() => { setStudyMode('quiz'); setQuizIsAnswered(false); setQuizSelectedOption(null); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              studyMode === 'quiz'
                ? 'bg-rose-400 text-white shadow-xs'
                : 'text-[#8B7E9C] hover:text-[#3F3355]'
            }`}
          >
            <QuizIcon className="w-3.5 h-3.5" />
            <span>Trắc nghiệm</span>
          </button>
          <button
            type="button"
            onClick={() => setStudyMode('list')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              studyMode === 'list'
                ? 'bg-rose-400 text-white shadow-xs'
                : 'text-[#8B7E9C] hover:text-[#3F3355]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Danh sách</span>
          </button>
        </div>
      </div>

      {/* Topic Title Header */}
      <div>
        <h1 className="text-2xl font-black text-[#3F3355]">{topic.title}</h1>
        <p className="text-xs text-[#8B7E9C] mt-0.5 font-medium">{topic.description}</p>
      </div>

      {/* ─── MODE 1: 3D FLASHCARD ─────────────────────────────────────────── */}
      {studyMode === 'flashcard' && currentCard && (
        <div className="space-y-6">
          {/* Card progress */}
          <div className="flex items-center justify-between text-xs font-bold text-[#8B7E9C]">
            <span>
              Thẻ {currentIndex + 1} / {cards.length}
            </span>
            <div className="w-36 h-2 bg-pink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-indigo-400 rounded-full"
                style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 3D Perspective Container */}
          <div
            className="w-full h-80 sm:h-96 cursor-pointer select-none"
            style={{ perspective: 1200 }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              className="w-full h-full relative"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              {/* FRONT OF CARD */}
              <div
                className="absolute inset-0 w-full h-full glass rounded-3xl p-8 border border-pink-200 shadow-md flex flex-col justify-between items-center text-center backdrop-blur-xl"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-rose-50 text-rose-500 border border-rose-200">
                    {currentCard.wordType}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(currentCard.audioUsUrl);
                      }}
                      className="p-2 rounded-xl bg-pink-50 text-rose-500 hover:bg-rose-100 transition-colors"
                      title="Phát âm US"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="my-auto">
                  <h2 className="text-4xl sm:text-5xl font-black text-[#3F3355] tracking-tight mb-2">
                    {currentCard.word}
                  </h2>
                  {currentCard.phonetic && (
                    <div className="text-base sm:text-lg text-indigo-400 font-mono font-medium">
                      {currentCard.phonetic}
                    </div>
                  )}
                </div>

                <div className="inline-flex items-center gap-1 text-xs text-[#8B7E9C] font-semibold">
                  <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>Chạm vào thẻ để lật mặt sau</span>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div
                className="absolute inset-0 w-full h-full bg-white rounded-3xl p-8 border border-pink-200 shadow-md flex flex-col justify-between items-center text-center"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8B7E9C] uppercase">Định nghĩa & Ví dụ</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(currentCard.audioUsUrl);
                    }}
                    className="p-1.5 rounded-xl bg-rose-50 text-rose-500"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-auto space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-black text-rose-500">
                    {currentCard.definition}
                  </h3>
                  {currentCard.definitionEn && (
                    <p className="text-xs sm:text-sm text-[#8B7E9C] italic">
                      "{currentCard.definitionEn}"
                    </p>
                  )}

                  {currentCard.example && (
                    <div className="p-3 rounded-2xl bg-pink-50/60 border border-pink-100 text-left">
                      <p className="text-xs sm:text-sm font-semibold text-[#3F3355]">
                        {currentCard.example}
                      </p>
                      {currentCard.exampleVi && (
                        <p className="text-xs text-[#8B7E9C] mt-1 font-medium">
                          {currentCard.exampleVi}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-1.5 flex-wrap justify-center">
                  {currentCard.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-500"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* SM-2 Response Grading Buttons */}
          <div className="space-y-2">
            <div className="text-center text-xs font-bold text-[#8B7E9C]">
              Đánh giá mức độ ghi nhớ (SM-2 Spaced Repetition):
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleReview(1)}
                className="p-3 rounded-2xl border border-rose-300 bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-all active:scale-95 shadow-xs"
              >
                🔴 Chưa nhớ
                <div className="text-[10px] font-normal text-rose-400 mt-0.5">Lưu vào Mistake</div>
              </button>

              <button
                type="button"
                onClick={() => handleReview(2)}
                className="p-3 rounded-2xl border border-amber-300 bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-all active:scale-95 shadow-xs"
              >
                🟠 Hơi khó
                <div className="text-[10px] font-normal text-amber-500 mt-0.5">Ôn lại sớm</div>
              </button>

              <button
                type="button"
                onClick={() => handleReview(4)}
                className="p-3 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-all active:scale-95 shadow-xs"
              >
                🟢 Nhớ tốt
                <div className="text-[10px] font-normal text-emerald-500 mt-0.5">+5 XP</div>
              </button>

              <button
                type="button"
                onClick={() => handleReview(5)}
                className="p-3 rounded-2xl border border-indigo-300 bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-all active:scale-95 shadow-xs"
              >
                🟣 Rất dễ
                <div className="text-[10px] font-normal text-indigo-500 mt-0.5">Giãn cách lâu</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODE 2: MULTIPLE CHOICE QUIZ ───────────────────────────────── */}
      {studyMode === 'quiz' && currentCard && (
        <div className="glass rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-[#8B7E9C]">
            <span>
              Câu hỏi {currentIndex + 1} / {cards.length}
            </span>
            <span className="text-rose-500 font-extrabold">Đúng: {quizScore} câu</span>
          </div>

          <div className="text-center py-4">
            <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-rose-50 text-rose-500 border border-rose-200">
              {currentCard.wordType}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#3F3355] mt-3 mb-1">
              {currentCard.word}
            </h2>
            {currentCard.phonetic && (
              <p className="text-sm font-mono text-indigo-400">{currentCard.phonetic}</p>
            )}
          </div>

          <div className="space-y-3">
            {getQuizOptions().map((opt, idx) => {
              const isSelected = quizSelectedOption === opt;
              const isCorrect = opt === currentCard.definition;

              let btnClass = 'border-pink-200 bg-white/90 text-[#3F3355] hover:border-pink-300';
              if (quizIsAnswered) {
                if (isCorrect) {
                  btnClass = 'border-emerald-400 bg-emerald-50 text-emerald-700 font-bold';
                } else if (isSelected) {
                  btnClass = 'border-rose-400 bg-rose-50 text-rose-700 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={quizIsAnswered}
                  onClick={() => handleQuizAnswer(opt)}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-semibold transition-all flex items-center justify-between ${btnClass}`}
                >
                  <span>{opt}</span>
                  {quizIsAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {quizIsAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                </button>
              );
            })}
          </div>

          {quizIsAnswered && (
            <div className="pt-4 border-t border-pink-100 flex items-center justify-between">
              <span className="text-xs text-[#8B7E9C] font-medium">
                {quizSelectedOption === currentCard.definition
                  ? '🎉 Chính xác! Bạn đã ghi nhớ từ này.'
                  : '⚠️ Chưa chính xác. Đã tự động lưu vào Mistake Notebook!'}
              </span>
              <button
                type="button"
                onClick={handleNextQuiz}
                className="btn-primary text-xs px-5 py-2"
              >
                Câu tiếp theo
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── MODE 3: FULL WORD LIST ─────────────────────────────────────── */}
      {studyMode === 'list' && (
        <div className="space-y-3">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className="glass rounded-2xl p-4 sm:p-5 border border-pink-200/80 shadow-xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-pink-50 text-rose-500 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-[#3F3355]">{card.word}</span>
                    <span className="text-xs font-mono text-indigo-400">{card.phonetic}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-100 text-rose-600">
                      {card.wordType}
                    </span>
                  </div>
                  <div className="text-xs text-[#8B7E9C] font-medium mt-0.5">
                    {card.definition} — <span className="italic">{card.example}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => playAudio(card.audioUsUrl)}
                className="p-2 rounded-xl bg-pink-50 text-rose-500 hover:bg-rose-100"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
