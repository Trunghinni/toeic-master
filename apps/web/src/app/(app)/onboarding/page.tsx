'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Calendar,
  Clock,
  User,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Compass,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { userApi, roadmapApi } from '@/lib/api-client';
import { BandLevel, BAND_SCORE_RANGES } from '@toeic-master/shared-types';

const TARGET_SCORES = [450, 500, 600, 700, 750, 800, 850, 900, 950, 990];
const DAILY_MINUTES = [15, 20, 30, 45, 60];

function getBandFromScore(score: number): BandLevel {
  if (score <= 250) return BandLevel.BAND_1;
  if (score <= 400) return BandLevel.BAND_2;
  if (score <= 600) return BandLevel.BAND_3;
  if (score <= 750) return BandLevel.BAND_4;
  if (score <= 900) return BandLevel.BAND_5;
  return BandLevel.BAND_6;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [targetScore, setTargetScore] = useState<number>(650);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(30);
  const [studyDeadline, setStudyDeadline] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0] ?? '';
  });
  const [displayName, setDisplayName] = useState('');
  const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh');

  // Step 3 choice: 'test' | 'manual'
  const [pathChoice, setPathChoice] = useState<'test' | 'manual'>('test');
  const [selectedCurrentBand, setSelectedCurrentBand] = useState<BandLevel>(BandLevel.BAND_2);

  useEffect(() => {
    if (user?.profile?.displayName) {
      setDisplayName(user.profile.displayName);
    }
  }, [user]);

  const nextStep = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    const targetBand = getBandFromScore(targetScore);

    // 1. Update user profile
    await userApi.updateProfile({
      displayName: displayName || user?.username || 'Học viên',
      targetScore,
      targetBand,
      dailyGoalMinutes,
      studyDeadline: new Date(studyDeadline).toISOString(),
      timezone,
    });

    if (pathChoice === 'test') {
      router.push('/placement-test');
    } else {
      await roadmapApi.generate({
        targetBand,
        targetScore,
        dailyGoalMinutes,
        studyDeadline: new Date(studyDeadline).toISOString(),
        currentBand: selectedCurrentBand,
      });
      router.push('/roadmap');
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Step Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-500 text-xs font-bold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Thiết lập lộ trình học cá nhân hóa 🌸</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#3F3355] tracking-tight">
          {step === 1 && 'Mục tiêu học tập của bạn'}
          {step === 2 && 'Thông tin & Thói quen học'}
          {step === 3 && 'Lựa chọn điểm xuất phát'}
        </h1>
        <p className="text-sm text-[#8B7E9C] mt-1 font-medium">
          {step === 1 && 'Hệ thống sẽ phân bổ khối lượng bài học tối ưu theo thời gian'}
          {step === 2 && 'Giúp hệ thống nhắc nhở và đồng hành cùng bạn và bạn đồng hành'}
          {step === 3 && 'Bạn muốn làm bài kiểm tra xếp lớp hay tự chọn trình độ ban đầu?'}
        </p>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-rose-400 shadow-sm shadow-rose-300/50'
                  : s < step
                  ? 'w-4 bg-indigo-400'
                  : 'w-2 bg-pink-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Wizard Card */}
      <div className="glass rounded-3xl p-6 sm:p-8 shadow-md border border-pink-200/80 backdrop-blur-xl relative overflow-hidden min-h-[440px] flex flex-col justify-between">
        <AnimatePresence custom={direction} mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="space-y-6"
            >
              {/* Target Score Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#3F3355] mb-3">
                  <Target className="w-4 h-4 text-rose-400" />
                  <span>Điểm mục tiêu TOEIC</span>
                  <span className="ml-auto text-xl font-extrabold text-rose-500 bg-rose-50 px-3 py-1 rounded-xl border border-rose-200">
                    {targetScore} điểm
                  </span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {TARGET_SCORES.map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setTargetScore(score)}
                      className={`py-2 px-1 text-center rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        targetScore === score
                          ? 'bg-rose-400 text-white shadow-md shadow-rose-400/30 scale-[1.03]'
                          : 'bg-white/90 border border-pink-200 text-[#3F3355] hover:border-rose-300 hover:bg-rose-50/50'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Goal Minutes */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#3F3355] mb-3">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>Thời gian bạn có thể dành mỗi ngày</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {DAILY_MINUTES.map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDailyGoalMinutes(mins)}
                      className={`py-2.5 px-2 text-center rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        dailyGoalMinutes === mins
                          ? 'bg-indigo-400 text-white shadow-md shadow-indigo-400/30 scale-[1.03]'
                          : 'bg-white/90 border border-pink-200 text-[#3F3355] hover:border-indigo-300 hover:bg-indigo-50/50'
                      }`}
                    >
                      {mins} phút
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#3F3355] mb-2">
                  <Calendar className="w-4 h-4 text-rose-400" />
                  <span>Thời hạn dự kiến thi (Deadline)</span>
                </label>
                <input
                  type="date"
                  value={studyDeadline}
                  onChange={(e) => setStudyDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-white/90 text-[#3F3355] focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm font-medium"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="space-y-6"
            >
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#3F3355] mb-2">
                  <User className="w-4 h-4 text-rose-400" />
                  <span>Tên hiển thị trong ứng dụng</span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Long & Mai Lan"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-white/90 text-[#3F3355] focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#3F3355] mb-2">
                  Múi giờ nhắc học
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 bg-white/90 text-[#3F3355] focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-sm"
                >
                  <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
                  <option value="Asia/Tokyo">Nhật Bản / Hàn Quốc (GMT+9)</option>
                  <option value="America/New_York">Hoa Kỳ (EST - GMT-5)</option>
                  <option value="Europe/London">Vương Quốc Anh (GMT+0)</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 text-xs text-[#3F3355] leading-relaxed">
                💡 <strong>Mẹo cùng học:</strong> Đặt mục tiêu học mỗi ngày từ 20–30 phút giúp hai bạn dễ dàng duy trì streak học tập liên tục và hỗ trợ nhau mỗi ngày!
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Choice 1: Placement Test */}
                <div
                  onClick={() => setPathChoice('test')}
                  className={`cursor-pointer p-5 rounded-2xl border-2 transition-all relative ${
                    pathChoice === 'test'
                      ? 'border-rose-400 bg-rose-50/70 shadow-sm shadow-rose-300/20'
                      : 'border-pink-200/80 bg-white/80 hover:border-rose-300'
                  }`}
                >
                  {pathChoice === 'test' && (
                    <CheckCircle2 className="absolute top-3.5 right-3.5 w-5 h-5 text-rose-400" />
                  )}
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500 mb-3 font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#3F3355] text-sm mb-1">Làm bài test xếp lớp</h3>
                  <p className="text-xs text-[#8B7E9C] leading-relaxed">
                    100 câu trắc nghiệm nhanh để hệ thống đo đạc chính xác trình độ khởi đầu và vẽ lộ trình tối ưu nhất.
                  </p>
                </div>

                {/* Choice 2: Skip and self-select */}
                <div
                  onClick={() => setPathChoice('manual')}
                  className={`cursor-pointer p-5 rounded-2xl border-2 transition-all relative ${
                    pathChoice === 'manual'
                      ? 'border-indigo-400 bg-indigo-50/70 shadow-sm shadow-indigo-300/20'
                      : 'border-pink-200/80 bg-white/80 hover:border-indigo-300'
                  }`}
                >
                  {pathChoice === 'manual' && (
                    <CheckCircle2 className="absolute top-3.5 right-3.5 w-5 h-5 text-indigo-400" />
                  )}
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-500 mb-3 font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#3F3355] text-sm mb-1">Tôi đã biết band điểm</h3>
                  <p className="text-xs text-[#8B7E9C] leading-relaxed">
                    Bỏ qua bài test và tự chọn band điểm hiện tại để kích hoạt ngay lộ trình luyện tập hàng ngày.
                  </p>
                </div>
              </div>

              {/* If Manual selected, pick current band */}
              {pathChoice === 'manual' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2 pt-2"
                >
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3F3355]">
                    Chọn trình độ hiện tại của bạn:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(BAND_SCORE_RANGES).map(([bandKey, info]) => (
                      <button
                        key={bandKey}
                        type="button"
                        onClick={() => setSelectedCurrentBand(bandKey as BandLevel)}
                        className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                          selectedCurrentBand === bandKey
                            ? 'border-indigo-400 bg-indigo-50 font-bold text-indigo-700 ring-2 ring-indigo-200'
                            : 'border-pink-200 bg-white text-[#3F3355] hover:border-indigo-200'
                        }`}
                      >
                        <div className="font-bold text-[#3F3355]">{bandKey.replace('_', ' ')}</div>
                        <div className="text-[11px] text-[#8B7E9C]">{info.label}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons Navigation */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-pink-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-pink-200 bg-white text-[#3F3355] text-sm font-semibold hover:bg-rose-50/50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="btn-primary text-sm px-6 py-2.5"
            >
              Tiếp tục
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinish}
              className="btn-accent text-sm px-6 py-2.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Đang khởi tạo lộ trình...
                </>
              ) : pathChoice === 'test' ? (
                <>
                  Bắt đầu làm bài test
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              ) : (
                <>
                  Khám phá lộ trình ngay
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
