import { prisma } from '../index.ts';

export const getActivityById = async (activityId: number, userId: number) => {
  return prisma.activity.findFirst({
    where: { id: activityId, userId },
  });
};

export const getActivitiesByUser = async (userId: number) => {
  return prisma.activity.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });
};

export const createActivity = async (
  userId: number,
  name: string,
  date: Date,
  mood = 'Neutral',
  completed = false
) => {
  return prisma.activity.create({
    data: { userId, name, date, mood, completed },
  });
};

export const updateActivity = async (
  activityId: number,
  userId: number,
  name: string,
  date: Date,
  mood: string,
  completed: boolean
) => {
  const existing = await prisma.activity.findFirst({
    where: { id: activityId, userId },
  });

  if (!existing) return null;

  return prisma.activity.update({
    where: { id: activityId },
    data: { name, date, mood, completed },
  });
};

export const deleteActivity = async (activityId: number, userId: number) => {
  const existing = await prisma.activity.findFirst({
    where: { id: activityId, userId },
  });

  if (!existing) return null;

  return prisma.activity.delete({
    where: { id: activityId },
  });
};

export const checkAndResetMonthly = async () => {
  const latest = await prisma.activity.findFirst({
    orderBy: { date: 'desc' },
  });

  if (!latest) return;

  const now = new Date();
  const lastDate = new Date(latest.date);
  const monthDiff =
    now.getFullYear() * 12 + now.getMonth() -
    (lastDate.getFullYear() * 12 + lastDate.getMonth());

  if (monthDiff >= 1) {
    await prisma.activity.deleteMany({});
    console.log('[Reset] Activities cleared after a month');
  }
};
