import { useEffect, useState } from 'react';
import { api } from '../api/client';
import AccountLayout from '../components/AccountLayout';

export default function AdminUsers() {
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
        <h2 className="account-panel-title">NGƯỜI DÙNG</h2>
        <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
          Quản lý toàn bộ tài khoản hệ thống (Admin &amp; User).
        </p>
        {error && <div className="form-error">{error}</div>}
        {loading ? (
          <div className="loading">Đang tải...</div>
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
                  <th>Vai trò</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.fullName}</td>
                    <td>@{u.username}</td>
                    <td>{u.email || '—'}</td>
                    <td>{u.phone || '—'}</td>
                    <td>
                      <span className={`role-badge role-${(u.role || 'User').toLowerCase()}`}>
                        {u.role}
                      </span>
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
