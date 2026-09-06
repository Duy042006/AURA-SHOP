import { Router } from 'express';
import { readCollection } from '../db.js';

const router = Router();

// GU
router.get('/gu', (_req, res) => {
  res.json(readCollection('gu'));
});

router.get('/gu/:id', (req, res) => {
  const gu = readCollection('gu').find((g) => g.guID === Number(req.params.id));
  if (!gu) return res.status(404).json({ message: 'Không tìm thấy GU' });
  const trams = readCollection('tram').filter((t) => t.guID === gu.guID);
  res.json({ ...gu, trams });
});

router.get('/tram/:id', (req, res) => {
  const tram = readCollection('tram').find((t) => t.tramID === Number(req.params.id));
  if (!tram) return res.status(404).json({ message: 'Không tìm thấy Trạm' });
  const nhoms = readCollection('nhomSanPham').filter((n) => n.tramID === tram.tramID);
  res.json({ ...tram, nhoms });
});

router.get('/nhom/:id', (req, res) => {
  const nhom = readCollection('nhomSanPham').find((n) => n.nhomID === Number(req.params.id));
  if (!nhom) return res.status(404).json({ message: 'Không tìm thấy Nhóm' });
  res.json(nhom);
});

// ÁO
router.get('/ao', (_req, res) => {
  res.json({
    cap1: readCollection('aoCap1'),
    danhMuc: readCollection('danhMucAo'),
  });
});

router.get('/ao/:id', (req, res) => {
  const id = Number(req.params.id);
  const cap1 = readCollection('aoCap1').find((x) => x.maDM === id);
  if (!cap1) return res.status(404).json({ message: 'Không tìm thấy' });
  const cap2 = readCollection('danhMucAo').filter((x) => x.maDMCha === id);
  res.json({ dmCha: cap1, dsMuc: cap2 });
});

router.get('/ao-dm/:id', (req, res) => {
  const dm = readCollection('danhMucAo').find((x) => x.maDM === Number(req.params.id));
  if (!dm) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
  res.json(dm);
});

// QUẦN
router.get('/quan', (_req, res) => {
  res.json({
    cap1: readCollection('quanCap1'),
    danhMuc: readCollection('danhMucQuan'),
  });
});

router.get('/quan/:id', (req, res) => {
  const id = Number(req.params.id);
  const cap1 = readCollection('quanCap1').find((x) => x.maDM === id);
  if (!cap1) return res.status(404).json({ message: 'Không tìm thấy' });
  const cap2 = readCollection('danhMucQuan').filter((x) => x.maDMCha === id);
  res.json({ dmCha: cap1, dsMuc: cap2 });
});

router.get('/quan-dm/:id', (req, res) => {
  const dm = readCollection('danhMucQuan').find((x) => x.maDM === Number(req.params.id));
  if (!dm) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
  res.json(dm);
});

// PHỤ KIỆN
router.get('/phukien', (_req, res) => {
  res.json({
    cap1: readCollection('phuKienCap1'),
    danhMuc: readCollection('danhMucPhuKien'),
  });
});

router.get('/phukien/:id', (req, res) => {
  const id = Number(req.params.id);
  const cap1 = readCollection('phuKienCap1').find((x) => x.maDM === id);
  if (!cap1) return res.status(404).json({ message: 'Không tìm thấy' });
  const cap2 = readCollection('danhMucPhuKien').filter((x) => x.maDMCha === id);
  res.json({ dmCha: cap1, dsMuc: cap2 });
});

router.get('/phukien-dm/:id', (req, res) => {
  const dm = readCollection('danhMucPhuKien').find((x) => x.maDM === Number(req.params.id));
  if (!dm) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
  res.json(dm);
});

// Danh mục trang chủ
router.get('/danhmuc', (_req, res) => {
  res.json(readCollection('danhMuc'));
});

export default router;
