import { Navigate } from 'react-router-dom';
import AccountLayout from '../components/AccountLayout';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
  const { user } = useAuth();
  const { items } = useWishlist();

  if (user?.role === 'Admin') return <Navigate to="/tai-khoan" replace />;

  return (
    <AccountLayout>
      <div className="account-panel">
        <h2 className="account-panel-title">DANH SÁCH YÊU THÍCH</h2>
        {!items.length ? (
          <div className="empty-state">
            <i className="bx bx-heart" style={{ fontSize: 40, color: '#e63946' }} />
            <p>Chưa có sản phẩm yêu thích</p>
            <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
              Bấm trái tim trên sản phẩm để thêm vào đây
            </p>
          </div>
        ) : (
          <div className="product-list wishlist-grid">
            {items.map((p) => (
              <ProductCard key={`${p.maSP}-${p.loaiSP}`} product={p} />
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
