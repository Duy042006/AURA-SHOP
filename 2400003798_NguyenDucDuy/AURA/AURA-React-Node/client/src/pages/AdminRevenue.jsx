import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api, formatVnd } from '../api/client';
import AccountLayout from '../components/AccountLayout';

function MiniChart({ data }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const w = 640;
  const h = 220;
  const pad = { t: 16, r: 12, b: 28, l: 12 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const points = data.map((d, i) => {
    const x = pad.l + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
    const y = pad.t + innerH - (d.revenue / max) * innerH;
    return { x, y, ...d };
  });
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${line} L ${points[points.length - 1].x} ${pad.t + innerH} L ${points[0].x} ${pad.t + innerH} Z`;

  return (
    <svg className="dash-chart-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {[0.25, 0.5, 0.75, 1].map((t) => {
        const y = pad.t + innerH * (1 - t);
        return (
          <line key={t} x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#eef1f4" strokeWidth="1" />
        );
      })}
      <path d={area} fill="url(#revGrad)" opacity="0.35" />
      <path d={line} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
      {points.map((p) => (
        <g key={p.date}>
          <circle cx={p.x} cy={p.y} r="4" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
          <text x={p.x} y={h - 8} textAnchor="middle" className="dash-chart-label">
            {p.label}
          </text>
        </g>
      ))}
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function AdminRevenue() {
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([api('/admin/dashboard'), api('/orders')])
      .then(([dash, orderList]) => {
        setData(dash);
        setOrders(orderList || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const weekRevenue = useMemo(() => {
    if (!data?.revenueByDay) return 0;
    return data.revenueByDay.reduce((s, d) => s + Number(d.revenue || 0), 0);
  }, [data]);

  const avgOrder = useMemo(() => {
    if (!data?.stats?.orders) return 0;
    const active = orders.filter((o) => o.status !== 'Canceled');
    if (!active.length) return 0;
    return Math.round(
      active.reduce((s, o) => s + Number(o.totalAmount || 0), 0) / active.length
    );
  }, [data, orders]);

  const byStatus = useMemo(() => {
    const map = {};
    for (const o of orders) {
      const k = o.status || 'Khác';
      if (!map[k]) map[k] = { count: 0, amount: 0 };
      map[k].count += 1;
      map[k].amount += Number(o.totalAmount || 0);
    }
    return Object.entries(map).map(([status, v]) => ({ status, ...v }));
  }, [orders]);

  // Lọc bảng doanh thu chi tiết
  const filteredOrders = useMemo(() => {
    let list = orders;
    if (statusFilter === 'ACTIVE') {
      list = list.filter((o) => o.status !== 'Canceled');
    } else if (statusFilter !== 'ALL') {
      list = list.filter((o) => o.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (o) =>
          String(o.orderID).includes(q) ||
          o.hoTen?.toLowerCase().includes(q) ||
          o.dienThoai?.includes(q) ||
          o.diaChi?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [orders, statusFilter, search]);

  const filteredRevenue = useMemo(() => {
    return filteredOrders
      .filter((o) => o.status !== 'Canceled')
      .reduce((s, o) => s + Number(o.totalAmount || 0), 0);
  }, [filteredOrders]);

  return (
    <AccountLayout adminOnly>
      <div className="dash-page">
        <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Doanh thu</h1>
            <p>Báo cáo doanh thu và chi tiết đơn hàng (tự động cập nhật khi mua hàng)</p>
          </div>
          <button
            className="btn btn-outline"
            type="button"
            onClick={loadData}
            title="Làm mới số liệu"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <i className="bx bx-refresh" /> Cập nhật lại
          </button>
        </div>

        {loading && <div className="loading">Đang tải...</div>}
        {error && <div className="form-error">{error}</div>}

        {data && (
          <>
            <div className="dash-stats">
              <div className="dash-stat dash-stat-blue">
                <div className="dash-stat-icon">
                  <i className="bx bx-money" />
                </div>
                <div>
                  <p className="dash-stat-label">Tổng doanh thu</p>
                  <p className="dash-stat-value">{formatVnd(data.stats.revenue)}</p>
                </div>
              </div>
              <div className="dash-stat dash-stat-green">
                <div className="dash-stat-icon">
                  <i className="bx bx-line-chart" />
                </div>
                <div>
                  <p className="dash-stat-label">Doanh thu 7 ngày</p>
                  <p className="dash-stat-value">{formatVnd(weekRevenue)}</p>
                </div>
              </div>
              <div className="dash-stat dash-stat-orange">
                <div className="dash-stat-icon">
                  <i className="bx bx-cart" />
                </div>
                <div>
                  <p className="dash-stat-label">Tổng đơn hàng</p>
                  <p className="dash-stat-value">{data.stats.orders}</p>
                </div>
              </div>
              <div className="dash-stat dash-stat-purple">
                <div className="dash-stat-icon">
                  <i className="bx bx-purchase-tag" />
                </div>
                <div>
                  <p className="dash-stat-label">Giá trị TB / đơn</p>
                  <p className="dash-stat-value">{formatVnd(avgOrder)}</p>
                </div>
              </div>
            </div>

            <div className="dash-card" style={{ marginBottom: 14 }}>
              <div className="dash-card-head">
                <h3>Doanh thu 7 ngày qua</h3>
                <span className="dash-chip">7 ngày</span>
              </div>
              <div className="dash-chart-wrap">
                <MiniChart data={data.revenueByDay} />
              </div>
            </div>

            <div className="dash-row-2">
              <div className="dash-card">
                <div className="dash-card-head">
                  <h3>Doanh thu theo trạng thái đơn</h3>
                </div>
                {!byStatus.length ? (
                  <p className="dash-empty">Chưa có đơn hàng</p>
                ) : (
                  <div className="dash-table-wrap">
                    <table className="dash-table">
                      <thead>
                        <tr>
                          <th>Trạng thái</th>
                          <th>Số đơn</th>
                          <th>Doanh thu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {byStatus.map((r) => (
                          <tr key={r.status}>
                            <td>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '2px 8px',
                                  borderRadius: 4,
                                  fontSize: 12,
                                  fontWeight: 500,
                                  background:
                                    r.status === 'Canceled'
                                      ? '#fee2e2'
                                      : r.status === 'Hoàn thành'
                                      ? '#dcfce7'
                                      : '#fef3c7',
                                  color:
                                    r.status === 'Canceled'
                                      ? '#991b1b'
                                      : r.status === 'Hoàn thành'
                                      ? '#166534'
                                      : '#92400e',
                                }}
                              >
                                {r.status === 'Canceled' ? 'Đã hủy' : r.status}
                              </span>
                            </td>
                            <td>{r.count}</td>
                            <td>
                              <strong style={{ color: r.status === 'Canceled' ? '#94a3b8' : '#0f172a' }}>
                                {formatVnd(r.amount)}
                              </strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="dash-card">
                <div className="dash-card-head">
                  <h3>Đơn hàng gần đây</h3>
                  <Link to="/tai-khoan/quan-ly-don" className="dash-link">
                    Xem tất cả
                  </Link>
                </div>
                {!data.recentOrders?.length ? (
                  <p className="dash-empty">Chưa có đơn</p>
                ) : (
                  <div className="dash-table-wrap">
                    <table className="dash-table">
                      <thead>
                        <tr>
                          <th>Mã</th>
                          <th>Khách</th>
                          <th>Tổng</th>
                          <th>TT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentOrders.map((o) => (
                          <tr key={o.orderID}>
                            <td>
                              <Link to={`/don-hang/${o.orderID}`}>#{o.orderID}</Link>
                            </td>
                            <td>{o.hoTen || '—'}</td>
                            <td>{formatVnd(o.totalAmount)}</td>
                            <td>{o.status === 'Canceled' ? 'Đã hủy' : o.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* BẢNG CHI TIẾT DOANH THU ĐƠN HÀNG */}
            <div className="dash-card" style={{ marginTop: 18 }}>
              <div className="dash-card-head" style={{ flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontSize: 18, margin: 0 }}>BẢNG CHI TIẾT DOANH THU ĐƠN HÀNG</h3>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
                    Cập nhật thời gian thực mỗi khi có khách đặt hàng mới
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Tìm mã đơn, tên khách, SĐT..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 6,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      minWidth: 220,
                    }}
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      padding: '7px 10px',
                      borderRadius: 6,
                      border: '1px solid #cbd5e1',
                      fontSize: 13,
                      background: '#fff',
                    }}
                  >
                    <option value="ALL">Tất cả đơn ({orders.length})</option>
                    <option value="ACTIVE">Tính vào doanh thu ({orders.filter((o) => o.status !== 'Canceled').length})</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Canceled">Đã hủy ({orders.filter((o) => o.status === 'Canceled').length})</option>
                  </select>
                </div>
              </div>

              {!filteredOrders.length ? (
                <p className="dash-empty" style={{ padding: '32px 0' }}>
                  Không tìm thấy đơn hàng nào phù hợp
                </p>
              ) : (
                <div className="dash-table-wrap">
                  <table className="dash-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Ngày đặt</th>
                        <th>Khách hàng</th>
                        <th>Số điện thoại</th>
                        <th>Voucher</th>
                        <th>Trạng thái</th>
                        <th style={{ textAlign: 'right' }}>Doanh thu ghi nhận</th>
                        <th style={{ textAlign: 'center' }}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => {
                        const isCanceled = o.status === 'Canceled';
                        return (
                          <tr key={o.orderID}>
                            <td>
                              <Link to={`/don-hang/${o.orderID}`} style={{ fontWeight: 600, color: '#2563eb' }}>
                                #{o.orderID}
                              </Link>
                            </td>
                            <td>
                              <span style={{ fontSize: 13, color: '#475569' }}>
                                {new Date(o.orderDate).toLocaleString('vi-VN')}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: 500 }}>{o.hoTen || 'Khách vãng lai'}</div>
                              <small style={{ color: '#94a3b8' }}>{o.diaChi}</small>
                            </td>
                            <td>{o.dienThoai || '—'}</td>
                            <td>
                              {o.voucherCode ? (
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    background: '#f1f5f9',
                                    border: '1px dashed #94a3b8',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: '#0f172a',
                                  }}
                                >
                                  {o.voucherCode}
                                </span>
                              ) : (
                                <span style={{ color: '#94a3b8' }}>—</span>
                              )}
                            </td>
                            <td>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '3px 8px',
                                  borderRadius: 4,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  background: isCanceled
                                    ? '#fee2e2'
                                    : o.status === 'Hoàn thành'
                                    ? '#dcfce7'
                                    : o.status === 'Đang giao'
                                    ? '#dbeafe'
                                    : '#fef3c7',
                                  color: isCanceled
                                    ? '#991b1b'
                                    : o.status === 'Hoàn thành'
                                    ? '#166534'
                                    : o.status === 'Đang giao'
                                    ? '#1e40af'
                                    : '#92400e',
                                }}
                              >
                                {isCanceled ? 'Đã hủy' : o.status}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {isCanceled ? (
                                <div>
                                  <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: 13 }}>
                                    {formatVnd(o.totalAmount)}
                                  </span>
                                  <br />
                                  <small style={{ color: '#ef4444', fontWeight: 500 }}>0 đ (Đã hủy)</small>
                                </div>
                              ) : (
                                <strong style={{ color: '#0f172a', fontSize: 14 }}>
                                  {formatVnd(o.totalAmount)}
                                </strong>
                              )}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <Link
                                to={`/don-hang/${o.orderID}`}
                                className="btn btn-outline"
                                style={{ padding: '4px 10px', fontSize: 12 }}
                              >
                                Chi tiết
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: '#f8fafc', fontWeight: 600, borderTop: '2px solid #e2e8f0' }}>
                        <td colSpan={6} style={{ padding: '12px 14px' }}>
                          Tổng cộng ({filteredOrders.length} đơn hiển thị · {filteredOrders.filter((o) => o.status !== 'Canceled').length} đơn ghi nhận):
                        </td>
                        <td style={{ textAlign: 'right', padding: '12px 14px', fontSize: 15, color: '#166534' }}>
                          {formatVnd(filteredRevenue)}
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AccountLayout>
  );
}
