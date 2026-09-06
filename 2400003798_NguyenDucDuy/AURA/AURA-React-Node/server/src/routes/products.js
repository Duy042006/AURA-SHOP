import { Router } from 'express';
import { readCollection } from '../db.js';

const router = Router();

function applyFilters(list, { mau, gia, keyword }) {
  let result = list;
  if (keyword) {
    const k = String(keyword).toLowerCase();
    result = result.filter((x) => x.tenSP?.toLowerCase().includes(k));
  }
  if (mau) {
    result = result.filter((x) => x.mauSac?.toLowerCase().includes(String(mau).toLowerCase()));
  }
  if (gia) {
    const g = Number(gia);
    switch (g) {
      case 1:
        result = result.filter((x) => x.gia < 100000);
        break;
      case 2:
        result = result.filter((x) => x.gia >= 100000 && x.gia <= 200000);
        break;
      case 3:
        result = result.filter((x) => x.gia >= 200000 && x.gia <= 300000);
        break;
      case 4:
        result = result.filter((x) => x.gia > 300000);
        break;
      default:
        break;
    }
  }
  return result;
}

function paginate(list, page = 1, pageSize = 20) {
  const p = Math.max(1, Number(page) || 1);
  const ps = Math.max(1, Number(pageSize) || 20);
  const totalItems = list.length;
  const data = list.slice((p - 1) * ps, p * ps);
  return { data, currentPage: p, pageSize: ps, totalItems, totalPages: Math.ceil(totalItems / ps) || 1 };
}

// GET /api/products/home — trang chủ (36 sp + gallery)
router.get('/home', (_req, res) => {
  const products = readCollection('products').filter((p) => p.loaiSP === 'TrangChu' && p.giaGoc != null);
  const gallery = readCollection('gallery');
  res.json({
    sanPhams: products.slice(0, 36),
    gallery,
    danhMuc: readCollection('danhMuc'),
  });
});

// GET /api/products/search?keyword=
router.get('/search', (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.json([]);
  const products = readCollection('products');
  const result = applyFilters(products, { keyword });
  res.json(result);
});

// GET /api/products?loaiSP=&maDM=&nhomID=&mau=&gia=&page=&pageSize=
router.get('/', (req, res) => {
  let products = readCollection('products');
  const { loaiSP, maDM, nhomID, mau, gia, page, pageSize } = req.query;

  if (loaiSP) products = products.filter((p) => p.loaiSP === loaiSP);
  if (maDM) products = products.filter((p) => Number(p.maDM) === Number(maDM));
  if (nhomID) products = products.filter((p) => Number(p.nhomID) === Number(nhomID));

  products = applyFilters(products, { mau, gia });
  products = products.sort((a, b) => a.maSP - b.maSP);

  res.json(paginate(products, page, pageSize));
});

// GET /api/products/:maSP?loaiSP=
router.get('/:maSP', (req, res) => {
  const maSP = Number(req.params.maSP);
  const loaiSP = req.query.loaiSP || 'TrangChu';
  const products = readCollection('products');
  const sp = products.find((p) => p.maSP === maSP && p.loaiSP === loaiSP)
    || products.find((p) => p.maSP === maSP);

  if (!sp) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

  const gallery = readCollection('gallery').filter((g) => g.maSP === sp.maSP);
  res.json({ ...sp, gallery });
});

export default router;
