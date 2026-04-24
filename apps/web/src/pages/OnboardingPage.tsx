import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  onFinish: (data: any) => void;
}

export function OnboardingPage({ onFinish }: Props) {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    plantName: "",
    energyLevel: "medium",
    courses: "CS 32, Math 33A",
    assignments: "Midterm study guide|CS 32|2026-05-02|4",
    preferredStudyDays: "Monday,Tuesday,Wednesday,Thursday,Sunday",
    breakDays: "Saturday",
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      courses: form.courses.split(",").map((name) => ({ name: name.trim() })),
      assignments: form.assignments.split("\n").map((line) => {
        const [title, courseName, dueDate, difficulty] = line.split("|");
        return { title, courseName, dueDate, difficulty: Number(difficulty) };
      }),
      preferredStudyDays: form.preferredStudyDays.split(",").map((d) => d.trim()),
      breakDays: form.breakDays.split(",").map((d) => d.trim()),
    };
    onFinish(payload);
    nav("/dashboard");
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold text-moss-700">Let’s set up your study sanctuary</h1>
      <form className="mt-6 space-y-4 card" onSubmit={submit}>
        {[
          ["name", "Your name"],
          ["plantName", "Plant name"],
          ["courses", "Courses (comma-separated)"],
          ["preferredStudyDays", "Preferred study days"],
          ["breakDays", "Break days"],
        ].map(([key, label]) => (
          <label key={key} className="block text-sm">{label}
            <input className="mt-1 w-full rounded-xl border p-2" value={(form as any)[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} required />
          </label>
        ))}
        <label className="block text-sm">Energy level
          <select className="mt-1 w-full rounded-xl border p-2" value={form.energyLevel} onChange={(e) => setForm((f) => ({ ...f, energyLevel: e.target.value }))}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
        </label>
        <label className="block text-sm">Assignments (one per line: title|course|YYYY-MM-DD|difficulty 1-5)
          <textarea className="mt-1 w-full rounded-xl border p-2" rows={4} value={form.assignments} onChange={(e) => setForm((f) => ({ ...f, assignments: e.target.value }))} />
        </label>
        <button className="rounded-xl bg-moss-500 px-5 py-2 font-semibold text-white">Enter GrowPath</button>
      </form>
    </main>
  );
}
