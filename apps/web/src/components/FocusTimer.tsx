import { useEffect, useMemo, useState } from "react";

interface Props {
  onComplete: (minutes: number) => Promise<void>;
  onAbandon: (minutes: number) => Promise<void>;
}

export function FocusTimer({ onComplete, onAbandon }: Props) {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => setSecondsLeft(minutes * 60), [minutes]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSecondsLeft((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    const onHidden = () => {
      if (document.hidden && running) {
        setRunning(false);
        void onAbandon(Math.ceil((minutes * 60 - secondsLeft) / 60));
      }
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => document.removeEventListener("visibilitychange", onHidden);
  }, [running, secondsLeft, minutes, onAbandon]);

  const clock = useMemo(() => {
    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const ss = String(secondsLeft % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }, [secondsLeft]);

  return (
    <section className="card">
      <h3 className="text-xl font-semibold">Focus Session</h3>
      <p className="mt-2 text-4xl font-bold text-moss-700">{clock}</p>
      <label className="mt-3 block text-sm">Session length
        <select className="mt-1 w-full rounded-xl border p-2" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
          {[25, 35, 45, 60].map((m) => <option key={m} value={m}>{m} minutes</option>)}
        </select>
      </label>
      <div className="mt-4 flex gap-2">
        <button className="rounded-xl bg-moss-500 px-4 py-2 text-white" onClick={() => setRunning((v) => !v)}>{running ? "Pause" : "Start"}</button>
        <button className="rounded-xl bg-cream-100 px-4 py-2" onClick={() => void onComplete(Math.max(1, Math.ceil((minutes * 60 - secondsLeft) / 60)))}>Complete</button>
        <button className="rounded-xl bg-rose-100 px-4 py-2" onClick={() => void onAbandon(Math.max(1, Math.ceil((minutes * 60 - secondsLeft) / 60)))}>Abandon</button>
      </div>
      <p className="mt-3 text-xs text-bark">If you switch tabs mid-session, GrowPath marks your plant as sad for gentle accountability.</p>
    </section>
  );
}
