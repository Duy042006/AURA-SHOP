using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AURA.Models;


namespace AURA.Controllers
{
    public class LoginController : Controller
    {
        AURA_DBContext db = new AURA_DBContext();

        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(string Username, string Password)
        {
            if (string.IsNullOrEmpty(Username) || string.IsNullOrEmpty(Password))
            {
                ViewBag.Error = "Vui lòng nhập đầy đủ thông tin!";
                return View();
            }

            var user = db.Users.FirstOrDefault(x =>
    x.Username.ToLower() == Username.ToLower()
    && x.Password == Password
            );

            if (user != null)
            {
                Session["UserId"] = user.Id;
                Session["User"] = user;

                // 🔒 FIX NULL ROLE
                Session["Role"] = string.IsNullOrEmpty(user.Role)
                                    ? "User"
                                    : user.Role.Trim();

                // 🔥 PHÂN HƯỚNG THEO ROLE
                if (Session["Role"].ToString() == "Admin")
                {
                    return RedirectToAction("Index", "ProductAdmin");
                }
                else
                {
                    return RedirectToAction("Index", "Order");
                }
            }


            ViewBag.Error = "Sai tài khoản hoặc tài khoản không tồn tại!";
            return View();
        }

        public ActionResult Logout()
        {
            Session.Clear();   // ✅ XÓA TOÀN BỘ SESSION (User, UserId, Role, Giỏ hàng...)
            return RedirectToAction("Index", "Login");
        }
    }
}