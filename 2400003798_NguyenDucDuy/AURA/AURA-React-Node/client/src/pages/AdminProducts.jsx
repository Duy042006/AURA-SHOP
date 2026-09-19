import { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api, formatVnd } from '../api/client';
import AccountLayout from '../components/AccountLayout';

export default function AdminProducts() {
  const location = useLocation();
  const isWarehouse = location.pathname.includes('kho-hang');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // State cho Modal Chỉnh sửa sản phẩm
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    tenSP: '',
    giaGoc: '',
    gia: '',
    mauSac: '',
    moTa: '',
    maDM: '',
    loaiSP: 'TrangChu',
    soLuongTon: 50,
    hinhAnh: '',
  });
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([
      api('/admin/products?all=true'),
      api('/admin/categories').catch(() => []),
    ])
      .then(([productList, catList]) => {
        setProducts(productList || []);
        setCategories(catList || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [isWarehouse]);

  const remove = async (id) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm #${id}?`)) return;
    try {
      await api(`/admin/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.maSP !== id));
      showToast(`Đã xóa sản phẩm #${id} thành công!`);
    } catch (err) {
      alert(err.message || 'Không thể xóa sản phẩm');
    }
  };

  const updateStock = async (id, soLuongTon) => {
    setUpdatingId(id);
    try {
      await api(`/admin/products/${id}/stock`, {
        method: 'PUT',
        body: { soLuongTon: Math.max(0, Number(soLuongTon) || 0) },
      });
      setProducts((prev) =>
        prev.map((p) => (p.maSP === id ? { ...p, soLuongTon: Math.max(0, Number(soLuongTon) || 0) } : p))
      );
      showToast(`Đã cập nhật tồn kho sản phẩm #${id}!`);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Mở popup chỉnh sửa
  const openEdit = (p) => {
    setEditingProduct(p);
    setEditForm({
      tenSP: p.tenSP || '',
      giaGoc: p.giaGoc !== undefined && p.giaGoc !== null ? String(p.giaGoc) : '',
      gia: p.gia !== undefined && p.gia !== null ? String(p.gia) : '',
      mauSac: p.mauSac || '',
      moTa: p.moTa || '',
      maDM: p.maDM ? String(p.maDM) : '',
      loaiSP: p.loaiSP || 'TrangChu',
      soLuongTon: p.soLuongTon !== undefined ? Number(p.soLuongTon) : 50,
      hinhAnh: p.hinhAnh || '',
    });
    setEditFile(null);
    setEditPreview(p.hinhAnh || '');
    setEditError('');
  };

  const closeEdit = () => {
    setEditingProduct(null);
    setEditFile(null);
    setEditPreview('');
    setEditError('');
  };

  const handleEditChange = (k, v) => {
    setEditForm((prev) => ({ ...prev, [k]: v }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFile(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setEditLoading(true);
    setEditError('');

    try {
      const fd = new FormData();
      Object.entries(editForm).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          fd.append(k, v);
        }
      });
      if (editFile) {
        fd.append('fileAnh', editFile);
      }

      const token = localStorage.getItem('aura_token');
      const res = await fetch(`/api/admin/products/${editingProduct.maSP}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const updated = await res.json();
      if (!res.ok) throw new Error(updated.message || 'Lỗi khi cập nhật sản phẩm');

      setProducts((prev) =>
        prev.map((item) => (item.maSP === editingProduct.maSP ? updated : item))
      );
      closeEdit();
      showToast(`Đã lưu thay đổi cho sản phẩm #${editingProduct.maSP}!`);
    } catch (err) {
      setEditError(err.message || 'Có lỗi xảy ra khi lưu');
    } finally {
      setEditLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = products;
    if (catFilter !== 'ALL') {
      list = list.filter((p) => (p.loaiSP || 'TrangChu') === catFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) => String(p.maSP).includes(q) || p.tenSP?.toLowerCase().includes(q) || p.mauSac?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, catFilter, search]);

  const totalInventory = useMemo(() => {
    return products.reduce((sum, p) => sum + (Number(p.soLuongTon) || 0), 0);
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((p) => (Number(p.soLuongTon) || 0) <= 0).length;
  }, [products]);

  return (
    <AccountLayout adminOnly>
      <div className="account-panel">
        <div className="account-panel-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 className="account-panel-title" style={{ marginBottom: 4 }}>
              {isWarehouse ? 'QUẢN LÝ KHO HÀNG' : 'SẢN PHẨM'}
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              {isWarehouse
                ? `Tổng tồn kho: ${totalInventory} cái · Hết hàng: ${outOfStockCount} sản phẩm (tồn kho tự động trừ khi khách mua)`
                : `Quản lý và chỉnh sửa danh sách sản phẩm hệ thống (${products.length} sản phẩm)`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-outline"
              type="button"
              onClick={load}
              title="Tải lại danh sách"
              style={{ marginTop: 0 }}
            >
              <i className="bx bx-refresh" /> Làm mới
            </button>
            <Link
              to="/tai-khoan/san-pham/them"
              className="btn account-save-btn"
              style={{ marginTop: 0 }}
            >
              + THÊM SẢN PHẨM
            </Link>
          </div>
        </div>

        {successMsg && (
          <div className="form-success" style={{ marginTop: 14 }}>
            {successMsg}
          </div>
        )}

        {/* BỘ LỌC DANH MỤC & TÌM KIẾM */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            marginTop: 18,
            padding: '12px 16px',
            background: '#f8fafc',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { key: 'ALL', label: `Tất cả (${products.length})` },
              { key: 'TrangChu', label: 'Trang chủ' },
              { key: 'Ao', label: 'Áo' },
              { key: 'Quan', label: 'Quần' },
              { key: 'PhuKien', label: 'Phụ kiện' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setCatFilter(tab.key)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  border: catFilter === tab.key ? '1px solid #2563eb' : '1px solid #cbd5e1',
                  background: catFilter === tab.key ? '#2563eb' : '#fff',
                  color: catFilter === tab.key ? '#fff' : '#334155',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Tìm tên hoặc mã SP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid #cbd5e1',
              fontSize: 13,
              minWidth: 200,
              background: '#fff',
            }}
          />
        </div>

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : !filtered.length ? (
          <div className="empty-state">
            <i className="bx bx-package" />
            <p>Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <div className="account-orders-table-wrap" style={{ marginTop: 16 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Mã</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá bán</th>
                  <th>Màu sắc</th>
                  <th>Số lượng tồn kho</th>
                  <th>Tình trạng</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const stock = Number(p.soLuongTon ?? 0);
                  const isLow = stock > 0 && stock <= 10;
                  const isOut = stock <= 0;

                  return (
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
                      <td>
                        <Link to={`/san-pham/${p.maSP}?loai=${p.loaiSP || 'TrangChu'}`} style={{ color: '#2563eb', fontWeight: 600 }}>
                          #{p.maSP}
                        </Link>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{p.tenSP}</div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: 12,
                            padding: '2px 6px',
                            background: '#f1f5f9',
                            borderRadius: 4,
                            color: '#475569',
                          }}
                        >
                          {p.loaiSP || 'TrangChu'}
                        </span>
                      </td>
                      <td>
                        <strong>{formatVnd(p.gia)}</strong>
                      </td>
                      <td>{p.mauSac || '—'}</td>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <input
                            type="number"
                            min="0"
                            defaultValue={stock}
                            key={`${p.maSP}-${stock}`}
                            disabled={updatingId === p.maSP}
                            style={{
                              width: 75,
                              padding: '6px 8px',
                              borderRadius: 6,
                              border: isOut ? '1px solid #ef4444' : isLow ? '1px solid #f59e0b' : '1px solid #cbd5e1',
                              fontWeight: 600,
                              color: isOut ? '#dc2626' : isLow ? '#d97706' : '#1e293b',
                              background: isOut ? '#fef2f2' : isLow ? '#fffbeb' : '#fff',
                            }}
                            onBlur={(e) => {
                              const v = Number(e.target.value);
                              if (!isNaN(v) && v !== stock) {
                                updateStock(p.maSP, v);
                              }
                            }}
                          />
                          <span style={{ fontSize: 12, color: '#64748b' }}>cái</span>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600,
                            background: isOut ? '#fee2e2' : isLow ? '#fef3c7' : '#dcfce7',
                            color: isOut ? '#991b1b' : isLow ? '#92400e' : '#166534',
                          }}
                        >
                          {isOut ? 'Hết hàng' : isLow ? 'Sắp hết' : 'Còn hàng'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            className="btn btn-outline"
                            type="button"
                            onClick={() => openEdit(p)}
                            style={{
                              padding: '4px 10px',
                              fontSize: 12,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              color: '#2563eb',
                              borderColor: '#93c5fd',
                            }}
                          >
                            <i className="bx bx-edit" /> Sửa
                          </button>
                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => remove(p.maSP)}
                            style={{ padding: '4px 10px', fontSize: 12 }}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL CHỈNH SỬA SẢN PHẨM */}
        {editingProduct && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              backdropFilter: 'blur(3px)',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeEdit();
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '620px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                padding: '24px 28px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '14px',
                  marginBottom: '18px',
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: '#0f172a' }}>
                    Chỉnh sửa sản phẩm #{editingProduct.maSP}
                  </h3>
                  <small style={{ color: '#64748b' }}>Cập nhật thông tin chi tiết, giá bán và kho hàng</small>
                </div>
                <button
                  type="button"
                  onClick={closeEdit}
                  style={{
                    border: 'none',
                    background: '#f1f5f9',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    fontSize: 18,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569',
                  }}
                >
                  ✕
                </button>
              </div>

              {editError && (
                <div className="form-error" style={{ marginBottom: 16 }}>
                  {editError}
                </div>
              )}

              <form onSubmit={saveEdit}>
                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.tenSP}
                    onChange={(e) => handleEditChange('tenSP', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                      Giá gốc (VND)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.giaGoc}
                      onChange={(e) => handleEditChange('giaGoc', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 14,
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                      Giá bán (VND) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={editForm.gia}
                      onChange={(e) => handleEditChange('gia', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 14,
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                      Số lượng tồn kho *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={editForm.soLuongTon}
                      onChange={(e) => handleEditChange('soLuongTon', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 14,
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                      Màu sắc
                    </label>
                    <input
                      type="text"
                      value={editForm.mauSac}
                      onChange={(e) => handleEditChange('mauSac', e.target.value)}
                      placeholder="VD: Đen, Trắng, Xanh..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 14,
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                      Loại sản phẩm
                    </label>
                    <select
                      value={editForm.loaiSP}
                      onChange={(e) => handleEditChange('loaiSP', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 14,
                        background: '#fff',
                      }}
                    >
                      <option value="TrangChu">Trang chủ</option>
                      <option value="Ao">Áo</option>
                      <option value="Quan">Quần</option>
                      <option value="PhuKien">Phụ kiện</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                      Danh mục
                    </label>
                    <select
                      value={editForm.maDM}
                      onChange={(e) => handleEditChange('maDM', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        fontSize: 14,
                        background: '#fff',
                      }}
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((dm) => (
                        <option key={dm.maDM} value={dm.maDM}>
                          {dm.tenDM}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.moTa}
                    onChange={(e) => handleEditChange('moTa', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #cbd5e1',
                      fontSize: 14,
                    }}
                  />
                </div>

                {/* HÌNH ẢNH */}
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>
                    Ảnh sản phẩm
                  </label>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 8 }}>
                    {editPreview && (
                      <img
                        src={editPreview}
                        alt="Preview"
                        style={{
                          width: 64,
                          height: 64,
                          objectFit: 'cover',
                          borderRadius: 6,
                          border: '1px solid #e2e8f0',
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ fontSize: 13 }}
                      />
                      <small style={{ display: 'block', color: '#64748b', marginTop: 4 }}>
                        Chọn ảnh mới từ máy tính (nếu muốn thay đổi ảnh hiện tại)
                      </small>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 10,
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: 16,
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={closeEdit}
                    disabled={editLoading}
                    style={{ padding: '8px 16px' }}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="btn account-save-btn"
                    disabled={editLoading}
                    style={{ padding: '8px 20px', marginTop: 0 }}
                  >
                    {editLoading ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
