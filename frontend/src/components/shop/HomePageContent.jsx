
"use client";

// useEffect dùng để chạy JavaScript
// sau khi giao diện React đã được render.
import { useEffect } from "react";


export default function HomePageContent() {

    // useEffect sẽ chạy sau khi component xuất hiện trên trang.
    useEffect(() => {

        // Biến này dùng để kiểm tra component còn tồn tại hay không.
        //
        // false = component vẫn đang hoạt động.
        // true  = component đã bị rời khỏi trang.
        let cancelled = false;


        // =====================================================
        // HÀM LẤY DỮ LIỆU VÀ HIỂN THỊ SẢN PHẨM
        // =====================================================

        const mountLegacyShopData = () => {

            // Nếu component đã bị hủy
            // thì không làm gì nữa.
            if (cancelled) return;


            // =================================================
            // 1. LẤY DỮ LIỆU TỪ FILE data.js
            // =================================================

            // TECHNOVA_DATA được khai báo trong file data.js.
            //
            // Ví dụ:
            //
            // window.TECHNOVA_DATA = {
            //     products: [...],
            //     news: [...]
            // }
            //
            // Ở đây chúng ta lấy toàn bộ dữ liệu.
            const data = window.TECHNOVA_DATA;


            // Lấy hàm renderProductCard().
            //
            // Hàm này thường nằm trong main.js.
            //
            // Nó có nhiệm vụ:
            //
            // product
            //    ↓
            // HTML của product card
            //
            const renderProductCard =
                window.renderProductCard;


            // =================================================
            // 2. KIỂM TRA DATA ĐÃ LOAD CHƯA
            // =================================================

            // Nếu chưa có data
            // hoặc renderProductCard chưa tồn tại
            // thì chờ 150ms rồi thử lại.
            if (
                !data ||
                typeof renderProductCard !== "function"
            ) {

                window.setTimeout(
                    mountLegacyShopData,
                    150
                );

                return;
            }


            // =================================================
            // 3. HÀM DÙNG ĐỂ HIỂN THỊ DANH SÁCH SẢN PHẨM
            // =================================================

            // id:
            // ID của thẻ HTML muốn hiển thị sản phẩm.
            //
            // products:
            // Danh sách sản phẩm cần hiển thị.
            const renderProductsList = (id, products) => {

                // Nếu component đã bị hủy
                // thì dừng lại.
                if (cancelled) return;


                // Tìm phần tử HTML theo ID.
                //
                // Ví dụ:
                //
                // <div id="new-products-grid"></div>
                //
                // document.getElementById()
                // sẽ tìm thẻ div này.
                const container =
                    document.getElementById(id);


                // Nếu không tìm thấy container
                // hoặc products không phải là mảng
                // thì không làm gì.
                if (
                    !container ||
                    !Array.isArray(products)
                ) {
                    return;
                }


                // =================================================
                // 4. BIẾN PRODUCT THÀNH HTML
                // =================================================

                // products.map(renderProductCard)
                //
                // Có thể hiểu đơn giản:
                //
                // Sản phẩm 1 → renderProductCard()
                // Sản phẩm 2 → renderProductCard()
                // Sản phẩm 3 → renderProductCard()
                //
                // Sau đó .join("")
                // nối tất cả HTML lại thành một chuỗi.
                //
                // Cuối cùng đưa HTML vào container.
                container.innerHTML =
                    products
                        .map(renderProductCard)
                        .join("");
            };


            // =================================================
            // 5. HIỂN THỊ SẢN PHẨM FLASH SALE
            // =================================================

            // Lấy tất cả sản phẩm
            // có isSale = true.
            //
            // slice(0, 4)
            // chỉ lấy 4 sản phẩm đầu tiên.
            renderProductsList(
                "flash-sale-grid",

                data.products
                    .filter((product) => product.isSale)
                    .slice(0, 4)
            );


            // =================================================
            // 6. HIỂN THỊ SẢN PHẨM MỚI
            // =================================================

            // Lấy sản phẩm có isNew = true.
            //
            // Chỉ lấy 8 sản phẩm đầu tiên.
            renderProductsList(
                "new-products-grid",

                data.products
                    .filter((product) => product.isNew)
                    .slice(0, 8)
            );


            // =================================================
            // 7. HIỂN THỊ SẢN PHẨM HOT
            // =================================================

            // Lấy sản phẩm có isHot = true.
            //
            // Chỉ lấy 8 sản phẩm đầu tiên.
            renderProductsList(
                "hot-products-grid",

                data.products
                    .filter((product) => product.isHot)
                    .slice(0, 8)
            );


            // =================================================
            // 8. TÌM KHU VỰC HIỂN THỊ BÀI VIẾT
            // =================================================

            // Ví dụ HTML:
            //
            // <div id="home-news-grid"></div>
            //
            // Chúng ta tìm thẻ div đó.
            const newsContainer =
                document.getElementById("home-news-grid");


            // Kiểm tra:
            //
            // 1. Có tìm thấy khu vực tin tức không?
            // 2. data.news có phải mảng không?
            if (
                newsContainer &&
                Array.isArray(data.news)
            ) {


                // =================================================
                // 9. LẤY 3 BÀI VIẾT ĐẦU TIÊN
                // =================================================

                // data.news
                //     ↓
                // slice(0, 3)
                //     ↓
                // lấy 3 bài đầu tiên
                //
                // map()
                //     ↓
                // biến từng bài viết thành HTML
                //
                // join("")
                //     ↓
                // nối tất cả HTML lại.
                newsContainer.innerHTML =
                    data.news
                        .slice(0, 3)
                        .map((article) => `

                            <!-- ========================= -->
                            <!-- CARD BÀI VIẾT -->
                            <!-- ========================= -->

                            <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">

                                <!-- Hình ảnh -->
                                <div class="aspect-[16/10] overflow-hidden relative">

                                    <img
                                        src="${article.image}"
                                        alt="${article.title}"
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    >

                                    <!-- Danh mục -->
                                    <span class="absolute top-3 left-3 px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold rounded-lg">
                                        ${article.category}
                                    </span>

                                </div>


                                <!-- Nội dung bài viết -->
                                <div class="p-5 flex-1 flex flex-col justify-between">

                                    <div>

                                        <!-- Ngày + thời gian đọc -->
                                        <div class="flex items-center gap-2 text-[11px] text-slate-400 mb-2">

                                            <span>
                                                ${article.date}
                                            </span>

                                            <span>•</span>

                                            <span>
                                                ${article.readTime}
                                            </span>

                                        </div>


                                        <!-- Tiêu đề -->
                                        <h3 class="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">

                                            <a
                                                href="news-detail.html?id=${article.id}"
                                            >
                                                ${article.title}
                                            </a>

                                        </h3>


                                        <!-- Mô tả -->
                                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                            ${article.description}
                                        </p>

                                    </div>


                                    <!-- Footer của card -->
                                    <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">

                                        <!-- Tác giả -->
                                        <span class="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                            Bởi ${article.author}
                                        </span>


                                        <!-- Link đọc tiếp -->
                                        <a
                                            href="news-detail.html?id=${article.id}"
                                            class="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                                        >
                                            Đọc tiếp &rarr;
                                        </a>

                                    </div>

                                </div>

                            </div>

                        `)
                        .join("");
            }


            // =================================================
            // 10. KHỞI TẠO ICON LUCIDE
            // =================================================

            // Sau khi chúng ta dùng innerHTML
            // để thêm HTML mới vào trang,
            // cần gọi lại createIcons()
            // để Lucide nhận diện các icon mới.
            window.lucide?.createIcons();


            // =================================================
            // 11. CẬP NHẬT WISHLIST
            // =================================================

            // Nếu hàm updateWishlistUI tồn tại
            // thì gọi nó.
            //
            // Hàm này có thể dùng để:
            // - kiểm tra sản phẩm yêu thích
            // - đổi trạng thái icon tim
            // - cập nhật wishlist
            window.updateWishlistUI?.();
        };


        // =====================================================
        // 12. CHẠY HÀM
        // =====================================================

        // Bắt đầu lấy dữ liệu và hiển thị sản phẩm.
        mountLegacyShopData();


        // =====================================================
        // 13. CLEANUP
        // =====================================================

        // Khi rời khỏi trang,
        // React sẽ chạy đoạn này.
        return () => {

            // Đánh dấu component đã bị hủy.
            //
            // Nếu lúc này setTimeout()
            // đang chờ chạy lại mountLegacyShopData()
            // thì lần chạy sau sẽ bị:
            //
            // if (cancelled) return;
            //
            // chặn lại.
            cancelled = true;
        };


        // [] nghĩa là useEffect chỉ chạy một lần
        // sau khi component được mount.
    }, []);


    // =====================================================
    // COMPONENT NÀY KHÔNG TẠO HTML
    // =====================================================

    // Vì sản phẩm và tin tức được thêm trực tiếp
    // vào DOM bằng JavaScript:
    //
    // document.getElementById()
    // container.innerHTML
    //
    // nên component này không cần return giao diện.
    return null;
}

