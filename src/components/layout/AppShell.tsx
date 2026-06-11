import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AppNav } from "./AppNav";

const socialLinks = [
  {
    href: "https://github.com/TheRealSouls/oratorium",
    label: "GitHub",
    iconClassName: "fa-brands fa-github",
  },
  {
    href: "https://www.linkedin.com/in/matas-roda-981421357/",
    label: "LinkedIn",
    iconClassName: "fa-brands fa-linkedin",
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0506] text-[#FFF7F8]">
      <header className="border-b border-[#3A151B] bg-[#0B0506]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold tracking-normal">
            <Image
              src="/sprites/oratorium.webp"
              alt=""
              width={32}
              height={32}
              priority
              className="h-8 w-8 rounded-md"
            />
            Oratorium
          </Link>
          <AppNav />
        </div>
      </header>
      {children}
      <footer className="border-t border-[#3A151B] bg-[#0B0506]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-sm text-[#D9A7AF] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>Built for sharper speeches under pressure.</p>
          <nav aria-label="Social links" className="flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-[#3A151B] px-3 py-2 font-medium transition-colors hover:border-[#FF5A6E] hover:text-white"
                aria-label={`Open Oratorium on ${link.label}`}
              >
                <i className={link.iconClassName} aria-hidden="true" />
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
