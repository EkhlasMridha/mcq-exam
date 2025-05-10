import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as fs from "fs";
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: generateAliases(path.resolve(__dirname, "src")),
  },
});

function generateAliases(srcPath: string) {
  const entries = fs.readdirSync(srcPath, { withFileTypes: true });

  return entries
    .filter((entry: any) => entry.isDirectory())
    .map((dir: any) => ({
      find: `${dir.name}`,
      replacement: path.resolve(srcPath, dir.name),
    }));
}
