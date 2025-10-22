import React from "react";
import Script from "next/script";

import { getMarketingScripts } from "@/lib/marketing/scripts";

export function MarketingScriptsManager() {
  const scripts = getMarketingScripts();

  if (scripts.length === 0) {
    return null;
  }

  return (
    <>
      {scripts.map((script) => {
        const attributes = script.attributes ?? {};

        if (script.type === "external") {
          return (
            <Script
              key={script.id}
              id={script.id}
              src={script.src}
              strategy={script.strategy}
              {...attributes}
            />
          );
        }

        return (
          <Script
            key={script.id}
            id={script.id}
            strategy={script.strategy}
            dangerouslySetInnerHTML={{ __html: script.content }}
            {...attributes}
          />
        );
      })}
      {scripts
        .filter((script) => script.noScriptFallback)
        .map((script) => (
          <noscript
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: script.noScriptFallback ?? "" }}
            key={`${script.id}-noscript`}
          />
        ))}
    </>
  );
}
