import { useState } from 'react';
import AccountLayout from '../components/AccountLayout';
import { useVouchers } from '../context/VoucherContext';

const emptyForm = {
  code: '',
  title: '',
  desc: '',
  type: 'percent',
  value: '10',
  minOrder: '0',
  expiry: '31/12/2026',
};

export default function AdminVouchers() {
  const { catalog, addCatalogVoucher, removeCatalogVoucher } = useVouchers();
  const [form, setForm] = useState(emptyForm);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      addCatalogVoucher({
        code: form.code,
        title: form.title,
        desc: form.desc || form.title,
        type: form.type,
        value: Number(form.value) || 0,
        minOrder: Number(form.minOrder) || 0,
        expiry: form.expiry,
      });
      setForm(emptyForm);
      setMsg('Đã thêm voucher và cấp cho khách hàng!');
    } catch (err) {
      setError(err.message || 'Không thể thêm voucher');
    }
  };

  const onDelete = (code) => {
    if (!confirm(`Xóa voucher ${code}? Mã sẽ bị gỡ khỏi tất cả khách hàng.`)) return;
    removeCatalogVoucher(code);
    setMsg(`Đã xóa voucher ${code}`);
  };

  return (
    <AccountLayout adminOnly>
      <div className="account-panel">
        <h2 className="account-panel-title">VOUCHER</h2>
        <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
          Quản lý mã giảm giá. Mã mới sẽ được cấp cho khách hàng; khi khách dùng
          lúc thanh toán, mã sẽ biến mất khỏi tài khoản khách.
        </p>

        {msg && <div className="form-success">{msg}</div>}
        {error && <div className="form-error">{error}</div>}

        <form className="account-form" onSubmit={onSubmit} style={{ marginBottom: 28 }}>
          <h3 className="account-section-title">Thêm voucher</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Mã (code)</label>
              <input
                value={form.code}
                onChange={(e) => set('code', e.target.value.toUpperCase())}
                placeholder="VD: SUMMER20"
                required
              />
            </div>
            <div className="form-group">
              <label>Tiêu đề</label>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="VD: Giảm 20% hè"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <input
              value={form.desc}
              onChange={(e) => set('desc', e.target.value)}
              placeholder="Mô tả ngắn"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>Loại</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option value="percent">Phần trăm (%)</option>
                <option value="fixed">Số tiền cố định (đ)</option>
                <option value="freeship">Freeship (trừ tiền ship)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Giá trị</label>
              <input
                type="number"
                min="0"
                value={form.value}
                onChange={(e) => set('value', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Đơn tối thiểu (đ)</label>
              <input
                type="number"
                min="0"
                value={form.minOrder}
                onChange={(e) => set('minOrder', e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Hạn sử dụng</label>
            <input
              value={form.expiry}
              onChange={(e) => set('expiry', e.target.value)}
              placeholder="31/12/2026"
            />
          </div>
          <button className="btn account-save-btn" type="submit">
            THÊM VOUCHER
          </button>
        </form>

        <h3 className="account-section-title">Danh sách voucher ({catalog.length})</h3>
        {!catalog.length ? (
          <div className="empty-state">
            <p>Chưa có voucher nào</p>
          </div>
        ) : (
          <div className="account-orders-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tiêu đề</th>
                  <th>Loại</th>
                  <th>Giá trị</th>
                  <th>Đơn tối thiểu</th>
                  <th>HSD</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {catalog.map((v) => (
                  <tr key={v.code}>
                    <td>
                      <strong>{v.code}</strong>
                    </td>
                    <td>{v.title}</td>
                    <td>
                      {v.type === 'percent'
                        ? '%'
                        : v.type === 'freeship'
                          ? 'Freeship'
                          : 'Cố định'}
                    </td>
                    <td>{v.discountLabel}</td>
                    <td>{v.minOrderLabel}</td>
                    <td>{v.expiry}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => onDelete(v.code)}
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
