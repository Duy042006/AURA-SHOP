/**
 * Seed dữ liệu mẫu cho website AURA
 * Chạy: npm run seed (từ thư mục server/)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE = path.join(__dirname, 'store');

function write(name, data) {
  if (!fs.existsSync(STORE)) fs.mkdirSync(STORE, { recursive: true });
  fs.writeFileSync(path.join(STORE, `${name}.json`), JSON.stringify(data, null, 2), 'utf8');
}

const danhMuc = [
  { maDM: 1, tenDM: 'Áo Thun Cơ Bản', moTa: 'Thoáng mát mỗi ngày, mặc là ưng' },
  { maDM: 2, tenDM: 'Công Sở Tối Giản', moTa: 'Quần tây, form gọn — cả ngày chỉn chu' },
  { maDM: 3, tenDM: 'Bộ Sưu Tập Jean', moTa: 'Jean mềm, form chuẩn mọi dáng' },
  { maDM: 4, tenDM: 'Streetwear & Casual', moTa: 'Polo, bomber, short — gu tự do' },
  { maDM: 5, tenDM: 'Áo Khoác', moTa: 'Lớp khoác nhẹ, đi đâu cũng hợp' },
  { maDM: 6, tenDM: 'Bộ Sưu Tập The Beginner', moTa: 'Trang phục thể thao cho người mới bắt đầu' },
  { maDM: 7, tenDM: 'Bộ Sưu Tập The Trainer', moTa: 'Trang phục thể thao công nghệ cao' },
  { maDM: 8, tenDM: 'Bộ Sưu Tập Dragon Ball Z', moTa: 'Bộ sưu tập có bản quyền chính hãng' },
  { maDM: 9, tenDM: 'Bộ Sưu Tập One Piece', moTa: 'Bộ sưu tập có bản quyền chính hãng' },
];

const gu = [
  { guID: 1, tenGu: 'Gu Đơn Giản', moTa: 'Phong cách tối giản, dễ mặc', hinhAnh: null },
  { guID: 2, tenGu: 'Gu Thiết Kế', moTa: 'Phong cách độc đáo, sáng tạo', hinhAnh: null },
  { guID: 3, tenGu: 'Gu Thể Thao', moTa: 'Phong cách năng động, thoải mái', hinhAnh: null },
];

const tram = [
  { tramID: 1, guID: 1, tenTram: 'Áo Thun Cơ Bản', moTa: 'Non Branded, Seventy Seven, The Worker' },
  { tramID: 2, guID: 1, tenTram: 'Bộ Sưu Tập Jean', moTa: 'The Original, Tek Black, Multi-Color' },
  { tramID: 3, guID: 1, tenTram: 'Công Sở Tối Giản', moTa: 'The Minimalist, The CEO' },
  { tramID: 4, guID: 2, tenTram: 'Áo Khoác', moTa: 'Áo khoác đơn giản & cá tính' },
  { tramID: 5, guID: 2, tenTram: 'Streetwear & Casual', moTa: 'The No Style, The Weekend' },
  { tramID: 6, guID: 2, tenTram: 'Collab', moTa: 'One Piece, Dragon Ball Z' },
  { tramID: 7, guID: 3, tenTram: 'The Beginner', moTa: null },
  { tramID: 8, guID: 3, tenTram: 'The Trainer', moTa: null },
];

const nhomSanPham = [
  { nhomID: 1, tramID: 1, tenNhom: 'Non Branded', moTa: 'Bền, đơn giản', hinhAnhBanner: null, tieuDe: 'Non Branded', noiDung: 'Bền, đơn giản' },
  { nhomID: 2, tramID: 1, tenNhom: 'Seventy Seven', moTa: 'Không lỗi mốt', hinhAnhBanner: null, tieuDe: 'Seventy Seven', noiDung: 'Không lỗi mốt' },
  { nhomID: 3, tramID: 1, tenNhom: 'The Worker', moTa: 'Nhiều túi', hinhAnhBanner: null, tieuDe: 'The Worker', noiDung: 'Nhiều túi' },
  { nhomID: 4, tramID: 2, tenNhom: 'The Original Jean', moTa: 'Giá tốt', hinhAnhBanner: null, tieuDe: 'The Original Jean', noiDung: 'Giá tốt' },
  { nhomID: 5, tramID: 2, tenNhom: 'Tek Black Jean', moTa: 'Đen bền', hinhAnhBanner: null, tieuDe: 'Tek Black Jean', noiDung: 'Đen bền' },
  { nhomID: 6, tramID: 2, tenNhom: 'Multi-Color Jean', moTa: 'Nhiều màu', hinhAnhBanner: null, tieuDe: 'Multi-Color Jean', noiDung: 'Nhiều màu' },
  { nhomID: 7, tramID: 3, tenNhom: 'The Minimalist', moTa: 'Tối giản', hinhAnhBanner: null, tieuDe: 'The Minimalist', noiDung: 'Tối giản' },
  { nhomID: 8, tramID: 3, tenNhom: 'The CEO', moTa: 'Sang trọng', hinhAnhBanner: null, tieuDe: 'The CEO', noiDung: 'Sang trọng' },
  { nhomID: 9, tramID: 4, tenNhom: 'Áo Khoác Đơn Giản', moTa: 'Bền, đơn giản', hinhAnhBanner: null, tieuDe: 'Đơn Giản', noiDung: '' },
  { nhomID: 10, tramID: 4, tenNhom: 'Áo Khoác Cá Tính', moTa: 'Trẻ trung', hinhAnhBanner: null, tieuDe: 'Cá Tính', noiDung: '' },
  { nhomID: 11, tramID: 5, tenNhom: 'The No Style', moTa: 'Streetwear', hinhAnhBanner: null, tieuDe: 'The No Style', noiDung: '' },
  { nhomID: 12, tramID: 5, tenNhom: 'The Weekend', moTa: 'Thư giãn', hinhAnhBanner: null, tieuDe: 'The Weekend', noiDung: '' },
  { nhomID: 13, tramID: 6, tenNhom: 'One Piece', moTa: 'Collab', hinhAnhBanner: null, tieuDe: 'One Piece', noiDung: '' },
  { nhomID: 14, tramID: 6, tenNhom: 'Dragon Ball Z', moTa: 'Collab', hinhAnhBanner: null, tieuDe: 'Dragon Ball Z', noiDung: '' },
];

// Menu Áo / Quần / Phụ kiện (3 cấp)
const aoCap1 = [
  { maDM: 1, tenDM: 'ÁO THUN', banner: null },
  { maDM: 2, tenDM: 'ÁO SƠ MI', banner: null },
  { maDM: 3, tenDM: 'ÁO KHOÁC', banner: null },
];
const danhMucAo = [
  { maDM: 1, maDMCha: 1, tenDM: 'Áo Thun Cổ Tròn', banner: null },
  { maDM: 2, maDMCha: 1, tenDM: 'Áo Polo', banner: null },
  { maDM: 3, maDMCha: 1, tenDM: 'Áo Thun Tay Dài', banner: null },
  { maDM: 4, maDMCha: 1, tenDM: 'Áo Tank Top (Áo Ba Lỗ)', banner: null },
  { maDM: 5, maDMCha: 2, tenDM: 'Áo Sơ Mi Ngắn Tay', banner: null },
  { maDM: 6, maDMCha: 2, tenDM: 'Áo Sơ Mi Dài Tay', banner: null },
  { maDM: 7, maDMCha: 3, tenDM: 'Áo Khoác Gió', banner: null },
  { maDM: 8, maDMCha: 3, tenDM: 'Áo Khoác Jean', banner: null },
];

const quanCap1 = [
  { maDM: 1, tenDM: 'QUẦN JEAN', banner: null },
  { maDM: 2, tenDM: 'QUẦN TÂY', banner: null },
  { maDM: 3, tenDM: 'QUẦN SHORT', banner: null },
];
const danhMucQuan = [
  { maDM: 1, maDMCha: 1, tenDM: 'Jeans Slimfit', banner: null },
  { maDM: 2, maDMCha: 1, tenDM: 'Jeans Loose', banner: null },
  { maDM: 3, maDMCha: 2, tenDM: 'Quần Tây Casual', banner: null },
  { maDM: 4, maDMCha: 2, tenDM: 'Quần Tây Công Sở', banner: null },
  { maDM: 5, maDMCha: 3, tenDM: 'Short Thun', banner: null },
  { maDM: 6, maDMCha: 3, tenDM: 'Short Kaki', banner: null },
];

const phuKienCap1 = [
  { maDM: 1, tenDM: 'NÓN', banner: null },
  { maDM: 2, tenDM: 'TÚI / BALO', banner: null },
];
const danhMucPhuKien = [
  { maDM: 1, maDMCha: 1, tenDM: 'Nón Cap', banner: null },
  { maDM: 2, maDMCha: 1, tenDM: 'Nón Bucket', banner: null },
  { maDM: 3, maDMCha: 2, tenDM: 'Balo', banner: null },
  { maDM: 4, maDMCha: 2, tenDM: 'Túi Tote / Messenger', banner: null },
];

// Ảnh thật nằm trong Content/images/Images/
const IMG = '/Content/images/Images';

const sanPhams = [
  { maSP: 1, tenSP: 'Áo Thun Pique Thoáng Mát Seventy Seven 13 Đen', giaGoc: 157000, gia: 149000, mauSac: 'Đen', moTa: 'Chất liệu thoáng mát, thoải mái', hinhAnh: `${IMG}/ao-thun-seventy-seven-13-den-1174883530.webp`, maDM: 1, nhomID: 1, loaiSP: 'TrangChu' },
  { maSP: 2, tenSP: 'Áo Thun Waffle Thoáng Mát Non Branded 01 Đen', giaGoc: 127000, gia: 120000, mauSac: 'Đen', moTa: 'Chất liệu thoáng mát, form rộng', hinhAnh: `${IMG}/ao-thun-non-branded-01-den-1174882387.webp`, maDM: 1, nhomID: 1, loaiSP: 'TrangChu' },
  { maSP: 3, tenSP: 'Áo Thun Pique Thoáng Mát Seventy Seven 13 Trắng', giaGoc: 157000, gia: 149000, mauSac: 'Trắng', moTa: 'Mềm mịn, co giãn tốt', hinhAnh: `${IMG}/ao-thun-seventy-seven-13-tr-ng-1174883539.webp`, maDM: 1, nhomID: 1, loaiSP: 'TrangChu' },
  { maSP: 4, tenSP: 'Áo Thun Cotton Line Art Co Giãn Seventy Seven 04 Hồng', giaGoc: 157000, gia: 149000, mauSac: 'Hồng', moTa: 'Phù hợp thời tiết nóng', hinhAnh: `${IMG}/ao-thun-seventy-seven-04-h-ng-1174883171.webp`, maDM: 1, nhomID: 2, loaiSP: 'TrangChu' },
  { maSP: 5, tenSP: 'Quần Tây Nam Co Giãn Ít Nhăn Non Iron 019 Đen', giaGoc: 347000, gia: 329000, mauSac: 'Đen', moTa: 'Vải cao cấp, co giãn nhẹ', hinhAnh: `${IMG}/qu-n-tay-non-iron-19-den-1174881694.webp`, maDM: 2, nhomID: null, loaiSP: 'TrangChu' },
  { maSP: 6, tenSP: 'Quần Tây Casual Mềm Mại Non Iron 001 Đen', giaGoc: 397000, gia: 377000, mauSac: 'Đen', moTa: 'Chất liệu mềm mại, thoáng mát', hinhAnh: `${IMG}/qu-n-tay-no-style-m116-den-1174881533.webp`, maDM: 2, nhomID: null, loaiSP: 'TrangChu' },
  { maSP: 7, tenSP: 'Áo Khoác Thun Nam Chống Nắng Cool Touch 002 Đen', giaGoc: 557000, gia: 473000, mauSac: 'Đen', moTa: 'Vải thun cool touch chống nắng', hinhAnh: `${IMG}/ao-khoac-cool-touch-02-den-1174884952.webp`, maDM: 2, nhomID: null, loaiSP: 'TrangChu' },
  { maSP: 8, tenSP: 'Quần Jogger Mềm Mịn Mát The Minimalist 019 Đen', giaGoc: 397000, gia: 377000, mauSac: 'Đen', moTa: 'Jogger co giãn, mềm mịn', hinhAnh: `${IMG}/qu-n-dai-cool-touch-03-den-1174881341.webp`, maDM: 2, nhomID: 7, loaiSP: 'TrangChu' },
  { maSP: 9, tenSP: 'Quần Jeans Slimfit Co Giãn The Original 028 Đen', giaGoc: 327000, gia: 294000, mauSac: 'Đen', moTa: 'Co giãn tốt, form chuẩn', hinhAnh: `${IMG}/qu-n-jean-the-original-28-den-1174882647.webp`, maDM: 3, nhomID: 4, loaiSP: 'TrangChu' },
  { maSP: 10, tenSP: 'Quần Jeans Slimfit Co Giãn The Original 028 Xanh Dương Tối', giaGoc: 327000, gia: 294000, mauSac: 'Xanh dương', moTa: 'Co giãn nhẹ, chất jean bền', hinhAnh: `${IMG}/qu-n-jean-the-original-28-xanh-d-m-1-1174882642.webp`, maDM: 3, nhomID: 4, loaiSP: 'TrangChu' },
  { maSP: 11, tenSP: 'Quần Jeans Slimfit Co Giãn The Original 028 Xanh Dương', giaGoc: 327000, gia: 294000, mauSac: 'Xanh dương', moTa: 'Mềm, dễ mặc', hinhAnh: `${IMG}/qu-n-jean-the-original-28-xanh-d-ng-1174882630.webp`, maDM: 3, nhomID: 4, loaiSP: 'TrangChu' },
  { maSP: 12, tenSP: 'Áo Khoác Jean Phối Nón The Original 039 Xanh Dương Đậm', giaGoc: 447000, gia: 402000, mauSac: 'Xanh', moTa: 'Áo khoác jean cá tính', hinhAnh: `${IMG}/ao-khoac-jean-the-original-m039-xanh-d-ng-1184461421.webp`, maDM: 3, nhomID: 4, loaiSP: 'TrangChu' },
  { maSP: 13, tenSP: 'Áo Polo Pique Mềm Mại Thoáng Mát The No Style 078 Đen', giaGoc: 197000, gia: 187000, mauSac: 'Đen', moTa: 'Chất liệu pique mềm mại', hinhAnh: `${IMG}/ao-polo-no-style-78-den-1174885461.webp`, maDM: 4, nhomID: 11, loaiSP: 'TrangChu' },
  { maSP: 14, tenSP: 'Áo Khoác Bomber Vải Pique Co Giãn The No Style 183 Xám Nhạt', giaGoc: 697000, gia: 662000, mauSac: 'Xám nhạt', moTa: 'Form bomber trẻ trung', hinhAnh: `${IMG}/ao-khoac-no-style-m45-xam-ghi-1174885194.webp`, maDM: 4, nhomID: 11, loaiSP: 'TrangChu' },
  { maSP: 15, tenSP: 'Áo Thun Suede Mềm Mịn The Weekend 002 Xám Đậm', giaGoc: 227000, gia: 215000, mauSac: 'Xám đậm', moTa: 'Chất suede mềm, mịn', hinhAnh: `${IMG}/ao-thun-no-style-m14-xam-1174883787.webp`, maDM: 4, nhomID: 12, loaiSP: 'TrangChu' },
  { maSP: 16, tenSP: 'Quần Short 5 Inch Vải Mesh Thoáng Khí The No Style 153 Đen', giaGoc: 257000, gia: 218000, mauSac: 'Đen', moTa: 'Vải mesh thoáng khí', hinhAnh: `${IMG}/24032_thumb_1.webp`, maDM: 4, nhomID: 11, loaiSP: 'TrangChu' },
  { maSP: 17, tenSP: 'Áo Khoác Sơ Mi OXFORD Thoáng Khí Ít Nhăn The No Style 223 Xám', giaGoc: 297000, gia: 282000, mauSac: 'Xám', moTa: 'Oxford thoáng khí, ít nhăn', hinhAnh: `${IMG}/0024629_thumb_1.webp`, maDM: 5, nhomID: 9, loaiSP: 'TrangChu' },
  { maSP: 18, tenSP: 'Áo Khoác Sơ Mi OXFORD Thoáng Khí Ít Nhăn The No Style 223 Xám Nhạt', giaGoc: 297000, gia: 282000, mauSac: 'Xám nhạt', moTa: 'Oxford mềm, thoáng khí', hinhAnh: `${IMG}/0024628_thumb_1.webp`, maDM: 5, nhomID: 9, loaiSP: 'TrangChu' },
  { maSP: 19, tenSP: 'Áo Khoác Sơ Mi OXFORD Thoáng Khí Ít Nhăn The No Style 223 Trắng', giaGoc: 297000, gia: 282000, mauSac: 'Trắng', moTa: 'Form rộng dễ mặc', hinhAnh: `${IMG}/0024627_thumb_1.webp`, maDM: 5, nhomID: 9, loaiSP: 'TrangChu' },
  { maSP: 20, tenSP: 'Áo Khoác Sơ Mi OXFORD Thoáng Khí Ít Nhăn The No Style 223 Xanh Dương', giaGoc: 297000, gia: 282000, mauSac: 'Xanh dương', moTa: 'Phong cách trẻ trung', hinhAnh: `${IMG}/0024626_thumb_1.webp`, maDM: 5, nhomID: 10, loaiSP: 'TrangChu' },
  { maSP: 21, tenSP: 'Quần Short Dù Thể Thao Beginner 014 Xanh Dương', giaGoc: 177000, gia: 150000, mauSac: 'Xanh dương', moTa: 'Mỏng nhẹ, co giãn tối ưu', hinhAnh: `${IMG}/0024158_thumb_1.webp`, maDM: 6, nhomID: null, loaiSP: 'TrangChu' },
  { maSP: 22, tenSP: 'Áo Khoác Thể Thao Mềm Mại Nhanh Khô Beginner 009 Đen', giaGoc: 257000, gia: 218000, mauSac: 'Đen', moTa: 'Vải Hexagon Polyester', hinhAnh: `${IMG}/0023174thumb1.webp`, maDM: 6, nhomID: null, loaiSP: 'TrangChu' },
  { maSP: 23, tenSP: 'Quần Jogger Thun Thể Thao Co Giãn Beginner 008 Xanh Dương', giaGoc: 257000, gia: 218000, mauSac: 'Xanh dương', moTa: '90% Polyester 10% Spandex', hinhAnh: `${IMG}/0023172_thumb_1.webp`, maDM: 6, nhomID: null, loaiSP: 'TrangChu' },
  { maSP: 24, tenSP: 'Quần Short Thun 7 Inch Vải Hexagon Beginner 005 Xám Nhạt', giaGoc: 147000, gia: 124000, mauSac: 'Xám nhạt', moTa: 'Thoát ẩm tốt khi tập luyện', hinhAnh: `${IMG}/0023167_Thumb_1.webp`, maDM: 6, nhomID: null, loaiSP: 'TrangChu' },
  { maSP: 25, tenSP: 'Áo Thun Thể Thao Ultra Stretch The Trainer 001 Trắng', giaGoc: 297000, gia: 282000, mauSac: 'Trắng', moTa: 'Thể thao, năng động, tối giản', hinhAnh: `${IMG}/24056thumb1.webp`, maDM: 7, nhomID: null, loaiSP: 'TrangChu' },
  { maSP: 26, tenSP: 'Quần Short Thể Thao 7 Inch Ultra Stretch The Trainer 015 Đen', giaGoc: 357000, gia: 339000, mauSac: 'Đen', moTa: 'Thể thao, năng động, hiện đại', hinhAnh: `${IMG}/qu-n-short-the-trainer-015-den-1178529190.webp`, maDM: 7, nhomID: null, loaiSP: 'TrangChu' },
  { maSP: 27, tenSP: 'Áo Thun Tay Dài Thể Thao Ultra Stretch The Trainer 006 Xám', giaGoc: 357000, gia: 321000, mauSac: 'Xám', moTa: 'Athletic & Minimalist', hinhAnh: `${IMG}/ao-thun-the-trainer-006-xam-1178529255.webp`, maDM: 7, nhomID: null, loaiSP: 'TrangChu' },
  { maSP: 28, tenSP: 'Áo Thun 3 Lỗ Thể Thao Ultra Stretch The Trainer 007 Đen', giaGoc: 147000, gia: 139000, mauSac: 'Đen', moTa: 'Chuyên dụng cho thể thao', hinhAnh: `${IMG}/24077_thumb_1.webp`, maDM: 7, nhomID: null, loaiSP: 'TrangChu' },
  { maSP: 29, tenSP: 'Nón 5 Panel Cap Kaki Bền Bỉ Dragon Ball Z 036 Đen', giaGoc: 197000, gia: 157000, mauSac: 'Đen', moTa: 'Nón 5 Panel kaki bền bỉ', hinhAnh: `${IMG}/0024442thumb1.webp`, maDM: 8, nhomID: 14, loaiSP: 'TrangChu' },
  { maSP: 30, tenSP: 'Nón 5 Panel Cap Kaki Bền Bỉ Dragon Ball Z 036 Nâu Đậm', giaGoc: 197000, gia: 157000, mauSac: 'Nâu đậm', moTa: 'Nón 5 Panel kaki bền bỉ', hinhAnh: `${IMG}/0024441thumb1.webp`, maDM: 8, nhomID: 14, loaiSP: 'TrangChu' },
  { maSP: 31, tenSP: 'Nón 5 Panel Cap Kaki Bền Bỉ Dragon Ball Z 037 Đỏ Đậm', giaGoc: 197000, gia: 157000, mauSac: 'Đỏ đậm', moTa: 'Nón 5 Panel kaki bền bỉ', hinhAnh: `${IMG}/0024440thumb1.webp`, maDM: 8, nhomID: 14, loaiSP: 'TrangChu' },
  { maSP: 32, tenSP: 'Túi Tote Canvas Bền Bỉ Dragon Ball Z 031 Xanh Lá Đậm', giaGoc: 397000, gia: 317000, mauSac: 'Xanh lá đậm', moTa: 'Streetwear, grunge', hinhAnh: `${IMG}/0024439thumb1.webp`, maDM: 8, nhomID: 14, loaiSP: 'TrangChu' },
  { maSP: 33, tenSP: 'Balo Essential Trượt Nước ONE PIECE WANO 037 Đen', giaGoc: 557000, gia: 445000, mauSac: 'Đen', moTa: 'Simili trượt nước, ngăn laptop', hinhAnh: `${IMG}/0024284thumb1.jpg`, maDM: 9, nhomID: 13, loaiSP: 'TrangChu' },
  { maSP: 34, tenSP: 'Túi Messenger Trượt Nước Form Cứng ONE PIECE WANO 030 Đen', giaGoc: 457000, gia: 365000, mauSac: 'Đen', moTa: 'Simily chống thấm nước', hinhAnh: `${IMG}/0024282thumb1.webp`, maDM: 9, nhomID: 13, loaiSP: 'TrangChu' },
  { maSP: 35, tenSP: 'Áo Sơ CuBan Nhẹ Thoáng Mát ONE PIECE WANO 018 Đen', giaGoc: 327000, gia: 261000, mauSac: 'Đen', moTa: 'Phóng khoáng, streetwear', hinhAnh: `${IMG}/0024269thumb1.webp`, maDM: 9, nhomID: 13, loaiSP: 'TrangChu' },
  { maSP: 36, tenSP: 'Quần Short Nam Kaki 9 Inch ONE PIECE WANO 026 Xám', giaGoc: 397000, gia: 317000, mauSac: 'Xám', moTa: 'Streetwear phóng khoáng', hinhAnh: `${IMG}/0024276thumb1.webp`, maDM: 9, nhomID: 13, loaiSP: 'TrangChu' },
];

// Phân loại Áo / Quần / Phụ kiện theo loaiSP
const sanPhamAo = sanPhams
  .filter((s) => /áo|polo|hoodie|bomber|khoác/i.test(s.tenSP))
  .map((s, i) => ({
    ...s,
    maSP: 1000 + i + 1,
    loaiSP: 'Ao',
    maDM: s.tenSP.toLowerCase().includes('polo')
      ? 2
      : s.tenSP.toLowerCase().includes('sơ')
        ? 5
        : s.tenSP.toLowerCase().includes('khoác')
          ? 7
          : s.tenSP.toLowerCase().includes('lỗ') || s.tenSP.toLowerCase().includes('tank')
            ? 4
            : 1,
  }));

const sanPhamQuan = sanPhams
  .filter((s) => /quần|jogger|short|jeans/i.test(s.tenSP))
  .map((s, i) => ({
    ...s,
    maSP: 2000 + i + 1,
    loaiSP: 'Quan',
    maDM: s.tenSP.toLowerCase().includes('jean')
      ? 1
      : s.tenSP.toLowerCase().includes('tây')
        ? 3
        : s.tenSP.toLowerCase().includes('short')
          ? 5
          : 1,
  }));

const sanPhamPhuKien = sanPhams
  .filter((s) => /nón|balo|túi/i.test(s.tenSP))
  .map((s, i) => ({
    ...s,
    maSP: 3000 + i + 1,
    loaiSP: 'PhuKien',
    maDM: s.tenSP.toLowerCase().includes('nón') ? 1 : s.tenSP.toLowerCase().includes('balo') ? 3 : 4,
  }));

const allProducts = [...sanPhams, ...sanPhamAo, ...sanPhamQuan, ...sanPhamPhuKien];

const gallery = [
  { maHA: 1, maSP: 1, linkAnh: `${IMG}/1O4A9191_500x.webp` },
  { maHA: 2, maSP: 1, linkAnh: `${IMG}/1O4A1435_500x.webp` },
  { maHA: 3, maSP: 2, linkAnh: `${IMG}/IMG_3571_1_500x.webp` },
  { maHA: 4, maSP: 3, linkAnh: `${IMG}/IMG_4013_500x.webp` },
  { maHA: 5, maSP: 4, linkAnh: `${IMG}/24033_thum_5_500x.webp` },
  { maHA: 6, maSP: 4, linkAnh: `${IMG}/IMG_3778_500x.webp` },
  { maHA: 7, maSP: 9, linkAnh: `${IMG}/28_83f6d509-8ea4-4eee-a8c8-52c0984e1582_500x.webp` },
  { maHA: 8, maSP: 10, linkAnh: `${IMG}/29_13e4f784-6adc-4e44-b6d2-be6ac2d7da48_500x.webp` },
  { maHA: 9, maSP: 13, linkAnh: `${IMG}/Screen_Shot_2025-09-12_at_11.16.12_500x.webp` },
  { maHA: 10, maSP: 14, linkAnh: `${IMG}/346A7660_500x.webp` },
  { maHA: 11, maSP: 16, linkAnh: `${IMG}/1O4A2430_500x.webp` },
  { maHA: 12, maSP: 17, linkAnh: `${IMG}/1O4A3024_500x.webp` },
  { maHA: 13, maSP: 18, linkAnh: `${IMG}/1O4A3053_500x.webp` },
  { maHA: 14, maSP: 19, linkAnh: `${IMG}/1O4A2683_copy_500x.webp` },
];

const passwordHash = bcrypt.hashSync('123456', 10);
const users = [
  {
    id: 1,
    fullName: 'Admin AURA',
    email: 'admin@aura.vn',
    username: 'admin',
    password: passwordHash,
    phone: '0900000000',
    gender: 'Nam',
    day: 1,
    month: 1,
    year: 2000,
    address: 'TP.HCM',
    role: 'Admin',
  },
  {
    id: 2,
    fullName: 'Nguyễn Văn A',
    email: 'user@aura.vn',
    username: 'user',
    password: passwordHash,
    phone: '0912345678',
    gender: 'Nam',
    day: 15,
    month: 6,
    year: 2002,
    address: 'Hà Nội',
    role: 'User',
  },
];

write('danhMuc', danhMuc);
write('gu', gu);
write('tram', tram);
write('nhomSanPham', nhomSanPham);
write('aoCap1', aoCap1);
write('danhMucAo', danhMucAo);
write('quanCap1', quanCap1);
write('danhMucQuan', danhMucQuan);
write('phuKienCap1', phuKienCap1);
write('danhMucPhuKien', danhMucPhuKien);
write('products', allProducts);
write('gallery', gallery);
write('users', users);
write('orders', []);
write('orderDetails', []);

console.log('✅ Seed xong!');
console.log(`   - ${allProducts.length} sản phẩm`);
console.log(`   - ${users.length} users (admin/user — mật khẩu: 123456)`);
console.log(`   - ${gallery.length} ảnh gallery`);
