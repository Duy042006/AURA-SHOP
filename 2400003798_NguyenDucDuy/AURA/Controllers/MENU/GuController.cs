using AURA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace AURA.Controllers
{
    public class GuController : Controller
    {
        // GET: Gu
        AURA_DBContext db = new AURA_DBContext();

        // ============================
        // 1. Danh sách GU
        // ============================
        public ActionResult Index(int page = 1, int pageSize = 24)
        {
            var query = db.SanPhams.OrderBy(x => x.MaSP);

            int totalItems = query.Count();

            var data = query
                        .Skip((page - 1) * pageSize)
                        .Take(pageSize)
                        .ToList();

            var vm = new ViewModelGuIndex
            {
                DanhSachSanPham = data,
                CurrentPage = page,
                PageSize = pageSize,
                TotalItems = totalItems
            };

            return View(vm);
        }

        // ============================
        // 2. Hiển thị TRẠM theo GU
        // ============================
        public ActionResult Tram(int id, int page = 1, int pageSize = 12)
        {
            var gu = db.Gus.Find(id);
            if (gu == null) return HttpNotFound();

            // Lấy danh sách Trạm
            var trams = db.Trams.Where(x => x.GuID == id).ToList();

            // Lấy sản phẩm của GU
            var sanPhamQuery = db.SanPhams.Where(x => x.MaDM == id);

            int totalItems = sanPhamQuery.Count();

            var sanPhamPaging = sanPhamQuery
                                .OrderBy(x => x.MaSP)
                                .Skip((page - 1) * pageSize)
                                .Take(pageSize)
                                .ToList();

            var vm = new ViewModelChiTietGu
            {
                GuID = id,
                TenGu = gu.TenGu,
                MoTaGu = gu.MoTa,
                DanhSachTram = trams,
                DanhSachSanPham = sanPhamPaging,

                CurrentPage = page,
                PageSize = pageSize,
                TotalItems = totalItems
            };

            return View(vm);
        }


        // ============================
        // 3. Hiển thị NHÓM theo TRẠM
        // ============================
        public ActionResult Nhom(int id)
        {
            var tram = db.Trams.Find(id);
            if (tram == null) return HttpNotFound();

            var nhoms = db.NhomSanPhams
              .Where(x => x.TramID == id && x.HinhAnhBanner != null && x.HinhAnhBanner != "")
              .ToList();

            var listNhomID = nhoms.Select(n => n.NhomID).ToList();

            var sanPham = db.SanPhams
                            .Where(x => x.NhomID.HasValue && listNhomID.Contains(x.NhomID.Value))
                            .ToList();

            var vm = new ViewModelTramChiTiet
            {
                TenTram = tram.TenTram,
                MoTaTram = tram.MoTa,
                DanhSachNhom = nhoms,
                DanhSachSanPham = sanPham
            };

            return View(vm);
        }

        // ============================
        // 4. Hiển thị SẢN PHẨM theo NHÓM
        // ============================
        public ActionResult SanPhamTheoNhom(int id, string mau = "", int gia = 0)
        {
            var nhom = db.NhomSanPhams.Find(id);
            if (nhom == null)
                return HttpNotFound();

            var sanPham = db.SanPhams.Where(x => x.NhomID == id);

            // Lọc màu
            if (!string.IsNullOrEmpty(mau))
                sanPham = sanPham.Where(x => x.MauSac.Contains(mau));

            // Lọc giá
            switch (gia)
            {
                case 1: sanPham = sanPham.Where(x => x.Gia < 100000); break;
                case 2: sanPham = sanPham.Where(x => x.Gia >= 100000 && x.Gia <= 200000); break;
                case 3: sanPham = sanPham.Where(x => x.Gia >= 200000 && x.Gia <= 300000); break;
                case 4: sanPham = sanPham.Where(x => x.Gia > 300000); break;
            }

            var vm = new ViewModelSanPhamTheoNhom
            {
                NhomID = nhom.NhomID,
                TenNhom = nhom.TenNhom,
                Banner = nhom.HinhAnhBanner,
                TieuDe = nhom.TieuDe,
                NoiDung = nhom.NoiDung,
                DanhSachSanPham = sanPham.ToList()
            };

            return View(vm);
        }


    }
}