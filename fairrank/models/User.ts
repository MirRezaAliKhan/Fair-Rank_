import prisma from '@/lib/db';

export const User = {
  findOne: (where: any) => {
    if (where.email) {
      return prisma.user.findUnique({ where: { email: where.email } });
    }
    return prisma.user.findFirst({ where });
  },
  create: (data: any) => prisma.user.create({ data }),
  deleteMany: (where: any = {}) => prisma.user.deleteMany({ where }),
  insertMany: async (items: any[]) => {
    return Promise.all(items.map((item) => prisma.user.create({ data: item })));
  },
};
