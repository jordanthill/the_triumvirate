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
