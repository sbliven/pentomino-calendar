import { defineConfig } from "vite";

/**
 * GitHub Pages project sites are served at `https://<user>.github.io/<repo>/`.
 * Custom domains keep that path (e.g. `https://example.com/<repo>/`).
 * `GITHUB_REPOSITORY` is `owner/repo` and is set automatically in Actions.
 */
function baseUrl(): string {
  if (!process.env.GITHUB_ACTIONS) return "/";
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  return repo ? `/${repo}/` : "/";
}

export default defineConfig({
  base: baseUrl(),
});
