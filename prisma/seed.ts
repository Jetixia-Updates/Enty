import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // Create users
  const wife = await prisma.user.upsert({
    where: { email: "wife@homequeen.com" },
    update: {},
    create: {
      email: "wife@homequeen.com",
      passwordHash,
      name: "Sara Ahmed",
      role: "WIFE",
      isVerified: true,
    },
  });

  const providerUser = await prisma.user.upsert({
    where: { email: "provider@homequeen.com" },
    update: {},
    create: {
      email: "provider@homequeen.com",
      passwordHash,
      name: "Ahmed Hassan",
      role: "SERVICE_PROVIDER",
      isVerified: true,
    },
  });

  // Create family
  const family = await prisma.family.upsert({
    where: { id: "seed-family-1" },
    update: {},
    create: {
      id: "seed-family-1",
      name: "Ahmed Family",
    },
  });

  await prisma.user.update({
    where: { id: wife.id },
    data: { familyId: family.id },
  });

  // Create services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: "seed-svc-cleaning" },
      update: {},
      create: {
        id: "seed-svc-cleaning",
        name: "Home Cleaning",
        description: "Deep cleaning for your home",
        category: "CLEANING",
        basePrice: 150,
      },
    }),
    prisma.service.upsert({
      where: { id: "seed-svc-plumbing" },
      update: {},
      create: {
        id: "seed-svc-plumbing",
        name: "Plumbing",
        description: "Fixes and installations",
        category: "PLUMBING",
        basePrice: 200,
      },
    }),
    prisma.service.upsert({
      where: { id: "seed-svc-babysitter" },
      update: {},
      create: {
        id: "seed-svc-babysitter",
        name: "Babysitting",
        description: "Professional childcare",
        category: "BABYSITTER",
        basePrice: 80,
      },
    }),
  ]);

  // Create provider
  await prisma.provider.upsert({
    where: { id: "seed-provider-1" },
    update: {},
    create: {
      id: "seed-provider-1",
      userId: providerUser.id,
      serviceId: services[0].id,
      bio: "Professional cleaner with 5+ years experience.",
      rating: 4.8,
      reviewCount: 24,
      isApproved: true,
      isAvailable: true,
    },
  });

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      { title: "Morning cleaning", userId: wife.id, familyId: family.id, status: "PENDING" },
      { title: "Grocery shopping", userId: wife.id, familyId: family.id, status: "PENDING" },
      { title: "Pay electricity bill", userId: wife.id, familyId: family.id, status: "COMPLETED", completedAt: new Date() },
    ],
  });

  // Create sample expenses
  await prisma.expense.createMany({
    data: [
      { amount: 500, category: "FOOD", description: "Groceries", userId: wife.id, familyId: family.id },
      { amount: 350, category: "BILLS", description: "Electricity", userId: wife.id, familyId: family.id },
      { amount: 200, category: "EDUCATION", description: "School supplies", userId: wife.id, familyId: family.id },
    ],
  });

  // Create sample notifications
  await prisma.notification.create({
    data: {
      title: "Welcome to Home Queen!",
      message: "Start by adding your first task or tracking an expense.",
      type: "info",
      userId: wife.id,
    },
  });

  console.log("Seed completed successfully!");
  console.log("Test login: wife@homequeen.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
