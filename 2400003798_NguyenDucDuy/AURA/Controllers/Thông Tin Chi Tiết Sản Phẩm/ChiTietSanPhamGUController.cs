using AURA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AURA.Controllers
{
    public class ChiTietSanPhamGUController : Controller
    {
        // GET: ChiTietSanPhamGUontroller
        AURA_DBContext db = new AURA_DBContext();

        // =================================
        // TRANG CHI TIẾT SẢN PHẨM GU
        // =================================
        public ActionResult Index(int? id)
        {
            if (id == null)
                return RedirectToAction("Index", "Gu");

            // ✅ LẤY 1 SẢN PHẨM GU
            var sanPham = db.View_SanPhamTong
                .FirstOrDefault(x => x.MaSP == id && x.LoaiSP == "TrangChu"); // hoặc loại tương ứng

            if (sanPham == null)
                return HttpNotFound();

            // ✅ LẤY CHI TIẾT GU THEO MaSP
            var chiTiet = db.ChiTietSanPhamGUs
                .FirstOrDefault(x => x.NhomID == sanPham.MaDM);

            ViewBag.SanPham = sanPham;
            return View(chiTiet); // ✅ TRẢ ĐÚNG 1 ChiTietSanPhamGU
        }
    }
}