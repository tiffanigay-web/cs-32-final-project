import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-cream-50 to-cream-100 px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center">
        <section>
          <p className="mb-3 inline-block rounded-full bg-white px-4 py-1 text-sm shadow-soft">AI-powered study companion</p>
          <h1 className="text-5xl font-bold leading-tight text-moss-700">Grow your grades by growing one plant you care about.</h1>
          <p className="mt-4 text-lg text-bark">GrowPath turns weekly planning into an emotional ritual. Complete focus sessions, finish assignments, and watch your plant bloom through the semester.</p>
          <Link to="/onboarding" className="mt-8 inline-block rounded-2xl bg-moss-500 px-6 py-3 text-lg font-semibold text-white">Start your onboarding</Link>
        </section>
        <section className="card relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blossom/50" />
          <div className="absolute -left-8 bottom-3 h-20 w-20 rounded-full bg-moss-500/20" />
          <h2 className="text-2xl font-semibold">Why students stay</h2>
          <ul className="mt-4 space-y-3 text-bark">
            <li>🌱 Personalized weekly AI study plans</li>
            <li>🔥 Streak blooms and XP progression</li>
            <li>🍃 Gentle wilt feedback on missed non-break days</li>
            <li>🕰️ Focus timer with tab-switch accountability</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
