'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Headphones, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Volume2, 
  MessageSquare, 
  Users, 
  Mic, 
  FileText, 
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { skillsApi } from '@/lib/api-client';

interface SkillPart {
  part: string;
  name: string;
  category: 'Listening' | 'Reading';
  description: string;
  itemCount: number;
  icon: string;
}

export default function SkillsHubPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'Listening' | 'Reading'>('ALL');
  const [parts, setParts] = useState<SkillPart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkills() {
      try {
        const res = await skillsApi.getOverview();
        if (res.success && res.data?.parts) {
          setParts(res.data.parts as SkillPart[]);
        }
      } catch (err) {
        console.error('Failed to load skills overview', err);
      } finally {
        setLoading(false);
      }
    }
    loadSkills();
  }, []);

  const filteredParts = parts.filter((p) => {
    if (activeTab === 'ALL') return true;
    return p.category === activeTab;
  });

  const getIcon = (partKey: string) => {
    switch (partKey) {
      case 'PART_1': return <Headphones className="w-6 h-6 text-brand-500" />;
      case 'PART_2': return <MessageSquare className="w-6 h-6 text-accent-500" />;
      case 'PART_3': return <Users className="w-6 h-6 text-brand-500" />;
      case 'PART_4': return <Mic className="w-6 h-6 text-accent-500" />;
      case 'PART_5': return <FileText className="w-6 h-6 text-brand-500" />;
      case 'PART_6': return <FileSpreadsheet className="w-6 h-6 text-accent-500" />;
      case 'PART_7': return <BookOpen className="w-6 h-6 text-brand-500" />;
      default: return <Sparkles className="w-6 h-6 text-brand-500" />;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-brand-50 via-white to-accent-50 p-6 md:p-8 rounded-3xl border border-pink-200 shadow-sm relative overflow-hidden"
      >
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-600 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Luyện Kỹ Năng Chuyên Sâu 7 Part
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
            Listening & Reading Skills Hub 🎧📖
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Phân tách ma trận 7 phần TOEIC: Nghe tranh, phản xạ câu hỏi ngắn, hội thoại đến đọc hiểu đoạn văn kép. Có bộ phát audio tùy chỉnh tốc độ, transcript ẩn/hiện và tự động lưu câu làm sai vào Mistake Notebook!
          </p>
        </div>

        {/* Tab Filters */}
        <div className="relative z-10 mt-6 flex gap-2">
          {(['ALL', 'Listening', 'Reading'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-200'
                  : 'bg-white text-gray-600 hover:bg-pink-50/50 border border-pink-100'
              }`}
            >
              {tab === 'ALL' ? 'Tất cả 7 Part' : tab === 'Listening' ? '🎧 Listening (Part 1-4)' : '📖 Reading (Part 5-7)'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Parts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-pink-50/40 rounded-2xl animate-pulse border border-pink-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParts.map((item, idx) => (
            <motion.div
              key={item.part}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-3xl p-6 border border-pink-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-pink-50 rounded-2xl group-hover:bg-brand-50 transition-colors">
                    {getIcon(item.part)}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    item.category === 'Listening' 
                      ? 'bg-brand-50 text-brand-600 border border-brand-200' 
                      : 'bg-accent-50 text-accent-600 border border-accent-200'
                  }`}>
                    {item.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-brand-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-pink-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  {item.itemCount} bộ bài tập thực hành
                </span>
                <Link
                  href={`/skills/${item.part}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-colors"
                >
                  Luyện tập <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
