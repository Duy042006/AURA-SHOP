import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ADMIN_PATHS = [
  '/tai-khoan/dashboard',
  '/tai-khoan/san-pham',
  '/tai-khoan/danh-muc',
  '/tai-khoan/quan-ly-don',
  '/tai-khoan/khach-hang',
  '/tai-khoan/kho-hang',
  '/tai-khoan/voucher',
  '/tai-khoan/doanh-thu',
  '/tai-khoan/thong-ke',
  '/tai-khoan/nguoi-dung',
  '/tai-khoan/phan-quyen',
  '/tai-khoan/he-thong',
];

const SETTINGS_KEY = 'aura_admin_settings';
const DEFAULT_SUPPORT = {
  shopName: 'AURA',
  shopEmail: 'admin@aura.vn',
  shopPhone: '0900000000',
};

function loadSupportInfo() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({
        shopName: DEFAULT_SUPPORT.shopName,
        shopEmail: DEFAULT_SUPPORT.shopEmail,
        shopPhone: DEFAULT_SUPPORT.shopPhone,
        freeShipFrom: '500000',
      }));
      return { ...DEFAULT_SUPPORT };
    }
    const s = JSON.parse(raw);
    // Bỏ giá trị placeholder cũ nếu còn trong localStorage
    let email = (s.shopEmail || '').trim();
    let phone = (s.shopPhone || '').trim();
    if (!email || email === 'support@aura.vn') email = DEFAULT_SUPPORT.shopEmail;
    if (!phone || phone.includes('xxxx') || phone === '1900 xxxx') phone = DEFAULT_SUPPORT.shopPhone;
    return {
      shopName: (s.shopName || '').trim() || DEFAULT_SUPPORT.shopName,
      shopEmail: email,
      shopPhone: phone,
    };
  } catch {
    return { ...DEFAULT_SUPPORT };
  }
}

