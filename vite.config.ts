import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === "lib";

  if (isLib) {
    // Library build configuration
    return {
      plugins: [
        react(),
        dts({
          insertTypesEntry: true,
          include: ["src/**/*"],
          exclude: ["src/**/*.stories.tsx", "src/**/*.test.tsx"],
        }),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, "src/index.ts"),
          name: "SchemaForm",
          formats: ["es", "cjs"],
          fileName: (format) => `index.${format === "es" ? "esm" : format}.js`,
        },
        rollupOptions: {
          external: [
            "react",
            "react-dom",
            "react-hook-form",
            "zod",
            "@hookform/resolvers",
          ],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "react-hook-form": "ReactHookForm",
              zod: "Zod",
              "@hookform/resolvers": "HookformResolvers",
            },
          },
        },
        sourcemap: true,
        emptyOutDir: true,
      },
      resolve: {
        alias: {
          "@": resolve(__dirname, "src"),
        },
      },
    };
  }

  // Development/demo configuration
  return {
    plugins: [react()],
    root: "demo",
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      port: 3000,
    },
  };
});
