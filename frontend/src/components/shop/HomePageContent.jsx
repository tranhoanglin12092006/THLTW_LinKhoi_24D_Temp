"use client";
// Báo cho Next.js biết đây là Client Component.
// Vì component này sử dụng useEffect và window nên phải chạy ở phía trình duyệt.

import { useEffect } from "react";
// Import useEffect từ React.
// useEffect cho phép chạy JavaScript sau khi component đã được render trên trình duyệt.

export default function HomePageContent() {
    // Tạo component HomePageContent.
    // export default để component này có thể được import ở file khác.

    useEffect(() => {
        // useEffect sẽ chạy sau khi component được render xong.
        // Đây là nơi chúng ta lấy dữ liệu từ JavaScript cũ và đưa vào HTML.

        const data = window.TECHNOVA_DATA;
        // Lấy dữ liệu sản phẩm, tin tức... từ biến toàn cục TECHNOVA_DATA.
        // Biến này phải được tạo trước đó trong file /public/js/data.js.
        //
        // Ví dụ:
        // window.TECHNOVA_DATA = {
        //     products: [...],
        //     news: [...]
        // };

        const renderProductCard = window.renderProductCard;
        // Lấy hàm renderProductCard từ window.
        // Hàm này có nhiệm vụ biến một sản phẩm thành một đoạn HTML card sản phẩm.
        //
        // Ví dụ:
        // product => `<div>...</div>`

        if (!data || typeof renderProductCard !== "function") return;
        // Kiểm tra xem dữ liệu và hàm render sản phẩm có tồn tại hay không.
        //
        // Nếu:
        // - data không tồn tại
        // hoặc
        // - renderProductCard không phải là function
        //
        // thì dừng useEffect bằng return.
        //
        // Mục đích: tránh lỗi JavaScript khi data.js chưa load.

        const renderProducts = (id, products) => {
            // Tạo một function dùng chung để render danh sách sản phẩm.
            //
            // id:
            //    ID của thẻ HTML muốn chứa sản phẩm.
            //
            // products:
            //    Mảng sản phẩm cần hiển thị.

            const container = document.getElementById(id);
            // Tìm phần tử HTML dựa vào id.
            //
            // Ví dụ:
            // <div id="flash-sale-grid"></div>
            //
            // document.getElementById("flash-sale-grid")
            // sẽ lấy được thẻ div này.

            if (container) {
                // Kiểm tra xem container có tồn tại hay không.

                container.innerHTML = products.map(renderProductCard).join("");
                // Chuyển toàn bộ sản phẩm thành HTML.
                //
                // products.map(renderProductCard)
                // sẽ chạy renderProductCard cho từng sản phẩm.
                //
                // Ví dụ:
                // [
                //   product1,
                //   product2,
                //   product3
                // ]
                //
                // trở thành:
                // [
                //   "<div>Product 1</div>",
                //   "<div>Product 2</div>",
                //   "<div>Product 3</div>"
                // ]
                //
                // join("")
                // ghép các chuỗi HTML thành một chuỗi duy nhất.
                //
                // Sau đó innerHTML đưa HTML đó vào container.
            }
        };

        renderProducts(
            // Gọi function renderProducts.

            "flash-sale-grid",
            // ID của khu vực hiển thị sản phẩm Flash Sale.

            data.products.filter((product) => product.isSale).slice(0, 4),
            // Lấy danh sách sản phẩm từ data.products.
            //
            // filter((product) => product.isSale)
            // chỉ lấy sản phẩm có isSale = true.
            //
            // slice(0, 4)
            // chỉ lấy 4 sản phẩm đầu tiên.
        );

        renderProducts(
            // Render tiếp danh sách sản phẩm mới.

            "new-products-grid",
            // ID của khu vực sản phẩm mới.

            data.products.filter((product) => product.isNew).slice(0, 8),
            // Chỉ lấy sản phẩm có isNew = true.
            // Sau đó chỉ lấy tối đa 8 sản phẩm.
        );

        renderProducts(
            // Render tiếp danh sách sản phẩm hot.

            "hot-products-grid",
            // ID của khu vực sản phẩm hot.

            data.products.filter((product) => product.isHot).slice(0, 8),
            // Chỉ lấy sản phẩm có isHot = true.
            // Sau đó lấy tối đa 8 sản phẩm.
        );

        const newsContainer = document.getElementById("home-news-grid");
        // Tìm khu vực HTML dùng để hiển thị tin tức trên trang Home.
        //
        // Ví dụ:
        // <div id="home-news-grid"></div>

        if (newsContainer) {
            // Kiểm tra xem khu vực tin tức có tồn tại hay không.

            newsContainer.innerHTML = data.news.slice(0, 3).map((article) => `
                // Lấy 3 bài viết đầu tiên từ data.news.
                //
                // map() chạy qua từng bài viết.
                //
                // Mỗi article sẽ được biến thành một đoạn HTML.
                
                <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                    // Card chứa một bài viết.
                    // Tailwind CSS dùng để tạo giao diện.

                    <div class="aspect-[16/10] overflow-hidden relative">
                        // Khu vực hình ảnh bài viết.
                        // aspect-[16/10] tạo tỷ lệ khung hình 16:10.

                        <img
                            src="${article.image}"
                            alt="${article.title}"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        >
                        // Hiển thị hình ảnh bài viết.
                        //
                        // ${article.image}
                        // lấy đường dẫn hình ảnh từ dữ liệu.
                        //
                        // ${article.title}
                        // lấy tiêu đề làm alt cho ảnh.

                        <span class="absolute top-3 left-3 px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold rounded-lg">
                            ${article.category}
                        </span>
                        // Hiển thị danh mục của bài viết.
                        //
                        // Ví dụ:
                        // Công nghệ
                        // Laptop
                        // Smartphone
                    </div>

                    <div class="p-5 flex-1 flex flex-col justify-between">
                        // Phần nội dung của bài viết.

                        <div>
                            <div class="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                                <span>${article.date}</span>
                                // Ngày đăng bài.

                                <span>•</span>
                                // Dấu chấm ngăn cách.

                                <span>${article.readTime}</span>
                                // Thời gian đọc bài.
                            </div>

                            <h3 class="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                // Tiêu đề bài viết.

                                <a href="news-detail.html?id=${article.id}">
                                    ${article.title}
                                </a>
                                // Link tới trang chi tiết bài viết.
                                //
                                // article.id được đưa vào URL.
                                //
                                // Ví dụ:
                                // news-detail.html?id=5
                            </h3>

                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                ${article.description}
                            </p>
                            // Hiển thị mô tả ngắn của bài viết.
                        </div>

                        <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            // Phần cuối của card.
                            // Có đường viền phía trên.

                            <span class="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                Bởi ${article.author}
                            </span>
                            // Hiển thị tên tác giả.

                            <a
                                href="news-detail.html?id=${article.id}"
                                class="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                            >
                                Đọc tiếp &rarr;
                            </a>
                            // Link đọc tiếp bài viết.
                        </div>
                    </div>
                </div>
            `).join("");
            // map() tạo HTML cho từng bài viết.
            //
            // join("")
            // ghép tất cả HTML lại thành một chuỗi.
            //
            // innerHTML
            // đưa chuỗi HTML vào #home-news-grid.
        }

        window.lucide?.createIcons();
        // Gọi thư viện Lucide để chuyển các icon thành SVG.
        //
        // Dấu ?. gọi là Optional Chaining.
        //
        // Nếu window.lucide tồn tại:
        //     gọi createIcons()
        //
        // Nếu window.lucide chưa tồn tại:
        //     không bị crash.

        window.updateWishlistUI?.();
        // Gọi function updateWishlistUI nếu function này tồn tại.
        //
        // Function này thường dùng để cập nhật giao diện
        // nút yêu thích / wishlist.

    }, []);
    // [] nghĩa là useEffect chỉ chạy một lần sau lần render đầu tiên.
    //
    // Component mount
    //      ↓
    // useEffect chạy
    //      ↓
    // Lấy data
    //      ↓
    // Render sản phẩm + tin tức

    return null;
    // Component này không tự tạo HTML bằng JSX.
    //
    // Nó chỉ dùng JavaScript để tìm các container có sẵn
    // trong DOM và đưa HTML vào đó.
}