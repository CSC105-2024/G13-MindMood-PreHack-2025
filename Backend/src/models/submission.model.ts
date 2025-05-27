import { prisma } from '../index.js';

export interface CreateSubmissionData {
  userId: number;
  week: number;
  day: number;
  overallMood: string;
  overallMessage: string;
  totalActivities: number;
  calmCount: number;
  neutralCount: number;
  stressedCount: number;
  calmPercentage: number;
  neutralPercentage: number;
  stressedPercentage: number;
  activitiesData: string; // JSON string of activities
}

export class SubmissionModel {
  static async create(data: CreateSubmissionData) {
    return await prisma.submission.create({
      data: {
        userId: data.userId,
        week: data.week,
        day: data.day,
        overallMood: data.overallMood,
        overallMessage: data.overallMessage,
        totalActivities: data.totalActivities,
        calmCount: data.calmCount,
        neutralCount: data.neutralCount,
        stressedCount: data.stressedCount,
        calmPercentage: data.calmPercentage,
        neutralPercentage: data.neutralPercentage,
        stressedPercentage: data.stressedPercentage,
        activitiesData: data.activitiesData,
      },
    });
  }

  static async findByUserAndDate(userId: number, week: number, day: number) {
    return await prisma.submission.findFirst({
      where: {
        userId,
        week,
        day,
      },
    });
  }

  static async findAllByUser(userId: number) {
    return await prisma.submission.findMany({
      where: {
        userId,
      },
      orderBy: [
        { week: 'asc' },
        { day: 'asc' },
      ],
    });
  }

  static async findById(id: number, userId: number) {
    return await prisma.submission.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  static async delete(id: number, userId: number) {
    return await prisma.submission.delete({
      where: {
        id,
      },
    });
  }

  // Clear all submissions for a user
  static async clearAllByUser(userId: number) {
    const result = await prisma.submission.deleteMany({
      where: {
        userId,
      },
    });
    return result.count;
  }
}