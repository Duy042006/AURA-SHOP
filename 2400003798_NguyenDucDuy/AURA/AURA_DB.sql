
-- Tạo database
CREATE DATABASE AURA_DB;
GO
USE AURA_DB;
GO


-- ==============================
-- MENU GU
-- ==============================

--- Bảng Gu
CREATE TABLE Gu (
    GuID INT IDENTITY PRIMARY KEY,
    TenGu NVARCHAR(100),
    MoTa NVARCHAR(255),
    HinhAnh NVARCHAR(255)
);

--- Bảng Trạm
CREATE TABLE Tram (
    TramID INT IDENTITY PRIMARY KEY,
    GuID INT FOREIGN KEY REFERENCES Gu(GuID),
    TenTram NVARCHAR(100),
    MoTa NVARCHAR(255)
);


--- Bảng Nhóm Sản Phẩm
CREATE TABLE NhomSanPham (
    NhomID INT IDENTITY PRIMARY KEY,
    TramID INT FOREIGN KEY REFERENCES Tram(TramID),
    TenNhom NVARCHAR(100),
    MoTa NVARCHAR(255)
);


-- ==============================
-- TRANG CHỦ
-- ==============================


-- Bảng danh mục (ví dụ: Trạm 1, Bộ sưu tập...)
CREATE TABLE DanhMuc (
    MaDM INT PRIMARY KEY IDENTITY(1,1),
    TenDM NVARCHAR(100),
    MoTa NVARCHAR(255)
);

-- Bảng sản phẩm
CREATE TABLE SanPham (
    MaSP INT PRIMARY KEY IDENTITY(1,1),
    TenSP NVARCHAR(150),
	GiaGoc DECIMAL(18,2),
    Gia DECIMAL(10,0),
    MauSac NVARCHAR(50),
    MoTa NVARCHAR(255),
    HinhAnh NVARCHAR(500),
    MaDM INT FOREIGN KEY REFERENCES DanhMuc(MaDM),
	NhomID INT FOREIGN KEY REFERENCES NhomSanPham(NhomID)  -- dùng cho GU → TRẠM → NHÓM
);

-- Bảng hình ảnh sản phẩm (gallery)
CREATE TABLE HinhAnhSanPham (
    MaHA INT PRIMARY KEY IDENTITY(1,1),
    MaSP INT FOREIGN KEY REFERENCES SanPham(MaSP),
    LinkAnh NVARCHAR(500)
);

-- ==============================
-- TRẠM 1 | THỜI TRANG Thiết Yếu
-- ==============================

-- Danh mục
INSERT INTO DanhMuc (TenDM, MoTa)
VALUES (N'Trạm 1 | Thời Trang Thiết Yếu', N'Nền Tảng Phong Cách, Chất Lượng Vượt Thời Gian');

-- Sản phẩm
INSERT INTO SanPham (TenSP,GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM)
VALUES
(N'Áo Thun Pique Thoáng Mát Seventy Seven 13 Đen',157000, 149000, N'Đen',  N'Chất liệu thoáng mát, thoải mái', '/Content/images/Images/images/Imagess/ao-thun-seventy-seven-13-den-1174883530.webp', 1),
(N'Áo Thun Waffle Thoáng Mát Non Branded 01 Đen',127000, 120650, N'Trắng', N'Chất liệu thoáng mát, form rộng', '/Content/images/Images/images/Imagess/ao-thun-non-branded-01-den-1174882387.webp', 1),
(N'Áo Thun Pique Thoáng Mát Seventy Seven 13 Trắng',157000, 149000, N'Hồng', N'Mềm mịn, co giãn tốt', '/Content/images/Images/images/Imagess/ao-thun-seventy-seven-13-tr-ng-1174883539.webp', 1),
(N'Áo Thun Cotton Line Art Co Giãn Seventy Seven 04 Hồng',157000, 149000, N'Đen',  N'Phù hợp thời tiết nóng', '/Content/images/Images/images/Imagess/ao-thun-seventy-seven-04-h-ng-1174883171.webp', 1);

-- Hình ảnh (gallery)
INSERT INTO HinhAnhSanPham (MaSP, LinkAnh)
VALUES
(1, '/Content/images/Images/images/Imagess/1O4A9191_500x.webp'),
(1, '/Content/images/Images/images/Imagess/1O4A1435_500x.webp'),
(2, '/Content/images/Images/images/Imagess/IMG_3571_1_500x.webp'),
(3, '/Content/images/Images/images/Imagess/IMG_4013_500x.webp'),
(4, '/Content/images/Images/images/Imagess/24033_thum_5_500x.webp'),
(4, '/Content/images/Images/images/Imagess/IMG_3778_500x.webp'),
(1, '/Content/images/Images/images/Imagess/23710_thum_5_500x.webp'),
(2, '/Content/images/Images/images/Imagess/1O4A1378_500x.webp'),
(3, '/Content/images/Images/images/Imagess/IMG_0050_500x.webp'),
(3, '/Content/images/Images/images/Imagess/IMG_2806_500x.webp'),
(4, '/Content/images/Images/images/Imagess/IMG_2908_500x.webp'),
(4, '/Content/images/Images/images/Imagess/IMG_3113_500x.webp');


-- ==============================
-- TRẠM 2 | THỜI TRANG CÔNG NGHỆ
-- ==============================

-- Thêm danh mục mới
INSERT INTO DanhMuc (TenDM, MoTa)
VALUES (N'Trạm 2 | Thời Trang Công Nghệ', N'Mặc Công Nghệ, Sống Thành Thơi');

-- Thêm 4 sản phẩm mới
INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM)
VALUES
(N'Quần Tây Nam Co Giãn Ít Nhăn Non Iron 019 Đen', 347000, 329650, N'Đen',
 N'Vải cao cấp, co giãn nhẹ, dễ ủi phẳng',
 '/Content/images/Images/images/Imagess/qu-n-tay-non-iron-19-den-1174881694.webp', 2),

(N'Quần Tây Cas
ual Mềm Mại Non Iron 001 Đen', 397000, 377150, N'Đen',
 N'Chất liệu mềm mại, thoáng mát, dễ phối đồ',
 '/Content/images/Images/images/Imagess/qu-n-tay-no-style-m116-den-1174881533.webp', 2),

(N'Áo Khoác Thun Nam Chống Nắng Cool Touch 002 Đen', 557000, 473450, N'Đen',
 N'Thiết kế năng động, vải thun cool touch chống nắng tốt',
 '/Content/images/Images/images/Imagess/ao-khoac-cool-touch-02-den-1174884952.webp', 2),

(N'Quần Jogger Mềm Mịn Mát The Minimalist 019 Đen', 397000, 377150, N'Đen',
 N'Jogger co giãn, mềm mịn, dễ vận động và thời trang',
 '/Content/images/Images/images/Imagess/qu-n-dai-cool-touch-03-den-1174881341.webp', 2);

-- ==============================
-- Trạm 3 | Thời Trang Jean
-- ==============================

-- Thêm danh mục mới
INSERT INTO DanhMuc (TenDM, MoTa)
VALUES (N'Trạm 3 | Thời Trang Jean', N'Jean Mềm Cho Mọi Dáng Hình');

-- Thêm 4 sản phẩm mới
INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM)
VALUES
(N'Quần Jeans Slimfit Co Giãn The Original 028 Đen', 327000, 294300,
 N'Đen', N'Co giãn tốt, form chuẩn',
 '/Content/images/Images/images/Imagess/qu-n-jean-the-original-28-den-1174882647.webp', 3),

(N'Quần Jeans Slimfit Co Giãn The Original 028 Xanh Dương Tối', 327000, 294300,
 N'Xanh dương', N'Co giãn nhẹ, chất jean bền',
 '/Content/images/Images/images/Imagess/qu-n-jean-the-original-28-xanh-d-m-1-1174882642.webp', 3),

