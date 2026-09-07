'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
  ChevronRight,
  History,
  TrendingUp,
  Loader2,
  Play,
} from 'lucide-react';
import { testApi, ApiResult } from '@/lib/api-client';

interface TestItem {
  id: string;
  title: string;
  description: string;
  mode: 'PRACTICE' | 'MOCK_TEST';
  durationMins: number;
  questionCount: number;
  bestScore: number | null;
  attemptCount: number;
}

interface AttemptItem {
  id: string;
  testId: string;
  totalScaled: number;
  listeningScaled: number;
  readingScaled: number;
  totalCorrect: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  completedAt: string;
  test: { title: string; mode: string };
}

export default function TestBankHubPage() {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [history, setHistory] = useState<AttemptItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'mini' | 'full' | 'history'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [testsRes, histRes] = await Promise.all([
        testApi.getTests() as Promise<ApiResult<TestItem[]>>,
        testApi.getHistory() as Promise<ApiResult<AttemptItem[]>>,
      ]);
      if (testsRes.success && testsRes.data) setTests(testsRes.data);
      if (histRes.success && histRes.data) setHistory(histRes.data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filteredTests = tests.filter((t) => {
    if (activeTab === 'mini') return t.mode === 'PRACTICE';
    if (activeTab === 'full') return t.mode === 'MOCK_TEST';
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-rose-400 animate-spin" />
        <p className="text-sm font-semibold text-[#3F3355]">Đang chuẩn bị ngân hàng đề thi TOEIC... 🌸</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass rounded-3xl p-6 sm:p-8 border border-pink-200/80 shadow-xs relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-500 text-xs font-bold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Hệ thống thi thử chuẩn ETS & Thang điểm quy đổi 10–990</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#3F3355] tracking-tight">
              Ngân hàng đề thi TOEIC 🎯
            </h1>
            <p className="text-xs sm:text-sm text-[#8B7E9C] mt-1 max-w-xl font-medium">
              Luyện tập đề rút gọn (Mini-test 25 phút) hoặc thi thử toàn diện (Full-test 120 phút). Điểm thi được quy đổi chính xác theo thang điểm TOEIC chính thức.
            </p>
          </div>

          <div className="w-full md:w-auto p-4 rounded-2xl bg-white/90 border border-pink-200 flex items-center gap-4 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-400 to-indigo-400 flex items-center justify-center text-white font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#8B7E9C]">Tổng số lượt thi</div>
              <div className="text-xl font-black text-[#3F3355]">
                {history.length} <span className="text-xs font-semibold text-[#8B7E9C]">lần hoàn thành</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/80 border border-pink-200 w-fit">
        {[
          { key: 'all', label: `Tất cả đề (${tests.length})` },
          { key: 'mini', label: 'Mini-Test (25p)' },
          { key: 'full', label: 'Full Mock Test (120p)' },
          { key: 'history', label: `Lịch sử thi (${history.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key as never)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-rose-400 text-white shadow-xs'
                : 'text-[#8B7E9C] hover:text-[#3F3355]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Test List or History */}
      {activeTab !== 'history' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="glass rounded-3xl p-6 border border-pink-200/80 shadow-xs hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${
                      test.mode === 'MOCK_TEST'
                        ? 'bg-purple-50 text-purple-600 border-purple-200'
                        : 'bg-rose-50 text-rose-500 border-rose-200'
                    }`}
                  >
                    {test.mode === 'MOCK_TEST' ? 'Full Test 120p' : 'Mini-Test 25p'}
                  </span>
                  <span className="text-xs text-[#8B7E9C] font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    {test.durationMins} phút • {test.questionCount} câu
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-[#3F3355] mb-1.5">{test.title}</h3>
                <p className="text-xs text-[#8B7E9C] line-clamp-2 leading-relaxed font-medium">
                  {test.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-pink-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#8B7E9C] block">Điểm cao nhất</span>
                  <span className="text-base font-black text-rose-500">
                    {test.bestScore !== null ? `${test.bestScore} / 990` : 'Chưa thi'}
                  </span>
                </div>

                <Link
                  href={`/tests/${test.id}`}
                  className="btn-primary text-xs px-5 py-2.5 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 mr-1 fill-white" />
                  Bắt đầu làm bài
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* History list */
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#8B7E9C] glass rounded-3xl">
              Bạn chưa hoàn thành bài thi nào. Hãy thử sức với Mini-Test 01 ngay!
            </div>
          ) : (
            history.map((attempt) => (
              <div
                key={attempt.id}
                className="glass rounded-2xl p-4 sm:p-5 border border-pink-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-100 text-rose-600">
                      {attempt.test.mode === 'MOCK_TEST' ? 'Full Test' : 'Mini-Test'}
                    </span>
                    <span className="text-xs text-[#8B7E9C] font-semibold">
                      {new Date(attempt.completedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-[#3F3355]">{attempt.test.title}</h4>
                  <div className="text-xs text-[#8B7E9C] font-medium mt-0.5">
                    Đúng {attempt.totalCorrect} / {attempt.totalQuestions} câu • Thời gian làm: {Math.round(attempt.timeSpentSeconds / 60)} phút
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-[#8B7E9C] block">Listening: {attempt.listeningScaled} | Reading: {attempt.readingScaled}</span>
                    <span className="text-2xl font-black text-rose-500">
                      {attempt.totalScaled} <span className="text-xs text-[#8B7E9C] font-normal">/ 990</span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
