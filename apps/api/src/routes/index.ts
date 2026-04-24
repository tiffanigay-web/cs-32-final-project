import { Router } from "express";
import { z } from "zod";
import { generatePlan } from "../services/planner.js";
import { assignmentXp, levelFromXp, moodFromEvents, sessionXp, themeFromLevel } from "../lib/xp.js";
import { store } from "../lib/store.js";

const router = Router();

const plannerSchema = z.object({
  courses: z.array(z.object({ name: z.string(), color: z.string().optional() })),
  assignments: z.array(
    z.object({
      title: z.string(),
      dueDate: z.string(),
      difficulty: z.number().min(1).max(5),
      courseName: z.string(),
    }),
  ),
  energyLevel: z.enum(["low", "medium", "high"]),
  preferredStudyDays: z.array(z.string()),
  breakDays: z.array(z.string()),
  pastStudySessions: z.array(
    z.object({
      date: z.string(),
      durationMinutes: z.number(),
      completed: z.boolean(),
    }),
  ),
});

router.get("/health", (_req, res) => res.json({ ok: true }));

router.get("/users", (_req, res) => res.json(Array.from(store.users.values())));
router.post("/users", (req, res) => {
  const id = `user-${crypto.randomUUID()}`;
  const next = {
    id,
    name: req.body.name,
    email: req.body.email,
    energyLevel: req.body.energyLevel ?? "medium",
    preferredStudyDays: req.body.preferredStudyDays ?? [],
    breakDays: req.body.breakDays ?? [],
    plantName: req.body.plantName ?? "Sprout",
    xp: 0,
    streak: 0,
    mood: "idle" as const,
  };
  store.users.set(id, next);
  res.status(201).json(next);
});

router.get("/courses", (_req, res) => res.json(Array.from(store.courses.values())));
router.post("/courses", (req, res) => {
  const id = `course-${crypto.randomUUID()}`;
  const course = { id, ...req.body };
  store.courses.set(id, course);
  res.status(201).json(course);
});

router.get("/assignments", (_req, res) => res.json(Array.from(store.assignments.values())));
router.post("/assignments", (req, res) => {
  const id = `assignment-${crypto.randomUUID()}`;
  const assignment = { id, completed: false, xpAwarded: 0, ...req.body };
  store.assignments.set(id, assignment);
  res.status(201).json(assignment);
});

router.post("/assignments/:id/complete", (req, res) => {
  const assignment = store.assignments.get(req.params.id);
  if (!assignment) return res.status(404).json({ message: "Assignment not found" });
  const xpAwarded = assignmentXp(assignment.difficulty);
  assignment.completed = true;
  assignment.xpAwarded = xpAwarded;
  const user = store.users.get(assignment.userId);
  if (user) {
    user.xp += xpAwarded;
    user.streak += 1;
    user.mood = moodFromEvents({ streak: user.streak });
  }
  return res.json({ assignment, xpAwarded, user });
});

router.get("/study-sessions", (_req, res) => res.json(Array.from(store.sessions.values())));
router.post("/study-sessions", (req, res) => {
  const id = `session-${crypto.randomUUID()}`;
  const minutes = Number(req.body.durationMinutes ?? 25);
  const abandoned = Boolean(req.body.abandoned);
  const completed = !abandoned;
  const xpAwarded = completed ? sessionXp(minutes) : 0;

  const session = {
    id,
    userId: req.body.userId,
    durationMinutes: minutes,
    completed,
    abandoned,
    date: new Date().toISOString(),
    xpAwarded,
  };

  store.sessions.set(id, session);

  const user = store.users.get(session.userId);
  if (user) {
    user.xp += xpAwarded;
    user.mood = moodFromEvents({ abandoned, streak: user.streak });
  }

  res.status(201).json({ session, user });
});

router.get("/plant/:userId", (req, res) => {
  const user = store.users.get(req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  const level = levelFromXp(user.xp);
  return res.json({
    xp: user.xp,
    level,
    streak: user.streak,
    mood: user.mood,
    theme: themeFromLevel(level),
    plantName: user.plantName,
  });
});

router.patch("/plant/:userId", (req, res) => {
  const user = store.users.get(req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.plantName = req.body.plantName ?? user.plantName;
  user.mood = req.body.mood ?? user.mood;
  if (typeof req.body.wilted === "boolean" && req.body.wilted) {
    user.mood = moodFromEvents({ wilted: true });
  }
  return res.json(user);
});

router.post("/plans/generate", async (req, res, next) => {
  try {
    const payload = plannerSchema.parse(req.body);
    const plan = await generatePlan(payload);
    if (req.body.userId) {
      store.plans.set(req.body.userId, plan);
    }
    res.json(plan);
  } catch (error) {
    next(error);
  }
});

router.get("/plans/:userId", (req, res) => {
  const plan = store.plans.get(req.params.userId);
  return res.json(plan ?? null);
});

export default router;
