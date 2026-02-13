export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          The Triumvirate
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          A collaborative space where we build, experiment, and share ideas.
          Each member has their own section to create whatever they want.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SectionCard
          name="Jordan"
          href="/jordan"
          description="Jordan's corner of the site. Check out what they're building."
        />
        <SectionCard
          name="Member 2"
          href="/member2"
          description="Member 2's space. Coming soon..."
        />
        <SectionCard
          name="Member 3"
          href="/member3"
          description="Member 3's space. Coming soon..."
        />
      </div>
    </div>
  );
}

function SectionCard({
  name,
  href,
  description,
}: {
  name: string;
  href: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="block p-6 rounded-xl border border-gray-800 bg-gray-900 hover:border-indigo-500 hover:bg-gray-900/80 transition-all group"
    >
      <h2 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors">
        {name}
      </h2>
      <p className="mt-2 text-gray-400 text-sm">{description}</p>
    </a>
  );
}
