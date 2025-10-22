import type { MetadataRoute } from "next";

import { listProductSlugs } from "@/lib/catalog/products";

const siteUrl = "https://jk-footwear.pl";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/catalog",
    "/about",
    "/contact",
    "/order/native",
    "/group-orders",
    "/healthz"
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7
  }));

  const productRoutes: MetadataRoute.Sitemap = listProductSlugs().map((slug) => ({
    url: `${siteUrl}/catalog/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6
  }));

  return [...staticRoutes, ...productRoutes];
}
