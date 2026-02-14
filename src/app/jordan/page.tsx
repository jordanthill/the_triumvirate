import Image from "next/image";
import Link from "next/link";
import ChatbotMascot from "@/components/ChatbotMascot";

const projects = [
  {
    title: "Wordle",
    href: "/jordan/wordle",
    description: "The classic word-guessing game. Six tries to find the five-letter word.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    ),
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
  {
    title: "Particle Trail",
    href: "/jordan/particles",
    description: "Interactive canvas with glowing particles that follow your cursor.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    color: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-400",
  },
  {
    title: "Flappy Bird",
    href: "/jordan/flappy",
    description: "Tap to flap through the pipes. How far can you get?",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
      </svg>
    ),
    color: "from-yellow-500/20 to-orange-500/20",
    iconColor: "text-yellow-400",
  },
  {
    title: "2048",
    href: "/jordan/game2048",
    description: "Slide and merge tiles to reach 2048. Arrow keys or swipe to play.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      </svg>
    ),
    color: "from-amber-500/20 to-red-500/20",
    iconColor: "text-amber-400",
  },
  {
    title: "Fractal Explorer",
    href: "/jordan/fractals",
    description: "Zoom into the infinite depths of the Mandelbrot set in real-time.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
      </svg>
    ),
    color: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-400",
  },
  {
    title: "Market Heatmap",
    href: "/jordan/heatmap",
    description: "Live S&P 500 heatmap with simulated prices, sectors, and sparkline charts.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400",
  },
];

const visualHighlights = [
  "Resting heart rate trend with 7-day and 30-day smoothing windows.",
  "Calories burned heatmap for quick consistency and intensity scanning.",
  "Weekday versus weekend activity split to compare routine stability.",
  "Percentile bands that show where the current week sits versus historical baseline.",
];

const keyInsights = [
  "Lower resting heart rate tends to follow more consistent sleep timing.",
  "Steady calorie burn across the week correlates with better recovery patterns.",
  "Weekdays are more predictable, while weekends add higher variance in activity and sleep.",
];

const roadmapItems = [
  "Build KPI-aligned feature tables with lag variables (sleep_t-1, sleep_t-2).",
  "Run correlation and regression experiments across sleep, heart rate, and activity.",
  "Ship model diagnostics and confidence intervals to avoid misleading conclusions.",
  "Generate insight cards with effect sizes, sample size, and uncertainty ranges.",
];

export default function JordanPage() {
  return (
    <div className="space-y-10">
      <div className="relative rounded-2xl overflow-hidden h-48">
        <Image
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=400&fit=crop"
          alt="Jordan's section"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-4xl font-bold text-white">Jordan&apos;s Section</h1>
          <p className="text-gray-300 mt-1">Games, experiments, and interactive things.</p>
        </div>
      </div>

      <section className="p-6 sm:p-8 rounded-2xl glass space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-medium border border-indigo-400/30">
            Featured Project
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Apple Health Analytics Dashboard</h2>
          <p className="text-gray-300 max-w-3xl leading-relaxed">
            A personal data app that transforms Apple Health exports into clean time-series insights for resting heart rate,
            calories, activity, and recovery trends.
          </p>
          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            <span className="px-2.5 py-1 rounded-full border border-emerald-400/30 text-emerald-300 bg-emerald-500/10">Status: In Progress</span>
            <span className="px-2.5 py-1 rounded-full border border-blue-400/30 text-blue-300 bg-blue-500/10">Role: Product + Engineering</span>
            <span className="px-2.5 py-1 rounded-full border border-violet-400/30 text-violet-300 bg-violet-500/10">Focus: Data Pipeline + Visualization</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <h3 className="text-white font-semibold">What I Built</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              <li>Ingested Apple Health XML export data into structured tables.</li>
              <li>Normalized timestamps and units across metrics and sources.</li>
              <li>Built daily and weekly aggregates for trend analysis.</li>
              <li>Created interactive KPI views with rolling averages and filters.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <h3 className="text-white font-semibold">Visual Highlights</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {visualHighlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <h3 className="text-white font-semibold">Key Insights (Early)</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {keyInsights.map((insight) => (
                <li key={insight}>{insight}</li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <h3 className="text-white font-semibold">Roadmap</h3>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {roadmapItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href="/jordan/health"
            className="px-4 py-2 rounded-full bg-white text-gray-900 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            View Project
          </Link>
          <a
            href="https://github.com/jordanthill/the_triumvirate"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full glass glass-hover text-sm text-gray-300 font-medium transition-all"
          >
            GitHub
          </a>
          <Link
            href="/chat"
            className="px-4 py-2 rounded-full glass glass-hover text-sm text-gray-300 font-medium transition-all"
          >
            Contact Jordan
          </Link>
        </div>
      </section>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white">More Projects</h2>
        <p className="text-gray-500">Playable experiments and interactive builds.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link
            key={project.href}
            href={project.href}
            className="group p-6 rounded-2xl glass glass-hover transition-all duration-300"
          >
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center ${project.iconColor} group-hover:scale-110 transition-transform mb-4`}>
              {project.icon}
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{project.description}</p>
          </Link>
        ))}
      </div>

      <ChatbotMascot />
    </div>
  );
}
