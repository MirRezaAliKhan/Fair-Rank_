import prisma from '@/lib/db';

export const JobRole = {
  create: (data: any) => prisma.jobRole.create({ data }),
  findMany: (where: any) => prisma.jobRole.findMany({ where }),
  findByIdAndUpdate: (id: string, data: any) =>
    prisma.jobRole.update({ where: { id }, data }),
};
