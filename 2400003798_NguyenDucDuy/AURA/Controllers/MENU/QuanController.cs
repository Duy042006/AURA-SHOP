using AURA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AURA.Controllers
{
    public class QuanController : Controller
    {
        AURA_DBContext db = new AURA_DBContext();

        // ================================
        // 1) MENU QUẦN – load toàn bộ sản phẩm
        // ================================
        public ActionResult QuanMenu(int page = 1, int pageSize = 20)
        {
            var all = db.SanPhamQuans.OrderBy(x => x.MaSP);

            int totalItems = all.Count();

            var sanPhamPaging = all
                                .Skip((page - 1) * pageSize)
                                .Take(pageSize)
                                .ToList();

            var vm = new ViewModelQuan
            {
                DSSanPham = sanPhamPaging,
                CurrentPage = page,
                PageSize = pageSize,
                TotalItems = totalItems
            };

            return View(vm);
        }

        // ================================
        // 2) DANH MỤC CẤP 2 – theo MaDMCha
        // ================================
        public ActionResult DanhMucQuan(int id, int page = 1, int pageSize = 12)
        {
            var cap1 = db.Quans.Find(id);
            if (cap1 == null) return HttpNotFound();

            var cap2 = db.DanhMucQuans
                         .Where(x => x.MaDMCha == id)
                         .ToList();

            var listDM = cap2.Select(x => x.MaDM).ToList();

            var sanPham = db.SanPhamQuans
                            .Where(x => x.MaDM.HasValue && listDM.Contains(x.MaDM.Value));

            int totalItems = sanPham.Count();

            var sanPhamPaging = sanPham
                                .OrderBy(x => x.MaSP)
                                .Skip((page - 1) * pageSize)
                                .Take(pageSize)
                                .ToList();

            var vm = new ViewModelQuan
            {
                DMCha = cap1,
                DSMuc = cap2,
                DSSanPham = sanPhamPaging,
                CurrentPage = page,
                PageSize = pageSize,
                TotalItems = totalItems
            };

            return View(vm);
        }

        // ================================
        // 3) SẢN PHẨM THEO DANH MỤC (CẤP 3)
        // ================================
        public ActionResult SanPhamQuan(int id, string mau, int? gia)
        {
            var dm = db.DanhMucQuans.Find(id);
            if (dm == null)
                return HttpNotFound();

            var sanPham = db.SanPhamQuans.Where(x => x.MaDM == id);

            // Lọc theo màu
            if (!string.IsNullOrEmpty(mau))
                sanPham = sanPham.Where(x => x.MauSac.Contains(mau));

            // Lọc theo giá
            switch (gia)
            {
                case 1: sanPham = sanPham.Where(x => x.Gia < 100000); break;
                case 2: sanPham = sanPham.Where(x => x.Gia >= 100000 && x.Gia <= 200000); break;
                case 3: sanPham = sanPham.Where(x => x.Gia >= 200000 && x.Gia <= 300000); break;
                case 4: sanPham = sanPham.Where(x => x.Gia > 300000); break;
            }

            var vm = new ViewModelSanPhamTheoDanhMucQuan
            {
                MaDM = dm.MaDM,
                TenDM = dm.TenDM,
                Banner = dm.Banner,
                DanhSachSanPham = sanPham.ToList()
            };  

            return View(vm);
        }
    }
}   