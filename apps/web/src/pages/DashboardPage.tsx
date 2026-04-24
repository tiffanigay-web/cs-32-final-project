import { useEffect, useMemo, useState } from "react";
import { FocusTimer } from "../components/FocusTimer";
import { PlantCard } from "../components/PlantCard";
import { api } from "../lib/api";
import type { GeneratedPlan } from "@growpath/shared";

interface Props {
  onboarding: any;
}

export function DashboardPage({ onboarding }: Props) {
  const [user, setUser] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);

  const userId = "demo-user";

  const refresh = async () => {
    const [users, tasks, plant] = await Promise.all([
      api.getUsers(),
      api.getAssignments(),
      api.getPlant(userId),
    ]);
    setUser({ ...users[0], ...plant });
    setAssignments(tasks);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const upcoming = useMemo(
    () => assignments.filter((a) => !a.completed).sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate)).slice(0, 5),
    [assignments],
  );

  const generatePlan = async () => {
    const payload = {
      userId,
      courses: onboarding?.courses ?? [{ name: "CS 32" }],
      assignments: (onboarding?.assignments ?? []).length
        ? onboarding.assignments
        : assignments.map((a) => ({
            title: a.title,
            dueDate: a.dueDate,
            difficulty: a.difficulty,
            courseName: "Course",
          })),
      energyLevel: onboarding?.energyLevel ?? "medium",
      preferredStudyDays: onboarding?.preferredStudyDays ?? ["Monday", "Tuesday", "Wednesday", "Thursday"],
      breakDays: onboarding?.breakDays ?? ["Saturday"],
      pastStudySessions: [],
    };
    const next = await api.generatePlan(payload);
    setPlan(next);
  };

  if (!user) return <main className="p-10">Loading dashboard…</main>;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-moss-700">Welcome back, {onboarding?.name ?? user.name}</h1>
        <button onClick={generatePlan} className="rounded-xl bg-moss-500 px-4 py-2 text-white">Generate Plan</button>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <PlantCard level={user.level} mood={user.mood} xp={user.xp} streak={user.streak} plantName={onboarding?.plantName ?? user.plantName} />
        <FocusTimer
          onComplete={async (minutes) => {
            await api.createSession({ userId, durationMinutes: minutes });
            await refresh();
          }}
          onAbandon={async (minutes) => {
            await api.createSession({ userId, durationMinutes: minutes, abandoned: true });
            await refresh();
          }}
        />
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-xl font-semibold">Upcoming Deadlines</h3>
          <ul className="mt-3 space-y-2">
            {upcoming.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded-xl bg-cream-50 p-3">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-bark">Due {new Date(item.dueDate).toLocaleDateString()}</p>
                </div>
                <button
                  className="rounded-lg bg-moss-500 px-3 py-1 text-sm text-white"
                  onClick={async () => {
                    await api.completeAssignment(item.id);
                    await refresh();
                  }}
                >
                  Complete Assignment
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold">Weekly AI Study Plan</h3>
          {!plan ? <p className="mt-3 text-bark">No plan yet. Click "Generate Plan" to map your week.</p> : (
            <ul className="mt-3 space-y-2 text-sm">
              {plan.blocks.map((block, idx) => (
                <li key={`${block.day}-${idx}`} className="rounded-xl bg-cream-50 p-3">
                  <p className="font-semibold">{block.day} · {block.startTime}-{block.endTime}</p>
                  <p>{block.task}</p>
                  <p className="text-xs text-bark">{block.rationale}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
