import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AccountLayout from '../components/AccountLayout';
import { useAuth } from '../context/AuthContext';

export default function Newsletter() {
  const { user, updateProfile } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setSubscribed(Boolean(user.newsletter));
  }, [user]);

  if (user?.role === 'Admin') return <Navigate to="/tai-khoan/dashboard" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setSaving(true);
    try {
      await updateProfile({ newsletter: subscribed });
      setMsg(
        subscribed
          ? 'Đã đăng ký nhận tin thành công!'
          : 'Đã hủy đăng ký nhận tin.'
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountLayout>
      <div className="account-panel">
        <h2 className="account-panel-title">ĐĂNG KÝ NHẬN TIN</h2>
        {msg && <div className="form-success">{msg}</div>}
        {error && <div className="form-error">{error}</div>}
        <form className="account-form" onSubmit={onSubmit}>
          <p style={{ color: '#555', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
            Nhận email về ưu đãi, bộ sưu tập mới và tin tức từ AURA.
          </p>
          <div className="form-group">
            <label>Email nhận tin</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              readOnly
              className="input-readonly"
            />
          </div>
          <label className="newsletter-check">
            <input
              type="checkbox"
              checked={subscribed}
              onChange={(e) => setSubscribed(e.target.checked)}
            />
            <span>Tôi muốn nhận tin khuyến mãi qua email</span>
          </label>
          <button
            className="btn account-save-btn"
            type="submit"
            disabled={saving}
            style={{ marginTop: 20 }}
          >
            {saving ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}
