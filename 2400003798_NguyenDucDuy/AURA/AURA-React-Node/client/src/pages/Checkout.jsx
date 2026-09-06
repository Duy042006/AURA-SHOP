import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useVouchers, calcVoucherDiscount, canUseVoucher } from '../context/VoucherContext';
import { api, formatVnd } from '../api/client';

function readCookie(name) {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : '';
}

function shippingFromUser(user) {
  if (!user) return null;
  return {
    hoTen: user.fullName || '',
    dienThoai: user.phone || '',
    diaChi: user.address || '',
  };
}

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { vouchers, consumeVoucher } = useVouchers();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    hoTen: '',
    dienThoai: '',
    diaChi: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filledFromAccount, setFilledFromAccount] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      const ship = shippingFromUser(user);
      setForm({
        hoTen: ship.hoTen || readCookie('HoTen') || '',
        dienThoai: ship.dienThoai || readCookie('DienThoai') || '',
        diaChi: ship.diaChi || readCookie('DiaChi') || '',
      });
      setFilledFromAccount(Boolean(ship.hoTen || ship.dienThoai || ship.diaChi));
    } else {
      setForm({
        hoTen: readCookie('HoTen') || '',
        dienThoai: readCookie('DienThoai') || '',
        diaChi: readCookie('DiaChi') || '',
      });
      setFilledFromAccount(false);
    }
  }, [user, authLoading]);

  // Nếu mã đang chọn bị mất (đã dùng / hết) thì bỏ chọn
  useEffect(() => {
    if (voucherCode && !vouchers.some((v) => v.code === voucherCode)) {
      setVoucherCode('');
    }
  }, [vouchers, voucherCode]);

  const selectedVoucher = useMemo(
    () => vouchers.find((v) => v.code === voucherCode) || null,
    [vouchers, voucherCode]
  );

  const memberDiscount = user ? Math.round(total * 0.1) : 0;
  const voucherOk = selectedVoucher ? canUseVoucher(selectedVoucher, total) : false;
  const voucherDiscount = voucherOk ? calcVoucherDiscount(selectedVoucher, total) : 0;

  // Ưu tiên mã giảm giá nếu chọn & đủ điều kiện; không thì giảm 10% thành viên
  const useVoucher = Boolean(selectedVoucher && voucherOk && voucherDiscount > 0);
  const discountAmount = useVoucher ? voucherDiscount : memberDiscount;
  const payTotal = Math.max(0, total - discountAmount);
  const discountLabel = useVoucher
    ? `Mã ${selectedVoucher.code}`
    : user
      ? 'Giảm 10% thành viên'
      : null;

  if (!items.length) return <Navigate to="/gio-hang" replace />;
  if (!authLoading && !user) {
    return (
      <Navigate
        to="/dang-nhap"
        replace
        state={{ from: '/thanh-toan', message: 'Vui lòng đăng nhập để thanh toán' }}
      />
    );
  }

  const missingShip =
    user && (!form.hoTen?.trim() || !form.dienThoai?.trim() || !form.diaChi?.trim());

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedVoucher && !voucherOk) {
      setError(
        `Mã ${selectedVoucher.code} chưa đủ điều kiện (đơn tối thiểu ${
          selectedVoucher.minOrderLabel || selectedVoucher.minOrder
        }).`
      );
      return;
    }

    setLoading(true);
    try {
      const result = await api('/orders', {
        method: 'POST',
        body: {
          items,
          ...form,
          voucherCode: useVoucher ? selectedVoucher.code : null,
          voucherDiscount: useVoucher ? voucherDiscount : 0,
        },
      });

      // Dùng mã → mã biến mất khỏi tài khoản
      if (useVoucher && selectedVoucher?.code) {
        consumeVoucher(selectedVoucher.code);
      }

      const exp = new Date(Date.now() + 30 * 864e5).toUTCString();
      document.cookie = `HoTen=${encodeURIComponent(form.hoTen)}; expires=${exp}; path=/`;
      document.cookie = `DienThoai=${encodeURIComponent(form.dienThoai)}; expires=${exp}; path=/`;
      document.cookie = `DiaChi=${encodeURIComponent(form.diaChi)}; expires=${exp}; path=/`;
      document.cookie = `DaDatHang=1; expires=${exp}; path=/`;

      clear();
      navigate('/hoan-tat', {
        state: {
          order: result.order,
          items: result.items,
          form,
          voucherCode: useVoucher ? selectedVoucher.code : null,
          discountAmount,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="page loading">Đang tải thông tin...</div>;
  }

  return (
    <div className="page">
      <h1>Thanh toán</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <form onSubmit={onSubmit}>
          {error && <div className="form-error">{error}</div>}

          {user && filledFromAccount && !missingShip && (
            <div className="form-success" style={{ marginBottom: 16 }}>
              Đã lấy thông tin từ{' '}
              <Link to="/tai-khoan/giao-hang" style={{ color: '#2e7d32', fontWeight: 600 }}>
                Thông tin giao hàng
              </Link>{' '}
              trong tài khoản. Bạn có thể chỉnh sửa nếu cần.
            </div>
          )}

          {user && missingShip && (
            <div className="form-error" style={{ marginBottom: 16 }}>
              Chưa có đủ thông tin giao hàng trong tài khoản.{' '}
              <Link to="/tai-khoan/giao-hang" style={{ color: '#e63946', fontWeight: 600 }}>
                Cập nhật tại đây
              </Link>{' '}
              hoặc điền bên dưới.
            </div>
          )}

          <div className="form-group">
            <label>Họ tên người nhận</label>
            <input
              value={form.hoTen}
              onChange={(e) => set('hoTen', e.target.value)}
              placeholder="Họ và tên"
              required
            />
          </div>
          <div className="form-group">
            <label>Điện thoại</label>
            <input
              value={form.dienThoai}
              onChange={(e) => set('dienThoai', e.target.value)}
              placeholder="Số điện thoại"
              required
            />
          </div>
          <div className="form-group">
            <label>Địa chỉ giao hàng</label>
            <textarea
              rows={3}
              value={form.diaChi}
              onChange={(e) => set('diaChi', e.target.value)}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
              required
            />
          </div>

          {/* Chọn mã giảm giá */}
          <div className="form-group checkout-voucher">
            <label>Mã giảm giá</label>
            {!vouchers.length ? (
              <p className="checkout-voucher-empty">
                Bạn không còn mã giảm giá.{' '}
                <Link to="/tai-khoan/ma-giam-gia">Xem mã của tôi</Link>
              </p>
            ) : (
              <>
                <select
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                >
                  <option value="">— Không dùng mã (giảm 10% thành viên) —</option>
                  {vouchers.map((v) => {
                    const ok = canUseVoucher(v, total);
                    const off = calcVoucherDiscount(v, total);
                    return (
                      <option key={v.code} value={v.code} disabled={!ok}>
                        {v.code} — {v.title}
                        {ok ? ` (−${formatVnd(off)})` : ` (Đơn tối thiểu ${v.minOrderLabel})`}
                      </option>
                    );
                  })}
                </select>
                {selectedVoucher && !voucherOk && (
                  <p className="checkout-voucher-warn">
                    Đơn chưa đủ điều kiện cho mã {selectedVoucher.code}. Cần tối thiểu{' '}
                    {selectedVoucher.minOrderLabel}.
                  </p>
                )}
                {useVoucher && (
                  <p className="checkout-voucher-ok">
                    Đang áp dụng <strong>{selectedVoucher.code}</strong>. Sau khi đặt hàng, mã
                    này sẽ bị xóa khỏi tài khoản.
                  </p>
                )}
              </>
            )}
          </div>

          {user && (
            <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
              Quản lý mã tại{' '}
              <Link to="/tai-khoan/ma-giam-gia" style={{ color: '#457b9d', fontWeight: 600 }}>
                Tài khoản → Mã giảm giá
              </Link>
            </p>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Đang đặt hàng...' : 'Xác nhận đặt hàng'}
          </button>
        </form>

        <div className="cart-summary" style={{ marginLeft: 0, maxWidth: '100%' }}>
          <h3 style={{ marginBottom: 16 }}>Đơn hàng ({items.length} SP)</h3>
          {items.map((i) => (
            <div className="row" key={`${i.loaiSP}-${i.maSP}`}>
              <span>
                {i.tenSP} × {i.soLuong}
              </span>
              <span>{formatVnd(i.gia * i.soLuong)}</span>
            </div>
          ))}
          <div className="row">
            <span>Tạm tính</span>
            <span>{formatVnd(total)}</span>
          </div>
          {discountLabel && discountAmount > 0 && (
            <div className="row" style={{ color: '#2e7d32' }}>
              <span>{discountLabel}</span>
              <span>-{formatVnd(discountAmount)}</span>
            </div>
          )}
          <div className="row total">
            <span>Tổng thanh toán</span>
            <span>{formatVnd(payTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