(N'Quần Jeans Slimfit Co Giãn The Original 028 Xanh Dương', 327000, 294300, 
 N'Xanh dương', N'Mềm, dễ mặc',
 '/Content/images/Images/images/Imagess/qu-n-jean-the-original-28-xanh-d-ng-1174882630.webp', 3),
(N'Áo Khoác Jean Phối Nón The Original 039 Xanh Dương Đậm', 447000, 402300,
 N'Xanh', N'Áo khoác jean cá tính',
 '/Content/images/Images/images/Imagess/ao-khoac-jean-the-original-m039-xanh-d-ng-1184461421.webp', 3);

 -- Hình ảnh (gallery)
INSERT INTO HinhAnhSanPham (MaSP, LinkAnh)
VALUES
(9, '/Content/images/Images/images/Imagess/28_83f6d509-8ea4-4eee-a8c8-52c0984e1582_500x.webp'),
(9, '/Content/images/Images/images/Imagess/27_31af3b34-6abf-43a2-86f6-04a9a5b63e2d_500x.webp'),
(10, '/Content/images/Images/images/Imagess/29_13e4f784-6adc-4e44-b6d2-be6ac2d7da48_500x.webp'),
(10, '/Content/images/Images/images/Imagess/30_1c744b61-a7ad-4920-bea6-e9415701ff0f_500x.webp'),
(11, '/Content/images/Images/images/Imagess/32_cce3803d-1298-4a10-9f9b-d00f74cf0a01_500x.webp'),
(11, '/Content/images/Images/images/Imagess/31_6ff2f48a-004b-4958-bcdb-cc8433004be3_500x.webp'),
(12, '/Content/images/Images/images/Imagess/35_753d1399-fdfe-4eed-8e76-abc22198558e_500x.webp'),
(12, '/Content/images/Images/images/Imagess/36_91750504-47b3-4c1b-a60b-fd200f5ef8ef_500x.webp'),
(12, '/Content/images/Images/images/Imagess/37_a401824e-aef8-40b0-b802-20666bdb3aa1_500x.webp'),
(12, '/Content/images/Images/images/Imagess/13-8_ym0801_500x.webp'),
(12, '/Content/images/Images/images/Imagess/39_e98cd9fd-ee8d-482d-a7a4-6f6c38ed0506_500x.webp'),
(12, '/Content/images/Images/images/Imagess/Hinh_nh_garally_aa3bebac-aeb4-492d-b9ae-34f6f2ad7756_500x.webp')

-- ==============================
-- Trạm 4 | Thời Trang Tận Hưởng
-- ==============================

-- Thêm danh mục mới
INSERT INTO DanhMuc (TenDM, MoTa)
VALUES (N'Trạm 4 | Thời Trang Tận Hưởng', N'Gu Của Bạn, AURA Có Hế');

-- Thêm 4 sản phẩm mới
INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM)
VALUES
(N'Áo Polo Pique Mềm Mại Thoáng Mát The No Style 078 Đen', 197000, 187150,
 N'Đen', N'Chất liệu pique mềm mại, thoáng mát, dễ phối đồ',
 '/Content/images/Images/images/Imagess/ao-polo-no-style-78-den-1174885461.webp', 4),

(N'Áo Khoác Bomber Vải Pique Co Giãn The No Style 183 Xám Nhạt', 697000, 662150,
 N'Xám nhạt', N'Chất vải pique co giãn, form bomber trẻ trung',
 '/Content/images/Images/images/Imagess/ao-khoac-no-style-m45-xam-ghi-1174885194.webp', 4),

(N'Áo Thun Suede Mềm Mịn The Weekend 002 Xám Đậm', 227000, 215650,
 N'Xám đậm', N'Chất suede mềm, mịn, mặc thoải mái',
 '/Content/images/Images/images/Imagess/ao-thun-no-style-m14-xam-1174883787.webp', 4),

(N'Quần Short 5 Inch Vải Mesh Thoáng Khí The No Style 153 Đen', 257000, 218450,
 N'Đen', N'Vải mesh thoáng khí, co giãn, thích hợp vận động',
 '/Content/images/Images/images/Imagess/24032_thumb_1.webp', 4);

-- Hình ảnh (gallery)
INSERT INTO HinhAnhSanPham (MaSP, LinkAnh)
VALUES
(13, '/Content/images/Images/images/Imagess/Screen_Shot_2025-09-12_at_11.16.12_500x.webp'),
(13, '/Content/images/Images/images/Imagess/346A7644_500x.webp'),
(14, '/Content/images/Images/images/Imagess/346A7660_500x.webp'),
(14, '/Content/images/Images/images/Imagess/346A7698_500x.webp'),
(15, '/Content/images/Images/images/Imagess/346A7727_500x.webp'),
(15, '/Content/images/Images/images/Imagess/346A7782_9fe4d221-ed68-42bf-a861-2e065a849021_500x.webp'),
(13, '/Content/images/Images/images/Imagess/346A7794_500x.webp'),
(13, '/Content/images/Images/images/Imagess/346A7851_71023e72-24b9-4dfd-aac9-233033ff6793_500x.webp'),
(14, '/Content/images/Images/images/Imagess/Screen_Shot_2025-09-12_at_11.15.58_500x.webp'),
(15, '/Content/images/Images/images/Imagess/346A7845_d82b0d28-f8df-47e0-ab08-c4ada725366c_500x.webp')

-- ==============================
-- Trạm 5 | Thời Trang Dịch Chuyển
-- ==============================

-- Thêm danh mục mới
INSERT INTO DanhMuc (TenDM, MoTa)
VALUES (N'Trạm 5 | Thời Trang Dịch Chuyển', N'Một Lớp Khoác, Vạn Hành Trình');

-- Thêm 4 sản phẩm mới
INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM)
VALUES
(N'Áo Khoác Sơ Mi OXFORD Thoáng Khí Ít Nhăn The No Style 223 Xám', 297000, 282150, 
 N'Xám', N'Chất liệu Oxford thoáng khí, ít nhăn, form trẻ trung hiện đại', 
 '/Content/images/Images/images/Imagess/0024629_thumb_1.webp', 5),

(N'Áo Khoác Sơ Mi OXFORD Thoáng Khí Ít Nhăn The No Style 223 Xám Nhạt', 297000, 282150, 
 N'Xám nhạt', N'Chất liệu Oxford mềm, thoáng khí, ít nhăn', 
 '/Content/images/Images/images/Imagess/0024628_thumb_1.webp', 5),

(N'Áo Khoác Sơ Mi OXFORD Thoáng Khí Ít Nhăn The No Style 223 Trắng', 297000, 282150, 
 N'Trắng', N'Form rộng dễ mặc, vải Oxford thoáng mát và ít nhăn', 
 '/Content/images/Images/images/Imagess/0024627_thumb_1.webp', 5),

(N'Áo Khoác Sơ Mi OXFORD Thoáng Khí Ít Nhăn The No Style 223 Xanh Dương', 297000, 282150, 
 N'Xanh dương', N'Phong cách trẻ trung, thoáng khí, ít nhăn, dễ phối đồ', 
 '/Content/images/Images/images/Imagess/0024626_thumb_1.webp', 5);

-- Hình ảnh (gallery)
INSERT INTO HinhAnhSanPham (MaSP, LinkAnh)
VALUES
(16, '/Content/images/Images/images/Imagess/1O4A2430_500x.webp'),
(16, '/Content/images/Images/images/Imagess/1O4A3046_500x.webp'),
(17, '/Content/images/Images/images/Imagess/1O4A3024_500x.webp'),
(17, '/Content/images/Images/images/Imagess/1O4A2588_500x.webp'),
(18, '/Content/images/Images/images/Imagess/1O4A3053_500x.webp'),
(18, '/Content/images/Images/images/Imagess/1O4A3328_500x.webp'),
(19, '/Content/images/Images/images/Imagess/1O4A2683_copy_500x.webp'),
(19, '/Content/images/Images/images/Imagess/1O4A3260_500x.webp'),
(16, '/Content/images/Images/images/Imagess/1O4A2669_500x.webp'),
(17, '/Content/images/Images/images/Imagess/1O4A2143_500x.webp'),
(18, '/Content/images/Images/images/Imagess/1O4A2080_e3413185-7517-44ec-a7ec-4d27a2ad15dd_1000x.webp')

