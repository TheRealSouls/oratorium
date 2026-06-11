"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { ArenaLoading } from "../ui/ArenaLoading";

interface ArenaRouteLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  label?: string;
  title?: string;
  message?: string;
}

const routeLoadingCopy: Record<string, { label: string; title: string; message: string }> = {
  "/practice": {
    label: "Practice arena",
    title: "Entering the arena",
    message: "Loading your topic wheel, timer, and recording setup...",
  },
  "/leaderboard": {
    label: "Rankings",
    title: "Opening the ranks",
    message: "Loading ratings, filters, and arena standings...",
  },
  "/profile": {
    label: "Speaker profile",
    title: "Loading your profile",
    message: "Pulling your score history and rank snapshot...",
  },
};

export function ArenaRouteLink({ href, children, className, label, title, message }: ArenaRouteLinkProps) {
  const pathname = usePathname();
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const copy = routeLoadingCopy[href] ?? {
    label: label ?? "Arena loading",
    title: title ?? "Loading",
    message: message ?? "Opening the next arena screen...",
  };

  useEffect(() => {
    setIsLoadingRoute(false);
  }, [pathname]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      pathname === href ||
      !href.startsWith("/") ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    setIsLoadingRoute(true);
  }

  return (
    <>
      <Link
        href={href}
        onClick={handleClick}
        className={className}
        aria-current={pathname === href ? "page" : undefined}
      >
        {children}
      </Link>

      {isLoadingRoute && (
        <ArenaLoading
          mode="modal"
          label={label ?? copy.label}
          title={title ?? copy.title}
          message={message ?? copy.message}
        />
      )}
    </>
  );
}
