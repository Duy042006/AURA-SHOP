using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AURA.Models
{
    public class ViewModelTramChiTiet
    {
        public int TramID { get; set; }

        // Thông tin TRẠM
        public string TenTram { get; set; }
        public string MoTaTram { get; set; }
        public string BannerTram { get; set; }

        // 3 Thương hiệu (Nonbranded – Seventyseven – Worker)
        public List<NhomSanPham> DanhSachNhom { get; set; }

        // Danh sách SẢN PHẨM của TRẠM
        public List<SanPham> DanhSachSanPham { get; set; }
    }
}