-- Thêm danh mục mới
INSERT INTO DanhMuc (TenDM, MoTa)
VALUES (N'Bộ Sưu Tập The Beginner', N'Trang phục thể thao cho người mới bắt đầu');

-- Thêm 4 sản phẩm mới
INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM)
VALUES
(N'Quần Short Dù Thể Thao Beginner 014 Xanh Dương', 177000, 150450, 
 N'Xanh dương', N'Mỏng nhẹ và Độ co giãn tối ưu ', 
 '/Content/images/Images/images/Imagess/0024158_thumb_1.webp', 6),

(N'Áo Khoác Thể Thao Mềm Mại Nhanh Khô Beginner 009 Đen', 257000, 218450, 
 N'Đen', N'Vải Hexagon Polyester (100% Polyester)	', 
 '/Content/images/Images/images/Imagess/0023174thumb1.webp', 6),

(N'Quần Jogger Thun Thể Thao Co Giãn Beginner 008 Xanh Dương', 257000, 218450, 
 N'Xanh dương', N'Vải Polyester Double Face được làm từ 90% Polyester và 10% Spandex', 
 '/Content/images/Images/images/Imagess/0023172_thumb_1.webp', 6),

(N'Quần Short Thun 7 Inch Vải Hexagon Thoáng Khí Beginner 005 Xám Nhạt', 147000, 124950, 
 N'Xám nhạt', N'Vải nhẹ và có khả năng thoát ẩm tốt giúp bạn luôn luôn khô ráo khi tập luyện.', 
 '/Content/images/Images/images/Imagess/0023167_Thumb_1.webp', 6);

 -- Thêm danh mục mới
INSERT INTO DanhMuc (TenDM, MoTa)
VALUES (N'Bộ Sưu Tập The Trainer', N'Trang phục thể thao công nghệ cao và tối ưu hiệu suất');

-- Thêm 4 sản phẩm mới
INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM)
VALUES
(N'Áo Thun Thể Thao Ultra Stretch The Trainer 001 Trắng', 297000, 282150, 
 N'Trắng', N'Phong cách: Thể thao, năng động, tối giản và hiện đại. ', 
 '/Content/images/Images/images/Imagess/24056thumb1.webp', 7),

(N'Quần Short Thể Thao 7 Inch Ultra Stretch The Trainer 015 Đen', 357000, 339150, 
 N'Đen', N'Phong cách: Thể thao, năng động, hiện đại.', 
 '/Content/images/Images/images/Imagess/qu-n-short-the-trainer-015-den-1178529190.webp', 7),

(N'Áo Thun Tay Dài Thể Thao Ultra Stretch The Trainer 006 Xám', 357000, 321300, 
 N'Xám', N'Phong cách: Thể thao & Năng động (Athletic & Dynamic), Tối giản & Hiện Đại (Minimalist & Modern), "Body-conscious" & Tôn dáng', 
 '/Content/images/Images/images/Imagess/ao-thun-the-trainer-006-xam-1178529255.webp', 7),

(N'Áo Thun 3 Lỗ Thể Thao Ultra Stretch The Trainer 007 Đen', 147000, 139650, 
 N'Đen', N'Phong cách: Hiện đại, năng động và chuyên dụng cho thể thao.', 
 '/Content/images/Images/images/Imagess/24077_thumb_1.webp', 7);

 -- Thêm danh mục mới
INSERT INTO DanhMuc (TenDM, MoTa)
VALUES (N'Bộ Sưu Tập Dragon Balls Z', N'Bộ sưu tập có bản quyền chính hãng');

-- Thêm 4 sản phẩm mới
INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM)
VALUES
(N'Nón 5 Panel Cap Kaki Bền Bỉ Dragon Ball Z 036 Đen', 197000, 157600, 
 N'Đen', N'Nón 5 Panel lạ mắt, kaki bền bỉ đứng form.', 
 '/Content/images/Images/images/Imagess/0024442thumb1.webp', 8),

(N'Nón 5 Panel Cap Kaki Bền Bỉ Dragon Ball Z 036 Nâu Đậm', 197000, 157600, 
 N'Nâu đậm', N'Nón 5 Panel lạ mắt, kaki bền bỉ đứng form.', 
 '/Content/images/Images/images/Imagess/0024441thumb1.webp', 8),

(N'Nón 5 Panel Cap Kaki Bền Bỉ Dragon Ball Z 037 Đỏ Đậm', 197000, 157600, 
 N'Đỏ đậm', N'Nón 5 Panel lạ mắt, kaki bền bỉ đứng form.', 
 '/Content/images/Images/images/Imagess/0024440thumb1.webp', 8),

(N'Túi Tote Canvas Bền Bỉ Dragon Ball Z 031 Xanh Lá Đậm', 397000, 317600, 
 N'Xanh lá đậm', N'Phong cách: Thời trang đường phố (streetwear), Phong cách grunge.', 
 '/Content/images/Images/images/Imagess/0024439thumb1.webp', 8);

-- Thêm danh mục mới
INSERT INTO DanhMuc (TenDM, MoTa)
VALUES (N'Bộ Sưu Tập One Piece', N'Bộ sưu tập có bản quyền chính hãng');

-- Thêm 4 sản phẩm mới
INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM)
VALUES
(N'Balo Essential Trượt Nước ONE PIECE WANO 037 Đen', 557000, 445600, 
 N'Đen', N'Balo ONE PIECE-WANO Simili trượt nước, có ngăn đựng laptop, quai đeo chịu lực.', 
 '/Content/images/Images/images/Imagess/0024284thumb1.jpg', 9),

(N'Túi Messenger Trượt Nước Form Cứng ONE PIECE WANO 030 Đen', 457000, 365600, 
 N'Đen', N'Túi Messenger ONE PIECE-WANO, chất liệu Simily chống thấm nước, kích thước nhỏ gọn, khóa gài nam châm.', 
 '/Content/images/Images/images/Imagess/0024282thumb1.webp', 9),

(N'Áo Sơ CuBan Nhẹ Thoáng Mát ONE PIECE WANO 018 Đen', 327000, 261600, 
 N'Đen', N'Phong cách: Phóng khoáng, trẻ trung, đậm chất streetwear', 
 '/Content/images/Images/images/Imagess/0024269thumb1.webp', 9),

(N'Quần Short Nam Kaki 9 Inch ONE PIECE WANO 026 Xám', 397000, 317600, 
 N'Xám', N'Phong cách: Streetwear Phóng khoáng, tự do, thể hiện cái tôi độc đáo', 
 '/Content/images/Images/images/Imagess/0024276thumb1.webp', 9);

-- ==============================
-- Trang chủ
-- ==============================

-- ==============================
--  Dữ Liệu MENU GU
-- ==============================

INSERT INTO Gu (TenGu, MoTa, HinhAnh) VALUES
(N'Gu Đơn Giản', N'Phong cách tối giản, dễ mặc', NULL),
(N'Gu Thiết Kế', N'Phong cách độc đáo, sáng tạo', NULL),
(N'Gu Thể Thao', N'Phong cách năng động, thoải mái', NULL);

-- ==============================
--  Dữ Liệu Trạm MENU GU
-- ==============================

--- Gu Đơn Giản
INSERT INTO Tram (GuID, TenTram, MoTa) VALUES
(1, N'Trạm Thiết Yếu', NULL),
(1, N'Trạm Jean', NULL),
(1, N'Trạm Công Nghệ', NULL);


