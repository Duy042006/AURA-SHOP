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

function toDateKey(dateInput) {
  const d = new Date(dateInput);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

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

  // Doanh thu 7 ngày (tính theo ngày địa phương chính xác)
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = toDateKey(d);
    const label = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    const dayRevenue = activeOrders
      .filter((o) => toDateKey(o.orderDate) === key)
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
router.get('/products', adminRequired, (req, res) => {
  const { loaiSP, all } = req.query;
  let products = readCollection('products');
  if (loaiSP && loaiSP !== 'ALL') {
    products = products.filter((p) => p.loaiSP === loaiSP);
  } else if (all !== 'true' && !loaiSP) {
    products = products.filter((p) => p.loaiSP === 'TrangChu');
  }
  res.json(products);
});

// POST /api/admin/products
router.post('/products', adminRequired, upload.single('fileAnh'), (req, res) => {
  const products = readCollection('products');
  const { tenSP, giaGoc, gia, mauSac, moTa, maDM, nhomID, loaiSP } = req.body;

  const product = {
    maSP: nextId(products, 'maSP'),
    tenSP,
    giaGoc: Number(giaGoc) || 0,
    gia: Number(gia) || 0,
    mauSac: mauSac || '',
    moTa: moTa || '',
    hinhAnh: req.file ? `/uploads/${req.file.filename}` : req.body.hinhAnh || '',
    maDM: maDM ? Number(maDM) : null,
    nhomID: nhomID ? Number(nhomID) : null,
    loaiSP: loaiSP || 'TrangChu',
    soLuongTon: Number(req.body.soLuongTon) || 50,
  };

  products.push(product);
  writeCollection('products', products);
  res.status(201).json(product);
});

// PUT /api/admin/products/:id/stock
router.put('/products/:id/stock', adminRequired, (req, res) => {
  const id = Number(req.params.id);
  const products = readCollection('products');
  const idx = products.findIndex((p) => p.maSP === id);
  if (idx < 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  products[idx].soLuongTon = Math.max(0, Number(req.body?.soLuongTon) || 0);
  writeCollection('products', products);
  res.json(products[idx]);
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', adminRequired, (req, res) => {
  const id = Number(req.params.id);
  let products = readCollection('products');
  const before = products.length;
  products = products.filter((p) => p.maSP !== id);
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

  const prevStatus = orders[idx].status;
  orders[idx].status = status;
  writeCollection('orders', orders);

  // Nếu chuyển sang Canceled và trước đó chưa Canceled -> hoàn trả tồn kho
  if (status === 'Canceled' && prevStatus !== 'Canceled') {
    const orderDetails = readCollection('orderDetails').filter((d) => d.orderID === id);
    const products = readCollection('products');
    for (const d of orderDetails) {
      const p = products.find((x) => x.maSP === d.maSP && x.loaiSP === d.loaiSP)
        || products.find((x) => x.maSP === d.maSP);
      if (p) {
        p.soLuongTon = (Number(p.soLuongTon) || 0) + (Number(d.quantity) || 1);
      }
    }
    writeCollection('products', products);
  }
  // Nếu chuyển từ Canceled sang trạng thái khác (phục hồi đơn) -> trừ lại tồn kho
  else if (prevStatus === 'Canceled' && status !== 'Canceled') {
    const orderDetails = readCollection('orderDetails').filter((d) => d.orderID === id);
    const products = readCollection('products');
    for (const d of orderDetails) {
      const p = products.find((x) => x.maSP === d.maSP && x.loaiSP === d.loaiSP)
        || products.find((x) => x.maSP === d.maSP);
      if (p) {
        p.soLuongTon = Math.max(0, (Number(p.soLuongTon) || 0) - (Number(d.quantity) || 1));
      }
    }
    writeCollection('products', products);
  }

  res.json(orders[idx]);
});

// PUT /api/admin/products/:id — cập nhật sản phẩm
router.put('/products/:id', adminRequired, upload.single('fileAnh'), (req, res) => {
  const id = Number(req.params.id);
  const products = readCollection('products');
  const idx = products.findIndex((p) => p.maSP === id);
  if (idx < 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

  const { tenSP, giaGoc, gia, mauSac, moTa, maDM, nhomID, loaiSP, soLuongTon } = req.body;

  if (tenSP !== undefined) products[idx].tenSP = tenSP;
  if (giaGoc !== undefined) products[idx].giaGoc = Number(giaGoc) || 0;
  if (gia !== undefined) products[idx].gia = Number(gia) || 0;
  if (mauSac !== undefined) products[idx].mauSac = mauSac;
  if (moTa !== undefined) products[idx].moTa = moTa;
  if (maDM !== undefined) products[idx].maDM = maDM ? Number(maDM) : null;
  if (nhomID !== undefined) products[idx].nhomID = nhomID ? Number(nhomID) : null;
  if (loaiSP !== undefined) products[idx].loaiSP = loaiSP;
  if (soLuongTon !== undefined) products[idx].soLuongTon = Math.max(0, Number(soLuongTon) || 0);

  if (req.file) {
    products[idx].hinhAnh = `/uploads/${req.file.filename}`;
  } else if (req.body.hinhAnh) {
    products[idx].hinhAnh = req.body.hinhAnh;
  }

  writeCollection('products', products);
  res.json(products[idx]);
});

// DELETE /api/admin/orders/:id — xóa đơn hàng
router.delete('/orders/:id', adminRequired, (req, res) => {
  const id = Number(req.params.id);
  let orders = readCollection('orders');
  const before = orders.length;
  orders = orders.filter((o) => o.orderID !== id);
  if (orders.length === before) {
    return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  }

  let orderDetails = readCollection('orderDetails');
  orderDetails = orderDetails.filter((d) => d.orderID !== id);

  writeCollection('orders', orders);
  writeCollection('orderDetails', orderDetails);
  res.json({ message: 'Đã xóa đơn hàng thành công', orderID: id });
});

export default router;
