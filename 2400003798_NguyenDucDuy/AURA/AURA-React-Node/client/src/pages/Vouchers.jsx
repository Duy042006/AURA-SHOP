import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AccountLayout from '../components/AccountLayout';
import { useAuth } from '../context/AuthContext';
import { useVouchers } from '../context/VoucherContext';

export default function Vouchers() {
  const { user } = useAuth();
  const { vouchers } = useVouchers();
  const [copied, setCopied] = useState('');

  if (user?.role === 'Admin') return <Navigate to="/tai-khoan/dashboard" replace />;

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      setCopied('');
    }
  };

  return (
    <AccountLayout>
      <div className="account-panel">
        <h2 className="account-panel-title">MÃ GIẢM GIÁ</h2>
        <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
          Mã còn hiệu lực của bạn. Khi thanh toán chọn mã thì mã sẽ được dùng và biến mất.
          Xem tại{' '}
          <Link to="/thanh-toan" style={{ color: '#457b9d', fontWeight: 600 }}>
            trang thanh toán
          </Link>
          .
        </p>

        {!vouchers.length ? (
          <div className="empty-state">
            <i className="bx bx-purchase-tag" style={{ fontSize: 40, color: '#999' }} />
            <p>Bạn chưa có mã giảm giá nào</p>
            <p style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
              Mã đã dùng sẽ không hiển thị lại tại đây.
            </p>
          </div>
        ) : (
          <div className="voucher-list">
            {vouchers.map((v) => (
              <div key={v.code} className="voucher-card">
                <div className="voucher-badge">{v.discountLabel || v.discount}</div>
                <div className="voucher-body">
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                  <div className="voucher-meta">
                    <span>
                      <i className="bx bx-purchase-tag" /> {v.code}
                    </span>
                    <span>
                      <i className="bx bx-cart" /> Đơn tối thiểu:{' '}
                      {v.minOrderLabel || 'Không giới hạn'}
                    </span>
                    <span>
                      <i className="bx bx-calendar" /> HSD: {v.expiry}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn account-save-btn voucher-copy-btn"
                  onClick={() => copyCode(v.code)}
                >
                  {copied === v.code ? 'ĐÃ SAO CHÉP' : 'SAO CHÉP MÃ'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
