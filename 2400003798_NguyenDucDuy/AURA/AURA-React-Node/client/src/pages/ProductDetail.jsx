import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, formatVnd } from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const loai = params.get('loai') || 'TrangChu';
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setProduct(null);
    api(`/products/${id}?loaiSP=${loai}`)
      .then(setProduct)
      .catch((e) => setError(e.message));
  }, [id, loai]);

  if (error) return <div className="page"><div className="form-error">{error}</div></div>;
  if (!product) return <div className="loading">Đang tải...</div>;

  const stock = product.soLuongTon !== undefined ? Number(product.soLuongTon) : 50;
  const isOutOfStock = stock <= 0;

  const addToCart = () => {
    if (isOutOfStock) return;
    addItem(product);
    navigate('/gio-hang');
  };

  const buyNow = () => {
    if (isOutOfStock) return;
    addItem(product);
    if (!user) {
      navigate('/dang-nhap', {
        state: { from: '/thanh-toan', message: 'Vui lòng đăng nhập để thanh toán' },
      });
      return;
    }
    navigate('/thanh-toan');
  };

  return (
    <div className="page">
      <div className="detail-grid">
        <img
          className="detail-img"
          src={product.hinhAnh}
          alt={product.tenSP}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x500?text=AURA';
          }}
        />
        <div className="detail-info">
          <h1>{product.tenSP}</h1>
          {product.giaGoc > product.gia && (
            <span className="old-price">{formatVnd(product.giaGoc)}</span>
          )}
          <div className="price">{formatVnd(product.gia)}</div>
          <p className="meta">Màu: {product.mauSac || '—'}</p>
          <p className="meta">Loại: {product.loaiSP}</p>
          <p className="meta">
            Tồn kho:{' '}
            <strong
              style={{
                color: isOutOfStock ? '#ef4444' : stock <= 10 ? '#f59e0b' : '#16a34a',
              }}
            >
              {isOutOfStock ? 'Hết hàng' : `${stock} sản phẩm`}
            </strong>
          </p>
          <p style={{ marginTop: 16, lineHeight: 1.6, color: '#444' }}>{product.moTa}</p>
          <div className="detail-actions">
            <button
              className="btn btn-primary"
              type="button"
              onClick={addToCart}
              disabled={isOutOfStock}
              style={{ opacity: isOutOfStock ? 0.6 : 1, cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
            >
              <i className="bx bx-cart" /> {isOutOfStock ? 'Hết hàng' : 'Thêm giỏ hàng'}
            </button>
            <button
              className="btn btn-outline"
              type="button"
              onClick={buyNow}
              disabled={isOutOfStock}
              style={{ opacity: isOutOfStock ? 0.6 : 1, cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
            >
              Mua ngay
            </button>
          </div>
          {product.gallery?.length > 0 && (
            <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {product.gallery.map((g) => (
                <img
                  key={g.maHA}
                  src={g.linkAnh}
                  alt=""
                  style={{ width: 72, height: 90, objectFit: 'cover', borderRadius: 6 }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
