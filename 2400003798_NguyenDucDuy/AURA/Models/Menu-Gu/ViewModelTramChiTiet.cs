using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AURA.Models
{
    public class ViewModelTramChiTiet
    {
        public int TramID { get; set; }

    public string TenTram { get; set; }
    public string MoTaTram { get; set; }
    public string BannerTram { get; set; }

    public List<NhomSanPham> DanhSachNhom { get; set; }
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