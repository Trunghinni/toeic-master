'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  BookOpen,
  CheckCircle2,
  Lock,
  Clock,
  Calendar,
  Award,
  Sparkles,
  Flame,
  ChevronRight,
  Check,
  Loader2,
} from 'lucide-react';
import { roadmapApi, ApiResult } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth.store';

interface RoadmapNode {
  id: string;
  roadmapId: string;
  weekNumber: number;
  dayNumber: number;
  orderInDay: number;
  title: string;
  description: string | null;
  type: 'VOCABULARY' | 'GRAMMAR' | 'MINI_TEST' | 'FULL_TEST' | 'REVIEW' | 'SPEAKING_WRITING';
  status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
  skill: string;
  estimatedMinutes: number;
}

interface RoadmapData {
  id: string;
  userId: string;
  targetBand: string;
  targetScore: number;
  totalWeeks: number;
  currentWeek: number;
  studyDeadline: string | null;
  isActive: boolean;
  nodes: RoadmapNode[];
}

interface TypeConfigItem {
  label: string;
  icon: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

const DEFAULT_TYPE_CONFIG: TypeConfigItem = {
  label: 'Từ vựng',
  icon: '📚',
  bgClass: 'bg-rose-50',
  textClass: 'text-rose-500',
  borderClass: 'border-rose-200',
};

const TYPE_CONFIG: Record<string, TypeConfigItem> = {
  VOCABULARY: DEFAULT_TYPE_CONFIG,
  GRAMMAR: {
    label: 'Ngữ pháp',
    icon: '✏️',
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-600',
    borderClass: 'border-indigo-200',
  },
  MINI_TEST: {
    label: 'Mini Test',
    icon: '📝',
    bgClass: 'bg-pink-50',
    textClass: 'text-pink-600',
    borderClass: 'border-pink-200',
  },
  FULL_TEST: {
    label: 'Full Test',
    icon: '🎯',
    bgClass: 'bg-purple-50',
    textClass: 'text-purple-600',
    borderClass: 'border-purple-200',
  },
  REVIEW: {
    label: 'Ôn tập tuần',
    icon: '🔄',
    bgClass: 'bg-indigo-50/70',
    textClass: 'text-indigo-500',
    borderClass: 'border-indigo-200',
  },
  SPEAKING_WRITING: {
    label: 'Luyện 4 kỹ năng',
    icon: '🎙️',
    bgClass: 'bg-rose-50/70',
    textClass: 'text-rose-500',
    borderClass: 'border-rose-200',
  },
};

export default function RoadmapPage() {
  const { user } = useAuthStore();

  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  // Check-in modal state
  const [checkinWeek, setCheckinWeek] = useState<number | null>(null);
  const [checkinFeedback, setCheckinFeedback] = useState<'too_easy' | 'just_right' | 'too_hard'>('just_right');
  const [isCheckinLoading, setIsCheckinLoading] = useState(false);
  const [checkinSuccessMsg, setCheckinSuccessMsg] = useState<string | null>(null);

  const fetchRoadmap = async () => {
    setIsLoading(true);

    const res = await roadmapApi.getMyRoadmap() as ApiResult<RoadmapData>;
    if (res.success && res.data) {
      setRoadmap(res.data);
      setSelectedWeek(res.data.currentWeek || 1);
    } else {
      setRoadmap(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const handleMilestoneCheckin = async () => {
    if (!checkinWeek) return;
    setIsCheckinLoading(true);

    const res = await roadmapApi.checkIn(checkinWeek, checkinFeedback);
    if (res.success) {
      setCheckinSuccessMsg(`Đã ghi nhận đánh giá tuần ${checkinWeek}. Hệ thống đã cân chỉnh độ khó phù hợp! 💕`);
      setTimeout(() => {
        setCheckinWeek(null);
        setCheckinSuccessMsg(null);
        fetchRoadmap();
      }, 1500);
    } else {
      alert('Không thể hoàn tất check-in: ' + res.error.message);
    }
    setIsCheckinLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-rose-400 animate-spin" />
        <p className="text-sm font-semibold text-[#3F3355]">Đang tải lộ trình học cá nhân hóa... 🌸</p>
      </div>
    );
  }

  // No active roadmap state
  if (!roadmap) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 glass rounded-3xl text-center border border-pink-200 shadow-md backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-200">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#3F3355] tracking-tight mb-2">
          Bạn chưa kích hoạt lộ trình học
        </h2>
        <p className="text-sm text-[#8B7E9C] mb-6 leading-relaxed font-medium">
          Hãy hoàn thành bài kiểm tra xếp lớp (15 phút) hoặc thiết lập mục tiêu trong Onboarding để AI kiến tạo lộ trình học riêng cho bạn và bạn đồng hành.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/placement-test" className="btn-primary w-full sm:w-auto">
            <BookOpen className="w-4 h-4 mr-2" />
            Làm bài test xếp lớp
          </Link>
          <Link href="/onboarding" className="btn-secondary w-full sm:w-auto">
            Thiết lập mục tiêu nhanh
          </Link>
        </div>
      </div>
    );
  }

  // Computed summary
  const totalNodes = roadmap.nodes.length;
  const completedNodes = roadmap.nodes.filter((n) => n.status === 'COMPLETED').length;
  const overallProgress = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;
  const currentWeekNodes = roadmap.nodes.filter((n) => n.weekNumber === selectedWeek);

  return (
    <div className="space-y-6 pb-12">
      {/* Roadmap Header Card */}
      <div className="glass rounded-3xl p-6 sm:p-8 shadow-sm border border-pink-200 relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-500 text-xs font-bold mb-2.5 border border-rose-200/80">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Lộ trình cá nhân hóa Linear Interpolation 🌸</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#3F3355] tracking-tight">
              Mục tiêu: {roadmap.targetScore} điểm ({roadmap.targetBand.replace('_', ' ')})
            </h1>
            <p className="text-xs sm:text-sm text-[#8B7E9C] mt-1 flex items-center gap-4 flex-wrap font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Tổng {roadmap.totalWeeks} tuần học
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                Mỗi ngày {user?.profile?.dailyGoalMinutes ?? 30} phút
              </span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
                Tuần hiện tại: Tuần {roadmap.currentWeek}
              </span>
            </p>
          </div>

          {/* Overall Progress Gauge */}
          <div className="w-full md:w-64 p-4 rounded-2xl bg-white/90 border border-pink-200 shadow-xs">
            <div className="flex justify-between items-center text-xs font-bold text-[#3F3355] mb-2">
              <span>Tiến độ tổng thể</span>
              <span className="text-rose-500">{overallProgress}%</span>
            </div>
            <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden mb-2">
              <motion.div
                className="h-full bg-gradient-to-r from-rose-400 to-indigo-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#8B7E9C] font-semibold">
              <span>Đã xong: {completedNodes} bài</span>
              <span>Tổng: {totalNodes} bài</span>
            </div>
          </div>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {Array.from({ length: roadmap.totalWeeks }, (_, i) => i + 1).map((week) => {
          const isSelected = selectedWeek === week;
          const isCurrent = roadmap.currentWeek === week;
          const isMilestone = week % 4 === 0;

          return (
            <button
              key={week}
              type="button"
              onClick={() => setSelectedWeek(week)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all relative ${
                isSelected
                  ? 'bg-rose-400 text-white shadow-md shadow-rose-300/30 scale-[1.02]'
                  : isCurrent
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-white/90 border border-pink-200 text-[#3F3355] hover:border-pink-300'
              }`}
            >
              <span>Tuần {week}</span>
              {isMilestone && (
                <span className="ml-1.5 text-[10px] bg-rose-200/50 px-1.5 py-0.5 rounded-full">
                  🏆
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Week Title & Milestone Check-in Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-lg font-extrabold text-[#3F3355]">
            Nội dung học Tuần {selectedWeek}
          </h2>
          <p className="text-xs text-[#8B7E9C] font-medium">
            {selectedWeek <= 2
              ? 'Tập trung củng cố từ vựng cơ bản và ngữ pháp nền tảng'
              : selectedWeek % 4 === 0
              ? 'Tuần đánh giá cột mốc (Milestone Assessment) & ôn tập tổng hợp'
              : 'Luyện tập phối hợp kỹ năng đọc, nghe và các cấu trúc hay ra đề'}
          </p>
        </div>

        {selectedWeek % 4 === 0 && (
          <button
            type="button"
            onClick={() => setCheckinWeek(selectedWeek)}
            className="btn-accent text-xs px-4 py-2 self-start sm:self-auto"
          >
            <Award className="w-4 h-4 mr-1.5" />
            Check-in cột mốc Tuần {selectedWeek}
          </button>
        )}
      </div>

      {/* Staggered Node Timeline */}
      <div className="space-y-3.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedWeek}
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.07,
                },
              },
            }}
            className="space-y-3"
          >
            {currentWeekNodes.length === 0 ? (
              <div className="p-8 text-center text-sm text-[#8B7E9C] glass rounded-3xl">
                Chưa có nội dung cho tuần này.
              </div>
            ) : (
              currentWeekNodes.map((node) => {
                const conf: TypeConfigItem = TYPE_CONFIG[node.type] ?? DEFAULT_TYPE_CONFIG;
                const isLocked = node.status === 'LOCKED';
                const isCompleted = node.status === 'COMPLETED';
                const isAvailable = node.status === 'AVAILABLE' || node.status === 'IN_PROGRESS';

                return (
                  <motion.div
                    key={node.id}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className={`glass rounded-3xl p-4 sm:p-5 border transition-all flex items-center justify-between gap-4 ${
                      isCompleted
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : isAvailable
                        ? 'border-pink-300 bg-white/95 shadow-xs hover:border-rose-300'
                        : 'border-pink-100 bg-white/50 opacity-70'
                    }`}
                  >
                    {/* Left details */}
                    <div className="flex items-center gap-4">
                      {/* Status Icon badge */}
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 border ${
                          isCompleted
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-600'
                            : isAvailable
                            ? `${conf.bgClass} ${conf.borderClass} ${conf.textClass}`
                            : 'bg-pink-50 border-pink-100 text-[#8B7E9C]'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : isLocked ? (
                          <Lock className="w-5 h-5 text-[#8B7E9C]" />
                        ) : (
                          conf.icon
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${conf.bgClass} ${conf.textClass} border ${conf.borderClass}`}
                          >
                            {conf.label}
                          </span>
                          <span className="text-xs text-[#8B7E9C] font-semibold">
                            Ngày {node.dayNumber}
                          </span>
                          <span className="text-xs text-[#8B7E9C] font-semibold">•</span>
                          <span className="text-xs text-[#8B7E9C] font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            {node.estimatedMinutes} phút
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-[#3F3355] leading-snug">
                          {node.title}
                        </h3>

                        {node.description && (
                          <p className="text-xs text-[#8B7E9C] mt-0.5 line-clamp-1 sm:line-clamp-none font-medium">
                            {node.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right CTA */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-bold">
                          <Check className="w-3.5 h-3.5" />
                          Đã xong
                        </span>
                      ) : isAvailable ? (
                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              `Bắt đầu bài học: "${node.title}". Hãy cùng luyện tập nào!`
                            )
                          }
                          className="btn-primary text-xs px-4 py-2 shadow-xs"
                        >
                          Học ngay
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-50 text-[#8B7E9C] text-xs font-semibold border border-pink-100">
                          <Lock className="w-3 h-3" />
                          Đang khóa
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Milestone Check-in Modal */}
      <AnimatePresence>
        {checkinWeek !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-3xl p-6 sm:p-8 max-w-md w-full border border-pink-200 shadow-xl backdrop-blur-xl relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-[#3F3355] text-center mb-1">
                Check-in Cột Mốc Tuần {checkinWeek} 🏆
              </h3>
              <p className="text-xs text-[#8B7E9C] text-center mb-6 font-medium">
                Đánh giá mức độ phù hợp của lượng bài học trong 4 tuần qua để hệ thống cân đối lại nhịp độ học tập.
              </p>

              {checkinSuccessMsg ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm text-center flex items-center justify-center gap-2 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>{checkinSuccessMsg}</span>
                </div>
              ) : (
                <>
                  <div className="space-y-2.5 mb-6">
                    {[
                      { key: 'too_easy', label: 'Quá dễ', desc: 'Chúng mình hoàn thành rất nhanh, muốn tăng khối lượng học' },
                      { key: 'just_right', label: 'Vừa sức', desc: 'Tốc độ học lý tưởng, giữ nguyên nhịp độ này' },
                      { key: 'too_hard', label: 'Quá khó', desc: 'Khối lượng hơi nhiều, cần giãn bớt hoặc chia nhỏ hơn' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setCheckinFeedback(item.key as never)}
                        className={`w-full p-3 rounded-2xl border text-left transition-all ${
                          checkinFeedback === item.key
                            ? 'border-rose-400 bg-rose-50 ring-2 ring-rose-200 font-bold'
                            : 'border-pink-200 bg-white hover:border-rose-200'
                        }`}
                      >
                        <div className="text-sm font-bold text-[#3F3355]">{item.label}</div>
                        <div className="text-xs text-[#8B7E9C] font-medium">{item.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      disabled={isCheckinLoading}
                      onClick={() => setCheckinWeek(null)}
                      className="px-4 py-2 rounded-xl border border-pink-200 bg-white text-xs font-semibold text-[#8B7E9C] hover:bg-rose-50/50"
                    >
                      Để sau
                    </button>
                    <button
                      type="button"
                      disabled={isCheckinLoading}
                      onClick={handleMilestoneCheckin}
                      className="btn-primary text-xs px-5 py-2"
                    >
                      {isCheckinLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                          Đang lưu...
                        </>
                      ) : (
                        'Xác nhận check-in'
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
