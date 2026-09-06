document.querySelectorAll(".see-more").forEach(btn => {

    btn.addEventListener("click", function (e) {
        e.preventDefault();

        // gallery chứa nút đang bấm
        const gallery = btn.closest(".gallery");

        // toàn bộ ảnh trong gallery đó
        const items = gallery.querySelectorAll(".img-item");

        const isExpanded = btn.textContent.trim() === "Thu gọn";

        if (!isExpanded) {
            // Mở rộng → hiện hết ảnh
            items.forEach(item => item.classList.remove("hidden"));
            btn.textContent = "Thu gọn";
        } else {
            // Thu gọn → ẩn ảnh từ số 7 trở đi
            items.forEach((item, index) => {
                if (index >= 7) item.classList.add("hidden");
            });
            btn.textContent = "Xem thêm";
        }
    });

});



// Xử lý popup sản phẩm
const popupOverlay = document.querySelector(".popup-overlay");
const popupImg = document.getElementById("popup-main-img");
const popupProductImg = document.getElementById("popup-product-img");
const popupName = document.getElementById("popup-name");
const popupPrice = document.getElementById("popup-price");
const popupOldPrice = document.getElementById("popup-old-price");
const closePopup = document.querySelector(".close-popup");

document.querySelectorAll(".shop-look").forEach(img => {
    img.addEventListener("click", () => {
        const data = JSON.parse(img.dataset.product);
        popupImg.src = img.src;
        popupProductImg.src = data.image;
        popupName.textContent = data.name;
        popupPrice.textContent = data.price;
        popupOldPrice.textContent = data.oldPrice;
        popupOverlay.style.display = "flex";
    });
});

closePopup.addEventListener("click", () => popupOverlay.style.display = "none");
popupOverlay.addEventListener("click", e => {
    if (e.target === popupOverlay) popupOverlay.style.display = "none";
});
