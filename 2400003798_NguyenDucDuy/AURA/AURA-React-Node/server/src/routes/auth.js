import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readCollection, writeCollection, nextId } from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

function publicUser(u) {
  const { password, ...rest } = u;
  return rest;
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role || 'User' },
    process.env.JWT_SECRET || 'aura_secret',
    { expiresIn: '7d' }
  );
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
  }

  const users = readCollection('users');
  const user = users.find(
    (x) => x.username?.toLowerCase() === String(username).toLowerCase()
  );

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu!' });
  }

  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { fullName, email, username, password, phone, gender, day, month, year, address } =
    req.body || {};

  if (!username || !password || !fullName) {
    return res.status(400).json({ message: 'Vui lòng nhập họ tên, username và mật khẩu' });
  }

  const users = readCollection('users');
  if (users.some((u) => u.username?.toLowerCase() === String(username).toLowerCase())) {
    return res.status(400).json({ message: 'Username đã tồn tại' });
  }

  const user = {
    id: nextId(users, 'id'),
    fullName,
    email: email || '',
    username,
    password: bcrypt.hashSync(password, 10),
    phone: phone || '',
    gender: gender || '',
    day: day ? Number(day) : null,
    month: month ? Number(month) : null,
    year: year ? Number(year) : null,
    address: address || '',
    role: 'User',
  };

  users.push(user);
  writeCollection('users', users);
  res.status(201).json({ message: 'Đăng ký thành công', user: publicUser(user) });
});

// GET /api/auth/me
router.get('/me', authRequired, (req, res) => {
  const users = readCollection('users');
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
  res.json(publicUser(user));
});

// PUT /api/auth/profile
router.put('/profile', authRequired, (req, res) => {
  const users = readCollection('users');
  const idx = users.findIndex((u) => u.id === req.user.id);
  if (idx < 0) return res.status(404).json({ message: 'Không tìm thấy user' });

  const fields = [
    'fullName',
    'email',
    'phone',
    'gender',
    'day',
    'month',
    'year',
    'address',
    'newsletter',
  ];
  for (const f of fields) {
    if (req.body[f] !== undefined) users[idx][f] = req.body[f];
  }

  // Đổi mật khẩu (tuỳ chọn)
  const { currentPassword, newPassword } = req.body || {};
  if (newPassword) {
    if (!currentPassword || !bcrypt.compareSync(currentPassword, users[idx].password)) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới tối thiểu 6 ký tự' });
    }
    users[idx].password = bcrypt.hashSync(String(newPassword), 10);
  }

  writeCollection('users', users);
  res.json(publicUser(users[idx]));
});

export default router;
