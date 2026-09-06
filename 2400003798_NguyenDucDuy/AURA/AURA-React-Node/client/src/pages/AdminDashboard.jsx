import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatVnd } from '../api/client';
import AccountLayout from '../components/AccountLayout';

function statusClass(status) {
  if (status === 'Hoàn thành' || status === 'Đã giao') return 'st-done';
  if (status === 'Đang giao') return 'st-ship';
  if (status === 'Canceled' || status === 'Đã hủy') return 'st-cancel';
  return 'st-pending';
}

function statusLabel(status) {
  if (status === 'Canceled') return 'Đã hủy';
  return status || '—';
}

function RevenueChart({ data }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const w = 560;
  const h = 200;
  const pad = { t: 16, r: 12, b: 28, l: 12 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;

  const points = data.map((d, i) => {
    const x = pad.l + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
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
          <line
            key={t}
            x1={pad.l}
            x2={w - pad.r}
            y1={y}
            y2={y}
            stroke="#eef1f4"
            strokeWidth="1"
          />
        );
      })}
      <path d={area} fill="url(#dashGrad)" opacity="0.35" />
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
        <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/admin/dashboard')
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const maxSold = useMemo(() => {
    if (!data?.topProducts?.length) return 1;
    return Math.max(...data.topProducts.map((p) => p.qty), 1);
  }, [data]);

  const maxCat = useMemo(() => {
    if (!data?.categories?.length) return 1;
    return Math.max(...data.categories.map((c) => c.count), 1);
  }, [data]);

  const statCards = data
    ? [
        {
          label: 'Tổng doanh thu',
          value: formatVnd(data.stats.revenue),
          icon: 'bx-shopping-bag',
          tone: 'blue',
        },
        {
          label: 'Tổng đơn hàng',
          value: data.stats.orders.toLocaleString('vi-VN'),
          icon: 'bx-cart',
          tone: 'green',
        },
        {
          label: 'Khách hàng',
          value: data.stats.customers.toLocaleString('vi-VN'),
          icon: 'bx-user',
          tone: 'orange',
        },
        {
          label: 'Sản phẩm',
          value: data.stats.products.toLocaleString('vi-VN'),
          icon: 'bx-cube',
          tone: 'purple',
        },
      ]
    : [];

  const catIcons = ['bx-t-shirt', 'bx-closet', 'bx-shopping-bag', 'bx-category', 'bx-package'];

  return (
    <AccountLayout adminOnly>
      <div className="dash-page">
        <div className="dash-header">
          <h1>Dashboard</h1>
          <p>Tổng quan hệ thống</p>
        </div>

        {loading && <div className="loading">Đang tải dashboard...</div>}
        {error && <div className="form-error">{error}</div>}

        {data && (
          <>
            <div className="dash-stats">
              {statCards.map((c) => (
                <div key={c.label} className={`dash-stat dash-stat-${c.tone}`}>
                  <div className="dash-stat-icon">
                    <i className={`bx ${c.icon}`} />
                  </div>
                  <div>
                    <p className="dash-stat-label">{c.label}</p>
                    <p className="dash-stat-value">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="dash-row-2">
              <div className="dash-card">
                <div className="dash-card-head">
                  <h3>Doanh thu 7 ngày qua</h3>
                  <span className="dash-chip">7 ngày qua</span>
                </div>
                <div className="dash-chart-wrap">
                  <RevenueChart data={data.revenueByDay} />
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-head">
                  <h3>Đơn hàng mới nhất</h3>
                  <Link to="/tai-khoan/quan-ly-don" className="dash-link">
                    Xem tất cả
                  </Link>
                </div>
                {!data.recentOrders.length ? (
                  <p className="dash-empty">Chưa có đơn hàng</p>
                ) : (
                  <div className="dash-table-wrap">
                    <table className="dash-table">
                      <thead>
                        <tr>
                          <th>Mã đơn</th>
                          <th>Khách hàng</th>
                          <th>Ngày đặt</th>
                          <th>Tổng tiền</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentOrders.map((o) => (
                          <tr key={o.orderID}>
                            <td>
                              <Link to={`/don-hang/${o.orderID}`}>#{o.orderID}</Link>
                            </td>
                            <td>{o.hoTen || '—'}</td>
                            <td>
                              {o.orderDate
                                ? new Date(o.orderDate).toLocaleDateString('vi-VN')
                                : '—'}
                            </td>
                            <td>{formatVnd(o.totalAmount)}</td>
                            <td>
                              <span className={`dash-status ${statusClass(o.status)}`}>
                                {statusLabel(o.status)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="dash-row-3">
              <div className="dash-card">
                <div className="dash-card-head">
                  <h3>Sản phẩm bán chạy</h3>
                  <Link to="/tai-khoan/san-pham" className="dash-link">
                    Xem tất cả
                  </Link>
                </div>
                {!data.topProducts.length ? (
                  <p className="dash-empty">Chưa có dữ liệu bán hàng</p>
                ) : (
                  <ul className="dash-rank-list">
                    {data.topProducts.map((p) => (
                      <li key={`${p.maSP}-${p.tenSP}`}>
                        <div className="dash-rank-thumb">
                          {p.hinhAnh ? (
                            <img src={p.hinhAnh} alt="" />
                          ) : (
                            <i className="bx bx-package" />
                          )}
                        </div>
                        <div className="dash-rank-body">
                          <div className="dash-rank-top">
                            <span className="dash-rank-name">{p.tenSP}</span>
                            <span className="dash-rank-qty">{p.qty} đã bán</span>
                          </div>
                          <div className="dash-bar">
                            <div
                              className="dash-bar-fill"
                              style={{ width: `${(p.qty / maxSold) * 100}%` }}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="dash-card">
                <div className="dash-card-head">
                  <h3>Danh mục sản phẩm</h3>
                  <Link to="/tai-khoan/danh-muc" className="dash-link">
                    Xem tất cả
                  </Link>
                </div>
                {!data.categories.length ? (
                  <p className="dash-empty">Chưa có danh mục</p>
                ) : (
                  <ul className="dash-cat-list">
                    {data.categories.slice(0, 6).map((c, i) => (
                      <li key={c.maDM}>
                        <div className={`dash-cat-icon tone-${i % 5}`}>
                          <i className={`bx ${catIcons[i % catIcons.length]}`} />
                        </div>
                        <div className="dash-cat-body">
                          <span className="dash-cat-name">{c.tenDM}</span>
                          <span className="dash-cat-count">{c.count} sản phẩm</span>
                          <div className="dash-bar thin">
                            <div
                              className="dash-bar-fill soft"
                              style={{ width: `${(c.count / maxCat) * 100}%` }}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="dash-card">
                <div className="dash-card-head">
                  <h3>Hoạt động gần đây</h3>
                </div>
                {!data.activities.length ? (
                  <p className="dash-empty">Chưa có hoạt động</p>
                ) : (
                  <ul className="dash-activity">
                    {data.activities.map((a, i) => (
                      <li key={`${a.type}-${i}`}>
                        <span className={`dash-act-dot act-${a.type}`}>
                          <i
                            className={`bx ${
                              a.type === 'order' ? 'bx-cart' : a.type === 'user' ? 'bx-user' : 'bx-bell'
                            }`}
                          />
                        </span>
                        <div>
                          <p>{a.text}</p>
                          {a.time && (
                            <small>
                              {new Date(a.time).toLocaleString('vi-VN')}
                            </small>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AccountLayout>
  );
}
