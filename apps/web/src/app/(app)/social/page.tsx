'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Flame,
  UserPlus,
  Clock,
  Trophy,
  Target,
  Send,
  CalendarCheck2,
  MessageCircleHeart,
} from 'lucide-react';
import { socialApi } from '@/lib/api-client';

interface CoupleDashboardData {
  hasPartner: boolean;
  userA: {
    id: string;
    role: string;
    colorHex: string;
    name: string;
    avatarUrl?: string;
    streak: number;
    targetScore: number;
    minutesToday: number;
    isStudyingNow: boolean;
    lastStudiedAt?: string;
  };
  userB: {
    id: string;
    role: string;
    colorHex: string;
    name: string;
    avatarUrl?: string;
    streak: number;
    targetScore: number;
    minutesToday: number;
    isStudyingNow: boolean;
    lastStudiedAt?: string;
  };
  sharedGoal: {
    sharedStreak: number;
    weeklyWordsLearned: number;
    weeklyWordsTarget: number;
    percent: number;
  };
  habitWeek: {
    day: string;
    userACompleted: boolean;
    userBCompleted: boolean;
    togetherCompleted: boolean;
  }[];
}

interface PendingItem {
  friendshipId: string;
  requesterId: string;
  username: string;
  displayName: string;
}

const FALLBACK_COUPLE_DATA: CoupleDashboardData = {
  hasPartner: true,
  userA: {
    id: 'demo_user_a',
    role: 'User A (Bạn)',
    colorHex: '#FB7185',
    name: 'Bạn (Rose 🌹)',
    avatarUrl: undefined,
    streak: 4,
    targetScore: 750,
    minutesToday: 25,
    isStudyingNow: true,
    lastStudiedAt: new Date().toISOString(),
  },
  userB: {
    id: 'demo_user_b',
    role: 'User B (Người yêu)',
    colorHex: '#818CF8',
    name: 'Bạn Đồng Hành (Indigo 🍇)',
    avatarUrl: undefined,
    streak: 4,
    targetScore: 800,
    minutesToday: 30,
    isStudyingNow: true,
    lastStudiedAt: new Date().toISOString(),
  },
  sharedGoal: {
    sharedStreak: 4,
    weeklyWordsLearned: 68,
    weeklyWordsTarget: 100,
    percent: 68,
  },
  habitWeek: [
    { day: 'T2', userACompleted: true, userBCompleted: true, togetherCompleted: true },
    { day: 'T3', userACompleted: true, userBCompleted: true, togetherCompleted: true },
    { day: 'T4', userACompleted: true, userBCompleted: true, togetherCompleted: true },
    { day: 'T5', userACompleted: true, userBCompleted: true, togetherCompleted: true },
    { day: 'T6', userACompleted: true, userBCompleted: false, togetherCompleted: false },
    { day: 'T7', userACompleted: false, userBCompleted: false, togetherCompleted: false },
    { day: 'CN', userACompleted: false, userBCompleted: false, togetherCompleted: false },
  ],
};

const FALLBACK_LEADERBOARD = [
  { rank: 1, displayName: 'Alex & Mai 💕', totalXp: 1250, currentStreak: 14, targetScore: 850 },
  { rank: 2, displayName: 'Huy & Linh 🌸', totalXp: 980, currentStreak: 10, targetScore: 800 },
  { rank: 3, displayName: 'Nam & Trang 🍀', totalXp: 820, currentStreak: 7, targetScore: 750 },
  { rank: 4, displayName: 'Minh & Thảo 🍓', totalXp: 690, currentStreak: 5, targetScore: 700 },
];

