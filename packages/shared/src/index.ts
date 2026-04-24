export type EnergyLevel = "low" | "medium" | "high";

export interface CourseInput {
  name: string;
  color?: string;
}

export interface AssignmentInput {
  title: string;
  dueDate: string;
  difficulty: number;
  courseName: string;
}

export interface PlannerInput {
  courses: CourseInput[];
  assignments: AssignmentInput[];
  energyLevel: EnergyLevel;
  preferredStudyDays: string[];
  breakDays: string[];
  pastStudySessions: {
    date: string;
    durationMinutes: number;
    completed: boolean;
  }[];
}

export interface PlanBlock {
  day: string;
  startTime: string;
  endTime: string;
  task: string;
  rationale: string;
}

export interface GeneratedPlan {
  generatedAt: string;
  blocks: PlanBlock[];
}

export type PlantMood = "idle" | "happy" | "blooming" | "wilted" | "sad";

export interface PlantProgress {
  xp: number;
  level: 1 | 2 | 3 | 4 | 5;
  streak: number;
  mood: PlantMood;
  theme: "spring" | "cherry" | "enchanted" | "autumn";
}
