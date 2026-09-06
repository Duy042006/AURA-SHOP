import { Router } from 'express';
import { readCollection, writeCollection, nextId } from '../db.js';
import { authRequired, optionalAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/orders — đặt hàng
router.post('/', optionalAuth, (req, res) => {
  const { items, hoTen, dienThoai, diaChi } = req.body || {};

  if (!items?.length) {
    return res.status(400).json({ message: 'Giỏ hàng trống' });
  }
  if (!hoTen || !dienThoai || !diaChi) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin giao hàng' });
  }

  let tongTien = items.reduce((sum, i) => sum + Number(i.gia) * Number(i.soLuong), 0);

  // Đã đăng nhập → giảm 10%
  if (req.user) {
    tongTien = Math.round(tongTien * 0.9);
  }

  const orders = readCollection('orders');
  const orderDetails = readCollection('orderDetails');

  const order = {
    orderID: nextId(orders, 'orderID'),
    userId: req.user?.id ?? null,
    orderDate: new Date().toISOString(),
    totalAmount: tongTien,
    status: 'Đang xử lý',
    hoTen,
    dienThoai,
    diaChi,
  };

  orders.push(order);

  for (const item of items) {
    orderDetails.push({
      id: nextId(orderDetails, 'id'),
      orderID: order.orderID,
      maSP: item.maSP,
      loaiSP: item.loaiSP,
      tenSP: item.tenSP,
      hinhAnh: item.hinhAnh,
      quantity: item.soLuong,
      price: item.gia,
    });
  }

  writeCollection('orders', orders);
  writeCollection('orderDetails', orderDetails);

  res.status(201).json({
    message: 'Đặt hàng thành công',
    order,
    items,
  });
});

// GET /api/orders — danh sách đơn (user: của mình; admin: tất cả)
router.get('/', authRequired, (req, res) => {
  let orders = readCollection('orders');
  if (req.user.role !== 'Admin') {
    orders = orders.filter((o) => o.userId === req.user.id);
  }
  orders = orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  res.json(orders);
});

// GET /api/orders/:id
router.get('/:id', authRequired, (req, res) => {
  const id = Number(req.params.id);
  const order = readCollection('orders').find((o) => o.orderID === id);
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

  if (req.user.role !== 'Admin' && order.userId !== req.user.id) {
    return res.status(403).json({ message: 'Không có quyền xem đơn này' });
  }

  const items = readCollection('orderDetails').filter((d) => d.orderID === id);
  res.json({ ...order, items });
});

// POST /api/orders/:id/cancel
router.post('/:id/cancel', authRequired, (req, res) => {
  const id = Number(req.params.id);
  const orders = readCollection('orders');
  const idx = orders.findIndex((o) => o.orderID === id);
  if (idx < 0) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

  if (req.user.role !== 'Admin' && orders[idx].userId !== req.user.id) {
    return res.status(403).json({ message: 'Không có quyền' });
  }

  orders[idx].status = 'Canceled';
  writeCollection('orders', orders);
  res.json(orders[idx]);
});

export default router;
