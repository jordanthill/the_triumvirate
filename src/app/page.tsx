import Image from "next/image";
import Link from "next/link";

const members = [
  {
    name: "Jordan",
    href: "/jordan",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
    description: "Jordan's corner of the site. Check out what he's building.",
  },
  {
    name: "Brian",
    href: "/brian",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    description: "Brian's corner of the site. Check out what he's building.",
  },
  {
    name: "James",
    href: "/james",
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=600&h=400&fit=crop",
    description: "James's corner of the site. Check out what he's building.",
  },
];

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
    title: "Code Playground",
    description: "Experiment with new tech, frameworks, and wild ideas in a shared sandbox.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Live Projects",
    description: "Ship real features that go live instantly. No waiting, no gatekeepers.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    title: "Creative Freedom",
    description: "Your section, your rules. Build games, tools, art — whatever inspires you.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
    title: "Collaborative",
    description: "One repo, three minds. Merge ideas, review code, and build together.",
  },
];

export default function Home() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-16 pb-8 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />

        <div className="relative text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-gray-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Now live on the web
          </div>

          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Build anything.
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Together.
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            Three developers, one shared playground. We experiment, build, and
            ship whatever we want — each with our own corner of the internet.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/jordan"
              className="px-6 py-2.5 rounded-full bg-white text-gray-900 font-medium text-sm hover:bg-gray-200 transition-colors"
            >
              Explore Sections
            </Link>
            <a
              href="https://github.com/jordanthill/the_triumvirate"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full glass glass-hover text-sm text-gray-300 font-medium transition-all"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">How it works</h2>
          <p className="text-gray-500">The concept is simple. The possibilities are not.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl glass glass-hover transition-all duration-300 group"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 transition-colors mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Hero Image Banner */}
      <section className="relative rounded-2xl overflow-hidden h-64">
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&h=400&fit=crop"
          alt="Technology abstract"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/60 to-transparent" />
        <div className="absolute inset-0 flex items-center px-10">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Built for experimentation</h3>
            <p className="text-gray-300 max-w-md text-sm">
              A living, breathing project that evolves as we do. Every push
              deploys automatically. Every idea gets a home.
            </p>
          </div>
        </div>
      </section>

      {/* Shared Tools */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Shared</h2>
          <p className="text-gray-500">Community features for the whole crew.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/chat"
            className="group p-6 rounded-2xl glass glass-hover transition-all duration-300"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors">Chat Wall</h3>
            <p className="mt-1 text-sm text-gray-500">Leave messages for the crew. A shared message board.</p>
          </Link>
          <Link
            href="/stats"
            className="group p-6 rounded-2xl glass glass-hover transition-all duration-300"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors">Site Stats</h3>
            <p className="mt-1 text-sm text-gray-500">Live GitHub stats, commits, and contributor activity.</p>
          </Link>
          <Link
            href="/today"
            className="group p-6 rounded-2xl glass glass-hover transition-all duration-300"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">This Day in History</h3>
            <p className="mt-1 text-sm text-gray-500">What happened on this day? Events, births, and more.</p>
          </Link>
        </div>
      </section>

      {/* Member Sections */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">The Members</h2>
          <p className="text-gray-500">Each member has their own section to build whatever they want.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {members.map((member) => (
            <Link
              key={member.href}
              href={member.href}
              className="group relative rounded-2xl overflow-hidden glass glass-hover transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                  {member.name}&apos;s Section
                </h3>
                <p className="mt-1 text-sm text-gray-500">{member.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 pt-8 pb-4 text-center text-sm text-gray-600">
        <p>The Triumvirate &mdash; Built with Next.js, deployed on Vercel.</p>
      </footer>
    </div>
  );
}
