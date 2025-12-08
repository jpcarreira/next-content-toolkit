import { defineConfig } from 'tsup';
import { glob } from 'glob';

const entry = await glob('src/**/*.ts', {
  ignore: ['**/*.d.ts', '**/*.test.ts', '**/*.spec.ts']
});

export default defineConfig({
  entry,
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'next',
    'mongodb',
    'resend',
    'contentlayer2',
    'next-contentlayer2',
    'reading-time',
    'date-fns',
    'lucide-react',
    'next-themes',
  ],
  treeshake: true,
});
