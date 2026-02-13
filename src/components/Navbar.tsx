"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { name: "Home", href: "/" },
  { name: "Jordan", href: "/jordan" },
  { name: "Member 2", href: "/member2" },
  { name: "Member 3", href: "/member3" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white tracking-tight">
            The Triumvirate
          </Link>
          <div className="flex space-x-1">
            {sections.map((section) => {
              const isActive =
                pathname === section.href ||
                (section.href !== "/" && pathname.startsWith(section.href));
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
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