--- Gu Thiết Kế
INSERT INTO Tram (GuID, TenTram, MoTa) VALUES
(2, N'Trạm Dịch Chuyển', NULL),
(2, N'Trạm Tận Hưởng', NULL),
(2, N'Trạm Collab', NULL);

--- Gu Thể Thao
INSERT INTO Tram (GuID, TenTram, MoTa) VALUES
(3, N'The Beginner', NULL),
(3, N'The Trainee', NULL);


-- =====================================
--  Dữ Liệu Nhóm Sản Phẩm - Gu Đơn Giản
-- =====================================

--- Nhóm của Trạm Thiết Yếu (TramID = 1)
INSERT INTO NhomSanPham (TramID, TenNhom, MoTa) VALUES
(1, N'Non Branded', N'Bền, đơn giản'),
(1, N'Seventy Seven', N'Không lỗi mốt'),
(1, N'The Worker', N'Nhiều túi');

--- Nhóm của Trạm Jean (TramID = 2)
INSERT INTO NhomSanPham (TramID, TenNhom, MoTa) VALUES
(2, N'The Original Jean', N'Giá tốt'),
(2, N'Tek Black Jean', N'Đen bền'),
(2, N'Multi-Color Jean', N'Nhiều màu');

--- Nhóm của Trạm Công Nghệ (TramID = 3) 
INSERT INTO NhomSanPham (TramID, TenNhom, MoTa) VALUES
(3, N'The Minimalist', N'Tối giản'),
(3, N'The CEO', N'Sang trọng');


------------------------------------------------------------
-- GU → Gu Đơn Giản → Trạm Thiết Yếu
-- MaDM = 1
------------------------------------------------------------

------------------------------
-- 1. Non-Branded (NhomID = 1)
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Áo Thun Pique Thoáng Mát Seventy Seven 013 Đen',157000,149150,N'Đen',N'Chất liệu thoáng mát',N'/Content/images/Imagess/_MENU/Gu/ao-thun-seventy-seven-13-den-1174883530.webp',1,1),
(N'Áo Thun Pique Thoáng Mát Seventy Seven 013 Trắng',157000,149150,N'Trắng',N'Thoáng mát mềm mại',N'/Content/images/Imagess/_MENU/Gu/ao-thun-seventy-seven-13-tr-ng-1174883539.webp',1,1),
(N'Áo Thun Pique Thoáng Mát Seventy Seven 013 Xám',157000,149150,N'Xám',N'Thiết kế thoải mái',N'/Content/images/Imagess/_MENU/Gu/ao-thun-seventy-seven-13-xam-1174883483.webp',1,1),
(N'Áo Thun Pique Thoáng Mát Seventy Seven 013 Nâu',157000,149150,N'Nâu',N'Mềm mịn thoáng khí',N'/Content/images/Imagess/_MENU/Gu/ao-thun-seventy-seven-13-be-1174883511.webp',1,1),

(N'Áo Thun Waffle Thoáng Mát Non Branded 001 Đen',127000,120650,N'Đen',N'Thoáng khí',N'/Content/images/Imagess/_MENU/Gu/ao-thun-non-branded-01-den-1174882387.webp',1,1),
(N'Áo Thun Waffle Thoáng Mát Non Branded 001 Trắng',127000,120650,N'Trắng',N'Thiết kế đơn giản',N'/Content/images/Imagess/_MENU/Gu/ao-thun-non-branded-01-tr-ng-1174882372.webp',1,1),
(N'Áo Thun Waffle Thoáng Mát Non Branded 001 Xám',127000,120650,N'Xám',N'Vải Waffle thoáng mát',N'/Content/images/Imagess/_MENU/Gu/ao-thun-non-branded-01-xam-tr-ng-1174882211.webp',1,1),
(N'Áo Thun Waffle Thoáng Mát Non Branded 001 Nâu',127000,120650,N'Nâu',N'Thoáng nhẹ',N'/Content/images/Imagess/_MENU/Gu/ao-thun-non-branded-01-kem-1174882413.webp',1,1);

