import { defineConfig } from "vite";

const base = process.env.GITHUB_ACTIONS ? "/calendar_puzzle/" : "/";

export default defineConfig({
  base,
});
