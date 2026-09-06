import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatVnd } from '../api/client';
import AccountLayout from '../components/AccountLayout';

export default function AdminStats() {
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api('/admin/dashboard'), api('/orders'), api('/admin/users')])
      .then(([dash, orderList, users]) => {
        setData({ ...dash, users: users || [] });
        setOrders(orderList || []);
      })
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

  const cancelRate = useMemo(() => {
    if (!orders.length) return 0;
    const canceled = orders.filter((o) => o.status === 'Canceled').length;
    return Math.round((canceled / orders.length) * 100);
  }, [orders]);

  const adminCount = data?.users?.filter((u) => u.role === 'Admin').length || 0;
  const userCount = data?.users?.filter((u) => u.role !== 'Admin').length || 0;

  return (
    <AccountLayout adminOnly>
      <div className="dash-page">
        <div className="dash-header">
          <h1>Thống kê</h1>
          <p>Tổng quan số liệu hệ thống</p>
        </div>

        {loading && <div className="loading">Đang tải...</div>}
        {error && <div className="form-error">{error}</div>}

        {data && (
          <>
            <div className="dash-stats">
              <div className="dash-stat dash-stat-blue">
                <div className="dash-stat-icon">
                  <i className="bx bx-package" />
                </div>
                <div>
                  <p className="dash-stat-label">Sản phẩm</p>
                  <p className="dash-stat-value">{data.stats.products}</p>
                </div>
              </div>
              <div className="dash-stat dash-stat-green">
                <div className="dash-stat-icon">
                  <i className="bx bx-cart" />
                </div>
                <div>
                  <p className="dash-stat-label">Đơn hàng</p>
                  <p className="dash-stat-value">{data.stats.orders}</p>
                </div>
              </div>
              <div className="dash-stat dash-stat-orange">
                <div className="dash-stat-icon">
                  <i className="bx bx-user" />
                </div>
                <div>
                  <p className="dash-stat-label">Khách hàng</p>
                  <p className="dash-stat-value">{userCount}</p>
                </div>
              </div>
              <div className="dash-stat dash-stat-purple">
                <div className="dash-stat-icon">
                  <i className="bx bx-error-circle" />
                </div>
                <div>
                  <p className="dash-stat-label">Tỷ lệ hủy đơn</p>
                  <p className="dash-stat-value">{cancelRate}%</p>
                </div>
              </div>
            </div>

            <div className="dash-row-3">
              <div className="dash-card">
                <div className="dash-card-head">
                  <h3>Sản phẩm bán chạy</h3>
                  <Link to="/tai-khoan/san-pham" className="dash-link">
                    Sản phẩm
                  </Link>
                </div>
                {!data.topProducts?.length ? (
                  <p className="dash-empty">Chưa có dữ liệu bán</p>
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
                    Danh mục
                  </Link>
                </div>
                {!data.categories?.length ? (
                  <p className="dash-empty">Chưa có danh mục</p>
                ) : (
                  <ul className="dash-cat-list">
                    {data.categories.slice(0, 8).map((c, i) => (
                      <li key={c.maDM}>
                        <div className={`dash-cat-icon tone-${i % 5}`}>
                          <i className="bx bx-category" />
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
                  <h3>Người dùng hệ thống</h3>
                  <Link to="/tai-khoan/nguoi-dung" className="dash-link">
                    Chi tiết
                  </Link>
                </div>
                <ul className="dash-activity">
                  <li>
                    <span className="dash-act-dot act-user">
                      <i className="bx bx-user" />
                    </span>
                    <div>
                      <p>
                        Khách hàng: <strong>{userCount}</strong>
                      </p>
                    </div>
                  </li>
                  <li>
                    <span className="dash-act-dot act-order">
                      <i className="bx bx-shield" />
                    </span>
                    <div>
                      <p>
                        Admin: <strong>{adminCount}</strong>
                      </p>
                    </div>
                  </li>
                  <li>
                    <span className="dash-act-dot act-product">
                      <i className="bx bx-money" />
                    </span>
                    <div>
                      <p>
                        Doanh thu: <strong>{formatVnd(data.stats.revenue)}</strong>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </AccountLayout>
  );
}
