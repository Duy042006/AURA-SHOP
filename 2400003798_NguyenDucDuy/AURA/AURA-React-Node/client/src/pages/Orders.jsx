import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api, formatVnd } from '../api/client';
import { useAuth } from '../context/AuthContext';
import AccountLayout from '../components/AccountLayout';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role === 'Admin') return;
    api('/orders')
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const cancel = async (id) => {
    if (!confirm('Hủy đơn hàng này?')) return;
    await api(`/orders/${id}/cancel`, { method: 'POST' });
    setOrders((prev) =>
      prev.map((o) => (o.orderID === id ? { ...o, status: 'Canceled' } : o))
    );
  };

  if (user?.role === 'Admin') return <Navigate to="/tai-khoan" replace />;

  return (
    <AccountLayout>
      <div className="account-panel">
        <h2 className="account-panel-title">LỊCH SỬ ĐẶT HÀNG</h2>
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : !orders.length ? (
          <div className="empty-state">
            <i className="bx bx-receipt" />
            <p>Chưa có đơn hàng</p>
          </div>
        ) : (
          <div className="account-orders-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã ĐH</th>
                  <th>Ngày</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.orderID}>
                    <td>#{o.orderID}</td>
                    <td>{new Date(o.orderDate).toLocaleString('vi-VN')}</td>
                    <td>{formatVnd(o.totalAmount)}</td>
                    <td>{o.status}</td>
                    <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Link to={`/don-hang/${o.orderID}`} className="btn btn-outline">
                        Chi tiết
                      </Link>
                      {o.status === 'Đang xử lý' && (
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => cancel(o.orderID)}
                        >
                          Hủy
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
