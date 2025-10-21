"use client";

import React, { useMemo, type ComponentPropsWithoutRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LinkHref = ComponentPropsWithoutRef<typeof Link>["href"];

type NavLinkProps = {
  href: LinkHref;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  exact?: boolean;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href">;

const hrefToString = (href: LinkHref): string => {
  if (typeof href === "string") {
    return href;
  }

  if (href instanceof URL) {
    return href.pathname ?? "/";
  }

  if (typeof href.pathname === "string" && href.pathname.length > 0) {
    return href.pathname;
  }

  return "/";
};

const normalizePathname = (path: string | null) => {
  if (!path) return null;
  if (path === "/") {
    return "/";
  }

  return path.replace(/\/+$/, "");
};

const resolveHrefPath = (href: LinkHref) => {
  const hrefValue = hrefToString(href);

  try {
    const url = new URL(hrefValue, "http://localhost");
    return normalizePathname(url.pathname) ?? hrefValue;
  } catch {
    return normalizePathname(hrefValue) ?? hrefValue;
  }
};

const isPathActive = (currentPath: string | null, targetPath: string, exact: boolean) => {
  const normalizedCurrent = normalizePathname(currentPath);

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
  const targetPath = useMemo(() => resolveHrefPath(href), [href]);

  const isActive = useMemo(
    () => isPathActive(pathname, targetPath, exact),
    [pathname, targetPath, exact]
  );

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
