import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AppNav } from "./AppNav";

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
    </div>
  );
}
