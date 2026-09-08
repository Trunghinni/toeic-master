'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { grammarApi, ApiResult } from '@/lib/api-client';

interface GrammarTopicSummary {
  id: string;
  title: string;
  description: string;
  formula: string;
  targetBand: string;
  exerciseCount: number;
  needsReview: boolean;
  accuracyPercent: number;
  attemptsCount: number;
}

export default function GrammarHubPage() {
  const [topics, setTopics] = useState<GrammarTopicSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await grammarApi.getTopics() as ApiResult<GrammarTopicSummary[]>;
      if (res.success && res.data) {
        setTopics(res.data);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const needsReviewTopics = topics.filter((t) => t.needsReview);

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-rose-400 animate-spin" />
        <p className="text-sm font-semibold text-[#3F3355]">Đang tải các chủ điểm ngữ pháp TOEIC... 🌸</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-pink-200/80 shadow-xs relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ngữ pháp tinh gọn & Thuật toán gợi ý ôn tập thông minh</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#3F3355] tracking-tight">
              Chuyên đề ngữ pháp TOEIC 🌸
            </h1>
            <p className="text-xs sm:text-sm text-[#8B7E9C] mt-1 max-w-xl font-medium">
              Mỗi bài giải thích súc tích ≤150 từ, kèm 3-5 bài tập áp dụng tức thì. Nếu tỷ lệ sai vượt quá 40% trong 5 lần làm gần nhất, hệ thống sẽ tự động nhắc bạn ôn lại.
            </p>
          </div>

          {/* Review recommendation alert badge */}
          {needsReviewTopics.length > 0 ? (
            <div className="w-full md:w-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600 mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Gợi ý cần ôn lại ({needsReviewTopics.length})</span>
              </div>
              <p className="text-[11px] text-rose-400 font-medium">
                Tỷ lệ sai &gt; 40% trong các bài tập gần đây
              </p>
            </div>
          ) : (
            <div className="w-full md:w-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs flex items-center gap-2 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Nắm vững các chủ điểm đã học!</span>
            </div>
          )}
        </div>
      </div>

      {/* Needs Review Section if any */}
      {needsReviewTopics.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-rose-500 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Các chủ điểm AI khuyến nghị ôn lại ngay
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {needsReviewTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/grammar/${topic.id}`}
                className="p-5 rounded-3xl bg-rose-50/70 border-2 border-rose-300 shadow-xs hover:border-rose-400 hover:shadow-md transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-200 text-rose-700">
                      CẦN ÔN LẠI
                    </span>
                    <span className="text-xs text-rose-500 font-bold">
                      Độ chính xác: {topic.accuracyPercent}%
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#3F3355]">{topic.title}</h3>
                  <p className="text-xs text-[#8B7E9C] mt-0.5 line-clamp-1 font-medium">{topic.formula}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-rose-500 flex-shrink-0 ml-3" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All Grammar Topics */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-[#3F3355] uppercase tracking-wider">
          Toàn bộ danh mục chủ điểm
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/grammar/${topic.id}`}
              className="glass rounded-3xl p-5 border border-pink-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
                    {topic.targetBand.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-[#8B7E9C] font-semibold">
                    {topic.exerciseCount} bài tập
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-[#3F3355] group-hover:text-indigo-600 transition-colors mb-1">
                  {topic.title}
                </h3>
                <p className="text-xs text-[#8B7E9C] line-clamp-2 font-medium mb-3">
                  {topic.description}
                </p>

                {topic.formula && (
                  <div className="p-2.5 rounded-xl bg-pink-50/50 border border-pink-100 text-[11px] font-mono text-indigo-600">
                    💡 {topic.formula}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>
                  {topic.attemptsCount > 0
                    ? `Đã làm ${topic.attemptsCount} lần (${topic.accuracyPercent}% đúng)`
                    : 'Chưa làm bài tập'}
                </span>
                <ChevronRight className="w-4 h-4 text-[#8B7E9C] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
