import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard from '../components/ProductCard';

const STATIONS = [
  { title: 'Áo Thun Cơ Bản', desc: '"Thoáng mát mỗi ngày, mặc là ưng"', start: 0, link: '/gu/tram/1' },
  { title: 'Công Sở & Daily Wear', desc: '"Quần tây, áo khoác — gọn gàng cả ngày"', start: 4, link: '/gu/tram/3' },
  { title: 'Bộ Sưu Tập Jean', desc: '"Jean mềm, form chuẩn mọi dáng"', start: 8, link: '/gu/tram/2' },
  { title: 'Streetwear & Casual', desc: '"Polo, bomber, short — gu tự do"', start: 12, link: '/gu/tram/5' },
  { title: 'Áo Khoác Sơ Mi Oxford', desc: '"Lớp khoác nhẹ, đi đâu cũng hợp"', start: 16, link: '/gu/tram/4' },
  { title: 'Bộ Sưu Tập The Beginner', desc: 'Trang phục thể thao cho người mới bắt đầu', start: 20, link: '/gu/3' },
  { title: 'Bộ Sưu Tập The Trainer', desc: 'Trang phục thể thao công nghệ cao', start: 24, link: '/gu/3' },
  { title: 'Bộ Sưu Tập Dragon Ball Z', desc: 'Bộ sưu tập có bản quyền chính hãng', start: 28, link: '/gu/nhom/14' },
  { title: 'Bộ Sưu Tập One Piece', desc: 'Bộ sưu tập có bản quyền chính hãng', start: 32, link: '/gu/nhom/13' },
];

/**
 * direction = 'right': ảnh đầu → vị trí 2, ảnh 6 → vị trí 1
 *   [1,2,3,4,5,6] => [6,1,2,3,4,5]
 * direction = 'left': ảnh đầu ra cuối
 *   [1,2,3,4,5,6] => [2,3,4,5,6,1]
 */
function GalleryMarqueeRow({ items, direction = 'right' }) {
  const [list, setList] = useState(items);
  const [offset, setOffset] = useState(0); // -1 | 0 | 1 (ô đang trượt)
  const [noTransition, setNoTransition] = useState(false);
  const [paused, setPaused] = useState(false);
  const busy = offset !== 0;

  useEffect(() => {
    setList(items);
    setOffset(0);
  }, [items]);

  useEffect(() => {
    if (!list.length || paused || busy) return undefined;
    const timer = setInterval(() => {
      // right: trượt sang phải 1 ô (offset +1) rồi ghép lại
      // left: trượt sang trái 1 ô (offset -1)
      setNoTransition(false);
      setOffset(direction === 'right' ? 1 : -1);
    }, 2800);
    return () => clearInterval(timer);
  }, [list.length, direction, paused, busy]);

  useEffect(() => {
    if (offset === 0) return undefined;
    const done = setTimeout(() => {
      setList((prev) => {
        if (!prev.length) return prev;
        if (offset > 0) {
          // Ảnh cuối (6) → vị trí 1
          const last = prev[prev.length - 1];
          return [last, ...prev.slice(0, -1)];
        }
        // Ảnh đầu ra cuối
        return [...prev.slice(1), prev[0]];
      });
      // Tắt transition, reset offset về 0 (không giật)
      setNoTransition(true);
      setOffset(0);
    }, 520);
    return () => clearTimeout(done);
  }, [offset]);

  if (!list.length) return null;

  return (
    <div
      className="kol-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`kol-carousel-track${noTransition ? ' no-anim' : ''}`}
        style={{
          transform: `translateX(calc(${offset} * ((100% + 12px) / ${list.length})))`,
          // grid 6 cột cố định theo số ảnh
          gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))`,
        }}
      >
        {list.map((img) => (
          <Link
            key={img.maHA}
            to={`/san-pham/${img.maSP}?loai=TrangChu`}
            className="kol-carousel-item"
            title="Xem sản phẩm"
          >
            <img
              src={img.linkAnh}
              alt={`Sản phẩm #${img.maSP}`}
              onError={(e) => {
                e.target.style.opacity = 0.2;
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api('/products/home').then(setData).catch(console.error);
  }, []);

  if (!data) return <div className="loading">Đang tải trang chủ...</div>;

  const { sanPhams, gallery } = data;
  const topRow = (gallery || []).slice(0, 6);
  const bottomRow = (gallery || []).slice(6, 12);

  return (
    <>
      <section className="model-banner">
        <img
          src="/images/banner-homepage.jpg"
          alt="Banner AURA"
        />
      </section>

      <div className="marquee">
        <div className="marquee-content">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i}>MIỄN PHÍ SHIP</span>
          ))}
        </div>
      </div>

      {STATIONS.map((st) => {
        const items = sanPhams.slice(st.start, st.start + 4);
        if (!items.length) return null;
        return (
          <section className="station" key={st.title}>
            <h2>{st.title}</h2>
            <p>{st.desc}</p>
            <div className="product-list">
              {items.map((sp) => (
                <ProductCard key={sp.maSP} product={sp} />
              ))}
            </div>
            <Link to={st.link}>
              <button className="see-all" type="button">
                Xem tất cả
              </button>
            </Link>
          </section>
        );
      })}

      {gallery?.length > 0 && (
        <section className="gallery gallery-kol">
          <div className="kol-header">
            <img
              className="kol-logo"
              src="/images/logo-icon.png"
              alt=""
              onError={(e) => {
                e.target.src = '/Content/images/Menu/Logo.png';
              }}
            />
            <h2 className="kol-title">AURA x KOL</h2>
          </div>

          {topRow.length > 0 && (
            <GalleryMarqueeRow items={topRow} direction="right" />
          )}
          {bottomRow.length > 0 && (
            <GalleryMarqueeRow items={bottomRow} direction="left" />
          )}
        </section>
      )}
    </>
  );
}
