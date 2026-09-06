import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading }) {
  if (loading) return <div className="loading">Đang tải sản phẩm...</div>;
  if (!products?.length) {
    return (
      <div className="empty-state">
        <i className="bx bx-package" />
        <p>Không có sản phẩm nào</p>
      </div>
    );
  }
  return (
    <div className="product-list">
      {products.map((p) => (
        <ProductCard key={`${p.loaiSP}-${p.maSP}`} product={p} />
      ))}
    </div>
  );
}
