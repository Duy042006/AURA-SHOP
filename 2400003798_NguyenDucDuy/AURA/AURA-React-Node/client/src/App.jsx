import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderComplete from './pages/OrderComplete';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';
import GuIndex from './pages/GuIndex';
import GuTram from './pages/GuTram';
import GuNhom from './pages/GuNhom';
import GuProducts from './pages/GuProducts';
import CategoryMenu from './pages/CategoryMenu';
import CategoryLevel2 from './pages/CategoryLevel2';
import CategoryProducts from './pages/CategoryProducts';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import ShippingInfo from './pages/ShippingInfo';
import OrderDetail from './pages/OrderDetail';
import AdminProducts from './pages/AdminProducts';
import AdminCreate from './pages/AdminCreate';
import AdminCategories from './pages/AdminCategories';
import AdminOrders from './pages/AdminOrders';
import AdminCustomers from './pages/AdminCustomers';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminRoles from './pages/AdminRoles';
import AdminSystemSettings from './pages/AdminSystemSettings';
import AdminVouchers from './pages/AdminVouchers';
import AdminRevenue from './pages/AdminRevenue';
import AdminStats from './pages/AdminStats';
import Wishlist from './pages/Wishlist';
import Newsletter from './pages/Newsletter';
import Vouchers from './pages/Vouchers';
import AccountSettings from './pages/AccountSettings';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gioi-thieu" element={<About />} />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-ky" element={<Register />} />
        <Route path="/gio-hang" element={<Cart />} />
        <Route path="/thanh-toan" element={<Checkout />} />
        <Route path="/hoan-tat" element={<OrderComplete />} />
        <Route path="/san-pham/:id" element={<ProductDetail />} />
        <Route path="/tim-kiem" element={<Search />} />

        <Route path="/gu" element={<GuIndex />} />
        <Route path="/gu/tram/:id" element={<GuNhom />} />
        <Route path="/gu/nhom/:id" element={<GuProducts />} />
        <Route path="/gu/:id" element={<GuTram />} />

        <Route path="/ao" element={<CategoryMenu loaiSP="Ao" base="/ao" title="ÁO" />} />
        <Route path="/ao/danh-muc/:id" element={<CategoryLevel2 loai="ao" base="/ao" />} />
        <Route path="/ao/san-pham/:id" element={<CategoryProducts loaiSP="Ao" catApi="ao-dm" titlePrefix="Áo" />} />

        <Route path="/quan" element={<CategoryMenu loaiSP="Quan" base="/quan" title="QUẦN" />} />
        <Route path="/quan/danh-muc/:id" element={<CategoryLevel2 loai="quan" base="/quan" />} />
        <Route path="/quan/san-pham/:id" element={<CategoryProducts loaiSP="Quan" catApi="quan-dm" titlePrefix="Quần" />} />

        <Route path="/phu-kien" element={<CategoryMenu loaiSP="PhuKien" base="/phu-kien" title="PHỤ KIỆN" />} />
        <Route path="/phu-kien/danh-muc/:id" element={<CategoryLevel2 loai="phukien" base="/phu-kien" />} />
        <Route path="/phu-kien/san-pham/:id" element={<CategoryProducts loaiSP="PhuKien" catApi="phukien-dm" titlePrefix="Phụ kiện" />} />

        <Route path="/tai-khoan" element={<Profile />} />
        <Route path="/tai-khoan/don-hang" element={<Orders />} />
        <Route path="/tai-khoan/giao-hang" element={<ShippingInfo />} />
        <Route path="/tai-khoan/yeu-thich" element={<Wishlist />} />
        <Route path="/tai-khoan/ma-giam-gia" element={<Vouchers />} />
        <Route path="/tai-khoan/nhan-tin" element={<Newsletter />} />
        <Route path="/tai-khoan/cai-dat" element={<AccountSettings />} />
        <Route path="/tai-khoan/dashboard" element={<AdminDashboard />} />
        <Route path="/tai-khoan/san-pham" element={<AdminProducts />} />
        <Route path="/tai-khoan/san-pham/them" element={<AdminCreate />} />
        <Route path="/tai-khoan/danh-muc" element={<AdminCategories />} />
        <Route path="/tai-khoan/quan-ly-don" element={<AdminOrders />} />
        <Route path="/tai-khoan/khach-hang" element={<AdminCustomers />} />
        <Route path="/tai-khoan/kho-hang" element={<AdminProducts />} />
        <Route path="/tai-khoan/kho-hang/them" element={<Navigate to="/tai-khoan/san-pham/them" replace />} />
        <Route path="/tai-khoan/voucher" element={<AdminVouchers />} />
        <Route path="/tai-khoan/doanh-thu" element={<AdminRevenue />} />
        <Route path="/tai-khoan/thong-ke" element={<AdminStats />} />
        <Route path="/tai-khoan/nguoi-dung" element={<AdminUsers />} />
        <Route path="/tai-khoan/phan-quyen" element={<AdminRoles />} />
        <Route path="/tai-khoan/he-thong" element={<AdminSystemSettings />} />
        <Route path="/don-hang" element={<Navigate to="/tai-khoan/don-hang" replace />} />
        <Route path="/don-hang/:id" element={<OrderDetail />} />

        <Route path="/admin/san-pham" element={<Navigate to="/tai-khoan/san-pham" replace />} />
        <Route path="/admin/san-pham/them" element={<Navigate to="/tai-khoan/san-pham/them" replace />} />
      </Routes>
    </Layout>
  );
}
