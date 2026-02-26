import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // Supabase Proxy: भारत के इंटरनेट ब्लॉक को पार करने के लिए
  app.use(
    '/supabase-proxy',
    createProxyMiddleware({
      target: 'https://kwkzyoppaxgvxeufgpqc.supabase.co',
      changeOrigin: true,
      pathRewrite: {
        '^/supabase-proxy': '',
      },
      onProxyReq: (proxyReq, req, res) => {
        if (req.headers['apikey']) {
          proxyReq.setHeader('apikey', req.headers['apikey']);
        }
        if (req.headers['authorization']) {
          proxyReq.setHeader('authorization', req.headers['authorization']);
        }
      },
    })
  );

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});