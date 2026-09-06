using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AURA.Models
{
    public class ViewModelGuIndex
    {
        public List<SanPham> DanhSachSanPham { get; set; }

        // Phân trang
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }

        public int TotalPages
        {
            get { return (int)Math.Ceiling((double)TotalItems / PageSize); }
        }
    }
}