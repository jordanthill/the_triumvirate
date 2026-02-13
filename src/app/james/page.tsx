import Image from "next/image";

export default function JamesPage() {
  return (
    <div className="space-y-10">
      {/* Header with banner */}
      <div className="relative rounded-2xl overflow-hidden h-48">
        <Image
          src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=1200&h=400&fit=crop"
          alt="James's section"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-4xl font-bold text-white">James&apos;s Section</h1>
          <p className="text-gray-300 mt-1">Welcome to my corner of the site.</p>
        </div>
      </div>

      {/* Getting started prompt */}
      <div className="p-8 rounded-2xl glass text-center space-y-4">
        <div className="h-12 w-12 mx-auto rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Ready to build</h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Edit{" "}
          <code className="text-indigo-400 bg-white/5 px-2 py-0.5 rounded text-xs font-mono">
            src/app/james/page.tsx
          </code>{" "}
          to replace this with whatever you want — a project showcase, a blog, a tool, anything.
        </p>
      </div>
    </div>
  );
}
