using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AURA.Models
{
    public class ViewModelSanPhamTheoNhom
    {
        public int NhomID { get; set; }
        public string TenNhom { get; set; }
        public string MoTaNhom { get; set; }
        public string Banner { get; set; }

        public List<SanPham> DanhSachSanPham { get; set; }
    }
}