import { defineConfig, lazyPlugins } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";
import { mdsvex } from "mdsvex";
import tailwindcss from "@tailwindcss/vite";
import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import electron from "vite-plugin-electron/simple";

export default defineConfig({
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  plugins: [
    tailwindcss(),
    sveltekit({
      csp: {
        mode: "hash",
        directives: {
          "script-src": ["localhost"],
        },
        reportOnly: {
          "script-src": ["localhost"],
          "report-uri": ["/"],
        },
      },
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
      },

      alias: { $lib: "src/lib" },
      adapter: adapter({
        // Zwingend erforderlich für Electron SPA-Routing
        //fallback: "index.html",

        strict: false,
        precompress: true,
      }),
      paths: {
        relative: false,
      },
      // Optional, aber sehr empfehlenswert:
      // Manche OS-Ordnerstrukturen haben Probleme mit Ordnern, die mit einem Unterstrich beginnen.
      appDir: "app",
      preprocess: [mdsvex({ extensions: [".svx", ".md"] })],
      extensions: [".svelte", ".svx", ".md"],
    }),
    electron({
      main: {
        entry: "electron/main.ts",
      },
      preload: {
        input: "electron/preload.ts",
      },
    }),
  ],
  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: "./vite.config.ts",
        test: {
          name: "client",
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium", headless: true }],
          },
          include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
          exclude: ["src/lib/server/**"],
        },
      },

      {
        extends: "./vite.config.ts",
        test: {
          name: "server",
          environment: "node",
          include: ["src/**/*.{test,spec}.{js,ts}"],
          exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
        },
      },
    ],
  },
  build: {
    sourcemap: true,
    modulePreload: true,
    cssCodeSplit: true,
    cssMinify: true,
    minify: true,
    target: "es2020",
  },
});
