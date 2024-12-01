import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    define: {
      __API_KEYS__: {
        ODDS: JSON.stringify(env.VITE_ODDS_API_KEY),
        XAI: JSON.stringify(env.VITE_XAI_API_KEY),
        POLYGON: JSON.stringify(env.VITE_POLYGON_API_KEY),
        POLYGON_SECRET: JSON.stringify(env.VITE_POLYGON_SECRET),
        STRIPE_PUBLIC: JSON.stringify(env.VITE_STRIPE_PUBLIC_KEY),
        STRIPE_PRICE: JSON.stringify(env.VITE_STRIPE_PRICE_ID),
      },
    },
  };
});