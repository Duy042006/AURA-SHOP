using AURA.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AURA.Controllers
{
    public class GioHangController : Controller
    {
        AURA_DBContext db = new AURA_DBContext();

        // ==============================
        // ✅ LẤY GIỎ HÀNG
        // ==============================
        private List<GioHangItem> LayGioHang()
        {
            var gio = Session["GioHang"] as List<GioHangItem>;
            if (gio == null)
            {
                gio = new List<GioHangItem>();
                Session["GioHang"] = gio;
            }
            return gio;
        }

        // ==============================
        // ✅ TRANG GIỎ HÀNG
        // ==============================
        public ActionResult Index()
        {
            return View(LayGioHang());
        }

        // ==============================
        // ✅ THÊM VÀO GIỎ
        // ==============================
        [HttpPost]
        public ActionResult ThemGioHang(int maSP, string loaiSP)
        {
            if (string.IsNullOrEmpty(loaiSP))
                return RedirectToAction("Index", "TrangChu");

            GioHangItem item = null;

            if (loaiSP == "TrangChu")
            {
                var sp = db.SanPhams.FirstOrDefault(x => x.MaSP == maSP);
                if (sp == null) return RedirectToAction("Index", "TrangChu");

                item = new GioHangItem
                {
                    MaSP = sp.MaSP,
                    LoaiSP = "TrangChu",
                    TenSP = sp.TenSP,
                    HinhAnh = sp.HinhAnh,
                    Gia = sp.Gia ?? 0,
                    SoLuong = 1
                };
            }
            else if (loaiSP == "Ao")
            {
                var sp = db.SanPhamAos.FirstOrDefault(x => x.MaSP == maSP);
                if (sp == null) return RedirectToAction("Index", "Ao");

                item = new GioHangItem
                {
                    MaSP = sp.MaSP,
                    LoaiSP = "Ao",
                    TenSP = sp.TenSP,
                    HinhAnh = sp.HinhAnh,
                    Gia = sp.Gia ?? 0,
                    SoLuong = 1
                };
            }
            else if (loaiSP == "Quan")
            {
                var sp = db.SanPhamQuans.FirstOrDefault(x => x.MaSP == maSP);
                if (sp == null) return RedirectToAction("Index", "Quan");

                item = new GioHangItem
                {
                    MaSP = sp.MaSP,
                    LoaiSP = "Quan",
                    TenSP = sp.TenSP,
                    HinhAnh = sp.HinhAnh,
                    Gia = sp.Gia ?? 0,
                    SoLuong = 1
                };
            }
            else if (loaiSP == "PhuKien")
            {
                var sp = db.SanPhamPhuKiens.FirstOrDefault(x => x.MaSP == maSP);
                if (sp == null) return RedirectToAction("Index", "PhuKien");

                item = new GioHangItem
                {
                    MaSP = sp.MaSP,
                    LoaiSP = "PhuKien",
                    TenSP = sp.TenSP,
                    HinhAnh = sp.HinhAnh,
                    Gia = sp.Gia ?? 0,
                    SoLuong = 1
                };
            }

            if (item == null)
                return RedirectToAction("Index", "TrangChu");

            var gio = LayGioHang();
            var tonTai = gio.FirstOrDefault(x => x.MaSP == maSP && x.LoaiSP == loaiSP);

            if (tonTai != null)
                tonTai.SoLuong++;
            else
                gio.Add(item);

            return RedirectToAction("Index");
        }

        // ==============================
        // ✅ XÓA SẢN PHẨM
        // ==============================
        public ActionResult Xoa(int maSP, string loaiSP)
        {
            var gio = LayGioHang();
            var item = gio.FirstOrDefault(x => x.MaSP == maSP && x.LoaiSP == loaiSP);
            if (item != null)
                gio.Remove(item);

            return RedirectToAction("Index");
        }

        // ==============================
        // ✅ CẬP NHẬT SỐ LƯỢNG (KHÔNG BỊ 404 NỮA)
        // ==============================
        [HttpPost]
        public ActionResult CapNhat(int maSP, string loaiSP, int soLuong)
        {
            var gio = LayGioHang();
            var item = gio.FirstOrDefault(x => x.MaSP == maSP && x.LoaiSP == loaiSP);

            if (item != null)
            {
                if (soLuong <= 0)
                    gio.Remove(item);
                else
                    item.SoLuong = soLuong;
            }

            return RedirectToAction("Index");
        }

        // ==============================
        // ✅ MUA NGAY
        // ==============================
        [HttpPost]
        public ActionResult MuaNgay(int maSP, string loaiSP)
        {
            var sp = db.View_SanPhamTong.FirstOrDefault(x => x.MaSP == maSP && x.LoaiSP == loaiSP);
            if (sp == null)
                return RedirectToAction("Index", "TrangChu");

            var gio = LayGioHang();
            var tonTai = gio.FirstOrDefault(x => x.MaSP == maSP && x.LoaiSP == loaiSP);

            if (tonTai != null)
                tonTai.SoLuong++;
            else
                gio.Add(new GioHangItem
                {
                    MaSP = sp.MaSP,
                    LoaiSP = sp.LoaiSP,
                    TenSP = sp.TenSP,
                    HinhAnh = sp.HinhAnh,
                    Gia = sp.Gia ?? 0,
                    SoLuong = 1
                });

            Session["GioHang"] = gio;
            return RedirectToAction("ThanhToan");
        }

        // ==============================
        // ✅ GET: THANH TOÁN
        // LẦN 1: TRỐNG — LẦN 2: ĐỌC COOKIE
        // ==============================
        [HttpGet]
        public ActionResult ThanhToan()
        {
            var gio = LayGioHang();
            if (gio == null || !gio.Any())
                return RedirectToAction("Index");

            var model = new DonHangViewModel
            {
                GioHang = gio
            };

            // ✅ CHỈ ĐỌC COOKIE KHI ĐÃ TỪNG ĐẶT HÀNG
            if (Request.Cookies["DaDatHang"] != null)
            {
                if (Request.Cookies["HoTen"] != null)
                    model.HoTen = Request.Cookies["HoTen"].Value;

                if (Request.Cookies["DienThoai"] != null)
                    model.DienThoai = Request.Cookies["DienThoai"].Value;

                if (Request.Cookies["DiaChi"] != null)
                    model.DiaChi = Request.Cookies["DiaChi"].Value;
            }

            return View(model);
        }

        // ==============================
        // ✅ POST: THANH TOÁN
        // ==============================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ThanhToan(DonHangViewModel model)
        {
            var gio = LayGioHang();
            if (gio == null || !gio.Any())
                return RedirectToAction("Index");

            // ==========================
            // TÍNH TỔNG TIỀN
            // ==========================
            decimal tongTien = gio.Sum(x => x.ThanhTien);

            // ✅ NẾU ĐÃ ĐĂNG NHẬP → GIẢM 10%
            if (Session["User"] != null)
            {
                tongTien = tongTien * 0.9m; // giảm 10%
            }

            // ==========================
            // LƯU ĐƠN HÀNG
            // ==========================
            var order = new Order
            {
                UserId = Session["UserId"] != null ? (int?)Session["UserId"] : null,
                OrderDate = DateTime.Now,
                TotalAmount = (int)tongTien,
                Status = "Đang xử lý"
            };

            db.Orders.Add(order);
            db.SaveChanges();

            // ==========================
            // LƯU CHI TIẾT ĐƠN HÀNG
            // ==========================
            foreach (var item in gio)
            {
                var product = db.Products.FirstOrDefault(x => x.Name == item.TenSP);

                if (product == null)
                {
                    product = new Product
                    {
                        Name = item.TenSP,
                        Price = item.Gia,
                        Image = item.HinhAnh,
                        Stock = 999,
                        Description = "Tự động tạo từ giỏ hàng"
                    };

                    db.Products.Add(product);
                    db.SaveChanges();
                }

                var ct = new OrderDetail
                {
                    OrderID = order.OrderID,
                    ProductID = product.ProductID,
                    Quantity = item.SoLuong,
                    Price = item.Gia
                };

                db.OrderDetails.Add(ct);
            }

            db.SaveChanges();

            // ==========================
            // LƯU COOKIE THÔNG TIN KH
            // ==========================
            Response.Cookies["HoTen"].Value = model.HoTen;
            Response.Cookies["DienThoai"].Value = model.DienThoai;
            Response.Cookies["DiaChi"].Value = model.DiaChi;
            Response.Cookies["DaDatHang"].Value = "1";

            Response.Cookies["HoTen"].Expires = DateTime.Now.AddDays(30);
            Response.Cookies["DienThoai"].Expires = DateTime.Now.AddDays(30);
            Response.Cookies["DiaChi"].Expires = DateTime.Now.AddDays(30);
            Response.Cookies["DaDatHang"].Expires = DateTime.Now.AddDays(30);

            // ==========================
            // HOÀN TẤT
            // ==========================
            TempData["GioCu"] = gio;
            TempData["ThongTinKH"] = model;
            Session["GioHang"] = null;

            return RedirectToAction("HoanTat");
        }


        // ==============================
        // ✅ HOÀN TẤT
        // ==============================
        public ActionResult HoanTat()
        {
            var gioCu = TempData["GioCu"] as List<GioHangItem>;
            var thongTin = TempData["ThongTinKH"] as DonHangViewModel;

            if (gioCu == null)
                return RedirectToAction("Index", "TrangChu");

            ViewBag.ThongTin = thongTin;
            return View(gioCu);
        }
    }
}
