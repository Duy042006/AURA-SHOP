using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AURA.Models
{
    public class DonHangViewModel
    {
        public string HoTen { get; set; }
        public string DienThoai { get; set; }
        public string DiaChi { get; set; }
        public string GhiChu { get; set; }
        public List<GioHangItem> GioHang { get; set; }
    }
}
