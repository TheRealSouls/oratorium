"use client";

import { ArenaRouteLink } from "./ArenaRouteLink";

const navItems = [
  { href: "/practice", label: "Practice" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
];

export function AppNav() {
  return (
    <nav aria-label="Main navigation" className="flex flex-wrap gap-2">
      {navItems.map((item) => (
        <ArenaRouteLink
          key={item.href}
          href={item.href}
          className="rounded-md border border-[#3A151B] px-3 py-2 text-sm font-medium text-[#D9A7AF] transition-colors hover:border-[#FF5A6E] hover:text-white"
        >
          {item.label}
        </ArenaRouteLink>
      ))}
    </nav>
  );
}
