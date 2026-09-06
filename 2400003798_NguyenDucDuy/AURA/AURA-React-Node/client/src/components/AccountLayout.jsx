import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const USER_MENU = [
  { to: '/tai-khoan', label: 'Thông Tin Cá Nhân', icon: 'bx-user', end: true },
  { to: '/tai-khoan/don-hang', label: 'Lịch Sử Đặt Hàng', icon: 'bx-cart' },
  { to: '/tai-khoan/giao-hang', label: 'Thông Tin Giao Hàng', icon: 'bx-map' },
  { to: '/tai-khoan/yeu-thich', label: 'Danh Sách Yêu Thích', icon: 'bx-heart' },
  { to: '/tai-khoan/ma-giam-gia', label: 'Mã Giảm Giá', icon: 'bx-purchase-tag' },
  { to: '/tai-khoan/nhan-tin', label: 'Đăng Ký Nhận Tin', icon: 'bx-envelope' },
  { to: '/tai-khoan/cai-dat', label: 'Cài Đặt Tài Khoản', icon: 'bx-cog' },
];

const ADMIN_SECTIONS = [
  {
    items: [
      { to: '/tai-khoan/dashboard', label: 'Dashboard', icon: 'bx-home-alt', end: true },
    ],
  },
  {
    label: 'QUẢN LÝ',
    items: [
      { to: '/tai-khoan/san-pham', label: 'Sản phẩm', icon: 'bx-box' },
      { to: '/tai-khoan/danh-muc', label: 'Danh mục', icon: 'bx-category' },
      { to: '/tai-khoan/quan-ly-don', label: 'Đơn hàng', icon: 'bx-cart' },
      { to: '/tai-khoan/khach-hang', label: 'Khách hàng', icon: 'bx-user' },
      { to: '/tai-khoan/kho-hang', label: 'Kho hàng', icon: 'bx-package' },
      { to: '/tai-khoan/voucher', label: 'Voucher', icon: 'bx-purchase-tag' },
    ],
  },
  {
    label: 'BÁO CÁO',
    items: [
      { to: '/tai-khoan/doanh-thu', label: 'Doanh thu', icon: 'bx-line-chart' },
      { to: '/tai-khoan/thong-ke', label: 'Thống kê', icon: 'bx-bar-chart-alt-2' },
    ],
  },
  {
    label: 'HỆ THỐNG',
    items: [
      { to: '/tai-khoan/nguoi-dung', label: 'Người dùng', icon: 'bx-group' },
      { to: '/tai-khoan/phan-quyen', label: 'Phân quyền', icon: 'bx-shield' },
      { to: '/tai-khoan/he-thong', label: 'Cài đặt', icon: 'bx-cog' },
    ],
  },
];

function initials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'AD';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AccountLayout({ children, adminOnly = false }) {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) return <div className="loading">Đang tải...</div>;
  if (!user) return <Navigate to="/dang-nhap" replace />;
  if (adminOnly && user.role !== 'Admin') return <Navigate to="/tai-khoan" replace />;

  const isAdmin = user.role === 'Admin';

  const isActive = (item) => {
    if (item.end) return location.pathname === item.to;
    return location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
  };

  const onLogout = () => {
    logout();
    navigate('/');
  };

  /* ===== ADMIN SHELL (dark sidebar + topbar) ===== */
  if (isAdmin) {
    return (
      <div className="admin-shell">
        <aside className="admin-shell-sidebar">
          <div className="admin-shell-brand">
            <span className="admin-shell-logo">AURA</span>
            <span className="admin-shell-badge">ADMIN</span>
          </div>

          <nav className="admin-shell-nav">
            {ADMIN_SECTIONS.map((section, si) => (
              <div key={section.label || `s-${si}`} className="admin-shell-section">
                {section.label && (
                  <p className="admin-shell-section-label">{section.label}</p>
                )}
                {section.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`admin-shell-link${isActive(item) ? ' active' : ''}`}
                  >
                    <i className={`bx ${item.icon}`} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          <button type="button" className="admin-shell-logout" onClick={onLogout}>
            <i className="bx bx-log-out" />
            <span>Đăng xuất</span>
          </button>
        </aside>

        <div className="admin-shell-main">
          <header className="admin-shell-topbar">
            <div className="admin-shell-topbar-spacer" />
            <div className="admin-shell-topbar-right">
              <div className="admin-shell-user">
                <div className="admin-shell-avatar">{initials(user.fullName || user.username)}</div>
                <div className="admin-shell-user-meta">
                  <strong>{user.fullName || user.username}</strong>
                  <span>Administrator</span>
                </div>
              </div>
            </div>
          </header>
          <div className="admin-shell-content">{children}</div>
        </div>
      </div>
    );
  }

  /* ===== CUSTOMER ACCOUNT ===== */
  return (
    <div className="page account-page">
      <div className="account-layout">
        <aside className="account-sidebar">
          <h1 className="account-greeting">
            Xin Chào, {user.fullName || user.username}!
          </h1>
          <nav className="account-menu">
            {USER_MENU.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`account-menu-item${isActive(item) ? ' active' : ''}`}
              >
                <i className={`bx ${item.icon}`} />
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              type="button"
              className="account-menu-item account-logout-item"
              onClick={onLogout}
            >
              <i className="bx bx-log-out" />
              <span>Đăng Xuất</span>
            </button>
          </nav>
        </aside>
        <section className="account-content">{children}</section>
      </div>
    </div>
  );
}
