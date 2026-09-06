using AURA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AURA.Controllers
{
    public class SanPhamController : Controller
    {
        AURA_DBContext db = new AURA_DBContext();

        // ==========================
        // 🔎 TÌM KIẾM SẢN PHẨM
        // ==========================
        public ActionResult TimKiem(string keyword)
        {
            if (string.IsNullOrEmpty(keyword))
                return RedirectToAction("Index", "TrangChu");

            var ketQua = db.View_SanPhamTong
                           .Where(x => x.TenSP.Contains(keyword))
                           .ToList();

            ViewBag.TuKhoa = keyword;

            return View(ketQua);
        }
    }
}