import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { products } from "@/data/products";
import { blogArticles } from "@/data/blog-articles";

const BASE_URL = "https://peptinium.com";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = [
          "/",
          "/produits",
          "/coa",
          "/blog",
          "/etudes-scientifiques",
          "/calculatrice",
          "/a-propos",
          "/contact",
        ];
        const productPaths = products.map((p) => `/produits/${p.slug}`);
        const blogPaths = blogArticles.map((a) => `/blog/${a.slug}`);
        const urls = [...staticPaths, ...productPaths, ...blogPaths]
          .map(
            (p) =>
              `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
