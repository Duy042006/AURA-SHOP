import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatVnd } from '../api/client';
import AccountLayout from '../components/AccountLayout';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api('/orders')
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api(`/admin/orders/${id}/status`, {
        method: 'PUT',
        body: { status },
      });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AccountLayout adminOnly>
      <div className="account-panel">
        <div className="account-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="account-panel-title" style={{ margin: 0 }}>ĐƠN HÀNG</h2>
          <button
            className="btn btn-outline"
            type="button"
            onClick={load}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <i className="bx bx-refresh" /> Làm mới
          </button>
        </div>
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : !orders.length ? (
          <div className="empty-state">
            <i className="bx bx-cart" />
            <p>Chưa có đơn hàng</p>
          </div>
        ) : (
          <div className="account-orders-table-wrap" style={{ marginTop: 16 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Khách</th>
                  <th>Ngày</th>
                  <th>Tổng</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.orderID}>
                    <td>#{o.orderID}</td>
                    <td>
                      <div>{o.hoTen}</div>
                      <small style={{ color: '#888' }}>{o.dienThoai}</small>
                    </td>
                    <td>{new Date(o.orderDate).toLocaleString('vi-VN')}</td>
                    <td>{formatVnd(o.totalAmount)}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.orderID, e.target.value)}
                        style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #ddd' }}
                      >
                        <option value="Đang xử lý">Đang xử lý</option>
                        <option value="Đang giao">Đang giao</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                        <option value="Canceled">Đã hủy</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Link
                        to={`/don-hang/${o.orderID}`}
                        className="btn btn-outline"
                        style={{ padding: '5px 12px', fontSize: 13 }}
                      >
                        Chi tiết
                      </Link>
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
