import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;

// Auto-seed nếu chưa có data
const storeDir = path.join(__dirname, 'data', 'store');
if (!fs.existsSync(path.join(storeDir, 'products.json'))) {
  console.log('📦 Chưa có data — đang seed...');
  spawnSync(process.execPath, [path.join(__dirname, 'data', 'seed.js')], {
    stdio: 'inherit',
  });
}

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ảnh tĩnh (logo, sản phẩm)
const contentPath = path.resolve(__dirname, process.env.CONTENT_PATH || '../../../Content');
if (fs.existsSync(contentPath)) {
  app.use('/Content', express.static(contentPath));
  console.log(`🖼️  Static images: ${contentPath}`);
} else {
  console.warn(`⚠️  Không tìm thấy Content path: ${contentPath}`);
}

// Upload admin
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'AURA API', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 AURA API: http://localhost:${PORT}`);
});
