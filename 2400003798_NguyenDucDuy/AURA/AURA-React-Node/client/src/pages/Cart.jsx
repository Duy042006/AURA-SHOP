import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatVnd } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart();
  const { user } = useAuth();
  const discountTotal = user ? Math.round(total * 0.9) : total;

  if (!items.length) {
    return (
      <div className="page">
        <div className="empty-state">
          <i className="bx bx-cart" />
          <p>Giỏ hàng trống</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Giỏ hàng</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={`${item.loaiSP}-${item.maSP}`}>
              <td>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img className="cart-item-img" src={item.hinhAnh} alt="" />
                  <span>{item.tenSP}</span>
                </div>
              </td>
              <td>{formatVnd(item.gia)}</td>
              <td>
                <div className="qty-control">
                  <button type="button" onClick={() => updateQty(item.maSP, item.loaiSP, item.soLuong - 1)}>
                    −
                  </button>
                  <span>{item.soLuong}</span>
                  <button type="button" onClick={() => updateQty(item.maSP, item.loaiSP, item.soLuong + 1)}>
                    +
                  </button>
                </div>
              </td>
              <td>{formatVnd(item.gia * item.soLuong)}</td>
              <td>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => removeItem(item.maSP, item.loaiSP)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-summary">
        <div className="row">
          <span>Tạm tính</span>
          <span>{formatVnd(total)}</span>
        </div>
        {user && (
          <div className="row" style={{ color: '#2e7d32' }}>
            <span>Giảm 10% (thành viên)</span>
            <span>-{formatVnd(total - discountTotal)}</span>
          </div>
        )}
        <div className="row total">
          <span>Tổng</span>
          <span>{formatVnd(discountTotal)}</span>
        </div>
        <Link
          to={user ? '/thanh-toan' : '/dang-nhap'}
          state={user ? undefined : { from: '/thanh-toan', message: 'Vui lòng đăng nhập để thanh toán' }}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 16 }}
        >
          Thanh toán
        </Link>
        {!user && (
          <p style={{ fontSize: 13, color: '#666', marginTop: 10, textAlign: 'center' }}>
            Cần đăng nhập để thanh toán
          </p>
        )}
      </div>
    </div>
  );
}
