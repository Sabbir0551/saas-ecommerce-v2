import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient;
  isDbConnected?: boolean;
  lastDbCheck?: number;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

let isDbConnected = false;
let lastCheckTime = 0;
const CHECK_INTERVAL = 30000; // 30 seconds cache for DB status

export async function isDatabaseAvailable(): Promise<boolean> {
  const now = Date.now();
  if (now - lastCheckTime < CHECK_INTERVAL && lastCheckTime > 0) {
    return isDbConnected;
  }

  try {
    // Quick non-blocking probe (300ms timeout)
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 300)),
    ]);
    isDbConnected = true;
  } catch {
    isDbConnected = false;
  }
  lastCheckTime = now;
  return isDbConnected;
}

export function getCachedDatabaseStatus(): boolean {
  return isDbConnected;
}
