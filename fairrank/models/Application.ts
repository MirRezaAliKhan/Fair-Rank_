import prisma from '@/lib/db';

export const Application = {
  create: (data: any) => prisma.application.create({ data }),
  findOne: (where: any) => prisma.application.findFirst({ where }),
  findByIdAndUpdate: (id: string, data: any) =>
    prisma.application.update({ where: { id }, data }),
  findMany: (where: any) =>
    prisma.application.findMany({ where, include: { student: true }, orderBy: { score: 'desc' } }),
};
