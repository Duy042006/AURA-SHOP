using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AURA.Models
{
    public class ViewModelQuan
    {
        public Quan DMCha { get; set; }
        public List<DanhMucQuan> DSMuc { get; set; }
        public List<SanPhamQuan> DSSanPham { get; set; }

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