using AURA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AURA.Controllers
{
    public class UserController : Controller
    {
        AURA_DBContext db = new AURA_DBContext();

        public ActionResult Index()
        {
            if (Session["User"] == null)
                return RedirectToAction("Index", "Login");

            User user = (User)Session["User"];
            return View(user);
        }

        [HttpPost]
        public ActionResult Update(User model)
        {
            if (Session["User"] == null)
                return RedirectToAction("Index", "Login");

            var sessionUser = (User)Session["User"];
            var user = db.Users.Find(sessionUser.Id);

            if (user == null)
                return HttpNotFound();

            user.FullName = model.FullName;
            user.Gender = model.Gender;
            user.Phone = model.Phone;
            user.Email = model.Email;
            user.Day = model.Day;
            user.Month = model.Month;
            user.Year = model.Year;

            db.SaveChanges();

            Session["User"] = user;

            return RedirectToAction("Index");
        }
    }
}