export default function Layout({ children }) {
  const { user } = useAuth();
  const { count } = useCart();
  const wishlist = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState('');
  const [support, setSupport] = useState(loadSupportInfo);
  const wishCount = Array.isArray(wishlist?.items) ? wishlist.items.length : 0;

  useEffect(() => {
    setSupport(loadSupportInfo());
    const onStorage = (e) => {
      if (!e.key || e.key === SETTINGS_KEY) setSupport(loadSupportInfo());
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('aura-settings-updated', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('aura-settings-updated', onStorage);
    };
  }, [location.pathname]);

  const isAdminShell =
    user?.role === 'Admin' &&
    ADMIN_PATHS.some(
      (p) => location.pathname === p || location.pathname.startsWith(`${p}/`)
    );

  const onSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/tim-kiem?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  if (isAdminShell) {
    return <main className="admin-root-main">{children}</main>;
  }

  return (
    <>
      <header>
        <div className="navbar">
          <div className="logo">
            <Link to="/">
              <img src="/Content/images/Menu/Logo.png" alt="AURA" onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<strong style="color:#fff;font-size:22px">AURA</strong>';
              }} />
            </Link>
          </div>

          <nav className="nav-menu">
            <ul className="menu">
              <li>
                <Link to="/">TRANG CHỦ</Link>
              </li>
              {/* GU */}
              <li className="dropdown">
                <Link to="/gu">GU ▾</Link>
                <ul className="submenu">
                  <li className="sub-dropdown">
                    <Link to="/gu/1">GU ĐƠN GIẢN ▸</Link>
                    <div className="mega-box">
                      <div className="content">
                        <div>
                          <Link to="/gu/tram/1"><h3>Áo Thun Cơ Bản</h3></Link>
                          <ul>
                            <li><Link to="/gu/nhom/1">Non Branded</Link></li>
                            <li><Link to="/gu/nhom/2">Seventy Seven</Link></li>
                            <li><Link to="/gu/nhom/3">The Worker</Link></li>
                          </ul>
                        </div>
                        <div>
                          <Link to="/gu/tram/2"><h3>Bộ Sưu Tập Jean</h3></Link>
                          <ul>
                            <li><Link to="/gu/nhom/4">The Original Jean</Link></li>
                            <li><Link to="/gu/nhom/5">Tek Black Jean</Link></li>
                            <li><Link to="/gu/nhom/6">Multi-Color Jean</Link></li>
                          </ul>
                        </div>
                        <div>
                          <Link to="/gu/tram/3"><h3>Công Sở Tối Giản</h3></Link>
                          <ul>
                            <li><Link to="/gu/nhom/7">The Minimalist</Link></li>
                            <li><Link to="/gu/nhom/8">The CEO</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="sub-dropdown">
                    <Link to="/gu/2">GU THIẾT KẾ ▸</Link>
                    <div className="mega-box">
                      <div className="content">
                        <div>
                          <Link to="/gu/tram/4"><h3>Áo Khoác</h3></Link>
                          <ul>
                            <li><Link to="/gu/nhom/9">Áo Khoác Đơn Giản</Link></li>
                            <li><Link to="/gu/nhom/10">Áo Khoác Cá Tính</Link></li>
                          </ul>
                        </div>
                        <div>
                          <Link to="/gu/tram/5"><h3>Streetwear & Casual</h3></Link>
                          <ul>
                            <li><Link to="/gu/nhom/11">The No Style</Link></li>
                            <li><Link to="/gu/nhom/12">The Weekend</Link></li>
                          </ul>
                        </div>
                        <div>
                          <Link to="/gu/tram/6"><h3>Collab</h3></Link>
                          <ul>
                            <li><Link to="/gu/nhom/13">One Piece</Link></li>
                            <li><Link to="/gu/nhom/14">Dragon Ball Z</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link to="/gu/3">GU THỂ THAO</Link>
                  </li>
                </ul>
              </li>

              {/* ÁO */}
              <li className="dropdown">
                <Link to="/ao">ÁO ▾</Link>
                <div className="mega">
                  <div className="content">
                    <div>
                      <Link to="/ao/danh-muc/1"><h3>ÁO THUN</h3></Link>
                      <ul>
                        <li><Link to="/ao/san-pham/1">Áo Thun Cổ Tròn</Link></li>
                        <li><Link to="/ao/san-pham/2">Áo Polo</Link></li>
                        <li><Link to="/ao/san-pham/3">Áo Thun Tay Dài</Link></li>
                        <li><Link to="/ao/san-pham/4">Áo Tank Top</Link></li>
                      </ul>
                    </div>
                    <div>
                      <Link to="/ao/danh-muc/2"><h3>ÁO SƠ MI</h3></Link>
                      <ul>
                        <li><Link to="/ao/san-pham/5">Sơ Mi Ngắn Tay</Link></li>
                        <li><Link to="/ao/san-pham/6">Sơ Mi Dài Tay</Link></li>
                      </ul>
                    </div>
                    <div>
                      <Link to="/ao/danh-muc/3"><h3>ÁO KHOÁC</h3></Link>
                      <ul>
                        <li><Link to="/ao/san-pham/7">Áo Khoác Gió</Link></li>
                        <li><Link to="/ao/san-pham/8">Áo Khoác Jean</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>

              {/* QUẦN */}
              <li className="dropdown">
                <Link to="/quan">QUẦN ▾</Link>
                <div className="mega">
                  <div className="content">
                    <div>
                      <Link to="/quan/danh-muc/1"><h3>QUẦN JEAN</h3></Link>
                      <ul>
                        <li><Link to="/quan/san-pham/1">Jeans Slimfit</Link></li>
                        <li><Link to="/quan/san-pham/2">Jeans Loose</Link></li>
                      </ul>
                    </div>
                    <div>
                      <Link to="/quan/danh-muc/2"><h3>QUẦN TÂY</h3></Link>
                      <ul>
                        <li><Link to="/quan/san-pham/3">Casual</Link></li>
                        <li><Link to="/quan/san-pham/4">Công Sở</Link></li>
                      </ul>
                    </div>
                    <div>
                      <Link to="/quan/danh-muc/3"><h3>QUẦN SHORT</h3></Link>
                      <ul>
                        <li><Link to="/quan/san-pham/5">Short Thun</Link></li>
                        <li><Link to="/quan/san-pham/6">Short Kaki</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>

              {/* PHỤ KIỆN */}
              <li className="dropdown">
                <Link to="/phu-kien">PHỤ KIỆN ▾</Link>
                <div className="mega" style={{ minWidth: 360 }}>
                  <div className="content" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <div>
                      <Link to="/phu-kien/danh-muc/1"><h3>NÓN</h3></Link>
                      <ul>
                        <li><Link to="/phu-kien/san-pham/1">Nón Cap</Link></li>
                        <li><Link to="/phu-kien/san-pham/2">Nón Bucket</Link></li>
                      </ul>
                    </div>
                    <div>
                      <Link to="/phu-kien/danh-muc/2"><h3>TÚI / BALO</h3></Link>
                      <ul>
                        <li><Link to="/phu-kien/san-pham/3">Balo</Link></li>
                        <li><Link to="/phu-kien/san-pham/4">Túi Tote</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <Link to="/gioi-thieu">GIỚI THIỆU</Link>
              </li>
            </ul>
          </nav>

          <div className="icons">
            <form className="search-box" onSubmit={onSearch}>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm..."
              />
              <button type="submit" aria-label="search">
                <i className="bx bx-search" />
              </button>
            </form>

            {user ? (
              <Link to={user.role === 'Admin' ? '/tai-khoan/dashboard' : '/tai-khoan'} title={user.fullName || 'Tài khoản'} aria-label="Tài khoản">
                <i className="bx bx-user" />
              </Link>
            ) : (
              <Link to="/dang-nhap" title="Đăng nhập">
                <i className="bx bx-user" />
              </Link>
            )}

            <Link
              to={user && user.role !== 'Admin' ? '/tai-khoan/yeu-thich' : user?.role === 'Admin' ? '/tai-khoan/dashboard' : '/dang-nhap'}
              title="Yêu thích"
              aria-label="Danh sách yêu thích"
              className="header-wish-link"
            >
              <i className="fa-regular fa-heart" aria-hidden="true" />
              {wishCount > 0 && <span className="cart-badge">{wishCount}</span>}
            </Link>

            <Link to="/gio-hang" title="Giỏ hàng">
              <i className="bx bx-cart" />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
          </div>
        </div>
      </header>

      <main className="site-main">{children}</main>

      <footer className="footer">
        <div className="footer-benefits">
          <div className="footer-benefit">
            <i className="bx bxs-truck" />
            <div>
              <strong>MIỄN PHÍ GIAO HÀNG</strong>
              <span>Cho đơn hàng từ 500.000đ</span>
            </div>
          </div>
          <div className="footer-benefit">
            <i className="bx bx-refresh" />
            <div>
              <strong>ĐỔI TRẢ DỄ DÀNG</strong>
              <span>Đổi trả trong vòng 7 ngày</span>
            </div>
          </div>
          <div className="footer-benefit">
            <i className="bx bx-shield-quarter" />
            <div>
              <strong>THANH TOÁN AN TOÀN</strong>
              <span>100% bảo mật thông tin</span>
            </div>
          </div>
          <div className="footer-benefit">
            <i className="bx bx-headphone" />
            <div>
              <strong>HỖ TRỢ 24/7</strong>
              <span>Hotline: {support?.shopPhone || '0900000000'}</span>
            </div>
          </div>
        </div>

        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-brand-row">
              <img
                className="footer-brand-logo"
                src="/images/logo-icon.png"
                alt="AURA"
                onError={(e) => {
                  e.target.src = '/Content/images/Menu/Logo.png';
                }}
              />
              <div>
                <div className="footer-brand-name">
                  AURA <span>FASHION</span>
                </div>
              </div>
            </div>
            <p>
              AURA là thương hiệu thời trang mang phong cách hiện đại, cung cấp
              các sản phẩm chất lượng với mức giá hợp lý, giúp khách hàng tự tin
              thể hiện phong cách riêng.
            </p>
            <p className="footer-social-label">THEO DÕI CHÚNG TÔI</p>
            <div className="footer-social">
              <span className="footer-social-icon" aria-hidden="true">
                <i className="bx bxl-facebook" />
              </span>
              <span className="footer-social-icon" aria-hidden="true">
                <i className="bx bxl-instagram" />
              </span>
              <span className="footer-social-icon" aria-hidden="true">
                <i className="bx bxl-tiktok" />
              </span>
              <span className="footer-social-icon" aria-hidden="true">
                <i className="bx bxl-youtube" />
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h4>HỖ TRỢ KHÁCH HÀNG</h4>
            <span className="footer-text">Trung tâm trợ giúp</span>
            <span className="footer-text">Hướng dẫn mua hàng</span>
            <span className="footer-text">Chính sách đổi trả</span>
            <span className="footer-text">Chính sách bảo hành</span>
            <span className="footer-text">Điều khoản sử dụng</span>
            <span className="footer-text">Chính sách bảo mật</span>
            <span className="footer-text">Liên hệ</span>
          </div>

          <div className="footer-col">
            <h4>DANH MỤC SẢN PHẨM</h4>
            <NavLink to="/ao">Áo</NavLink>
            <NavLink to="/quan">Quần</NavLink>
            <NavLink to="/ao/danh-muc/3">Áo khoác</NavLink>
            <NavLink to="/phu-kien">Phụ kiện</NavLink>
            <NavLink to="/">Hàng mới</NavLink>
            <NavLink to="/">Khuyến mãi</NavLink>
          </div>

          <div className="footer-col footer-contact">
            <h4>THÔNG TIN LIÊN HỆ</h4>
            <p>
              <i className="bx bx-map" />
              331A Nguyễn Tất Thành, P.An Phú Đông, Quận 12, TP. Hồ Chí Minh
            </p>
            <p>
              <i className="bx bx-phone" />
              {support?.shopPhone || '0900000000'}
            </p>
            <p>
              <i className="bx bx-envelope" />
              {support?.shopEmail || 'admin@aura.vn'}
            </p>
            <p>
              <i className="bx bx-time-five" />
              08:00 – 22:00 (Thứ 2 – Chủ nhật)
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} AURA Fashion — Thời trang thiết yếu
        </div>
      </footer>
    </>
  );
}
