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

        // --- Phân trang ---
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }

        public int TotalPages
        {
            get { return (int)Math.Ceiling((double)TotalItems / PageSize); }
        }
    }
}