------------------------------
-- 2. Seventy Seven (NhomID = 2)
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Áo Thun Cotton Line Art Co Giãn Seventy Seven 04 Hồng',157000,149150,N'Hồng',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/ao-thun-seventy-seven-04-h-ng-1174883171.webp',1,2),
(N'Áo Thun Cotton Line Art Co Giãn Seventy Seven 04 Trắng',157000,149150,N'Trắng',N'Chất liệu cotton mềm',N'/Content/images/Imagess/_MENU/Gu/ao-thun-seventy-seven-04-tr-ng-1174883207.webp',1,2),
(N'Áo Thun Cotton Line Art Co Giãn Seventy Seven 04 Đen',157000,149150,N'Đen',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/ao-thun-seventy-seven-04-den-1174883133.webp',1,2),
(N'Áo Thun Cotton Line Art Co Giãn Seventy Seven 04 Nâu',157000,149150,N'Nâu',N'Mặc thoải mái',N'/Content/images/Imagess/_MENU/Gu/ao-thun-seventy-seven-04-nau-d-m-1174883091.webp',1,2),

(N'Áo Khoác Gile Nam Vải Waffle Thoáng Khí Seventy Seven 006 Đen',227000,192950,N'Đen',N'Waffle thoáng khí',N'/Content/images/Imagess/_MENU/Gu/0023198_thumb_1.webp',1,2),
(N'Áo Khoác Gile Nam Vải Waffle Thoáng Khí Seventy Seven 006 Xám',227000,192950,N'Xám',N'Nhẹ và thoáng',N'/Content/images/Imagess/_MENU/Gu/0023199_thumb_1.webp',1,2),
(N'Áo Khoác Gile Nam Vải Waffle Thoáng Khí Seventy Seven 006 Trắng',227000,192950,N'Trắng',N'Sang trọng',N'/Content/images/Imagess/_MENU/Gu/0023197thumb1.webp',1,2),
(N'Áo Khoác Gile Nam Vải Waffle Thoáng Khí Seventy Seven 006 Nâu',227000,192950,N'Nâu',N'Phong cách trẻ trung',N'/images/Imagess/_MENU/Gu/images/Imagess/0023200_thumb_1.webp',1,2),

(N'Áo Khoác Gió Trượt Nước Seventy Seven 005 Đen',327000,294300,N'Đen',N'Chống nước nhẹ',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-seventy-seven-05-den-1174884607.webp',1,2),
(N'Áo Khoác Gió Trượt Nước Seventy Seven 005 Trắng',327000,294300,N'Trắng',N'Chống gió tốt',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-seventy-seven-05-tr-ng-1174884652.webp',1,2),
(N'Áo Khoác Gió Trượt Nước Seventy Seven 005 Xám',327000,294300,N'Xám',N'Nhẹ và thoáng',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-seventy-seven-05-xam-tr-ng-1174884624.webp',1,2),
(N'Áo Khoác Gió Trượt Nước Seventy Seven 005 Be',327000,294300,N'Be',N'Thiết kế basic',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-seventy-seven-05-be-1174884632.webp',1,2);

------------------------------
-- 3. The Worker (NhomID = 3)
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Quần Short Nam Thun Waffle 7 Inch Thoáng Khí Seventy Seven 030 Trắng',227000,192950,N'Trắng',N'Thoáng khí',N'/Content/images/Imagess/_MENU/Gu/0023287_thumb_1.webp',1,3),
(N'Quần Short Nam Thun Waffle 7 Inch Thoáng Khí Seventy Seven 030 Đen',227000,192950,N'Đen',N'Đơn giản',N'/Content/images/Imagess/_MENU/Gu/0023283thumb1.webp',1,3),
(N'Quần Short Nam Thun Waffle 7 Inch Thoáng Khí Seventy Seven 030 Xám',227000,192950,N'Xám',N'Mềm nhẹ',N'/Content/images/Imagess/_MENU/Gu/0023286_thumb_1.webp',1,3),
(N'Quần Short Nam Thun Waffle 7 Inch Thoáng Khí Seventy Seven 030 Nâu',227000,192950,N'Nâu',N'Thoáng mát',N'/Content/images/Imagess/_MENU/Gu/0023284_thumb_1.webp',1,3),

(N'Quần Tây Casual Co Giãn Ít Nhăn Non Branded 030 Đen',397000,357300,N'Đen',N'Co giãn ít nhăn',N'/Content/images/Imagess/_MENU/Gu/qu-n-tay-non-branded-30-den-1174881265.webp',1,3),
(N'Quần Tây Casual Co Giãn Ít Nhăn Non Branded 030 Be',397000,357300,N'Be',N'Lịch sự',N'/Content/images/Imagess/_MENU/Gu/qu-n-tay-non-branded-30-kem-1174881571.webp',1,3),
(N'Quần Tây Casual Co Giãn Ít Nhăn Non Branded 030 Xám',397000,357300,N'Xám',N'Dễ phối đồ',N'/Content/images/Imagess/_MENU/Gu/qu-n-tay-non-branded-30-xam-1174881562.webp',1,3),
(N'Quần Tây Casual Co Giãn Ít Nhăn Non Branded 030 Nâu',397000,357300,N'Nâu',N'Mặc thoải mái',N'/Content/images/Imagess/_MENU/Gu/qu-n-tay-non-branded-30-be-1174881555.webp',1,3),

(N'Áo Sơ Mi Cổ Trụ Linen Thoáng mát Seventy Seven 024 Đen',257000,231300,N'Đen',N'Linen thoáng mát',N'/Content/images/Imagess/_MENU/Gu/ao-s-mi-seventy-seven-24-den-1174883121.webp',1,3),
(N'Áo Sơ Mi Cổ Trụ Linen Thoáng mát Seventy Seven 024 Trắng',257000,231300,N'Trắng',N'Phong cách nhã nhặn',N'/Content/images/Imagess/_MENU/Gu/ao-s-mi-seventy-seven-24-tr-ng-1174883160.webp',1,3),
(N'Áo Sơ Mi Cổ Trụ Linen Thoáng mát Seventy Seven 024 Xám',257000,231300,N'Xám',N'Dễ chịu',N'/Content/images/Imagess/_MENU/Gu/ao-s-mi-seventy-seven-24-xam-1174881235.webp',1,3),
(N'Áo Sơ Mi Cổ Trụ Linen Thoáng mát Seventy Seven 024 Nâu',257000,231300,N'Nâu',N'Thoáng khí',N'/Content/images/Imagess/_MENU/Gu/ao-s-mi-seventy-seven-24-be-1174883242.webp',1,3);


------------------------------------------------------------
-- GU → Gu Đơn Giản → Trạm Jean
-- MaDM = 2
------------------------------------------------------------

------------------------------
-- 1. The Origina (NhomID = 4)
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Quần Jeans Slimfit Co Giãn The Original 028 Đen',327000,294300,N'Đen',N'Chất liệu thoáng mát',N'/Content/images/Imagess/_MENU/Gu/qu-n-jean-the-original-28-den-1174882647 (1).webp',2,4),
(N'Quần Jeans Slimfit Co Giãn The Original 028 Xanh Dương Tối',327000,294300,N'Xanh Dương Tối',N'Thoáng mát mềm mại',N'/Content/images/Imagess/_MENU/Gu/qu-n-jean-the-original-28-xanh-d-m-1-1174882642.webp',2,4),
(N'Quần Jeans Slimfit Co Giãn The Original 028 Xanh Dương',327000,294300,N'Xanh Dương',N'Thiết kế thoải mái',N'/Content/images/Imagess/_MENU/Gu/qu-n-jean-the-original-28-xanh-d-ng-1174882630.webp',2,4),
(N'Quần Jeans Slimfit Co Giãn The Original 028 Xám',157000,149150,N'Xám',N'Mềm mịn thoáng khí',N'/Content/images/Imagess/_MENU/Gu/qu-n-jean-the-original-28-xam-1174882665.webp',2,4),

(N'Áo Khoác Jean Phối Nón The Original 039 Xanh Dương Đậm',447000,402300,N'Xanh Dương Đậm',N'Thiết kế thoải mái',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-jean-the-original-m039-xanh-d-m-1184461428.webp',2,4),
(N'Áo Khoác Jean Phối Nón The Original 039 Xanh Dương Nhạt',447000,402300,N'Xanh Dương Nhạt',N'Thiết kế đơn giản',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-jean-the-original-m039-xanh-nh-t-1184461411.webp',2,4),
(N'Áo Khoác Jean Phối Nón The Original 039 Xanh Dương',447000,402300,N'Xanh Dương',N'Vải Waffle thoáng mát',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-jean-the-original-m039-xanh-d-ng-1184461421.webp',2,4);


------------------------------
-- 2. Tek Black (NhomID = 5)
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Quần Jeans Jogger Mềm Mại Co Giãn Tek Black Jean 005 Đen',447000,453150,N'Đen',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/qu-n-jeans-jogger-tek-black-jean-020-1184461437.webp',2,5),
(N'Quần Jeans Slim Fit Tek Black Jean 004 Đen',447000,453150,N'Đen',N'Chất liệu cotton mềm',N'/Content/images/Imagess/_MENU/Gu/qu-n-jeans-slim-fit-the-original-m009-den-1176074117.webp',2,5),
(N'Quần Short Jeans Mềm Mại Co Giãn Tek Black Jean 006 Đen',337000,358150,N'Đen',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/qu-n-short-the-original-m021-den-1176074122.webp',2,5);

------------------------------
-- 3. Multi-Color (NhomID = 6)
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Áo Khoác Jean Cotton Bền Đứng Phom Multi Color Jean 011 Xám Đậm',597000,567159,N'Xám Đậm',N'Thoáng khí',N'/Content/images/Imagess/_MENU/Gu/0024564_thumb_1.webp',2,6),
(N'Áo Khoác Jean Cotton Bền Đứng Phom Multi Color Jean 011 Xanh Lá Đậm',597000,567159,N'Xanh Lá Đậm',N'Đơn giản',N'/Content/images/Imagess/_MENU/Gu/0024562thumb1.webp',2,6),
(N'Áo Khoác Jean Cotton Bền Đứng Phom Multi Color Jean 011 Nâu Đậm',597000,567159,N'Nâu Đậm',N'Mềm nhẹ',N'/Content/images/Imagess/_MENU/Gu/0024563_thumb_1.webp',2,6),
(N'Áo Khoác Jean Cotton Bền Đứng Phom Multi Color Jean 011 Be',597000,567159,N'Nâu',N'Thoáng mát',N'/Content/images/Imagess/_MENU/Gu/0024565_thumb_1.webp',2,6),

(N'Quần Jean Short Loose Fit Nhiều Túi Multi Color Jean 013 Đen',397000,357300,N'Đen',N'Co giãn ít nhăn',N'/Content/images/Imagess/_MENU/Gu/qu-n-jean-short-loose-fit-nhi-u-tui-multi-color-jean-013-den-1194484000.webp',2,6),
(N'Quần Jean Short Loose Fit Nhiều Túi Multi Color Jean 013 Xám',397000,357300,N'Xám',N'Lịch sự',N'/Content/images/Imagess/_MENU/Gu/qu-n-jean-short-loose-fit-nhi-u-tui-multi-color-jean-013-xam-1194484043.jpg',2,6),
(N'Quần Jean Short Loose Fit Nhiều Túi Multi Color Jean 013 Nâu Đậm',397000,357300,N'Nâu Đậm',N'Dễ phối đồ',N'/Content/images/Imagess/_MENU/Gu/qu-n-jean-short-loose-fit-nhi-u-tui-multi-color-jean-013-nau-d-m-1194484022.webp',2,6),
(N'Quần Jean Short Loose Fit Nhiều Túi Multi Color Jean 013 Xanh Lá Đậm',397000,357300,N'Xanh Lá Đậm',N'Mặc thoải mái',N'/Content/images/Imagess/_MENU/Gu/qu-n-jean-short-loose-fit-nhi-u-tui-multi-color-jean-013-xanh-reu-1194483990.webp',2,6),

(N'Quần Jeans Loose Fit Bền Bỉ Multi Color Jean 012 Đen',557000,445600,N'Đen',N'Linen thoáng mát',N'/Content/images/Imagess/_MENU/Gu/0024645_thumb_1.webp',2,6),
(N'Quần Jeans Loose Fit Bền Bỉ Multi Color Jean 012 Xám',557000,445600,N'Xám',N'Phong cách nhã nhặn',N'/Content/images/Imagess/_MENU/Gu/qu-n-jeans-loose-fit-b-n-b-multi-color-jean-011-xam-1194483958.webp',2,6),
(N'Quần Jeans Loose Fit Bền Bỉ Multi Color Jean 012 Nâu Đậm',557000,445600,N'Nâu Đậm',N'Dễ chịu',N'/Content/images/Imagess/_MENU/Gu/0024644_thumb_1.webp',2,6),
(N'Quần Jeans Loose Fit Bền Bỉ Multi Color Jean 012 Xanh Lá Đậm',557000,445600,N'Xanh Lá Đậm',N'Thoáng khí',N'/Content/images/Imagess/_MENU/Gu/0024646_thumb_1.webp',2,6);


------------------------------------------------------------
-- GU → Gu Đơn Giản → Trạm Công Nghệ
-- MaDM = 3
------------------------------------------------------------

------------------------------
-- 1. Bộ sưu tập The Minimalist (NhomID = 7)
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Áo Thun Supima Cotton Thượng Hạng The Minimalist 014 Đen',327000,310650,N'Đen',N'Chất liệu thoáng mát',N'/Content/images/Imagess/_MENU/Gu/0024689_thumb_1.webp',3,7),
(N'Áo Thun Supima Cotton Thượng Hạng The Minimalist 014 Trắng',327000,310650,N'Trắng',N'Thoáng mát mềm mại',N'/Content/images/Imagess/_MENU/Gu/0024688_thumb_1.webp',3,7),
(N'Áo Thun Supima Cotton Thượng Hạng The Minimalist 014 Xám Nhạt',327000,310650,N'Xám',N'Thiết kế thoải mái',N'/Content/images/Imagess/_MENU/Gu/0024691_Thumb_1.webp',3,7),
(N'Áo Thun Supima Cotton Thượng Hạng The Minimalist 014 Be',327000,310650,N'Be',N'Mềm mịn thoáng khí',N'/Content/images/Imagess/_MENU/Gu/0024690_thumb_1.webp',3,7),

(N'Áo Khoác Hoodie Mịn Mát Ít Nhăn The Minimalist 025 Đen',457000,434150,N'Đen',N'Thiết kế thoải mái',N'/Content/images/Imagess/_MENU/Gu/0024670_thumb_1.webp',3,7),
(N'Áo Khoác Hoodie Mịn Mát Ít Nhăn The Minimalist 025 Xám Nhạt',457000,434150,N'Xám',N'Thiết kế đơn giản',N'/Content/images/Imagess/_MENU/Gu/0024668thumb1.webp',3,7),
(N'Áo Khoác Hoodie Mịn Mát Ít Nhăn The Minimalist 025 Xanh Lá Đậm',457000,434150,N'Xanh Lá Đậm',N'Vải Waffle thoáng mát',N'/Content/images/Imagess/_MENU/Gu/0024669_thumb_1.webp',3,7);


------------------------------
-- Bộ sưu tập The CEO (NhomID = 8)
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Áo Sơ Mi Tay Ngắn Vải Ngải Cứu Kháng Khuẩn The CEO 024 Đen',347000,329650,N'Đen',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0024801_thumb_1.webp',3,8),
(N'Áo Sơ Mi Tay Ngắn Vải Ngải Cứu Kháng Khuẩn The CEO 024 Trắng',347000,329650,N'Trắng',N'Chất liệu cotton mềm',N'/Content/images/Imagess/_MENU/Gu/0024800thumb1.webp',3,8),
(N'Áo Sơ Mi Tay Ngắn Vải Ngải Cứu Kháng Khuẩn The CEO 024 Xám',347000,329650,N'Xám',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/0024802_thumb_1.webp',3,8),
(N'Áo Sơ Mi Tay Ngắn Vải Ngải Cứu Kháng Khuẩn The CEO 024 Be',347000,329650,N'Be',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/0024803_thumb_1.webp',3,8),

(N'Quần Tây Smart Casual Mềm Ít Nhăn Lưng Tùy Chỉnh The CEO 017 Đen',497000,472150,N'Đen',N'Thiết kế thoải mái',N'/Content/images/Imagess/_MENU/Gu/The_CEO_017_Den_0024699_Thumb_1.webp',3,8),
(N'Quần Tây Smart Casual Co Giãn Lưng Tùy Chỉnh The CEO 012 Đen',497000,472150,N'Đen',N'Thiết kế đơn giản',N'/Content/images/Imagess/_MENU/Gu/TheCEO012Den0024748Thumb1.webp',3,8),
(N'Quần Tây Smart Casual Mềm Ít Nhăn Lưng Tùy Chỉnh The CEO 015 Đen',497000,472150,N'Xanh Lá Đậm',N'Vải Waffle thoáng mát',N'/Content/images/Imagess/_MENU/Gu/0024749_thumb_1.webp',3,8);



-- =====================================
--  Dữ Liệu Nhóm Sản Phẩm - Gu Thiết Kế
-- =====================================

--- Nhóm của Trạm Dịch Chuyển (TramID = 1)
INSERT INTO NhomSanPham (TramID, TenNhom, MoTa) VALUES
(1, N'Đơn Giản', N'Bền, đơn giản'),
(1, N'Cá Tính', N'Trẻ Chung, Năng Động');

--- Nhóm của Trạm Tận Hưởng (TramID = 2)
INSERT INTO NhomSanPham (TramID, TenNhom, MoTa) VALUES
(2, N'No Style', N'"sân chơi" thời trang dành cho những ai yêu thích streetwear'),
(2, N'The Weekend', N'sản phẩm sinh ra để thư giãn');

--- Nhóm của Trạm Collab (TramID = 3) 
INSERT INTO NhomSanPham (TramID, TenNhom, MoTa) VALUES
(3, N'Bộ sưu tập Dragon Ball Z', N'Ngầu'),
(3, N'Bộ sưu tập One Piece', N'Ngầu');

------------------------------------------------------------
-- GU → Gu Thiết kế  → Trạm Dịch chuyển
-- MaDM = 4
------------------------------------------------------------

------------------------------
-- 1. Áo khoác đơn giản  (NhomID = 9)
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Áo Khoác Gile Nam Vải Waffle Thoáng Khí Seventy Seven 006 Nâu Nhạt',227000,192950,N'Nâu',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0023200_thumb_1.webp',4,9),
(N'Áo Khoác Gile Nam Vải Waffle Thoáng Khí Seventy Seven 006 Trắng',227000,192950,N'Trắng',N'Chất liệu cotton mềm',N'/Content/images/Imagess/_MENU/Gu/0023197thumb1.webp',4,9),
(N'Áo Khoác Gile Nam Vải Waffle Thoáng Khí Seventy Seven 006 Xám',227000,192950,N'Xám',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/0023199_thumb_1.webp',4,9),
(N'Áo Khoác Gile Nam Vải Waffle Thoáng Khí Seventy Seven 006 Đen',227000,192950,N'Đen',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/0023198_thumb_1.webp',4,9),

(N'Áo Khoác Gió Trượt Nước Mỏng Nhẹ Nhiều Màu Non Branded 004 Be',327000,310000,N'Be',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-non-branded-04-be-1174884678.webp',4,9),
(N'Áo Khoác Gió Trượt Nước Mỏng Nhẹ Nhiều Màu Non Branded 004 Xám Nhạt',327000,310000,N'Xám Nhạt',N'Chất liệu cotton mềm',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-non-branded-04-xam-nh-t-1174881217.webp',4,9),
(N'Áo Khoác Gió Trượt Nước Mỏng Nhẹ Nhiều Màu Non Branded 004 Trắng',327000,310000,N'Trắng',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-gio-dang-v-a-non-branded-04-tr-ng-1194490216.webp',4,9),
(N'Áo Khoác Gió Trượt Nước Mỏng Nhẹ Nhiều Màu Non Branded 004 Xanh Lá Đậm',327000,310000,N'Xanh Lá Đậm',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-non-branded-04-xanh-reu-1174884672',4,9);

------------------------------
-- 2. Áo khoác cá tính  (NhomID = 10)
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Áo Khoác Gió Sporty Phối Màu Siêu Nhẹ The No Style 058 Xanh Dương Đen',557000,529150,N'Xanh Dương Đen',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-no-style-m58-xanh-den-1174884785.webp',4,10),
(N'Áo Khoác Gió Sporty Phối Màu Siêu Nhẹ The No Style 058 Nâu Đỏ',557000,529150,N'Nâu Đỏ',N'Chất liệu cotton mềm',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-no-style-m58-nau-d-1174884778.webp',4,10),
(N'Áo Khoác Gió Sporty Phối Màu Siêu Nhẹ The No Style 058 Xanh Lá Đậm',557000,529150,N'Xanh Lá Đậm',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-no-style-m58-xanh-reu-1174884768.webp',4,10),
(N'Áo Khoác Gió Co Giãn 2 Lớp The No Style 053 Be Nâu',557000,529150,N'Be Nâu',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-no-style-m53-be-1174884746.webp',4,10),

(N'Áo Khoác Bomber Corduroy Giữ Ấm The No Style 182 Xanh Lá Đậm',557000,445600,N'Xanh Lá Đậm',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-no-style-m44-xanh-reu-1174885212.webp',4,10),
(N'Áo Khoác Bomber Corduroy Giữ Ấm The No Style 182 Xanh Dương Be',557000,445600,N'Xanh Dương Be',N'Chất liệu cotton mềm',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-no-style-m44-xanh-d-ng-1174885229.webp',4,10),
(N'Áo Khoác Bomber Corduroy Mềm Mịn The No Style 042 Đen Be',597000,567150,N'Đen Be',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-no-style-m42-den-1174885239.webp',4,10),
(N'Áo Khoác Bomber Corduroy Mềm Mịn The No Style 042 Xanh Dương Be',597000,567150,N'Xanh Dương Be',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/ao-khoac-no-style-m42-xanh-den-1174885244.webp',4,10);

------------------------------------------------------------
-- GU → Gu Thiết kế  → Trạm Tận Hưởng
-- MaDM = 5
------------------------------------------------------------

------------------------------
-- 1. The No Style(Cá Tính Riêng)	  (NhomID = 11)
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Áo Polo Raglan Mát Mềm Mại The No Style 240 Nâu Be',350000,297000,N'Nâu Be',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/TheNoStyle240NauBe0024835Thumb1.webp',5,11),
(N'Áo Polo Raglan Mát Mềm Mại The No Style 240 Trắng Đen',350000,297000,N'Trắng Đen',N'Chất liệu cotton mềm',N'/Content/images/Imagess/_MENU/Gu/TheNoStyle240Tr_ngDen0024836Thumb1.webp',5,11),
(N'Áo Polo Raglan Mát Mềm Mại The No Style 240 Xanh Dương Xám',350000,297000,N'Xanh Dương Xám',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/TheNoStyle240XanhD_ngXam0024831Thumb1.webp',5,11),
(N'Áo Polo Raglan Mát Mềm Mại The No Style 240 Xanh Lá Trắng',350000,297000,N'Xanh Lá Trắng',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/TheNoStyle240XanhLaTr_ng0024830Thumb1',5,11),

(N'Áo Sơ Mi Khoác OXFORD Thoáng Khí Ít Nhăn The No Style 223 Trắng',297000,282150,N'Trắng',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0024627_thumb_1.webp',5,11),
(N'Áo Sơ Mi Khoác OXFORD Thoáng Khí Ít Nhăn The No Style 223 Xanh Dương',297000,282150,N'Xanh Dương',N'Chất liệu cotton mềm',N'/Content/images/Imagess/_MENU/Gu/0024626_thumb_1.webp',5,11),
(N'Áo Sơ Mi Khoác OXFORD Thoáng Khí Ít Nhăn The No Style 223 Xanh Dương Nhạt',297000,282150,N'Dương Nhạt',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/0024625_thumb_1.webp',5,11),
(N'Áo Sơ Mi Khoác OXFORD Thoáng Khí Ít Nhăn The No Style 223 Xám',297000,282150,N'Xám',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/0024629_thumb_1.webp',5,11);

------------------------------
-- 2. The Weekend(Thích chill)	  (NhomID = 12)
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Áo Sơ Mi Tay Ngắn Nhẹ Bền The Weekend 031 Nâu',257000,244150,N'Nâu',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0024584_thumb_1.webp',5,12),
(N'Áo Sơ Mi Tay Ngắn Nhẹ Bền The Weekend 031 Trắng',257000,244150,N'Trắng',N'Chất liệu cotton mềm',N'/Content/images/Imagess/_MENU/Gu/0024582thumb1.webp',5,12),
(N'Áo Sơ Mi Tay Ngắn Nhẹ Bền The Weekend 031 Xám Nhạt',257000,244150,N'Xám Nhạt',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/0024583_thumb_1.webp',5,12),
(N'Áo Sơ Mi Tay Ngắn Thoáng Khí Ít Nhăn The Weekend 029 Xanh Dương',257000,244150,N'Xanh Dương',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/0024631_thumb_1.webp',5,12),

(N'Áo Thun Polo Mesh Jacquard Thoáng Khí The Weekend 032 Be',277000,263150,N'Be',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/ao-thun-c-polo-tay-ng-n-the-weekend-032-kem-1187130574.webp',5,12),
(N'Áo Thun Polo Mesh Jacquard Thoáng Khí The Weekend 032 Trắng',277000,263150,N'Trắng',N'Chất liệu cotton mềm',N'/Content/images/Imagess/_MENU/Gu/ao-thun-c-polo-tay-ng-n-the-weekend-032-tr-ng-1187130580.webp',5,12),
(N'Áo Thun Polo Mesh Jacquard Thoáng Khí The Weekend 032 Xám',277000,263150,N'Xám',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/ao-thun-c-polo-tay-ng-n-the-weekend-032-xam-1187130586.webp',5,12),
(N'Áo Thun Polo Mesh Jacquard Thoáng Khí The Weekend 032 Xám Đậm',277000,263150,N'Xanh Đậm',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/ao-thun-c-polo-tay-ng-n-the-weekend-032-xam-d-m-1187130572.webp',5,12);


------------------------------------------------------------
-- GU → Gu Thiết kế  → Trạm Collab(Bản quyền)
-- MaDM = 6
------------------------------------------------------------

------------------------------
-- 1. One Piece	  (NhomID = 13)
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Áo Polo Vải Mesh Thoáng Khí ONE PIECE WANO 006 Xám',327000,261000,N'Xám',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0024264Thumb1.webp',6,13),
(N'Áo Polo Cotton Thoáng Khí ONE PIECE WANO 003 Be',327000,261000,N'Be',N'Chất liệu cotton mềm',N'/Content/images/Imagess/_MENU/Gu/0024263Thumb1.webp',6,13),
(N'Áo Thun Tay Ngắn Cotton ONE PIECE WANO 015 Đen',327000,261000,N'Đen',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/0024259Thumb1.webp',6,13),
(N'Áo Thun Tay Ngắn Cotton ONE PIECE WANO 013 Xám',327000,261000,N'Xám',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/0024258Thumb1.webp',6,13),

(N'Áo Thun Tay Ngắn Cotton ONE PIECE WANO 014 Đen',327000,261000,N'Đen',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0024254_Thumb_1.webp',6,13),
(N'Áo Thun One Piece Gear 5 004 Trắng',327000,261000,N'Trắng',N'Chất liệu cotton mềm',N'/Content/images/Imagess/_MENU/Gu/0024559thumb1.webp',6,13),
(N'Áo Thun One Piece Gear 5 003 Xám Đậm',327000,261000,N'Xám đậm',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/0024558thumb1.webp',6,13),
(N'Áo Thun One Piece Gear 5 001 Be',327000,261000,N'Be',N'Phong cách tối giản',N'/Content/images/Imagess/_MENU/Gu/0024556thumb1',6,13);


------------------------------
-- 2. Dragon Ball Z	  (NhomID = 14)
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Áo Khoác Kaki Dragon Ball Z 028 Nâu Đậm',577000,461000,N'Nâu Đậm',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0024424_thumb_1.webp',6,14),
(N'Áo Khoác Kaki Dragon Ball Z 027 Be',577000,461000,N'Be',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0024423_thumb_1.webp',6,14),
(N'Áo Sơ Mi Tay Ngắn Dragon Ball Z 024 Nâu Đậm',577000,461000,N'Nâu Đậm',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0024422_thumb_1.webp',6,14),
(N'Áo Sơ Mi Tay Ngắn Dragon Ball Z 023 Xám Nhạt',577000,461000,N'Xám Nhạt',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0024421_thumb_1',6,14),


(N'Áo Thun Tay Ngắn Cotton Dragon Ball Z 006 Xanh Dương',327000,261000,N'Xanh Dương',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0024415_thumb_1.webp',6,14),
(N'Áo Thun Tay Ngắn Cotton Dragon Ball Z 015 Nâu Đậm',327000,261000,N'Nâu Đậm',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0024406_Thumb_1.webp',6,14),
(N'Áo Thun Tay Ngắn Cotton Dragon Ball Z 014 Xám Nhạt',327000,261000,N'Xám Nhạt',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0024405_Thumb_1.webp',6,14),
(N'Áo Thun Tay Ngắn Cotton Dragon Ball Z 017 Đỏ Đậm',327000,261000,N'Đỏ Đậm',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0024404_Thumb_1.webp',6,14);


-- =====================================
--  Dữ Liệu Nhóm Sản Phẩm - Gu Thể Thao
-- =====================================

------------------------------------------------------------
-- GU → Gu Thể Thao
-- MaDM = 7   
-- MaDM = 8
------------------------------------------------------------

------------------------------
-- 1. The Beginner
------------------------------
INSERT INTO NhomSanPham (TramID, TenNhom, MoTa) VALUES
(7, N'The Beginner', N'Dành cho người mới bắt đầu – năng động, cơ bản, dễ phối đồ');

------------------------------
-- 2. The Trainer
------------------------------
INSERT INTO NhomSanPham (TramID, TenNhom, MoTa) VALUES
(7, N'The Trainer', N'Dòng sản phẩm chuyên về thể thao – hiệu suất cao, co giãn tốt');



------------------------------
-- 1. The Beginner 7
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Áo Khoác Thể Thao Mềm Mại Nhanh Khô Beginner 009 Be',257000,218000,N'Be',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0023175_thumb_1.webp',7,7),
(N'Áo Khoác Thể Thao Mềm Mại Nhanh Khô Beginner 009 Xanh Dương Đậm',257000,218000,N'Xanh Dương Đậm',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0023177_thumb_1.webp',7,7),
(N'Áo Khoác Thể Thao Mềm Mại Nhanh Khô Beginner 009 Xám Đậm',257000,218000,N'Xám Đậm',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0023176_thumb_1.webp',7,7),
(N'Áo Khoác Thể Thao Mềm Mại Nhanh Khô Beginner 009 Đen',257000,218000,N'Đen',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0023174thumb1.webp',7,7),

(N'Áo Thun 3 Lỗ Vải Hexagon "Biết Thở" Beginner 003 Xanh Dương Đậm',510000,428000,N'Xanh Dương Đậm',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0023146_thumb_1.webp',7,7),
(N'Áo Thun 3 Lỗ Vải Hexagon "Biết Thở" Beginner 003 Xám Đậm',510000,428000,N'Xám Đậm',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0023145_thumb_1.webp',7,7),
(N'Áo Thun 3 Lỗ Vải Hexagon "Biết Thở" Beginner 003 Be',510000,428000,N'Be',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0023144_thumb_1.webp',7,7),
(N'Áo Thun 3 Lỗ Vải Hexagon "Biết Thở" Beginner 003 Xám Nhạt',510000,428000,N'Xám Nhạt',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/0023143_thumb_1.webp',7,7);


------------------------------
-- 2. The Trainer 8 
------------------------------

INSERT INTO SanPham (TenSP, GiaGoc, Gia, MauSac, MoTa, HinhAnh, MaDM, NhomID) VALUES
(N'Áo Thun 3 Lỗ Thể Thao Ultra Stretch The Trainer 011 Trắng',257000,205000,N'Trắng',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/24092_thumb_1.webp',8,8),
(N'Áo Thun 3 Lỗ Thể Thao Ultra Stretch The Trainer 011 Xanh Dương',257000,205000,N'Xanh Dương',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/24095thumb1.webp',8,8),
(N'Áo Thun 3 Lỗ Thể Thao Ultra Stretch The Trainer 011 Xám Đậm',257000,205000,N'Xám Đậm',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/24094thumb1.webp',8,8),
(N'Áo Thun 3 Lỗ Thể Thao Ultra Stretch The Trainer 011 Đen',257000,205000,N'Đen',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/24093thumb1.webp',8,8),

(N'Áo Thun Thể Thao Ultra Stretch The Trainer 003 Trắng',357000,252000,N'Trắng',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/ao-thun-the-trainer-003-tr-ng-1177437119.webp',8,8),
(N'Áo Thun Thể Thao Ultra Stretch The Trainer 003 Xanh Dương',357000,252000,N'Xanh Dương',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/ao-thun-the-trainer-003-xanh-bich-1177437098.webp',8,8),
(N'Áo Thun Thể Thao Ultra Stretch The Trainer 003 Xám',357000,252000,N'Xám',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/ao-thun-the-trainer-003-xam-1177437097.webp',8,8),
(N'Áo Thun Thể Thao Ultra Stretch The Trainer 003 Đen',357000,252000,N'Đen',N'Co giãn thoải mái',N'/Content/images/Imagess/_MENU/Gu/ao-thun-the-trainer-003-den-1177426182.webp',8,8);










-- ==============================
--  Đăng Nhập - Đăng Ký
-- ==============================
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100),
    Email NVARCHAR(100),
    Username NVARCHAR(50),
    Password NVARCHAR(100)
)

-- ==============================
-- VIEW PHỤ TRỢ (nếu cần dùng)
-- ==============================
CREATE VIEW v_SanPhamDanhMuc AS
SELECT 
    s.MaSP,
    s.TenSP,
    s.Gia,
    s.MauSac,
    s.MoTa AS MoTaSP,
    s.HinhAnh,
    d.TenDM AS DanhMuc,
    d.MoTa AS MoTaDM
FROM SanPham s
JOIN DanhMuc d ON s.MaDM = d.MaDM;


-- ==============================
-- KIỂM TRA DỮ LIỆU
-- ==============================



    CREATE PROCEDURE sp_GetAllSanPham
AS
BEGIN
    SELECT * FROM SanPham;
END;



ALTER DATABASE AURA_DB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO


DROP DATABASE AURA_DB4;
GO

-- Bước 1: Chuyển về master
USE master;
GO

-- Bước 2: Kiểm tra database có tồn tại không
SELECT name, state_desc 
FROM sys.databases 
WHERE name = 'AURA_DB4';
GO



