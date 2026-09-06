import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import AccountLayout from '../components/AccountLayout';

export default function AdminCreate() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    tenSP: '',
    giaGoc: '',
    gia: '',
    mauSac: '',
    moTa: '',
    maDM: '',
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api('/admin/categories')
      .then((list) => {
        setCategories(list);
        if (list.length && !form.maDM) {
          setForm((f) => ({ ...f, maDM: String(list[0].maDM) }));
        }
      })
      .catch(console.error);
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('fileAnh', file);

      const token = localStorage.getItem('aura_token');
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi');
      navigate('/tai-khoan/san-pham');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccountLayout adminOnly>
      <div className="account-panel">
        <div className="account-panel-header">
          <h2 className="account-panel-title" style={{ marginBottom: 0 }}>
            THÊM SẢN PHẨM KHO
          </h2>
          <Link to="/tai-khoan/san-pham" className="btn btn-outline">
            ← Quay lại
          </Link>
        </div>

        {error && <div className="form-error" style={{ marginTop: 16 }}>{error}</div>}
        <form className="account-form" onSubmit={onSubmit} style={{ marginTop: 20 }}>
          <div className="form-group">
            <label>Tên sản phẩm</label>
            <input value={form.tenSP} onChange={(e) => set('tenSP', e.target.value)} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Giá gốc</label>
              <input
                type="number"
                value={form.giaGoc}
                onChange={(e) => set('giaGoc', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Giá bán</label>
              <input
                type="number"
                value={form.gia}
                onChange={(e) => set('gia', e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Màu sắc</label>
            <input value={form.mauSac} onChange={(e) => set('mauSac', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea rows={3} value={form.moTa} onChange={(e) => set('moTa', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Danh mục</label>
            <select value={form.maDM} onChange={(e) => set('maDM', e.target.value)} required>
              <option value="" disabled>
                Chọn danh mục
              </option>
              {categories.map((dm) => (
                <option key={dm.maDM} value={dm.maDM}>
                  {dm.tenDM}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Ảnh sản phẩm</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />
          </div>
          <button className="btn account-save-btn" type="submit" disabled={loading}>
            {loading ? 'ĐANG LƯU...' : 'THÊM SẢN PHẨM'}
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}
