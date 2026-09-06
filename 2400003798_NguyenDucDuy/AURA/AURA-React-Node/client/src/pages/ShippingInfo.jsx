import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccountLayout from '../components/AccountLayout';

export default function ShippingInfo() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ phone: '', address: '', fullName: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      setForm({
        phone: user.phone || '',
        address: user.address || '',
        fullName: user.fullName || '',
      });
    }
  }, [user]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      await updateProfile({
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
      });
      setMsg('Cập nhật thông tin giao hàng thành công!');
    } catch (err) {
      setError(err.message);
    }
  };

  if (user?.role === 'Admin') return <Navigate to="/tai-khoan" replace />;

  return (
    <AccountLayout>
      <div className="account-panel">
        <h2 className="account-panel-title">THÔNG TIN GIAO HÀNG</h2>
        {msg && <div className="form-success">{msg}</div>}
        {error && <div className="form-error">{error}</div>}
        <form className="account-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Họ &amp; Tên người nhận</label>
            <input
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              placeholder="Họ và tên"
              required
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="Số điện thoại"
              required
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ giao hàng</label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
              required
            />
          </div>
          <button className="btn account-save-btn" type="submit">
            LƯU THAY ĐỔI
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}
