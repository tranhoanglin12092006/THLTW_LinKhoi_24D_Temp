/**
 * TECHNOVA STORE - MAIN INTERACTIVE CONTROLLER
 * Xử lý toàn bộ tương tác giao diện: Mobile menu, Quick View, Search, Flash sale, Filter, Cart, Checkout
 */

function initializeMainInteractions() {
    // 1. Khởi tạo Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Khởi tạo Theme & Badges
    initTheme();
    updateCartBadges();
    updateWishlistBadges();
    updateWishlistUI();

    // 3. Xử lý Mobile Menu Drawer
    initMobileMenu();

    // 4. Xử lý Search Bar
    initSearchBar();

    // 5. Khởi tạo Flash Sale Countdown nếu có trên trang
    initCountdownTimer();

    // 6. Khởi tạo Quick View Modal listener
    initQuickViewModal();

    // 7. Khởi tạo Newsletter Subscribe
    initNewsletter();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMainInteractions, { once: true });
} else {
    initializeMainInteractions();
}

// ==========================================
// 1. MOBILE MENU DRAWER
// ==========================================
function initMobileMenu() {
    const openBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-mobile-menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');

    if (!drawer) return;

    function openMenu() {
        drawer.classList.remove('-translate-x-full');
        if (backdrop) backdrop.classList.remove('hidden', 'opacity-0');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        drawer.classList.add('-translate-x-full');
        if (backdrop) backdrop.classList.add('opacity-0');
        setTimeout(() => {
            if (backdrop) backdrop.classList.add('hidden');
        }, 300);
        document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    // Hỗ trợ bấm phím ESC để đóng nhanh Mobile Drawer & Quick View Modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
            closeQuickView();
        }
    });
}

// ==========================================
// 2. SEARCH BAR INTERACTION
// ==========================================
function initSearchBar() {
    const searchForms = document.querySelectorAll('.header-search-form');
    searchForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="text"]');
            if (input && input.value.trim()) {
                window.location.href = `shop.html?search=${encodeURIComponent(input.value.trim())}`;
            }
        });
    });

    // Gợi ý tìm kiếm nhanh (Live search dropdown)
    const searchInputs = document.querySelectorAll('.search-autocomplete-input');
    searchInputs.forEach(input => {
        const dropdown = input.parentElement.querySelector('.search-results-dropdown');
        if (!dropdown) return;

        input.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            if (!query) {
                dropdown.classList.add('hidden');
                return;
            }

            const matched = TECHNOVA_DATA.products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.categoryName.toLowerCase().includes(query) ||
                p.brand.toLowerCase().includes(query)
            ).slice(0, 5);

            if (matched.length === 0) {
                dropdown.innerHTML = `
                    <div class="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                        Không tìm thấy sản phẩm phù hợp cho "${query}"
                    </div>
                `;
            } else {
                dropdown.innerHTML = matched.map(p => `
                    <a href="product-detail.html?id=${p.id}" class="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
                        <img src="${p.image}" alt="${p.name}" class="w-11 h-11 object-cover rounded-lg border border-slate-200 dark:border-slate-700">
                        <div class="flex-1 min-w-0">
                            <h4 class="text-xs font-semibold text-slate-900 dark:text-white truncate">${p.name}</h4>
                            <div class="flex items-center gap-2 mt-0.5">
                                <span class="text-xs font-bold text-blue-600 dark:text-blue-400">${formatPrice(p.price)}</span>
                                ${p.oldPrice ? `<span class="text-[10px] text-slate-400 line-through">${formatPrice(p.oldPrice)}</span>` : ''}
                            </div>
                        </div>
                    </a>
                `).join('') + `
                    <a href="shop.html?search=${encodeURIComponent(query)}" class="block p-2.5 text-center text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 hover:underline">
                        Xem tất cả kết quả cho "${query}" &rarr;
                    </a>
                `;
            }
            dropdown.classList.remove('hidden');
        });

        // Hide when click outside
        document.addEventListener('click', (e) => {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
    });
}

// ==========================================
// 3. FLASH SALE COUNTDOWN TIMER
// ==========================================
function initCountdownTimer() {
    const hoursEl = document.getElementById('sale-hours');
    const minutesEl = document.getElementById('sale-minutes');
    const secondsEl = document.getElementById('sale-seconds');

    if (!hoursEl || !minutesEl || !secondsEl) return;

    // Giả lập đồng hồ đếm ngược kết thúc sau 8 tiếng tính từ lúc mở trang
    let targetTime = Date.now() + (8 * 3600 + 45 * 60 + 30) * 1000;

    function update() {
        const now = Date.now();
        const diff = Math.max(0, targetTime - now);

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');

        if (diff > 0) {
            requestAnimationFrame(() => {
                setTimeout(update, 1000);
            });
        }
    }
    update();
}

