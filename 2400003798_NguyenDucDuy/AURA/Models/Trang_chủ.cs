using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;


namespace AURA.ViewModels
{
    public class TrangChuViewModel
    {
        public List<SanPhamViewModel> SanPhams { get; set; }
        public List<BoSuuTapAnhViewModel> Gallery { get; set; }


    }

    public class SanPhamViewModel
    {
        [Key]
        public int Id { get; set; }
        public string TenSanPham { get; set; }
        public string HinhAnh { get; set; }
        public decimal Gia { get; set; }
        public decimal? GiaGoc { get; set; } // để nullable cho khớp với cách bạn dùng ?? 0m


    }

    public class BoSuuTapAnhViewModel
    {
        [Key]
        public int Id { get; set; }
        public string HinhAnh { get; set; }
        public string MoTa { get; set; }
    }

}
