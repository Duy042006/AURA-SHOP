using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AURA.Models
{
    public class ViewModelAo
    {
        public Ao DMCha { get; set; }

        public List<DanhMucAo> DSMuc { get; set; }

        public List<SanPhamAo> DSSanPham { get; set; }

        // Phân trang
        public int MaDM { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }

        public int TotalPages
        {
            get { return (int)Math.Ceiling((double)TotalItems / PageSize); }
        }
    }
}