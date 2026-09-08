import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

// Band ordering for linear interpolation (1 = lowest, 6 = highest)
const BAND_ORDER: Record<string, number> = {
  BAND_1: 1, BAND_2: 2, BAND_3: 3, BAND_4: 4, BAND_5: 5, BAND_6: 6,
};

// Estimated hours to advance one full band level
const HOURS_PER_BAND_LEVEL = 40;

// Milestone check-in frequency (every N weeks)
const MILESTONE_INTERVAL_WEEKS = 4;

export interface GenerateRoadmapInput {
  targetBand: string;
  targetScore: number;
  studyDeadline?: string;
  dailyGoalMinutes: number;
  placementTestResultId?: string;
  currentBand?: string; // from placement result, default BAND_1
}

@Injectable()
export class RoadmapService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Generate Roadmap ─────────────────────────────────────────

  async generateRoadmap(userId: string, input: GenerateRoadmapInput) {
    // Check if user already has an active roadmap
    const existing = await this.prisma.roadmap.findUnique({ where: { userId } });
    if (existing && existing.isActive) {
      // Deactivate existing roadmap before creating new
      await this.prisma.roadmap.update({
        where: { id: existing.id },
        data: { isActive: false },
      });
    }

    const currentBand = input.currentBand ?? 'BAND_1';
    const totalWeeks = this.calculateTotalWeeks(
      currentBand,
      input.targetBand,
      input.dailyGoalMinutes,
    );

    // Create roadmap record
    const roadmap = await this.prisma.roadmap.create({
      data: {
        userId,
        placementTestResultId: input.placementTestResultId ?? null,
        targetBand:   input.targetBand as never,
        targetScore:  input.targetScore,
        studyDeadline: input.studyDeadline ? new Date(input.studyDeadline) : null,
        totalWeeks,
        currentWeek: 1,
        isActive:    true,
      },
    });

    // Generate nodes for all weeks
    const nodes = this.generateNodes(totalWeeks, currentBand, input.targetBand);

    await this.prisma.roadmapNode.createMany({
      data: nodes.map((node) => ({
        ...node,
        roadmapId: roadmap.id,
        type:   node.type   as never,
        status: node.status as never,
      })),
    });

    // Also update UserProfile with target band/score
    await this.prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        displayName:     userId,
        targetBand:      input.targetBand as never,
        targetScore:     input.targetScore,
        dailyGoalMinutes: input.dailyGoalMinutes,
        studyDeadline:   input.studyDeadline ? new Date(input.studyDeadline) : null,
      },
      update: {
        targetBand:      input.targetBand as never,
        targetScore:     input.targetScore,
        dailyGoalMinutes: input.dailyGoalMinutes,
        studyDeadline:   input.studyDeadline ? new Date(input.studyDeadline) : null,
      },
    });

    return this.getRoadmapWithNodes(roadmap.id);
  }

  // ── Get Active Roadmap ────────────────────────────────────────

  async getActiveRoadmap(userId: string) {
    const roadmap = await this.prisma.roadmap.findFirst({
      where: { userId, isActive: true },
      include: {
        nodes: { orderBy: [{ weekNumber: 'asc' }, { dayNumber: 'asc' }, { orderInDay: 'asc' }] },
      },
    });

    if (!roadmap) throw new NotFoundException('No active roadmap found');
    return roadmap;
  }

  async getRoadmapNodes(userId: string, week?: number) {
    const roadmap = await this.prisma.roadmap.findFirst({
      where: { userId, isActive: true },
    });
    if (!roadmap) throw new NotFoundException('No active roadmap found');

    return this.prisma.roadmapNode.findMany({
      where: {
        roadmapId: roadmap.id,
        ...(week ? { weekNumber: week } : {}),
      },
      orderBy: [{ weekNumber: 'asc' }, { dayNumber: 'asc' }, { orderInDay: 'asc' }],
    });
  }

  // ── Milestone Check-in ────────────────────────────────────────

  async milestoneCheckin(userId: string, weekNumber: number, feedback: 'too_easy' | 'just_right' | 'too_hard') {
    const roadmap = await this.prisma.roadmap.findFirst({
      where: { userId, isActive: true },
    });
    if (!roadmap) throw new NotFoundException('No active roadmap found');

    // Find the milestone node for this week
    const milestoneNode = await this.prisma.roadmapNode.findFirst({
      where: {
        roadmapId:  roadmap.id,
        weekNumber,
        type:       'MINI_TEST',
        status:     { in: ['AVAILABLE', 'IN_PROGRESS'] },
      },
    });

    if (!milestoneNode) {
      throw new NotFoundException(`No available milestone found for week ${weekNumber}`);
    }

    // Mark milestone as completed
    await this.prisma.roadmapNode.update({
      where: { id: milestoneNode.id },
      data:  { status: 'COMPLETED' },
    });

    // Adjust daily goal based on feedback (linear interpolation tweak)
    let goalAdjustment = 0;
    if (feedback === 'too_easy')  goalAdjustment = -5;  // reduce by 5 min — progressing fast
    if (feedback === 'too_hard')  goalAdjustment = +10; // add 10 min — needs more time

    if (goalAdjustment !== 0) {
      await this.prisma.userProfile.update({
        where: { userId },
        data: {
          dailyGoalMinutes: {
            increment: goalAdjustment,
          },
        },
      });
    }

    // Unlock next week's nodes
    const nextWeek = weekNumber + 1;
    await this.prisma.roadmapNode.updateMany({
      where: {
        roadmapId:  roadmap.id,
        weekNumber: nextWeek,
        status:     'LOCKED',
      },
      data: { status: 'AVAILABLE' },
    });

    // Update roadmap currentWeek
    await this.prisma.roadmap.update({
      where: { id: roadmap.id },
      data:  { currentWeek: nextWeek },
    });

    return {
      message:        `Week ${weekNumber} milestone completed`,
      nextWeek,
      goalAdjustment,
    };
  }

  // ── Private: Roadmap Calculation ─────────────────────────────

  /**
   * Linear interpolation for weeks calculation:
   * weeks = ceil(bandGap × hoursPerBand / (dailyGoalMinutes/60) / 7)
   */
  private calculateTotalWeeks(
    currentBand: string,
    targetBand:  string,
    dailyGoalMinutes: number,
  ): number {
    const currentLevel = BAND_ORDER[currentBand] ?? 1;
    const targetLevel  = BAND_ORDER[targetBand]  ?? 4;
    const bandGap      = Math.max(1, targetLevel - currentLevel);

    const totalHours  = bandGap * HOURS_PER_BAND_LEVEL;
    const dailyHours  = dailyGoalMinutes / 60;
    const totalDays   = totalHours / dailyHours;
    const totalWeeks  = Math.ceil(totalDays / 7);

    // Clamp: minimum 4 weeks, maximum 52 weeks (1 year)
    return Math.min(52, Math.max(4, totalWeeks));
  }

  /**
   * Generate week-by-week nodes with linear interpolation of content.
   * Early weeks: heavy vocab + grammar foundation
   * Mid weeks: balanced + mini-tests every 4 weeks
   * Late weeks: full-test practice
   */
  private generateNodes(totalWeeks: number, currentBand: string, targetBand: string) {
    const nodes: Array<{
      type: string;
      status: string;
      title: string;
      description: string;
      weekNumber: number;
      dayNumber: number;
      orderInDay: number;
      xpReward: number;
    }> = [];

    const currentLevel = BAND_ORDER[currentBand] ?? 1;
    const targetLevel  = BAND_ORDER[targetBand]  ?? 4;

    for (let week = 1; week <= totalWeeks; week++) {
      const progress = (week - 1) / Math.max(1, totalWeeks - 1); // 0→1 linear
      const isEarly  = progress < 0.33;
      const isMid    = progress >= 0.33 && progress < 0.75;

      // Milestone at every MILESTONE_INTERVAL_WEEKS
      const isMilestone = week % MILESTONE_INTERVAL_WEEKS === 0;

      // Week 1 is AVAILABLE; rest start LOCKED (unlocked by milestone check-ins)
      const weekStatus = week === 1 ? 'AVAILABLE' : 'LOCKED';

      // Interpolate band focus: smoothly increase from current → target
      const interpolatedLevel = currentLevel + (targetLevel - currentLevel) * progress;
      const weekBandFocus = `Band ${Math.round(interpolatedLevel)}`;

      if (isEarly) {
        // Early: 3 vocab + 2 grammar per week
        nodes.push({ type: 'VOCABULARY_TOPIC', status: weekStatus, weekNumber: week, dayNumber: 1, orderInDay: 1, xpReward: 15, title: `Từ vựng TOEIC — Tuần ${week}`, description: `${weekBandFocus} — Chủ đề công sở và kinh doanh cơ bản` });
        nodes.push({ type: 'VOCABULARY_TOPIC', status: weekStatus, weekNumber: week, dayNumber: 2, orderInDay: 1, xpReward: 15, title: `Từ vựng theo chủ đề — Tuần ${week}`, description: `${weekBandFocus} — Từ vựng thương mại và tài chính` });
        nodes.push({ type: 'GRAMMAR_TOPIC',    status: weekStatus, weekNumber: week, dayNumber: 3, orderInDay: 1, xpReward: 20, title: `Ngữ pháp TOEIC — Tuần ${week}`, description: `${weekBandFocus} — Thì động từ và cấu trúc câu cơ bản` });
        nodes.push({ type: 'VOCABULARY_TOPIC', status: weekStatus, weekNumber: week, dayNumber: 4, orderInDay: 1, xpReward: 15, title: `Ôn tập từ vựng — Tuần ${week}`, description: `${weekBandFocus} — Review và flashcard` });
        nodes.push({ type: 'GRAMMAR_TOPIC',    status: weekStatus, weekNumber: week, dayNumber: 5, orderInDay: 1, xpReward: 20, title: `Bài tập ngữ pháp — Tuần ${week}`, description: `${weekBandFocus} — Luyện tập Part 5` });
      } else if (isMid) {
        // Mid: 2 vocab + 1 grammar + 1 reading + 1 listening
        nodes.push({ type: 'VOCABULARY_TOPIC', status: weekStatus, weekNumber: week, dayNumber: 1, orderInDay: 1, xpReward: 15, title: `Từ vựng nâng cao — Tuần ${week}`, description: `${weekBandFocus} — Từ vựng học thuật và chuyên ngành` });
        nodes.push({ type: 'GRAMMAR_TOPIC',    status: weekStatus, weekNumber: week, dayNumber: 2, orderInDay: 1, xpReward: 20, title: `Ngữ pháp nâng cao — Tuần ${week}`, description: `${weekBandFocus} — Cấu trúc phức tạp và Part 6` });
        nodes.push({ type: 'READING_SKILL',    status: weekStatus, weekNumber: week, dayNumber: 3, orderInDay: 1, xpReward: 25, title: `Kỹ năng đọc hiểu — Tuần ${week}`, description: `${weekBandFocus} — Part 7: Đọc văn bản dài` });
        nodes.push({ type: 'LISTENING_SKILL',  status: weekStatus, weekNumber: week, dayNumber: 4, orderInDay: 1, xpReward: 25, title: `Kỹ năng nghe — Tuần ${week}`, description: `${weekBandFocus} — Part 3 & 4: Đoạn hội thoại` });
        nodes.push({ type: 'VOCABULARY_TOPIC', status: weekStatus, weekNumber: week, dayNumber: 5, orderInDay: 1, xpReward: 15, title: `Ôn luyện từ vựng — Tuần ${week}`, description: `${weekBandFocus} — SRS review` });
      } else {
        // Late: 1 vocab + 1 grammar + 2 reading + 1 full practice
        nodes.push({ type: 'VOCABULARY_TOPIC', status: weekStatus, weekNumber: week, dayNumber: 1, orderInDay: 1, xpReward: 15, title: `Từ vựng chuyên sâu — Tuần ${week}`, description: `${weekBandFocus} — Collocations và idioms kinh doanh` });
        nodes.push({ type: 'GRAMMAR_TOPIC',    status: weekStatus, weekNumber: week, dayNumber: 2, orderInDay: 1, xpReward: 20, title: `Ngữ pháp chuyên sâu — Tuần ${week}`, description: `${weekBandFocus} — Inverted structures và formal grammar` });
        nodes.push({ type: 'READING_SKILL',    status: weekStatus, weekNumber: week, dayNumber: 3, orderInDay: 1, xpReward: 25, title: `Đọc hiểu nâng cao — Tuần ${week}`, description: `${weekBandFocus} — Double/triple passages` });
        nodes.push({ type: 'MINI_TEST',        status: weekStatus, weekNumber: week, dayNumber: 4, orderInDay: 1, xpReward: 40, title: `Mini Test — Tuần ${week}`, description: `${weekBandFocus} — 25 câu luyện tập có tính giờ` });
        nodes.push({ type: 'FULL_TEST',        status: weekStatus, weekNumber: week, dayNumber: 5, orderInDay: 1, xpReward: 80, title: `Full Test — Tuần ${week}`, description: `${weekBandFocus} — Đề thi mô phỏng 200 câu` });
      }

      // Add milestone check-in node
      if (isMilestone) {
        nodes.push({
          type: 'MINI_TEST',
          status: weekStatus,
          weekNumber: week,
          dayNumber: 7,
          orderInDay: 1,
          xpReward: 50,
          title: `🏆 Milestone — Tuần ${week}`,
          description: `Kiểm tra tiến độ và điều chỉnh kế hoạch học tập`,
        });
      }
    }

    return nodes;
  }

  private async getRoadmapWithNodes(roadmapId: string) {
    return this.prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: {
        nodes: {
          orderBy: [{ weekNumber: 'asc' }, { dayNumber: 'asc' }, { orderInDay: 'asc' }],
        },
      },
    });
  }
}
