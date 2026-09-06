import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { readCollection, writeCollection, nextId } from '../db.js';
import { adminRequired } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});
const upload = multer({ storage });

const router = Router();

// GET /api/admin/dashboard
router.get('/dashboard', adminRequired, (_req, res) => {
  const products = readCollection('products').filter((p) => p.loaiSP === 'TrangChu');
  const orders = readCollection('orders').sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  );
  const orderDetails = readCollection('orderDetails');
  const users = readCollection('users');
  const categories = readCollection('danhMuc');

  const activeOrders = orders.filter((o) => o.status !== 'Canceled');
  const revenue = activeOrders.reduce((s, o) => s + Number(o.totalAmount || 0), 0);
  const customers = users.filter((u) => u.role !== 'Admin');

  // Doanh thu 7 ngày
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    const dayRevenue = activeOrders
      .filter((o) => String(o.orderDate).slice(0, 10) === key)
      .reduce((s, o) => s + Number(o.totalAmount || 0), 0);
    days.push({ date: key, label, revenue: dayRevenue });
  }

  // Sản phẩm bán chạy (theo quantity)
  const soldMap = {};
  for (const d of orderDetails) {
    const k = `${d.maSP}::${d.loaiSP || 'TrangChu'}`;
    if (!soldMap[k]) {
      soldMap[k] = {
        maSP: d.maSP,
        tenSP: d.tenSP,
        hinhAnh: d.hinhAnh,
        qty: 0,
      };
    }
    soldMap[k].qty += Number(d.quantity) || 0;
  }
  const topProducts = Object.values(soldMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Danh mục + số SP
  const catStats = categories.map((c) => ({
    ...c,
    count: products.filter((p) => Number(p.maDM) === Number(c.maDM)).length,
  }));

  // Hoạt động gần đây
  const activities = [];
  for (const o of orders.slice(0, 5)) {
    activities.push({
      type: 'order',
      text: `Đơn hàng #${o.orderID} của ${o.hoTen || 'khách'} — ${o.status}`,
      time: o.orderDate,
    });
  }
  for (const u of users
    .filter((x) => x.role !== 'Admin')
    .slice(-3)
    .reverse()) {
    activities.push({
      type: 'user',
      text: `Người dùng ${u.fullName || u.username} đã có tài khoản`,
      time: null,
    });
  }

  res.json({
    stats: {
      revenue,
      orders: orders.length,
      customers: customers.length,
      products: products.length,
    },
    revenueByDay: days,
    recentOrders: orders.slice(0, 5),
    topProducts,
    categories: catStats,
    activities: activities.slice(0, 6),
  });
});

// GET /api/admin/categories
router.get('/categories', adminRequired, (_req, res) => {
  res.json(readCollection('danhMuc'));
});

// POST /api/admin/categories
router.post('/categories', adminRequired, (req, res) => {
  const { tenDM, moTa } = req.body || {};
  if (!tenDM || !String(tenDM).trim()) {
    return res.status(400).json({ message: 'Vui lòng nhập tên danh mục' });
  }
  const list = readCollection('danhMuc');
  const item = {
    maDM: nextId(list, 'maDM'),
    tenDM: String(tenDM).trim(),
    moTa: moTa ? String(moTa).trim() : '',
  };
  list.push(item);
  writeCollection('danhMuc', list);
  res.status(201).json(item);
});

// DELETE /api/admin/categories/:id
router.delete('/categories/:id', adminRequired, (req, res) => {
  const id = Number(req.params.id);
  let list = readCollection('danhMuc');
  const before = list.length;
  list = list.filter((x) => x.maDM !== id);
  if (list.length === before) {
    return res.status(404).json({ message: 'Không tìm thấy danh mục' });
  }
  writeCollection('danhMuc', list);
  res.json({ message: 'Đã xóa' });
});

// GET /api/admin/products
router.get('/products', adminRequired, (_req, res) => {
  const products = readCollection('products').filter((p) => p.loaiSP === 'TrangChu');
  res.json(products);
});

// POST /api/admin/products
router.post('/products', adminRequired, upload.single('fileAnh'), (req, res) => {
  const products = readCollection('products');
  const { tenSP, giaGoc, gia, mauSac, moTa, maDM, nhomID } = req.body;

  const product = {
    maSP: nextId(
      products.filter((p) => p.loaiSP === 'TrangChu'),
      'maSP'
    ),
    tenSP,
    giaGoc: Number(giaGoc) || 0,
    gia: Number(gia) || 0,
    mauSac: mauSac || '',
    moTa: moTa || '',
    hinhAnh: req.file ? `/uploads/${req.file.filename}` : req.body.hinhAnh || '',
    maDM: maDM ? Number(maDM) : null,
    nhomID: nhomID ? Number(nhomID) : null,
    loaiSP: 'TrangChu',
    soLuongTon: Number(req.body.soLuongTon) || 0,
  };

  products.push(product);
  writeCollection('products', products);
  res.status(201).json(product);
});

// PUT /api/admin/products/:id/stock
router.put('/products/:id/stock', adminRequired, (req, res) => {
  const id = Number(req.params.id);
  const products = readCollection('products');
  const idx = products.findIndex((p) => p.maSP === id && p.loaiSP === 'TrangChu');
  if (idx < 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  products[idx].soLuongTon = Number(req.body?.soLuongTon) || 0;
  writeCollection('products', products);
  res.json(products[idx]);
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', adminRequired, (req, res) => {
  const id = Number(req.params.id);
  let products = readCollection('products');
  const before = products.length;
  products = products.filter((p) => !(p.maSP === id && p.loaiSP === 'TrangChu'));
  if (products.length === before) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  }
  writeCollection('products', products);
  res.json({ message: 'Đã xóa' });
});

// GET /api/admin/users
router.get('/users', adminRequired, (_req, res) => {
  const users = readCollection('users').map(({ password, ...u }) => u);
  res.json(users);
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', adminRequired, (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ message: 'Thiếu trạng thái' });
  const orders = readCollection('orders');
  const idx = orders.findIndex((o) => o.orderID === id);
  if (idx < 0) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  orders[idx].status = status;
  writeCollection('orders', orders);
  res.json(orders[idx]);
});

export default router;
