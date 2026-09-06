using AURA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AURA.Controllers
{
    public class ChiTietSanPhamTrangChuController : Controller
    {
        AURA_DBContext db = new AURA_DBContext();

        // ================================
        // TRANG CHI TIẾT SẢN PHẨM TRANG CHỦ
        // ================================
        public ActionResult Index(int? id)
        {
            if (id == null)
                return RedirectToAction("Index", "TrangChu");

            // Lấy sản phẩm từ bảng Trang Chủ
            var sanPham = db.SanPhams.FirstOrDefault(x => x.MaSP == id.Value);
            if (sanPham == null)
                return HttpNotFound();

            // Lấy chi tiết từ bảng ChiTietSanPhamTrangChu
            var chiTiet = db.ChiTietSanPhamTrangChus
                            .FirstOrDefault(x => x.MaSP == id.Value);

            ViewBag.SanPham = sanPham;
            return View(chiTiet);
        }
    }
}