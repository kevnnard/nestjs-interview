import { PrismaService } from '@ocmi/api/app/config/prisma/prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
  });

  afterEach(async () => {
    await prismaService.$disconnect();
  });

  it('should connect to the database on module initialization', async () => {
    await prismaService.onModuleInit();

    expect(prismaService.$disconnect()).toBe(false);
  });
});
