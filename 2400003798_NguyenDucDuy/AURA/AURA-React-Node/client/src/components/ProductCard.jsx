import { Link, useNavigate } from 'react-router-dom';
import { formatVnd } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const loai = product.loaiSP || 'TrangChu';
  const { user } = useAuth();
  const { isFavorite, toggle } = useWishlist();
  const navigate = useNavigate();
  const liked = isFavorite(product);

  const onHeart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/dang-nhap');
      return;
    }
    if (user.role === 'Admin') return;
    toggle(product);
  };

  return (
    <div className="product-card">
      <div className="img-box">
        <Link to={`/san-pham/${product.maSP}?loai=${loai}`} className="product-card-link">
          <img
            src={product.hinhAnh || ''}
            alt={product.tenSP}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.background = '#e9ecef';
              e.target.style.objectFit = 'contain';
              e.target.removeAttribute('src');
            }}
          />
        </Link>
        <span className="tag">Miễn Phí Ship</span>
        <button
          type="button"
          className={`wish-btn${liked ? ' active' : ''}`}
          aria-label={liked ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
          title={liked ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
          onClick={onHeart}
        >
          <i className={liked ? 'bx bxs-heart' : 'bx bx-heart'} />
        </button>
      </div>
      <Link to={`/san-pham/${product.maSP}?loai=${loai}`} className="info">
        <p className="name">{product.tenSP}</p>
        {product.giaGoc > product.gia && (
          <p className="old-price">{formatVnd(product.giaGoc)}</p>
        )}
        <p className="price">{formatVnd(product.gia)}</p>
      </Link>
    </div>
  );
}
