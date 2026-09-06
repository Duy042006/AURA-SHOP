using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AURA.Models
{
    public class GioHangItem
    {
        public int MaSP { get; set; }
        public string LoaiSP { get; set; }
        public string TenSP { get; set; }
        public string HinhAnh { get; set; }
        public decimal Gia { get; set; }
        public int SoLuong { get; set; }

        public decimal ThanhTien
        {
            get { return Gia * SoLuong; }
        }
    }
}