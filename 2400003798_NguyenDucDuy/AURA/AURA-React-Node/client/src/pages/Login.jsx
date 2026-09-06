import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || null;
  const notice = location.state?.message || '';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(username, password);
      if (user.role === 'Admin') {
        navigate('/tai-khoan/dashboard');
      } else if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-card">
        <h1>Đăng nhập</h1>
        {notice && <div className="form-success">{notice}</div>}
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
        <p className="auth-link">
          Chưa có tài khoản?{' '}
          <Link to="/dang-ky" state={redirectTo ? { from: redirectTo } : undefined}>
            Đăng ký
          </Link>
        </p>
        <p className="auth-link" style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
          Demo: admin / 123456 hoặc user / 123456
        </p>
      </div>
    </div>
  );
}
