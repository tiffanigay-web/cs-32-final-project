import type { GeneratedPlan, PlannerInput } from "@growpath/shared";

const toClock = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

const buildMockPlan = (input: PlannerInput): GeneratedPlan => {
  const sorted = [...input.assignments].sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));
  const blocks = input.preferredStudyDays.flatMap((day, idx) => {
    const assignment = sorted[idx % Math.max(sorted.length, 1)];
    const start = input.energyLevel === "high" ? 18 : input.energyLevel === "medium" ? 19 : 20;
    const task = assignment ? `${assignment.courseName}: ${assignment.title}` : "Review notes + active recall";
    return [{
      day,
      startTime: toClock(start),
      endTime: toClock(start + 1),
      task,
      rationale: assignment
        ? `Prioritized for ${day} because this deadline is approaching and fits your ${input.energyLevel} evening energy.`
        : `Scheduled lightweight review to keep momentum without overload.`,
    }];
  });

  return { generatedAt: new Date().toISOString(), blocks };
};

export const generatePlan = async (input: PlannerInput): Promise<GeneratedPlan> => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return buildMockPlan(input);
  }

  // MVP abstraction: keep transport swappable for real Claude integration.
  return buildMockPlan(input);
};
