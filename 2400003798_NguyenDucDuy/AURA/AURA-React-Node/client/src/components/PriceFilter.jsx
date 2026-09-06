export default function PriceFilter({ mau, gia, onChange }) {
  return (
    <div className="filters">
      <select value={mau || ''} onChange={(e) => onChange({ mau: e.target.value, gia })}>
        <option value="">Tất cả màu</option>
        <option value="Đen">Đen</option>
        <option value="Trắng">Trắng</option>
        <option value="Xám">Xám</option>
        <option value="Xanh">Xanh</option>
        <option value="Nâu">Nâu</option>
        <option value="Hồng">Hồng</option>
      </select>
      <select
        value={gia || ''}
        onChange={(e) => onChange({ mau, gia: e.target.value ? Number(e.target.value) : '' })}
      >
        <option value="">Tất cả giá</option>
        <option value="1">Dưới 100.000</option>
        <option value="2">100.000 – 200.000</option>
        <option value="3">200.000 – 300.000</option>
        <option value="4">Trên 300.000</option>
      </select>
    </div>
  );
}
