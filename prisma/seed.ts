import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: "demo@growpath.ai",
      name: "Ari Student",
      energyLevel: "medium",
      preferredStudyDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
      breakDays: ["Saturday"],
      plantName: "Mochi",
      xp: 180,
      streak: 3,
      mood: "happy",
    },
  });

  const course = await prisma.course.create({
    data: {
      userId: user.id,
      name: "CS 32",
      color: "#7ba7ff",
    },
  });

  await prisma.assignment.createMany({
    data: [
      {
        userId: user.id,
        courseId: course.id,
        title: "Midterm study guide",
        difficulty: 4,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      },
      {
        userId: user.id,
        courseId: course.id,
        title: "Project milestone",
        difficulty: 5,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      },
    ],
  });

  console.log("Seed complete", user.email);
}

main().finally(() => prisma.$disconnect());
