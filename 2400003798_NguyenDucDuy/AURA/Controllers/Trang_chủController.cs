using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication2.Models;

namespace WebApplication2.Controllers
{
    public class TrangchuController : Controller
    {
        private readonly SanPhamContext _context = new SanPhamContext();

        public ActionResult Index()
        {
            // Lấy 4 sản phẩm trên
            var sanPhams = _context.SanPhams.Take(4).ToList();

            // Lấy 6 ảnh dưới (gallery)
            var gallery = _context.BoSuuTapAnhs.Take(6).ToList();

            // Tạo view model để truyền ra view
            var viewModel = new TrangChuViewModel
            {
                SanPhams = sanPhams,
                Gallery = gallery
            };

            // Truyền model ra view
            return View(viewModel);
        }
    }
}
