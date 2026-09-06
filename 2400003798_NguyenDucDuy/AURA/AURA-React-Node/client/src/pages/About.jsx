export default function About() {
  return (
    <div className="page about-page">
      {/* Hàng trên: ảnh + chào mừng */}
      <section className="about-welcome">
        <div className="about-welcome-img">
          <img src="/images/about-store.png" alt="Cửa hàng AURA Fashion" />
        </div>
        <div className="about-welcome-text">
          <h1>Chào mừng đến với AURA Fashion</h1>
          <p>
            AURA Fashion là thương hiệu thời trang hướng phong cách hiện đại, trẻ
            trung và tinh tế. Chúng tôi mang đến những sản phẩm chất lượng cao với
            thiết kế linh hoạt, giúp khách hàng tự tin thể hiện phong cách riêng
            trong mọi hoàn cảnh.
          </p>
          <p>
            Từ những mẫu áo, quần, váy đến phụ kiện thời trang, AURA Fashion luôn
            cập nhật xu hướng mới nhất để đáp ứng nhu cầu đa dạng của khách hàng.
          </p>
        </div>
      </section>

      {/* 4 cột — layout giống ảnh 1 */}
      <section className="about-pillars">
        <div className="about-pillar">
          <div className="about-pillar-icon" aria-hidden="true">
            <i className="bx bx-bullseye" />
          </div>
          <h3>SỨ MỆNH</h3>
          <p>
            Mang đến sản phẩm thời trang chất lượng, giá cả hợp lý và trải nghiệm
            mua sắm tuyệt vời.
          </p>
        </div>
        <div className="about-pillar">
          <div className="about-pillar-icon" aria-hidden="true">
            <i className="bx bx-show" />
          </div>
          <h3>TẦM NHÌN</h3>
          <p>
            Trở thành thương hiệu thời trang được yêu thích hàng đầu trong phân
            khúc thời trang dân dụng.
          </p>
        </div>
        <div className="about-pillar">
          <div className="about-pillar-icon" aria-hidden="true">
            <i className="bx bxs-diamond" />
          </div>
          <h3>GIÁ TRỊ CỐT LÕI</h3>
          <p>Chất lượng – Xu hướng – Tận tâm – Uy tín – Phát triển bền vững.</p>
        </div>
        <div className="about-pillar">
          <div className="about-pillar-icon" aria-hidden="true">
            <i className="fa-regular fa-handshake" />
          </div>
          <h3>CAM KẾT</h3>
          <p>
            Chúng tôi cam kết mang đến sản phẩm tốt nhất và dịch vụ chăm sóc khách
            hàng tận tâm nhất.
          </p>
        </div>
      </section>

    </div>
  );
}
