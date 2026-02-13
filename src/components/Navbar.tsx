"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { name: "Home", href: "/" },
  { name: "Jordan", href: "/jordan" },
  { name: "Brian", href: "/brian" },
  { name: "James", href: "/james" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/70 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm group-hover:shadow-lg group-hover:shadow-indigo-500/25 transition-shadow">
              T
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              The Triumvirate
            </span>
          </Link>
          <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
            {sections.map((section) => {
              const isActive =
                pathname === section.href ||
                (section.href !== "/" && pathname.startsWith(section.href));
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {section.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
