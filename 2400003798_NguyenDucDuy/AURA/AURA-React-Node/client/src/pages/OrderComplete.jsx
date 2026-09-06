import { Link, useLocation, Navigate } from 'react-router-dom';
import { formatVnd } from '../api/client';

export default function OrderComplete() {
  const { state } = useLocation();
  if (!state?.order) return <Navigate to="/" replace />;

  const { order, items, form } = state;

  return (
    <div className="page" style={{ textAlign: 'center' }}>
      <div className="form-success" style={{ maxWidth: 520, margin: '0 auto 24px' }}>
        Đặt hàng thành công! Mã đơn #{order.orderID}
      </div>
      <h1>Cảm ơn bạn đã mua hàng</h1>
      <p className="subtitle">
        {form?.hoTen} — {form?.dienThoai}
        <br />
        {form?.diaChi}
      </p>
      <div className="cart-summary" style={{ margin: '24px auto', maxWidth: 480 }}>
        {items?.map((i) => (
          <div className="row" key={`${i.loaiSP}-${i.maSP}`}>
            <span>
              {i.tenSP} × {i.soLuong}
            </span>
            <span>{formatVnd(i.gia * i.soLuong)}</span>
          </div>
        ))}
        <div className="row total">
          <span>Tổng</span>
          <span>{formatVnd(order.totalAmount)}</span>
        </div>
      </div>
      <Link to="/" className="btn btn-primary">
        Về trang chủ
      </Link>
    </div>
  );
}
