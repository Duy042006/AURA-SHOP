document.addEventListener("DOMContentLoaded", function () {

    // =============================
    // MỞ / ĐÓNG MENU FILTER
    // =============================
    document.querySelectorAll(".filter-trigger").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            this.nextElementSibling.classList.toggle("active");
        });
    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".filter-menu.active").forEach(menu => {
            menu.classList.remove("active");
        });
    });

    // =============================
    // FILTER REALTIME JS (MÀU + GIÁ)
    // =============================

    const products = document.querySelectorAll(".product");

    let selectedColor = null;
    let selectedPrice = null;


    function applyFilters() {

        products.forEach(p => {
            let pColor = p.dataset.color.toLowerCase();
            let pGia = parseInt(p.dataset.gia);

            let show = true;

            // ----------- Lọc màu -----------
            if (selectedColor) {
                if (!pColor.includes(selectedColor)) {
                    show = false;
                }
            }

            // ----------- Lọc giá -----------
            if (selectedPrice) {

                if (selectedPrice === 100 && !(pGia < 100000)) show = false;
                if (selectedPrice === 200 && !(pGia >= 100000 && pGia <= 200000)) show = false;
                if (selectedPrice === 300 && !(pGia >= 200000 && pGia <= 300000)) show = false;
                if (selectedPrice === 400 && !(pGia > 300000)) show = false;
            }

            // Hiện / Ẩn
            p.style.display = show ? "block" : "none";
        });
    }



    // =============================
    // CHỌN LỌC MÀU
    // =============================
    document.querySelectorAll(".color-filter li").forEach(item => {
        item.addEventListener("click", () => {
            selectedColor = item.dataset.color.toLowerCase();
            applyFilters();
        });
    });


    // =============================
    // CHỌN LỌC GIÁ
    // =============================
    document.querySelectorAll(".price-filter li").forEach(item => {
        item.addEventListener("click", () => {
            selectedPrice = parseInt(item.dataset.price);
            applyFilters();
        });
    });

});
