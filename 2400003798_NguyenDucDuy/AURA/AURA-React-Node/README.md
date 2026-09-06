# AURA — Website bán thời trang

Website thương mại điện tử thời trang AURA, xây dựng bằng **ReactJS** (frontend) và **NodeJS / Express** (backend API).

## Công nghệ

- **Frontend:** React 18, React Router, Vite
- **Backend:** Node.js, Express, JWT, bcrypt
- **Lưu trữ:** JSON file store (dễ chạy, không cần cài database)

## Cấu trúc thư mục

```
AURA-React-Node/
├── client/          # Giao diện React
├── server/          # API Express
└── README.md
```

## Chức năng chính

- Trang chủ (bộ sưu tập, gallery, banner)
- Menu GU / Áo / Quần / Phụ kiện
- Chi tiết sản phẩm, tìm kiếm, lọc màu/giá
- Giỏ hàng và thanh toán (thành viên giảm 10%)
- Đăng ký / Đăng nhập / Cập nhật hồ sơ
- Quản lý đơn hàng
- Trang quản trị: thêm / xóa sản phẩm

## Cài đặt và chạy

### 1. Cài đặt thư viện

```bash
cd AURA-React-Node
npm install
npm run install:all
```

Hoặc cài riêng từng phần:

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Khởi tạo dữ liệu mẫu

```bash
cd server
npm run seed
```

(Server sẽ tự seed nếu chưa có dữ liệu khi khởi động.)

### 3. Chạy ứng dụng

**Terminal 1 — Backend (port 5000):**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend (port 5173):**

```bash
cd client
npm run dev
```

Truy cập: **http://localhost:5173**

## Tài khoản mẫu

| Username | Password | Vai trò |
|----------|----------|---------|
| `admin`  | `123456` | Admin   |
| `user`   | `123456` | User    |

## Cấu hình

File `server/.env`:

```
PORT=5000
JWT_SECRET=aura_secret_key_change_me
CLIENT_URL=http://localhost:5173
CONTENT_PATH=../../../Content
```

- `CONTENT_PATH`: đường dẫn tới thư mục ảnh tĩnh (logo, sản phẩm).

## API chính

| Method | Path | Mô tả |
|--------|------|--------|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/register` | Đăng ký |
| GET | `/api/products/home` | Dữ liệu trang chủ |
| GET | `/api/products` | Danh sách sản phẩm |
| GET | `/api/products/:id` | Chi tiết sản phẩm |
| GET | `/api/categories/gu` | Danh mục GU |
| POST | `/api/orders` | Đặt hàng |
| GET | `/api/orders` | Danh sách đơn hàng |
| GET/POST/DELETE | `/api/admin/products` | Quản trị sản phẩm |

## Sinh viên thực hiện

- Họ tên: Đào Quang Duy  
- MSSV: 2400003607  
- Lớp: 24DTH1A
