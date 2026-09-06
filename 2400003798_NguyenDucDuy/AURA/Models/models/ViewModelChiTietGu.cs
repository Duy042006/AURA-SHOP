using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AURA.Models
{
    public class ViewModelChiTietGu
    {
        public int GuID { get; set; }
        public string TenGu { get; set; }
        public string MoTaGu { get; set; }
        public string BannerGu { get; set; }

        public List<Tram> DanhSachTram { get; set; }
        public List<SanPham> DanhSachSanPham { get; set; }
    }
}