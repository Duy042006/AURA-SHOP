using AURA.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AURA.Controllers
{
    public class ProductAdminController : Controller
    {
        AURA_DBContext db = new AURA_DBContext();

        // =========================
        // 🔒 KIỂM TRA QUYỀN ADMIN
        // =========================
        private bool IsAdmin()
        {
            return Session["Role"] != null && Session["Role"].ToString() == "Admin";
        }

        // =========================
        // ✅ DANH SÁCH SẢN PHẨM
        // =========================
        public ActionResult Index()
        {
            if (!IsAdmin())
            {
                return RedirectToAction("Index", "Login");
            }

            var ds = db.SanPhams.ToList();
            return View(ds);
        }

        // =========================
        // ✅ THÊM SẢN PHẨM (GET)
        // =========================
        public ActionResult Create()
        {
            if (!IsAdmin())
            {
                return RedirectToAction("Index", "Login");
            }

            return View();
        }

        // =========================
        // ✅ THÊM SẢN PHẨM (POST)
        // =========================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(SanPham model, HttpPostedFileBase fileAnh)
        {
            if (!IsAdmin())
            {
                return RedirectToAction("Index", "Login");
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // ===== UPLOAD ẢNH =====
            if (fileAnh != null && fileAnh.ContentLength > 0)
            {
                string fileName = Path.GetFileName(fileAnh.FileName);
                string path = Path.Combine(Server.MapPath("~/Content/images"), fileName);

                fileAnh.SaveAs(path);
                model.HinhAnh = "/Content/images/" + fileName;
            }

            db.SanPhams.Add(model);
            db.SaveChanges();

            return RedirectToAction("Index");
        }

        // =========================
        // ✅ XOÁ SẢN PHẨM
        // =========================
        public ActionResult Delete(int id)
        {
            if (!IsAdmin())
            {
                return RedirectToAction("Index", "Login");
            }

            var sp = db.SanPhams.Find(id);

            if (sp == null)
            {
                return HttpNotFound();
            }

            db.SanPhams.Remove(sp);
            db.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}
