'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Mic,
  MicOff,
  Sparkles,
  Award,
  Clock,
} from 'lucide-react';
import { speakingWritingApi } from '@/lib/api-client';

interface SpeakingPrompt {
  id: string;
  type: string;
  title: string;
  instructions: string;
  preparationTime: number;
  responseTime: number;
  content: string;
  imageUrl?: string;
  sampleTranscript?: string;
  keyVocabulary?: string[];
}

interface EvaluationResult {
  promptId: string;
  promptTitle: string;
  speechText: string;
  wordCount: number;
  estimatedWpm: number;
  scaledScore: number;
  proficiencyLevel: number;
  pronunciationScore: number;
  fluencyScore: number;
  intonationScore: number;
  matchedKeywords: number;
  totalKeywords: number;
  feedback: string[];
  sampleTranscript: string;
}

export default function SpeakingPracticePage() {
  const [prompts, setPrompts] = useState<SpeakingPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt | null>(null);
  const [loading, setLoading] = useState(true);

  // Recording & Simulation State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [prepSeconds, setPrepSeconds] = useState(0);
  const [prepActive, setPrepActive] = useState(false);
  const [speechInput, setSpeechInput] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadPrompts() {
      try {
        const res = await speakingWritingApi.getSpeakingPrompts();
        if (res.success && res.data) {
          const list = res.data as SpeakingPrompt[];
          setPrompts(list);
          if (list.length > 0 && list[0]) setSelectedPrompt(list[0]);
        }
      } catch (err) {
        console.error('Failed to load speaking prompts', err);
      } finally {
        setLoading(false);
      }
    }
    loadPrompts();
  }, []);

  // Timer countdowns
  useEffect(() => {
    if (prepActive && prepSeconds > 0) {
      timerRef.current = setTimeout(() => {
        setPrepSeconds((prev) => prev - 1);
      }, 1000);
    } else if (prepActive && prepSeconds === 0) {
      setPrepActive(false);
      startRecording();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [prepActive, prepSeconds]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setTimeout(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRecording, recordingSeconds]);

  const handleSelectPrompt = (prompt: SpeakingPrompt) => {
    setSelectedPrompt(prompt);
    setResult(null);
    setIsRecording(false);
    setPrepActive(false);
    setRecordingSeconds(0);
    setSpeechInput('');
  };

  const startPreparation = () => {
    if (!selectedPrompt) return;
    setResult(null);
    setSpeechInput('');
    setPrepSeconds(selectedPrompt.preparationTime);
    setPrepActive(true);
  };

  const startRecording = () => {
    setPrepActive(false);
    setIsRecording(true);
    setRecordingSeconds(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    // If user hasn't typed manual transcript, provide sample or hint text for evaluation
    if (!speechInput.trim() && selectedPrompt) {
      setSpeechInput(selectedPrompt.sampleTranscript || selectedPrompt.content);
    }
  };

  const handleEvaluate = async () => {
    if (!selectedPrompt || !speechInput.trim()) return;
    setEvaluating(true);
    try {
      const res = await speakingWritingApi.evaluateSpeaking({
        promptId: selectedPrompt.id,
        speechText: speechInput,
        durationSeconds: recordingSeconds || 30,
      });
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      console.error('Failed to evaluate speaking', err);
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-500">
        <div className="animate-spin w-8 h-8 border-4 border-brand-400 border-t-transparent rounded-full mx-auto mb-3" />
        Đang tải bài luyện nói TOEIC Speaking...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-50 via-white to-accent-50 p-6 md:p-8 rounded-3xl border border-pink-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Phòng Luyện TOEIC Speaking AI
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Luyện Nói & Chấm Điểm Phát Âm Chuẩn ETS 🎙️
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Đánh giá Pronunciation, Intonation, Fluency & quy đổi thang điểm TOEIC Speaking 0 - 200!
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

      {/* Main Practice Workspace */}
      {selectedPrompt && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Prompt & Content Card (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-pink-200 shadow-sm space-y-6">
              <div className="border-b border-pink-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedPrompt.title}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedPrompt.instructions}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-pink-50/70 px-3 py-1.5 rounded-xl border border-pink-100">
                  <Clock className="w-3.5 h-3.5 text-brand-500" />
                  Chuẩn bị: {selectedPrompt.preparationTime}s | Nói: {selectedPrompt.responseTime}s
                </div>
              </div>

              {/* Image if Describe Picture */}
              {selectedPrompt.imageUrl && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-pink-200 shadow-sm">
                  <Image
                    src={selectedPrompt.imageUrl}
                    alt="Speaking Prompt Image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </div>
              )}

              {/* Prompt Text / Reading Passage */}
              <div className="p-6 bg-pink-50/40 rounded-2xl border border-pink-200 text-gray-800 font-serif text-base md:text-lg leading-relaxed shadow-inner">
                {selectedPrompt.content}
              </div>

              {/* Key Vocabulary Hints */}
              {selectedPrompt.keyVocabulary && selectedPrompt.keyVocabulary.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Từ vựng ghi điểm đề xuất:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedPrompt.keyVocabulary.map((kw, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl text-xs font-medium bg-accent-50 text-accent-700 border border-accent-200"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Speech Input / Live Transcription Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">Bản ghi giọng nói / Lời thoại:</span>
                  <span>{speechInput.split(/\s+/).filter(Boolean).length} từ</span>
                </div>
                <textarea
                  value={speechInput}
                  onChange={(e) => setSpeechInput(e.target.value)}
                  placeholder="Bản ghi âm hoặc nhập nội dung bài nói của bạn để AI phân tích..."
                  rows={4}
                  className="w-full p-4 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm text-gray-700 leading-relaxed resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={startPreparation}
                  disabled={prepActive || isRecording}
                  className="px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-brand-600 font-semibold text-xs transition-colors disabled:opacity-50"
                >
                  {prepActive ? `Đang chuẩn bị (${prepSeconds}s)...` : 'Bắt đầu bấm giờ thi'}
                </button>

                <button
                  onClick={handleEvaluate}
                  disabled={evaluating || !speechInput.trim()}
                  className="px-6 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-brand-200 transition-all active:scale-95 flex items-center gap-2"
                >
                  {evaluating ? 'AI đang chấm điểm...' : 'Chấm điểm phát âm'}
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Waveform & Recording Control (1 Col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-pink-200 shadow-sm space-y-6 text-center">
              <h3 className="text-base font-bold text-gray-800">Trạng Thái Ghi Âm</h3>

              {/* Dynamic Waveform Visualizer */}
              <div className="h-32 bg-gradient-to-b from-pink-50/50 to-indigo-50/50 rounded-2xl border border-pink-200 flex items-center justify-center gap-1.5 px-4 overflow-hidden relative">
                {isRecording ? (
                  // Animated Waveform Bars
                  [30, 60, 40, 80, 50, 95, 70, 45, 85, 30, 65, 90, 40, 75, 55].map((h, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        height: [15, h, 20, h * 0.8, 15],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: (idx % 5) * 0.1,
                      }}
                      className="w-1.5 bg-gradient-to-t from-brand-500 to-accent-400 rounded-full"
                    />
                  ))
                ) : (
                  <div className="text-gray-400 text-xs flex flex-col items-center gap-2">
                    <Mic className="w-8 h-8 text-pink-300 stroke-[1.5]" />
                    <span>Nhấn microphone để bắt đầu nói</span>
                  </div>
                )}
              </div>

              {/* Timer & Status */}
              <div className="space-y-1">
                <div className="text-2xl font-extrabold text-gray-800 font-mono">
                  00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                </div>
                <div className="text-xs text-gray-500">
                  {isRecording ? '🔴 Đang ghi âm giọng nói...' : prepActive ? `⏳ Thời gian chuẩn bị: ${prepSeconds}s` : 'Sẵn sàng'}
                </div>
              </div>

              {/* Big Mic Button */}
              <div>
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="w-16 h-16 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-200 mx-auto transition-transform active:scale-95"
                  >
                    <Mic className="w-7 h-7" />
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-200 mx-auto transition-transform active:scale-95 animate-pulse"
                  >
                    <MicOff className="w-7 h-7" />
                  </button>
                )}
              </div>
            </div>

            {/* AI Grading Result Card */}
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-white to-brand-50/50 rounded-3xl p-6 border border-brand-200 shadow-md space-y-4"
              >
                <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-brand-500" />
                    <span className="font-bold text-gray-800 text-sm">Điểm TOEIC Speaking</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700">
                    Level {result.proficiencyLevel}
                  </span>
                </div>

                {/* Score Dial */}
                <div className="text-center py-2">
                  <div className="text-4xl font-black text-brand-600 tracking-tight">
                    {result.scaledScore} <span className="text-sm font-semibold text-gray-400">/ 200</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Tốc độ nói: <strong>{result.estimatedWpm} WPM</strong>
                  </div>
                </div>

                {/* 3 Sub-scores */}
                <div className="space-y-2 pt-2 border-t border-pink-100 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pronunciation:</span>
                    <span className="font-bold text-gray-800">{result.pronunciationScore}/100</span>
                  </div>
                  <div className="w-full bg-pink-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-500 h-full rounded-full" style={{ width: `${result.pronunciationScore}%` }} />
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-gray-600">Fluency:</span>
                    <span className="font-bold text-gray-800">{result.fluencyScore}/100</span>
                  </div>
                  <div className="w-full bg-pink-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-accent-500 h-full rounded-full" style={{ width: `${result.fluencyScore}%` }} />
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-gray-600">Intonation & Stress:</span>
                    <span className="font-bold text-gray-800">{result.intonationScore}/100</span>
                  </div>
                  <div className="w-full bg-pink-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-pink-400 h-full rounded-full" style={{ width: `${result.intonationScore}%` }} />
                  </div>
                </div>

                {/* AI Advice list */}
                <div className="pt-3 border-t border-pink-100 space-y-1.5">
                  <span className="text-xs font-bold text-gray-700 block">Lời khuyên từ AI:</span>
                  {result.feedback.map((fb, idx) => (
                    <p key={idx} className="text-xs text-gray-600 flex items-start gap-1.5 leading-relaxed">
                      <span className="text-brand-500">•</span>
                      <span>{fb}</span>
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
