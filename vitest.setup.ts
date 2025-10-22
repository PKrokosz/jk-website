import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

(globalThis as unknown as { React?: typeof React }).React = React;

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, fill, priority, style, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    priority?: boolean;
  }) => {
    const mergedStyle = fill ? { ...style, width: "100%", height: "100%" } : style;

    return React.createElement("img", {
      ...props,
      style: mergedStyle,
      alt: alt ?? ""
    });
  }
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    prefetch: _prefetch,
    legacyBehavior: _legacy,
    passHref: _passHref,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string | URL }) =>
    React.createElement(
      "a",
      { ...rest, href: typeof href === "string" ? href : href.toString() },
      children
    )
}));

vi.mock("next/dynamic", () => ({
  __esModule: true,
  default:
    (
      importer: () => Promise<Record<string, unknown>>, 
      options?: { loading?: () => React.ReactNode }
    ) => {
      const LazyComponent = React.lazy(async () => {
        const module = await importer();
        const resolved = (module as { default?: React.ComponentType })?.default ?? module;
        return {
          default: resolved as React.ComponentType
        };
      });

      function DynamicComponent(props: Record<string, unknown>) {
        return React.createElement(
          React.Suspense,
          { fallback: options?.loading?.() ?? null },
          React.createElement(LazyComponent, props as Record<string, never>)
        );
      }

      DynamicComponent.displayName = "DynamicComponentMock";

      return DynamicComponent;
    }
}));
