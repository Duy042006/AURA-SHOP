using AURA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AURA.Controllers
{
    public class ChiTietSanPhamPhuKienController : Controller
    {
        AURA_DBContext db = new AURA_DBContext();

        // =================================
        // TRANG CHI TIẾT SẢN PHẨM PHỤ KIỆN
        // =================================
        public ActionResult Index(int? id)
        {
            // ✅ Không có id → quay về trang Phụ Kiện
            if (id == null)
                return RedirectToAction("Index", "PhuKien");

            // ✅ Lấy sản phẩm PHỤ KIỆN từ View_SanPhamTong
            var sanPham = db.View_SanPhamTong
                            .FirstOrDefault(x => x.MaSP == id && x.LoaiSP == "Phụ Kiện");

            if (sanPham == null)
                return HttpNotFound();

            // ✅ Lấy chi tiết sản phẩm PHỤ KIỆN
            var chiTiet = db.ChiTietSanPhamPhuKiens
                            .FirstOrDefault(x => x.MaSP == sanPham.MaSP);

            // ✅ Đưa sản phẩm chính qua ViewBag
            ViewBag.SanPham = sanPham;

            // ✅ Trả đúng 1 object cho View
            return View(chiTiet);
        }
    }
}