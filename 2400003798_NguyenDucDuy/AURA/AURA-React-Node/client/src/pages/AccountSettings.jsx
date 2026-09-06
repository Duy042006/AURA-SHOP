import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AccountLayout from '../components/AccountLayout';
import { useAuth } from '../context/AuthContext';

export default function AccountSettings() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    phone: '',
    gender: 'Nam',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        phone: user.phone || '',
        gender: user.gender || 'Nam',
      }));
    }
  }, [user]);

  if (user?.role === 'Admin') return <Navigate to="/tai-khoan" replace />;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    if (form.newPassword || form.confirmPassword || form.currentPassword) {
      if (!form.currentPassword) {
        setError('Vui lòng nhập mật khẩu hiện tại');
        return;
      }
      if (form.newPassword.length < 6) {
        setError('Mật khẩu mới tối thiểu 6 ký tự');
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        phone: form.phone,
        gender: form.gender,
      };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      await updateProfile(payload);
      setForm((f) => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
      setMsg('Đã cập nhật cài đặt tài khoản!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountLayout>
      <div className="account-panel">
        <h2 className="account-panel-title">CÀI ĐẶT TÀI KHOẢN</h2>
        {msg && <div className="form-success">{msg}</div>}
        {error && <div className="form-error">{error}</div>}
        <form className="account-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input value={user?.username || ''} disabled readOnly className="input-readonly" />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="Số điện thoại"
            />
          </div>
          <div className="form-group">
            <label>Giới tính</label>
            <select value={form.gender} onChange={(e) => set('gender', e.target.value)}>
              <option>Nam</option>
              <option>Nữ</option>
              <option>Khác</option>
            </select>
          </div>

          <h3 className="account-section-title">Đổi mật khẩu</h3>
          <div className="form-group">
            <label>Mật khẩu hiện tại</label>
            <input
              type="password"
              value={form.currentPassword}
              onChange={(e) => set('currentPassword', e.target.value)}
              placeholder="Để trống nếu không đổi"
              autoComplete="current-password"
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) => set('newPassword', e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => set('confirmPassword', e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              autoComplete="new-password"
            />
          </div>

          <button className="btn account-save-btn" type="submit" disabled={saving}>
            {saving ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}
