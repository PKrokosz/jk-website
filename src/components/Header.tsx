import React from "react";
import Link from "next/link";
import type { Route } from "next";

import { NavLink } from "./NavLink";

const navigationItems = [
  { href: "/", label: "Home", exact: true },
  { href: "/catalog", label: "Catalog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
] satisfies ReadonlyArray<{
  href: Route;
  label: string;
  exact?: boolean;
}>;

export function Header() {
  return (
    <header className="site-header" role="banner">
      <div className="container site-header__inner">
        <Link className="site-header__brand" href="/">
          JK Handmade Footwear
        </Link>

        <nav aria-label="Główna nawigacja" className="site-header__nav">
          <ul>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="site-header__link"
                  activeClassName="site-header__link--active"
                  exact={item.exact}
                  prefetch={false}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
