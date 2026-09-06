import { useState } from 'react';
import AccountLayout from '../components/AccountLayout';

const KEY = 'aura_admin_settings';

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export default function AdminSystemSettings() {
  const saved = loadSettings();
  const [form, setForm] = useState({
    shopName: saved.shopName || 'AURA',
    shopEmail: saved.shopEmail || 'admin@aura.vn',
    shopPhone: saved.shopPhone || '0900000000',
    freeShipFrom: saved.freeShipFrom || '500000',
  });
  const [msg, setMsg] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e) => {
    e.preventDefault();
    const next = {
      shopName: form.shopName.trim() || 'AURA',
      shopEmail: form.shopEmail.trim() || 'admin@aura.vn',
      shopPhone: form.shopPhone.trim() || '0900000000',
      freeShipFrom: form.freeShipFrom || '500000',
    };
    localStorage.setItem(KEY, JSON.stringify(next));
    setForm(next);
    window.dispatchEvent(new Event('aura-settings-updated'));
    setMsg('Đã lưu cài đặt hệ thống! Footer đã cập nhật.');
  };

  return (
    <AccountLayout adminOnly>
      <div className="account-panel">
        <h2 className="account-panel-title">CÀI ĐẶT HỆ THỐNG</h2>
        {msg && <div className="form-success">{msg}</div>}
        <form className="account-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Tên cửa hàng</label>
            <input value={form.shopName} onChange={(e) => set('shopName', e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email liên hệ</label>
            <input
              type="email"
              value={form.shopEmail}
              onChange={(e) => set('shopEmail', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Hotline</label>
            <input value={form.shopPhone} onChange={(e) => set('shopPhone', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Miễn phí ship từ (VND)</label>
            <input
              type="number"
              value={form.freeShipFrom}
              onChange={(e) => set('freeShipFrom', e.target.value)}
            />
          </div>
          <button className="btn account-save-btn" type="submit">
            LƯU CÀI ĐẶT
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}
