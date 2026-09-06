using AURA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AURA.Controllers
{

    public class OrderController : Controller
    {
        AURA_DBContext db = new AURA_DBContext();

        public ActionResult Index()
        {
            var orders = db.Orders.ToList();
            return View(orders);
        }

        public ActionResult Detail(int id)
        {
            var order = db.Orders.Find(id);

            var items = db.OrderDetails
                          .Where(i => i.OrderID == id)
                          .ToList();

            ViewBag.Items = items;
            return View(order);
        }

        public ActionResult Cancel(int id)
        {
            var order = db.Orders.Find(id);
            order.Status = "Canceled";
            db.SaveChanges();

            return RedirectToAction("Index");
        }
    }

}