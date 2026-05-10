"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const games = [
  { label: "🔢 Binary Solving", href: "/binary", key: "binary" },
  { label: "⚡ Logic Gate", href: "/logic-gate", key: "logic-gate" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-4 h-14">
        <span className="text-indigo-400 font-bold text-sm uppercase tracking-widest">
          RISTEK Games
        </span>
        {games.map((g) => {
          const isActive = pathname === g.href;
          return (
            <Link
              key={g.key}
              href={g.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {g.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
