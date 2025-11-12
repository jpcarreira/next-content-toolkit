import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'database/index': 'src/database/index.ts',
    'analytics/index': 'src/analytics/index.ts',
    'forms/index': 'src/forms/index.ts',
    'content/index': 'src/content/index.ts',
    'ui/index': 'src/ui/index.ts',
    'utils/index': 'src/utils/index.ts',
    'ads/index': 'src/ads/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: {
    resolve: true,
  },
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
