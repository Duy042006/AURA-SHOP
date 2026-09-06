// ====== SEARCH BOX CONTROL ======
document.addEventListener("DOMContentLoaded", function () {

    const searchIcon = document.getElementById('search-icon');
    const searchBox = document.getElementById('search-box');
    const closeIcon = document.getElementById('close-icon');

    // ✅ Kiểm tra tồn tại để tránh lỗi
    if (!searchIcon || !searchBox || !closeIcon) return;

    // ✅ Khi bấm icon kính lúp
    searchIcon.addEventListener('click', function (e) {
        e.stopPropagation(); // Không cho click lan ra ngoài
        searchBox.classList.add('active');  // Hiện ô tìm kiếm
        searchIcon.style.display = 'none';  // Ẩn icon kính lúp
        searchBox.querySelector('input').focus(); // Auto focus input
    });

    // ✅ Khi bấm icon X
    closeIcon.addEventListener('click', function (e) {
        e.stopPropagation();
        searchBox.classList.remove('active'); // Ẩn ô tìm kiếm
        searchIcon.style.display = 'inline';  // Hiện lại icon kính lúp
    });

    // ✅ Khi bấm ra ngoài (tự động đóng)
    document.addEventListener('click', function (event) {
        if (!searchBox.contains(event.target) && !searchIcon.contains(event.target)) {
            searchBox.classList.remove('active');
            searchIcon.style.display = 'inline';
        }
    });

});


//-----Drowp Menu-------

document.addEventListener("DOMContentLoaded", function () {
    const guBtn = document.querySelector(".gu-btn");
    const submenu = guBtn?.nextElementSibling; // submenu ngay sau GU
    const subDropdowns = submenu?.querySelectorAll(".sub-dropdown");
    const firstMega = submenu?.querySelector(".sub-dropdown .mega-box");

    if (!guBtn || !submenu) return;

    // Khi rê chuột vào "GU" thì mở menu
    guBtn.addEventListener("mouseenter", function () {
        // Đóng các menu khác nếu có
        document.querySelectorAll(".submenu, .mega-box").forEach(el => el.classList.remove("show"));

        submenu.classList.add("show");
        if (firstMega) firstMega.classList.add("show");
    });

    // Khi rê ra ngoài khỏi "GU" thì đóng menu
    const guDropdown = guBtn.closest(".dropdown");
    guDropdown.addEventListener("mouseleave", function () {
        submenu.classList.remove("show");
        document.querySelectorAll(".mega-box").forEach(el => el.classList.remove("show"));
    });

    // Hover từng mục con (GU ĐƠN GIẢN, GU THIẾT KẾ, GU THỂ THAO)
    subDropdowns?.forEach(item => {
        item.addEventListener("mouseenter", () => {
            subDropdowns.forEach(s => s.querySelector(".mega-box").classList.remove("show"));
            item.querySelector(".mega-box").classList.add("show");
        });
    });
});


const buttons = document.querySelectorAll(".options button");
buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
        // Xóa class active ở tất cả nút
        buttons.forEach((b) => b.classList.remove("active"));

        // Thêm class active cho nút vừa click
        btn.classList.add("active");
    });
});