export default function SocialCouplePage() {
  const [data, setData] = useState<CoupleDashboardData>(FALLBACK_COUPLE_DATA);
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<{ rank: number; displayName: string; totalXp: number; currentStreak: number; targetScore: number }[]>(FALLBACK_LEADERBOARD);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Love notes
  const [loveNote, setLoveNote] = useState('');
  const [notes, setNotes] = useState([
    { id: 1, sender: 'Bạn', text: 'Hôm nay cùng hoàn thành bài tập Part 5 nhé người thương! 🌸', time: '10 phút trước' },
    { id: 2, sender: 'Người ấy', text: 'Đã học xong 20 từ vựng chủ đề Office rồi nè, bạn cố lên nhé! 💪💕', time: '1 giờ trước' },
  ]);

  // Friend invite form
  const [inviteIdentifier, setInviteIdentifier] = useState('');
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);
  const [sendingInvite, setSendingInvite] = useState(false);

  useEffect(() => {
    async function loadSocialData() {
      try {
        const [dashRes, friendRes, leadRes] = await Promise.all([
          socialApi.getCoupleDashboard().catch(() => ({ success: false, data: null })),
          socialApi.getFriends().catch(() => ({ success: false, data: null })),
          socialApi.getLeaderboard().catch(() => ({ success: false, data: null })),
        ]);

        if (dashRes && dashRes.success && dashRes.data) {
          setData(dashRes.data);
          setIsDemoMode(false);
        } else {
          setIsDemoMode(true);
        }

        if (friendRes && friendRes.success && friendRes.data) {
          setPending(friendRes.data.pendingRequests || []);
        }

        if (leadRes && leadRes.success && leadRes.data) {
          setLeaderboard(leadRes.data);
        }
      } catch (err) {
        console.error('Failed to load social data', err);
        setIsDemoMode(true);
      }
    }
    loadSocialData();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteIdentifier.trim()) return;
    setSendingInvite(true);
    setInviteMsg(null);
    try {
      const res = await socialApi.sendFriendRequest(inviteIdentifier.trim());
      if (res.success) {
        setInviteMsg('Đã gửi lời mời kết bạn thành công! 💕');
        setInviteIdentifier('');
      } else {
        setInviteMsg((res as { success: false; error: { message: string } }).error?.message || 'Không gửi được lời mời kết bạn');
      }
    } catch (err: unknown) {
      setInviteMsg((err instanceof Error ? err.message : null) || 'Lỗi gửi lời mời');
    } finally {
      setSendingInvite(false);
    }
  };

  const handleAccept = async (friendshipId: string) => {
    try {
      await socialApi.acceptFriendRequest(friendshipId);
      const res = await socialApi.getFriends();
      if (res.success && res.data) {
        setPending(res.data.pendingRequests || []);
      }
      const dashRes = await socialApi.getCoupleDashboard();
      if (dashRes && dashRes.success && dashRes.data) {
        setData(dashRes.data);
      }
    } catch (err) {
      console.error('Failed to accept friend request', err);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loveNote.trim()) return;
    setNotes([
      { id: Date.now(), sender: 'Bạn', text: loveNote.trim(), time: 'Vừa xong' },
      ...notes,
    ]);
    setLoveNote('');
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-50/90 via-white to-accent-50/90 p-8 md:p-10 rounded-3xl border border-pink-200/90 shadow-sm relative overflow-hidden backdrop-blur-xl">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100/90 text-brand-700 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-current text-brand-500" />
            Couple Study Mode • Đồng Hành Cùng Tiến
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
            Góc Học Chung Cho 2 Bạn 🌹 & 🍇
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Học tiếng Anh mỗi ngày cùng người thương. Giữ vững ngọn lửa Streak chung, tích lũy từ vựng hàng tuần và hoàn thành thử thách 7 ngày không áp lực!
          </p>
        </div>

        {/* Demo Mode Reminder Pill */}
        {isDemoMode && (
          <div className="mt-4 p-3 bg-white/90 border border-pink-200 rounded-2xl text-xs text-brand-700 font-semibold flex items-center justify-between gap-3 shadow-xs">
            <span>
              💡 <strong>Bản xem trước trực quan:</strong> Khi đăng nhập và kết bạn, toàn bộ thời gian học và streak thật của hai bạn sẽ tự động hiển thị tại đây!
            </span>
            <a href="/login" className="px-3 py-1 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors whitespace-nowrap">
              Đăng nhập ngay
            </a>
          </div>
        )}
      </div>

      {/* Couple Mini-Dashboard Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-pink-200 shadow-sm relative overflow-hidden space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center">
          {/* User A (Rose #FB7185) */}
          <div className="md:col-span-3 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-50/90 via-pink-50/50 to-white border-2 border-brand-300 text-center space-y-4 shadow-sm relative group hover:border-brand-400 transition-all">
            <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-200 text-brand-800">
              Bạn (User A)
            </span>
            <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-tr from-brand-300 to-rose-400 border-4 border-white shadow-md flex items-center justify-center text-white font-black text-3xl">
              {data.userA.name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h3 className="font-extrabold text-gray-800 text-xl">{data.userA.name}</h3>
              <p className="text-xs font-semibold text-brand-600 mt-1">Mục tiêu: {data.userA.targetScore} TOEIC</p>
            </div>
            <div className="flex items-center justify-center gap-5 text-xs pt-3 border-t border-brand-100/80 font-medium">
              <span className="flex items-center gap-1.5 font-bold text-rose-600">
                <Flame className="w-4 h-4 fill-current text-rose-500 animate-bounce" /> {data.userA.streak} ngày streak
              </span>
              <span className="flex items-center gap-1.5 text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" /> {data.userA.minutesToday}p hôm nay
              </span>
            </div>
            <div className="pt-1">
              <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs ${
                data.userA.isStudyingNow ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${data.userA.isStudyingNow ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`} />
                {data.userA.isStudyingNow ? '🟢 Đang chăm chỉ học' : 'Chưa học hôm nay'}
              </span>
            </div>
          </div>

          {/* Heart Connection Center (1 Col) */}
          <div className="md:col-span-1 flex flex-col items-center justify-center text-center space-y-3 py-4">
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-400 via-pink-400 to-accent-400 text-white flex items-center justify-center shadow-lg shadow-pink-300/50"
            >
              <Heart className="w-8 h-8 fill-current" />
            </motion.div>
            <div>
              <div className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                Chung Streak
              </div>
              <div className="text-3xl font-black text-gray-800 font-mono mt-0.5">
                🔥 {data.sharedGoal.sharedStreak}
              </div>
              <span className="text-[10px] text-gray-400">ngày liên tiếp</span>
            </div>
          </div>

          {/* User B (Indigo #818CF8) */}
          <div className="md:col-span-3 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-blue-50/50 to-white border-2 border-accent-300 text-center space-y-4 shadow-sm relative group hover:border-accent-400 transition-all">
            <span className="absolute top-4 right-4 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accent-200 text-accent-800">
              Người yêu (User B)
            </span>
            <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-tr from-accent-300 to-indigo-400 border-4 border-white shadow-md flex items-center justify-center text-white font-black text-3xl">
              {data.userB.name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h3 className="font-extrabold text-gray-800 text-xl">{data.userB.name}</h3>
              <p className="text-xs font-semibold text-accent-600 mt-1">Mục tiêu: {data.userB.targetScore} TOEIC</p>
            </div>
            <div className="flex items-center justify-center gap-5 text-xs pt-3 border-t border-accent-100/80 font-medium">
              <span className="flex items-center gap-1.5 font-bold text-accent-600">
                <Flame className="w-4 h-4 fill-current text-accent-500 animate-bounce" /> {data.userB.streak} ngày streak
              </span>
              <span className="flex items-center gap-1.5 text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" /> {data.userB.minutesToday}p hôm nay
              </span>
            </div>
            <div className="pt-1">
              <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs ${
                data.userB.isStudyingNow ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${data.userB.isStudyingNow ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`} />
                {data.userB.isStudyingNow ? '🟢 Đang chăm chỉ học' : 'Chưa học hôm nay'}
              </span>
            </div>
          </div>
        </div>

        {/* Shared Weekly Words Progress */}
        <div className="pt-8 border-t border-pink-100 space-y-4">
          <div className="flex items-center justify-between text-sm md:text-base">
            <span className="font-bold text-gray-800 flex items-center gap-2.5">
              <Target className="w-5 h-5 text-brand-500" />
              Mục tiêu từ vựng chung tuần này:
            </span>
            <span className="font-extrabold text-brand-600">
              {data.sharedGoal.weeklyWordsLearned} / {data.sharedGoal.weeklyWordsTarget} từ ({data.sharedGoal.percent}%)
            </span>
          </div>
          {/* Dual-color Gradient Progress Bar */}
          <div className="w-full bg-pink-100/70 h-4 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-brand-400 via-pink-400 to-accent-400 h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.min(100, data.sharedGoal.percent)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            🌟 Mỗi từ mới một trong hai bạn học ở <strong>Vocabulary</strong> hoặc <strong>Skills</strong> đều được tự động cộng vào tiến độ chung!
          </p>
        </div>
      </div>

      {/* 7-Day Tick Habit Challenge */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2.5">
              <CalendarCheck2 className="w-5 h-5 text-brand-500" />
              Thử Thách 7 Ngày Tích Tắc Cùng Nhau
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Mỗi ngày cả hai cùng hoàn thành mục tiêu học, trái tim đôi lứa sẽ thắp sáng!
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand-500" /> Bạn (Rose)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-accent-500" /> Người ấy (Indigo)</span>
          </div>
        </div>

        {/* 7 Day Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-2">
          {data.habitWeek.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-3xl border text-center space-y-2.5 transition-all duration-200 ${
                item.togetherCompleted
                  ? 'bg-gradient-to-b from-brand-50/80 via-pink-50/40 to-accent-50/80 border-brand-300 shadow-sm hover:scale-105'
                  : 'bg-gray-50/40 border-gray-200'
              }`}
            >
              <span className="text-xs font-extrabold text-gray-700 block">{item.day}</span>
              <div className="flex items-center justify-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${item.userACompleted ? 'bg-brand-500' : 'bg-gray-300'}`} title="User A" />
                <span className={`w-3 h-3 rounded-full ${item.userBCompleted ? 'bg-accent-500' : 'bg-gray-300'}`} title="User B" />
              </div>
              <div className="text-2xl pt-1">
                {item.togetherCompleted ? '💖' : '🤍'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid 2 Columns: Love Notes & Friend Connect */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Couple Sticky Notes */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-sm space-y-5">
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2.5">
            <MessageCircleHeart className="w-5 h-5 text-brand-500" />
            Nhật Ký Lời Nhắn Yêu Thương
          </h3>
          <p className="text-xs text-gray-500">
            Gửi lời nhắn động viên người yêu trước mỗi buổi học:
          </p>

          <form onSubmit={handleAddNote} className="flex gap-2">
            <input
              type="text"
              value={loveNote}
              onChange={(e) => setLoveNote(e.target.value)}
              placeholder="Nhập lời nhắn cổ vũ..."
              className="flex-1 p-3 rounded-2xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button
              type="submit"
              disabled={!loveNote.trim()}
              className="px-4 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-200 transition-all active:scale-95 disabled:opacity-50"
            >
              Gửi 💕
            </button>
          </form>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {notes.map((n) => (
              <div
                key={n.id}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50/50 to-indigo-50/50 border border-pink-100 text-xs space-y-1"
              >
                <div className="flex justify-between items-center text-gray-400 text-[10px]">
                  <strong className="text-brand-600">{n.sender}</strong>
                  <span>{n.time}</span>
                </div>
                <p className="text-gray-700 font-medium leading-relaxed">{n.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Connect Partner & Leaderboard */}
        <div className="space-y-6">
          {/* Friend Request Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-base flex items-center gap-2.5">
              <UserPlus className="w-5 h-5 text-brand-500" />
              Kết Nối Bạn Học / Người Yêu
            </h3>
            <p className="text-xs text-gray-500">
              Nhập email hoặc username của người bạn muốn đồng hành học tập:
            </p>

            <form onSubmit={handleSendInvite} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteIdentifier}
                  onChange={(e) => setInviteIdentifier(e.target.value)}
                  placeholder="Email hoặc username..."
                  className="flex-1 p-3 rounded-2xl border border-pink-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
                <button
                  type="submit"
                  disabled={sendingInvite || !inviteIdentifier.trim()}
                  className="px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-brand-200"
                >
                  <Send className="w-3.5 h-3.5" />
                  Gửi
                </button>
              </div>
              {inviteMsg && (
                <p className="text-xs font-semibold text-brand-600">{inviteMsg}</p>
              )}
            </form>

            {/* Pending Requests */}
            {pending.length > 0 && (
              <div className="pt-3 border-t border-pink-100 space-y-2">
                <span className="text-xs font-bold text-gray-700">Lời mời đang chờ chấp nhận:</span>
                {pending.map((p) => (
                  <div key={p.friendshipId} className="flex items-center justify-between p-2.5 rounded-xl bg-pink-50/60 border border-pink-100 text-xs">
                    <span className="font-semibold text-gray-800">{p.displayName} (@{p.username})</span>
                    <button
                      onClick={() => handleAccept(p.friendshipId)}
                      className="px-3 py-1 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs"
                    >
                      Đồng ý
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Minimalist Leaderboard */}
          <div className="bg-white rounded-3xl p-6 border border-pink-200 shadow-sm space-y-3">
            <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Bảng Xếp Hạng Cặp Đôi Chăm Chỉ
            </h4>
            <div className="space-y-2">
              {leaderboard.map((l, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-pink-50/30 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {l.rank}
                    </span>
                    <span className="font-semibold text-gray-800">{l.displayName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-brand-600 font-bold">{l.totalXp} XP</span>
                    <span className="text-gray-400">🔥 {l.currentStreak}d</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
