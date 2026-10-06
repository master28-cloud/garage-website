import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://autoprogarage.co.ke";
  const now = new Date();
  return [
    { url: `${base}/`,          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/services`,  lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/our-work`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`,     lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
    { url: `${base}/privacy`,   lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,     lastModified: now, changeFrequency: "yearly",  priority: 0.3 }
  ];
}
