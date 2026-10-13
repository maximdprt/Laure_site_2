import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/styleguide",
          "/en/styleguide",
          "/rendez-vous/confirmation",
          "/en/book/confirmation",
          "/commande/confirmation",
          "/en/order/confirmation",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
