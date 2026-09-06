import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api, formatVnd } from '../api/client';
import AccountLayout from '../components/AccountLayout';

export default function AdminProducts() {
  const location = useLocation();
  const isWarehouse = location.pathname.includes('kho-hang');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api('/admin/products')
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    await api(`/admin/products/${id}`, { method: 'DELETE' });
    load();
  };

  const updateStock = async (id, soLuongTon) => {
    try {
      await api(`/admin/products/${id}/stock`, {
        method: 'PUT',
        body: { soLuongTon: Number(soLuongTon) || 0 },
      });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AccountLayout adminOnly>
      <div className="account-panel">
        <div className="account-panel-header">
          <h2 className="account-panel-title" style={{ marginBottom: 0 }}>
            {isWarehouse ? 'KHO HÀNG' : 'SẢN PHẨM'}
          </h2>
          <Link
            to="/tai-khoan/san-pham/them"
            className="btn account-save-btn"
            style={{ marginTop: 0 }}
          >
            + THÊM SẢN PHẨM
          </Link>
        </div>

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : !products.length ? (
          <div className="empty-state">
            <i className="bx bx-package" />
            <p>Chưa có sản phẩm</p>
          </div>
        ) : (
          <div className="account-orders-table-wrap" style={{ marginTop: 20 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Mã</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Màu</th>
                  {isWarehouse && <th>Tồn kho</th>}
                  <th />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.maSP}>
                    <td>
                      <img
                        src={p.hinhAnh}
                        alt=""
                        onError={(e) => {
                          e.target.style.opacity = 0.3;
                        }}
                      />
                    </td>
                    <td>{p.maSP}</td>
                    <td>{p.tenSP}</td>
                    <td>{formatVnd(p.gia)}</td>
                    <td>{p.mauSac}</td>
                    {isWarehouse && (
                      <td>
                        <input
                          type="number"
                          min="0"
                          defaultValue={p.soLuongTon ?? 0}
                          key={`${p.maSP}-${p.soLuongTon ?? 0}`}
                          style={{
                            width: 80,
                            padding: '6px 8px',
                            borderRadius: 6,
                            border: '1px solid #ddd',
                          }}
                          onBlur={(e) => {
                            const v = Number(e.target.value) || 0;
                            if (v !== (p.soLuongTon ?? 0)) updateStock(p.maSP, v);
                          }}
                        />
                      </td>
                    )}
                    <td>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => remove(p.maSP)}
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
