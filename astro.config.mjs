import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://manask322.github.io",
  base: "/",
  integrations: [sitemap()]
});
