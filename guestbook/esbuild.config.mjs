// esbuild.config.mjs
import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['backend/index.ts'],
  outdir: 'dist/backend',
  platform: 'node',
  format: 'esm',
  bundle: true,
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);"
  },
}).catch(() => process.exit(1));