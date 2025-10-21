"use client";

import React, { useMemo, type ComponentPropsWithoutRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  exact?: boolean;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href">;

const normalizePathname = (path: string | null) => {
  if (!path) return null;
  if (path === "/") {
    return "/";
  }

  return path.replace(/\/+$/, "");
};

const resolveHrefPath = (href: string) => {
  try {
    const url = new URL(href, "http://localhost");
    return normalizePathname(url.pathname) ?? href;
  } catch {
    return normalizePathname(href) ?? href;
  }
};

const isPathActive = (currentPath: string | null, href: string, exact: boolean) => {
  const normalizedCurrent = normalizePathname(currentPath);
  const targetPath = resolveHrefPath(href);

  if (!normalizedCurrent) {
    return false;
  }

  if (exact) {
    return normalizedCurrent === targetPath;
  }

  return (
    normalizedCurrent === targetPath ||
    (targetPath !== "/" && normalizedCurrent.startsWith(`${targetPath}/`))
  );
};

export function NavLink({
  href,
  children,
  className,
  activeClassName,
  inactiveClassName,
  exact = false,
  ...rest
}: NavLinkProps) {
  const pathname = usePathname();

  const isActive = useMemo(() => isPathActive(pathname, href, exact), [pathname, href, exact]);

  const computedClassName = [
    className,
    isActive ? activeClassName : inactiveClassName
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      {...rest}
      href={href}
      aria-current={isActive ? "page" : undefined}
      data-active={isActive ? "true" : undefined}
      className={computedClassName || undefined}
    >
      {children}
    </Link>
  );
}

export const __internal = {
  normalizePathname,
  resolveHrefPath,
  isPathActive
};
