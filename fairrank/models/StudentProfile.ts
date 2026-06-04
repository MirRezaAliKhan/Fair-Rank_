import prisma from '@/lib/db';

export const StudentProfile = {
  create: (data: any) => prisma.studentProfile.create({ data }),
  findOne: (where: any) => {
    if (where.userId) {
      return prisma.studentProfile.findUnique({ where: { userId: where.userId } });
    }
    return prisma.studentProfile.findFirst({ where });
  },
  findById: (id: string) => prisma.studentProfile.findUnique({ where: { id } }),
  findOneAndUpdate: async (where: any, data: any) => {
    const uniqueWhere = where.userId ? { userId: where.userId } : { id: where.id };
    return prisma.studentProfile.update({ where: uniqueWhere, data });
  },
  findByIdAndUpdate: (id: string, data: any) =>
    prisma.studentProfile.update({ where: { id }, data }),
  deleteMany: (where: any = {}) => prisma.studentProfile.deleteMany({ where }),
  insertMany: async (items: any[]) => {
    return Promise.all(items.map((item) => prisma.studentProfile.create({ data: item })));
  },
};
