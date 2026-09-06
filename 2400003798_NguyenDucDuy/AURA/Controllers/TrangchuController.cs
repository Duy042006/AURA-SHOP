using AURA.Models;
using AURA.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AURA.Controllers
{
    public class TrangchuController : Controller
    {
        // Sử dụng context thực từ EDMX (Database First)
        private readonly AURA_DBContext db = new AURA_DBContext();

        public ActionResult Index()
        {
            // Lấy 4 sản phẩm đầu tiên từ bảng SanPham
            var sanPhamsEf = db.SanPhams
            .Where(sp => sp.GiaGoc != null)
            .Take(36)
            .ToList();

            // Lấy 6 ảnh đầu tiên từ bảng HinhAnhSanPham
            var galleryEf = db.HinhAnhSanPhams.ToList();

            // Map từ entity (EF) sang ViewModel
            var viewModel = new TrangChuViewModel
            {
                SanPhams = sanPhamsEf.Select(sp => new SanPhamViewModel
                {
                    Id = sp.MaSP,               // map MaSP -> Id
                    TenSanPham = sp.TenSP,      // map TenSP -> TenSanPham
                    HinhAnh = sp.HinhAnh,       // map HinhAnh
                    Gia = sp.Gia ?? 0m,          // map Giá, nếu null thì 0
                    GiaGoc = sp.GiaGoc
                }).ToList(),

                Gallery = galleryEf.Select(g => new BoSuuTapAnhViewModel
                {
                    Id = g.MaHA,                // map MaHA -> Id
                    HinhAnh = g.LinkAnh,        // map LinkAnh -> HinhAnh
                    MoTa = ""                   // gán trống nếu bảng không có cột Mô tả
                }).ToList()
            };

            // Truyền sang view
            return View(viewModel);
        }
    }
}