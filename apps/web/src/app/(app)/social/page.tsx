'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Flame,
  Users,
  UserPlus,
  CheckCircle2,
  Clock,
  Sparkles,
  Trophy,
  Target,
  Send,
  CalendarCheck2,
  Smile,
  ShieldCheck
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

interface FriendItem {
  friendshipId: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  currentStreak: number;
  totalXp: number;
  targetScore: number;
}

interface PendingItem {
  friendshipId: string;
  requesterId: string;
  username: string;
  displayName: string;
}

export default function SocialCouplePage() {
  const [data, setData] = useState<CoupleDashboardData | null>(null);
  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Friend invite form
  const [inviteIdentifier, setInviteIdentifier] = useState('');
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);
  const [sendingInvite, setSendingInvite] = useState(false);

  useEffect(() => {
    async function loadSocialData() {
      try {
        const [dashRes, friendRes, leadRes] = await Promise.all([
          socialApi.getCoupleDashboard(),
          socialApi.getFriends(),
          socialApi.getLeaderboard(),
        ]);

        if (dashRes.success && dashRes.data) {
          setData(dashRes.data);
        }
        if (friendRes.success && friendRes.data) {
          setFriends(friendRes.data.friends || []);
          setPending(friendRes.data.pendingRequests || []);
        }
        if (leadRes.success && leadRes.data) {
          setLeaderboard(leadRes.data);
        }
      } catch (err) {
        console.error('Failed to load social data', err);
      } finally {
        setLoading(false);
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
        setInviteMsg((res as any).error || 'Không gửi được lời mời kết bạn');
      }
    } catch (err: any) {
      setInviteMsg(err.message || 'Lỗi gửi lời mời');
    } finally {
      setSendingInvite(false);
    }
  };

  const handleAccept = async (friendshipId: string) => {
    try {
      await socialApi.acceptFriendRequest(friendshipId);
      // Reload friends
      const res = await socialApi.getFriends();
      if (res.success && res.data) {
        setFriends(res.data.friends);
        setPending(res.data.pendingRequests);
      }
    } catch (err) {
      console.error('Failed to accept friend request', err);
    }
  };

  if (loading || !data) {
    return (
      <div className="py-16 text-center text-gray-500">
        <div className="animate-spin w-8 h-8 border-4 border-brand-400 border-t-transparent rounded-full mx-auto mb-3" />
        Đang tải Couple & Study Together Hub...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-50 via-white to-accent-50 p-6 md:p-8 rounded-3xl border border-pink-200 shadow-sm relative overflow-hidden">
        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-current text-brand-500" />
            Couple Study Mode • Đồng Hành Cùng Tiến
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Góc Học Chung Cho 2 Bạn 🌹 & 🍇
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Học tiếng Anh mỗi ngày cùng người thương. Giữ vững ngọn lửa Streak chung, tích lũy từ vựng hàng tuần và hoàn thành thử thách 7 ngày không áp lực!
          </p>
        </div>
      </div>

      {/* Couple Mini-Dashboard Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-pink-200 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center">
          {/* User A (Rose #FB7185) */}
          <div className="md:col-span-3 p-6 rounded-2xl bg-gradient-to-br from-rose-50/70 to-pink-50/40 border border-brand-200 text-center space-y-3 relative">
            <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-200 text-brand-800">
              Bạn (User A)
            </span>
            <div className="w-20 h-20 rounded-full mx-auto bg-brand-100 border-4 border-white shadow-md flex items-center justify-center text-brand-600 font-extrabold text-2xl">
              {data.userA.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{data.userA.name}</h3>
              <p className="text-xs text-brand-600 font-medium">Mục tiêu: {data.userA.targetScore} TOEIC</p>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs pt-2 border-t border-brand-100">
              <span className="flex items-center gap-1 font-semibold text-rose-600">
                <Flame className="w-4 h-4 fill-current" /> {data.userA.streak} ngày streak
              </span>
              <span className="flex items-center gap-1 text-gray-600">
                <Clock className="w-3.5 h-3.5" /> {data.userA.minutesToday}p hôm nay
              </span>
            </div>
            <div className="pt-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                data.userA.isStudyingNow ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
              }`}>
                <span className={`w-2 h-2 rounded-full ${data.userA.isStudyingNow ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                {data.userA.isStudyingNow ? '🟢 Đang chăm chỉ học' : 'Chưa học hôm nay'}
              </span>
            </div>
          </div>

          {/* Heart Connection Center (1 Col) */}
          <div className="md:col-span-1 flex flex-col items-center justify-center text-center space-y-2">
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-400 to-accent-400 text-white flex items-center justify-center shadow-lg shadow-pink-200"
            >
              <Heart className="w-6 h-6 fill-current" />
            </motion.div>
            <div className="text-xs font-bold text-brand-600">
              Chung Streak
            </div>
            <div className="text-xl font-black text-gray-800 font-mono">
              🔥 {data.sharedGoal.sharedStreak}
            </div>
          </div>

          {/* User B (Indigo #818CF8) */}
          <div className="md:col-span-3 p-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/40 border border-accent-200 text-center space-y-3 relative">
            <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-200 text-accent-800">
              Người yêu (User B)
            </span>
            <div className="w-20 h-20 rounded-full mx-auto bg-accent-100 border-4 border-white shadow-md flex items-center justify-center text-accent-600 font-extrabold text-2xl">
              {data.userB.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{data.userB.name}</h3>
              <p className="text-xs text-accent-600 font-medium">Mục tiêu: {data.userB.targetScore} TOEIC</p>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs pt-2 border-t border-accent-100">
              <span className="flex items-center gap-1 font-semibold text-accent-600">
                <Flame className="w-4 h-4 fill-current" /> {data.userB.streak} ngày streak
              </span>
              <span className="flex items-center gap-1 text-gray-600">
                <Clock className="w-3.5 h-3.5" /> {data.userB.minutesToday}p hôm nay
              </span>
            </div>
            <div className="pt-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                data.userB.isStudyingNow ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
              }`}>
                <span className={`w-2 h-2 rounded-full ${data.userB.isStudyingNow ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                {data.userB.isStudyingNow ? '🟢 Đang chăm chỉ học' : 'Chưa học hôm nay'}
              </span>
            </div>
          </div>
        </div>

        {/* Shared Weekly Words Progress */}
        <div className="mt-8 pt-6 border-t border-pink-100 space-y-3">
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="font-bold text-gray-700 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-500" />
              Mục tiêu từ vựng chung tuần này:
            </span>
            <span className="font-bold text-brand-600">
              {data.sharedGoal.weeklyWordsLearned} / {data.sharedGoal.weeklyWordsTarget} từ ({data.sharedGoal.percent}%)
            </span>
          </div>
          {/* Dual-color Gradient Progress Bar */}
          <div className="w-full bg-pink-100 h-3.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-brand-400 via-rose-400 to-accent-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, data.sharedGoal.percent)}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 text-center">
            Mỗi từ mới một trong hai bạn ôn tập đều được cộng trực tiếp vào tiến độ chung!
          </p>
        </div>
      </div>

      {/* 7-Day Tick Habit Challenge */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-pink-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
              <CalendarCheck2 className="w-5 h-5 text-brand-500" />
              Thử Thách 7 Ngày Tích Tắc Cùng Nhau
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Mỗi ngày cả hai cùng hoàn thành mục tiêu học, trái tim sẽ thắp sáng!
            </p>
          </div>
        </div>

        {/* 7 Day Grid */}
        <div className="grid grid-cols-7 gap-2 md:gap-4 pt-3">
          {data.habitWeek.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-center space-y-2 transition-all ${
                item.togetherCompleted
                  ? 'bg-gradient-to-b from-brand-50 to-accent-50 border-brand-300 shadow-sm'
                  : 'bg-gray-50/50 border-gray-200'
              }`}
            >
              <span className="text-xs font-bold text-gray-600 block">{item.day}</span>
              <div className="flex items-center justify-center gap-1">
                <span className={`w-2.5 h-2.5 rounded-full ${item.userACompleted ? 'bg-brand-500' : 'bg-gray-300'}`} title="User A" />
                <span className={`w-2.5 h-2.5 rounded-full ${item.userBCompleted ? 'bg-accent-500' : 'bg-gray-300'}`} title="User B" />
              </div>
              <div className="text-sm">
                {item.togetherCompleted ? '💖' : '🤍'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Friends & Invite Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Send Friend Request */}
        <div className="bg-white rounded-3xl p-6 border border-pink-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
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
                className="flex-1 p-3 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <button
                type="submit"
                disabled={sendingInvite || !inviteIdentifier.trim()}
                className="px-4 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-brand-200"
              >
                <Send className="w-3.5 h-3.5" />
                Gửi
              </button>
            </div>
            {inviteMsg && (
              <p className="text-xs font-semibold text-brand-600">{inviteMsg}</p>
            )}
          </form>

          {/* Pending Invitations */}
          {pending.length > 0 && (
            <div className="pt-3 border-t border-pink-100 space-y-2">
              <span className="text-xs font-bold text-gray-700">Lời mời đang chờ chấp nhận:</span>
              {pending.map((p) => (
                <div key={p.friendshipId} className="flex items-center justify-between p-2.5 rounded-xl bg-pink-50/50 border border-pink-100 text-xs">
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

        {/* Minimalist Top Learners Leaderboard */}
        <div className="bg-white rounded-3xl p-6 border border-pink-200 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Top Học Viên Chăm Chỉ
          </h3>

          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((l, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-pink-50/30 text-xs">
                <div className="flex items-center gap-2.5">
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
  );
}
