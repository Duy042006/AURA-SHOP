import { Router } from 'express';
import { readCollection, writeCollection, nextId } from '../db.js';
import { authRequired, optionalAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/orders — đặt hàng
router.post('/', optionalAuth, (req, res) => {
  const { items, hoTen, dienThoai, diaChi, voucherCode, voucherDiscount } = req.body || {};

  if (!items?.length) {
    return res.status(400).json({ message: 'Giỏ hàng trống' });
  }
  if (!hoTen || !dienThoai || !diaChi) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin giao hàng' });
  }

  const products = readCollection('products');

  // Kiểm tra tồn kho trước khi tạo đơn
  for (const item of items) {
    const p = products.find((x) => x.maSP === item.maSP && x.loaiSP === item.loaiSP)
      || products.find((x) => x.maSP === item.maSP);
    if (p) {
      const stock = p.soLuongTon !== undefined ? Number(p.soLuongTon) : 50;
      const qty = Number(item.soLuong) || 1;
      if (stock < qty) {
        return res.status(400).json({
          message: `Sản phẩm "${p.tenSP}" chỉ còn ${stock} sản phẩm trong kho (bạn đặt ${qty}). Vui lòng giảm số lượng!`
        });
      }
    }
  }

  // Trừ số lượng tồn kho
  for (const item of items) {
    const p = products.find((x) => x.maSP === item.maSP && x.loaiSP === item.loaiSP)
      || products.find((x) => x.maSP === item.maSP);
    if (p) {
      const currentStock = p.soLuongTon !== undefined ? Number(p.soLuongTon) : 50;
      const qty = Number(item.soLuong) || 1;
      p.soLuongTon = Math.max(0, currentStock - qty);
    }
  }
  writeCollection('products', products);

  let tongTien = items.reduce((sum, i) => sum + Number(i.gia) * Number(i.soLuong), 0);

  // Áp dụng giảm giá: voucher hoặc giảm 10% thành viên
  if (voucherDiscount && Number(voucherDiscount) > 0) {
    tongTien = Math.max(0, tongTien - Number(voucherDiscount));
  } else if (req.user) {
    tongTien = Math.round(tongTien * 0.9);
  }

  const orders = readCollection('orders');
  const orderDetails = readCollection('orderDetails');

  const order = {
    orderID: nextId(orders, 'orderID'),
    userId: req.user?.id ?? null,
    orderDate: new Date().toISOString(),
    totalAmount: tongTien,
    voucherCode: voucherCode || null,
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

  if (orders[idx].status !== 'Canceled') {
    orders[idx].status = 'Canceled';
    writeCollection('orders', orders);

    // Hoàn lại số lượng tồn kho
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

  res.json(orders[idx]);
});

export default router;
