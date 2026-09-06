using AURA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AURA.Controllers
{
    public class AoController : Controller
    {
        // GET: Ao
        AURA_DBContext db = new AURA_DBContext();

        // Menu 3 cấp
        public ActionResult AoMenu(int page = 1, int pageSize = 20)
        {
            var all = db.SanPhamAos.OrderBy(x => x.MaSP);

            int totalItems = all.Count();

            var sanPhamPaging = all
                                .Skip((page - 1) * pageSize)
                                .Take(pageSize)
                                .ToList();

            var vm = new ViewModelAo
            {
                DSSanPham = sanPhamPaging,
                CurrentPage = page,
                PageSize = pageSize,
                TotalItems = totalItems
            };

            return View(vm);
        }



        // Load danh mục cấp 2 theo MaDMCha
        public ActionResult DanhMuc(int id, int page = 1, int pageSize = 12)
        {
            var cap1 = db.Aos.Find(id);
            if (cap1 == null) return HttpNotFound();

            var cap2 = db.DanhMucAos
                        .Where(x => x.MaDMCha == id)
                        .ToList();

            var listDM = cap2.Select(x => x.MaDM).ToList();

            var sanPham = db.SanPhamAos
                            .Where(x => x.MaDM.HasValue && listDM.Contains(x.MaDM.Value));

            // Tổng số sản phẩm
            int totalItems = sanPham.Count();

            // Phân trang
            var sanPhamPaging = sanPham
                                .OrderBy(x => x.MaSP)
                                .Skip((page - 1) * pageSize)
                                .Take(pageSize)
                                .ToList();

            var vm = new ViewModelAo
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



        // Load sản phẩm theo MaDM (cấp 3)
        public ActionResult SanPham(int id, string mau, int? gia)
        {
            // Lấy danh mục cấp 2
            var dm = db.DanhMucAos.Find(id);
            if (dm == null)
                return HttpNotFound();

            // Lấy toàn bộ sản phẩm thuộc danh mục này (cấp 3)
            var sanPham = db.SanPhamAos.Where(x => x.MaDM == id);

            // Lọc MÀU
            if (!string.IsNullOrEmpty(mau))
                sanPham = sanPham.Where(x => x.MauSac.Contains(mau));

            // Lọc GIÁ
            switch (gia)
            {
                case 1:
                    sanPham = sanPham.Where(x => x.Gia < 100000);
                    break;
                case 2:
                    sanPham = sanPham.Where(x => x.Gia >= 100000 && x.Gia <= 200000);
                    break;
                case 3:
                    sanPham = sanPham.Where(x => x.Gia >= 200000 && x.Gia <= 300000);
                    break;
                case 4:
                    sanPham = sanPham.Where(x => x.Gia > 300000);
                    break;
            }

            // GỬI QUA VIEWMODEL
            var vm = new ViewModelSanPhamTheoDanhMucAo
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