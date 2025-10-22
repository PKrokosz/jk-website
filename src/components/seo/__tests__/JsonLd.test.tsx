import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JsonLd } from "../JsonLd";

describe("JsonLd", () => {
  it("renders JSON-LD script with serialized data", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "JK Handmade Footwear"
    };

    const { container } = render(<JsonLd data={data} id="organization-schema" />);

    const script = container.querySelector("script#organization-schema");
    expect(script).not.toBeNull();
    expect(script?.getAttribute("type")).toBe("application/ld+json");
    expect(script?.textContent).toContain("\"@type\": \"Organization\"");
  });
});
