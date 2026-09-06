import jwt from 'jsonwebtoken';

export function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: 'Chưa đăng nhập' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'aura_secret');
    next();
  } catch {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
}

export function adminRequired(req, res, next) {
  authRequired(req, res, () => {
    if (req.user?.role !== 'Admin') {
      return res.status(403).json({ message: 'Chỉ Admin mới được phép' });
    }
    next();
  });
}

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET || 'aura_secret');
    } catch {
      req.user = null;
    }
  }
  next();
}