// ==========================================
// 4. QUICK VIEW MODAL
// ==========================================
function initQuickViewModal() {
    let modal = document.getElementById('quick-view-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quick-view-modal';
        modal.className = 'fixed inset-0 z-[999] hidden items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300';
        modal.innerHTML = `
            <div id="quick-view-content" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden transform scale-95 transition-transform duration-300 max-h-[90vh] overflow-y-auto">
                <!-- Nội dung modal load động -->
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeQuickView();
        });
    }
}

function openQuickView(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const modal = document.getElementById('quick-view-modal');
    const content = document.getElementById('quick-view-content');
    if (!modal || !content) return;

    content.innerHTML = `
        <div class="relative p-6 sm:p-8">
            <button onclick="closeQuickView()" class="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div class="space-y-4">
                    <div class="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        <img id="modal-main-img" src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                    </div>
                    <div class="grid grid-cols-4 gap-2">
                        ${(product.thumbnails || [product.image]).map((thumb, idx) => `
                            <button onclick="document.getElementById('modal-main-img').src='${thumb}'" class="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-600 focus:border-blue-600 transition-all">
                                <img src="${thumb}" class="w-full h-full object-cover">
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-2.5 py-1 text-[11px] font-bold uppercase rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">${product.categoryName}</span>
                        <span class="text-xs text-slate-400">SKU: ${product.sku}</span>
                    </div>
                    <h3 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">${product.name}</h3>
                    
                    <div class="flex items-center gap-3 my-3">
                        <div class="flex items-center text-amber-400 text-sm">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                        </div>
                        <span class="text-xs text-slate-500 dark:text-slate-400">(${product.reviews} đánh giá)</span>
                        <span class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">• Còn ${product.stock} hàng</span>
                    </div>

                    <div class="flex items-baseline gap-3 my-4">
                        <span class="text-2xl font-black text-blue-600 dark:text-blue-400">${formatPrice(product.price)}</span>
                        ${product.oldPrice ? `
                            <span class="text-sm text-slate-400 line-through">${formatPrice(product.oldPrice)}</span>
                            <span class="px-2 py-0.5 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-full">-${product.discount}%</span>
                        ` : ''}
                    </div>

                    <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 line-clamp-3">${product.description}</p>

                    <div class="flex items-center gap-4 mb-6">
                        <span class="text-xs font-medium text-slate-500">Số lượng:</span>
                        <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                            <button onclick="decrementModalQty()" class="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold">-</button>
                            <input id="modal-qty-input" type="number" value="1" min="1" max="${product.stock}" class="w-12 text-center bg-transparent border-0 text-sm font-bold focus:outline-none">
                            <button onclick="incrementModalQty()" class="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold">+</button>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3">
                        <button onclick="addFromModal(${product.id})" class="flex-1 py-3 px-5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 text-sm">
                            <i data-lucide="shopping-cart" class="w-4 h-4"></i> Thêm vào giỏ
                        </button>
                        <a href="product-detail.html?id=${product.id}" class="py-3 px-5 rounded-xl font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white text-center transition-all text-sm">
                            Xem chi tiết &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons({ root: content });
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }
}

function decrementModalQty() {
    const input = document.getElementById('modal-qty-input');
    if (input && Number(input.value) > 1) {
        input.value = Number(input.value) - 1;
    }
}

function incrementModalQty() {
    const input = document.getElementById('modal-qty-input');
    if (input) {
        input.value = Number(input.value) + 1;
    }
}

function addFromModal(productId) {
    const input = document.getElementById('modal-qty-input');
    const qty = input ? Number(input.value) || 1 : 1;
    addToCart(productId, qty);
    closeQuickView();
}

// ==========================================
// 5. NEWSLETTER
// ==========================================
function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            if (input && input.value.trim()) {
                showToast(`✓ Cảm ơn bạn! Email <strong>${input.value}</strong> đã được đăng ký thành công.`, 'success');
                input.value = '';
            }
        });
    }
}

// ==========================================
// 6. HELPER RENDER SẢN PHẨM CARD REUSABLE
// ==========================================
function renderProductCard(p) {
    const inWishlist = isInWishlist(p.id);
    return `
        <div class="product-card group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300">
            <!-- Badges -->
            <div class="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 items-start">
                ${(p.stock !== undefined && p.stock <= 0) ? `<span class="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-black text-rose-300 bg-slate-900/90 border border-rose-500/40 rounded-lg shadow-sm">TẠM HẾT</span>` : ''}
                ${p.badge === 'HOT' ? `<span class="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold text-white bg-gradient-to-r from-amber-500 to-rose-500 rounded-lg shadow-sm flex items-center gap-1">🔥 HOT</span>` : ''}
                ${p.badge === 'NEW' ? `<span class="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold text-white bg-blue-600 rounded-lg shadow-sm">NEW</span>` : ''}
                ${p.badge === 'SALE' || p.discount ? `<span class="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-bold text-white bg-rose-600 rounded-lg shadow-sm">-${p.discount}%</span>` : ''}
            </div>

            <!-- Wishlist Button -->
            <button onclick="toggleWishlist(${p.id})" data-wishlist-btn="${p.id}" aria-label="Yêu thích" class="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-md flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all ${inWishlist ? 'text-rose-500 fill-rose-500' : ''}">
                <i data-lucide="heart" class="w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}"></i>
            </button>

            <!-- Image Container -->
            <div class="relative pt-[88%] bg-slate-50 dark:bg-slate-800/50 img-zoom-container">
                <a href="product-detail.html?id=${p.id}" class="absolute inset-0 p-2 sm:p-4 flex items-center justify-center">
                    <img src="${p.image}" alt="${p.name}" class="img-zoom-target w-full h-full object-cover rounded-xl ${(p.stock !== undefined && p.stock <= 0) ? 'grayscale contrast-75' : ''}" loading="lazy">
                </a>

                ${(p.stock !== undefined && p.stock <= 0) ? `
                    <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center p-3 pointer-events-none">
                        <span class="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-black text-[11px] uppercase tracking-wider shadow-lg border border-white/20">
                            ĐÃ HẾT HÀNG
                        </span>
                    </div>
                ` : ''}
                
                <!-- Quick View Overlay Button -->
                <button onclick="openQuickView(${p.id})" class="hidden sm:flex absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 px-3.5 py-1.5 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 items-center gap-1.5 whitespace-nowrap">
                    <i data-lucide="eye" class="w-3.5 h-3.5 text-blue-600"></i> Xem nhanh
                </button>
            </div>

            <!-- Product Info -->
            <div class="p-3 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <span class="font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400 truncate">${p.categoryName}</span>
                        <span class="whitespace-nowrap ml-1">Đã bán ${p.sold || 0}</span>
                    </div>

                    <h3 class="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-2 leading-tight sm:leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <a href="product-detail.html?id=${p.id}">${p.name}</a>
                    </h3>

                    <!-- Rating -->
                    <div class="flex items-center gap-1 my-1.5 sm:my-2">
                        <div class="flex text-amber-400 text-[10px] sm:text-xs">
                            ${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}
                        </div>
                        <span class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">(${p.reviews})</span>
                    </div>
                </div>

                <div class="pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div class="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                        <span class="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">${formatPrice(p.price)}</span>
                        ${p.oldPrice ? `<span class="text-[10px] sm:text-xs text-slate-400 line-through truncate">${formatPrice(p.oldPrice)}</span>` : ''}
                    </div>

                    <!-- Stock progress if Hot/Sale -->
                    ${(p.isHot || p.isSale) ? `
                        <div class="mb-2 sm:mb-3">
                            <div class="flex justify-between text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-1">
                                <span>Còn ${p.stock}</span>
                                <span>Bán ${p.sold}</span>
                            </div>
                            <div class="w-full h-1 sm:h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style="width: ${Math.min(100, Math.round((p.sold / (p.sold + p.stock)) * 100))}%"></div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Add To Cart Button hoặc Đã hết hàng -->
                    ${(p.stock !== undefined && p.stock <= 0) ? `
                        <button disabled class="w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed border border-slate-200 dark:border-slate-700 select-none">
                            <i data-lucide="slash" class="w-3.5 h-3.5 flex-shrink-0"></i> <span>Đã hết hàng</span>
                        </button>
                    ` : `
                        <button onclick="addToCart(${p.id})" class="w-full py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-slate-100 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-800 hover:text-white dark:text-slate-200 dark:hover:text-white text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 active:scale-95 shadow-sm">
                            <i data-lucide="shopping-cart" class="w-3.5 h-3.5 flex-shrink-0"></i> <span>Thêm vào giỏ</span>
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;
}
