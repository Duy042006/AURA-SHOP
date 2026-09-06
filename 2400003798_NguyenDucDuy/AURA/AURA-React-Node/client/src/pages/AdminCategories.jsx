import { useEffect, useState } from 'react';
import { api } from '../api/client';
import AccountLayout from '../components/AccountLayout';

export default function AdminCategories() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ tenDM: '', moTa: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api('/admin/categories')
      .then(setList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setSaving(true);
    try {
      await api('/admin/categories', {
        method: 'POST',
        body: { tenDM: form.tenDM.trim(), moTa: form.moTa.trim() },
      });
      setForm({ tenDM: '', moTa: '' });
      setMsg('Đã thêm danh mục!');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Xóa danh mục này?')) return;
    setError('');
    try {
      await api(`/admin/categories/${id}`, { method: 'DELETE' });
      setMsg('Đã xóa danh mục.');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AccountLayout adminOnly>
      <div className="account-panel">
        <h2 className="account-panel-title">DANH MỤC</h2>
        {msg && <div className="form-success">{msg}</div>}
        {error && <div className="form-error">{error}</div>}

        <form className="account-form" onSubmit={onSubmit} style={{ marginBottom: 28 }}>
          <div className="form-group">
            <label>Tên danh mục</label>
            <input
              value={form.tenDM}
              onChange={(e) => set('tenDM', e.target.value)}
              placeholder="VD: Áo Thun Cơ Bản"
              required
            />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              rows={2}
              value={form.moTa}
              onChange={(e) => set('moTa', e.target.value)}
              placeholder="Mô tả ngắn"
            />
          </div>
          <button className="btn account-save-btn" type="submit" disabled={saving}>
            {saving ? 'ĐANG LƯU...' : 'THÊM DANH MỤC'}
          </button>
        </form>

        <h3 style={{ fontSize: 15, marginBottom: 12, color: '#333' }}>Danh mục hiện có</h3>
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : !list.length ? (
          <div className="empty-state">
            <p>Chưa có danh mục</p>
          </div>
        ) : (
          <div className="account-orders-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tên</th>
                  <th>Mô tả</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {list.map((dm) => (
                  <tr key={dm.maDM}>
                    <td>{dm.maDM}</td>
                    <td>{dm.tenDM}</td>
                    <td>{dm.moTa || '—'}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => remove(dm.maDM)}
                      >
                        Xóa
                      </button>
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
