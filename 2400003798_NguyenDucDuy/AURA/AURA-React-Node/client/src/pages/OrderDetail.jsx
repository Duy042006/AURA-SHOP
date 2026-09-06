import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { api, formatVnd } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function OrderDetail() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    api(`/orders/${id}`)
      .then(setOrder)
      .catch((e) => setError(e.message));
  }, [id, user]);

  if (authLoading) return <div className="loading">Đang tải...</div>;
  if (!user) return <Navigate to="/dang-nhap" replace />;
  if (error) return <div className="page"><div className="form-error">{error}</div></div>;
  if (!order) return <div className="loading">Đang tải...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Đơn hàng #{order.orderID}</h1>
        <Link to="/don-hang" className="btn btn-outline">
          ← Quay lại
        </Link>
      </div>
      <p className="subtitle">
        {new Date(order.orderDate).toLocaleString('vi-VN')} · {order.status}
        <br />
        {order.hoTen} — {order.dienThoai} — {order.diaChi}
      </p>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>SL</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((i) => (
            <tr key={i.id}>
              <td>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img className="cart-item-img" src={i.hinhAnh} alt="" />
                  {i.tenSP}
                </div>
              </td>
              <td>{i.quantity}</td>
              <td>{formatVnd(i.price)}</td>
              <td>{formatVnd(i.price * i.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-summary">
        <div className="row total">
          <span>Tổng</span>
          <span>{formatVnd(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
