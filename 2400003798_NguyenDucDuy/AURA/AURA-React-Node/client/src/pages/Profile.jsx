import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccountLayout from '../components/AccountLayout';

function toDateValue(day, month, year) {
  if (!day || !month || !year) return '';
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function fromDateValue(value) {
  if (!value) return { day: '', month: '', year: '' };
  const [year, month, day] = value.split('-');
  return {
    day: day ? Number(day) : '',
    month: month ? Number(month) : '',
    year: year ? Number(year) : '',
  };
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', birthday: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        birthday: toDateValue(user.day, user.month, user.year),
      });
    }
  }, [user]);

  if (user?.role === 'Admin') return <Navigate to="/tai-khoan/dashboard" replace />;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      const { day, month, year } = fromDateValue(form.birthday);
      await updateProfile({
        fullName: form.fullName,
        email: form.email,
        day: day || null,
        month: month || null,
        year: year || null,
      });
      setMsg('Cập nhật thành công!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AccountLayout>
      <div className="account-panel">
        <h2 className="account-panel-title">THÔNG TIN CÁ NHÂN</h2>
        {msg && <div className="form-success">{msg}</div>}
        {error && <div className="form-error">{error}</div>}
        <form className="account-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} disabled readOnly className="input-readonly" />
          </div>
          <div className="form-group">
            <label>Họ &amp; Tên</label>
            <input
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              placeholder="Họ và tên"
              required
            />
          </div>
          <div className="form-group">
            <label>Sinh nhật</label>
            <input
              type="date"
              value={form.birthday}
              onChange={(e) => set('birthday', e.target.value)}
              placeholder="Nhập ngày tháng năm"
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
