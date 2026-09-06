using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AURA.Models;


namespace AURA.Controllers
{
    public class Sign_upController : Controller
    {
        // GET: Sign_up
        AURA_DBContext db = new AURA_DBContext();

        // GET: Sign_up
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(User user)
        {
            if (ModelState.IsValid)
            {
                // Lưu vào database
                db.Users.Add(user);
                db.SaveChanges();

                // Chuyển sang trang Login
                return RedirectToAction("Index", "Login");
            }

            return View(user);
        }
    }
}