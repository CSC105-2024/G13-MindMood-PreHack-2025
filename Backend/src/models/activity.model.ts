import { prisma } from '../index.js';

export interface CreateActivityData {
  name: string;
  mood?: string;
  week: number;
  day: number;
  userId: number;
}

export interface UpdateActivityData {
  name?: string;
  mood?: string;
  completed?: boolean;
}

export class ActivityModel {
  static async create(data: CreateActivityData) {
    return await prisma.activity.create({
      data: {
        name: data.name,
        mood: data.mood || 'Neutral',
        week: data.week,
        day: data.day,
        userId: data.userId,
      },
    });
  }

  static async findByUserAndDate(userId: number, week: number, day: number) {
    return await prisma.activity.findMany({
      where: {
        userId,
        week,
        day,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  static async findById(id: number, userId: number) {
    return await prisma.activity.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  static async update(id: number, userId: number, data: UpdateActivityData) {
    return await prisma.activity.update({
      where: {
        id,
      },
      data,
    });
  }

  static async delete(id: number, userId: number) {
    return await prisma.activity.delete({
      where: {
        id,
      },
    });
  }

  static async findAllByUser(userId: number) {
    return await prisma.activity.findMany({
      where: {
        userId,
      },
      orderBy: [
        { week: 'asc' },
        { day: 'asc' },
        { createdAt: 'asc' },
      ],
    });
  }

  // Clear all activities for a specific day
  static async clearByUserAndDate(userId: number, week: number, day: number) {
    const result = await prisma.activity.deleteMany({
      where: {
        userId,
        week,
        day,
      },
    });
    return result.count;
  }

  // Clear all activities for a user
  static async clearAllByUser(userId: number) {
    const result = await prisma.activity.deleteMany({
      where: {
        userId,
      },
    });
    return result.count;
  }
}