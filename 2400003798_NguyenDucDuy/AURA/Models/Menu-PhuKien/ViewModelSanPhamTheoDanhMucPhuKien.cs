using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AURA.Models
{
    public class ViewModelSanPhamTheoDanhMucPhuKien
    {
        public int MaDM { get; set; }
        public string TenDM { get; set; }
        public string Banner { get; set; }

        public List<SanPhamPhuKien> DanhSachSanPham { get; set; }
    }
}