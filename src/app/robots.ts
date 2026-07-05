import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin-voluntariado-eventos/", "/api/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://voluntariadocaba.com"}/sitemap.xml`,
  };
}
