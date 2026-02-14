import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    title: "Chess Puzzles",
    href: "/brian/chess-puzzles",
    description: "Solve tactical chess puzzles. Find the winning move sequence to checkmate!",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
    color: "from-slate-500/20 to-gray-500/20",
    iconColor: "text-slate-400",
  },
  {
    title: "Chemistry Recipes",
    href: "/brian/chemistry-recipes",
    description: "Explore the science of cooking! Select a chemical reaction and discover recipes that showcase it.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    color: "from-green-500/20 to-teal-500/20",
    iconColor: "text-green-400",
  },
];

export default function BrianPage() {
  return (
    <div className="space-y-10">
      {/* Header with banner */}
      <div className="relative rounded-2xl overflow-hidden h-48">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=400&fit=crop"
          alt="Brian's section"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-4xl font-bold text-white">Brian&apos;s Section</h1>
          <p className="text-gray-300 mt-1">Interactive games, tools, and experiments.</p>
        </div>
      </div>

      {/* Projects grid */}
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
    </div>
  );
}
