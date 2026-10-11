import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Set PUBLIC_SITE_URL to your final HTTPS domain when deploying.
// No local preview or unconfirmed domain is emitted as a canonical URL.
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || undefined,
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  devToolbar: { enabled: false },
  vite: {
    optimizeDeps: { exclude: ['@vitejs/plugin-react/preamble', 'three/addons/utils/BufferGeometryUtils.js'] },
    build: { chunkSizeWarningLimit: 650 },
  },
});
