import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatVnd } from '../api/client';
import AccountLayout from '../components/AccountLayout';

function MiniChart({ data }) {
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

  useEffect(() => {
    Promise.all([api('/admin/dashboard'), api('/orders')])
      .then(([dash, orderList]) => {
        setData(dash);
        setOrders(orderList || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <AccountLayout adminOnly>
      <div className="dash-page">
        <div className="dash-header">
          <h1>Doanh thu</h1>
          <p>Báo cáo doanh thu theo đơn hàng</p>
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
                            <td>{r.status === 'Canceled' ? 'Đã hủy' : r.status}</td>
                            <td>{r.count}</td>
                            <td>{formatVnd(r.amount)}</td>
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
          </>
        )}
      </div>
    </AccountLayout>
  );
}
