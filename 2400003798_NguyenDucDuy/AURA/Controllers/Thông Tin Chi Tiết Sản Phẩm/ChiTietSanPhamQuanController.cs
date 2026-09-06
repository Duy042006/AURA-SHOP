using AURA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AURA.Controllers
{
    public class ChiTietSanPhamQuanController : Controller
    {
        AURA_DBContext db = new AURA_DBContext();

        // =================================
        // TRANG CHI TIẾT SẢN PHẨM QUẦN
        // =================================
        public ActionResult Index(int? id)
        {
            // ✅ Nếu không có id → quay về trang Quần
            if (id == null)
                return RedirectToAction("Index", "Quan");

            // ✅ Lấy sản phẩm QUẦN từ View_SanPhamTong
            var sanPham = db.View_SanPhamTong
                            .FirstOrDefault(x => x.MaSP == id && x.LoaiSP == "Quần");

            if (sanPham == null)
                return HttpNotFound();

            // ✅ Lấy chi tiết sản phẩm QUẦN
            var chiTiet = db.ChiTietSanPhamQuans
                            .FirstOrDefault(x => x.MaSP == sanPham.MaSP);

            // ✅ Đưa sản phẩm chính qua ViewBag
            ViewBag.SanPham = sanPham;

            // ✅ Trả đúng 1 object cho View
            return View(chiTiet);
        }
    }
}