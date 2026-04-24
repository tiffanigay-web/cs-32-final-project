import type { PlantMood } from "@growpath/shared";

interface Props {
  level: number;
  mood: PlantMood;
  xp: number;
  streak: number;
  plantName: string;
}

const moodFace: Record<PlantMood, string> = {
  idle: "•ᴗ•",
  happy: "^_^",
  blooming: "✿‿✿",
  wilted: "×_×",
  sad: ";_;",
};

const stageLabel = ["Tiny Seed", "Cracking Sprout", "Young Seedling", "Growing Plant", "Full Bloom"];

export function PlantCard({ level, mood, xp, streak, plantName }: Props) {
  const size = 30 + level * 12;
  const progress = Math.min(100, (xp / 1000) * 100);

  return (
    <section className="card">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-moss-700">{plantName}</h2>
          <p className="text-sm text-bark">Level {level} · {stageLabel[level - 1]}</p>
        </div>
        <div className="rounded-full bg-cream-100 px-3 py-1 text-sm">Streak {streak}🔥</div>
      </div>

      <div className="mt-6 flex justify-center">
        <svg width="220" height="220" viewBox="0 0 220 220" className="animate-float">
          <ellipse cx="110" cy="180" rx="60" ry="16" fill="#d8c6aa" opacity="0.5" />
          <rect x="75" y="142" width="70" height="45" rx="16" fill="#b08968" />
          <rect x="75" y="138" width="70" height="10" rx="6" fill="#8a6d52" />
          <line x1="110" y1="142" x2="110" y2={142 - size} stroke="#5c9c72" strokeWidth="7" strokeLinecap="round" />
          {level >= 2 && <ellipse cx="90" cy={140 - size / 1.4} rx="16" ry="8" fill="#86c58f" transform={`rotate(-25 90 ${140 - size / 1.4})`} />}
          {level >= 3 && <ellipse cx="130" cy={145 - size / 1.2} rx="16" ry="8" fill="#86c58f" transform={`rotate(25 130 ${145 - size / 1.2})`} />}
          {level >= 4 && <circle cx="110" cy={132 - size} r="10" fill="#f2b5d4" />}
          {level >= 5 && (
            <>
              <circle cx="95" cy={125 - size} r="8" fill="#f7cf5f" />
              <circle cx="125" cy={125 - size} r="8" fill="#f7cf5f" />
            </>
          )}
          <text x="110" y={158 - size / 2} textAnchor="middle" className="fill-bark text-lg">{moodFace[mood]}</text>
        </svg>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-sm"><span>XP</span><span>{xp}/1000</span></div>
        <div className="h-3 overflow-hidden rounded-full bg-cream-100">
          <div className="h-full bg-moss-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </section>
  );
}
