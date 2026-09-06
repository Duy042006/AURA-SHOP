import { useEffect, useState } from 'react';
import { api } from '../api/client';
import AccountLayout from '../components/AccountLayout';

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/admin/users')
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AccountLayout adminOnly>
      <div className="account-panel">
        <h2 className="account-panel-title">KHÁCH HÀNG</h2>
        {error && <div className="form-error">{error}</div>}
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : !users.filter((u) => u.role !== 'Admin').length ? (
          <div className="empty-state">
            <i className="bx bx-user" />
            <p>Chưa có khách hàng</p>
          </div>
        ) : (
          <div className="account-orders-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>SĐT</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) => u.role !== 'Admin')
                  .map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.fullName}</td>
                      <td>@{u.username}</td>
                      <td>{u.email || '—'}</td>
                      <td>{u.phone || '—'}</td>
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
