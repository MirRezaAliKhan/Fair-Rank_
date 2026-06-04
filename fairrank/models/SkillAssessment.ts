import prisma from '@/lib/db';

export const SkillAssessment = {
  create: (data: any) => prisma.skillAssessment.create({ data }),
};
