/**
 * TECHNOVA STORE - STATE & UTILITIES STORE
 * Quản lý Giỏ hàng, Wishlist, Dark Mode, Toast và Mock Auth
 */

const TECHNOVA_STORAGE = {
    CART_KEY: 'technova_cart_items',
    WISHLIST_KEY: 'technova_wishlist_items',
    THEME_KEY: 'technova_theme_mode',
    USER_KEY: 'technova_auth_user',
    ORDERS_KEY: 'technova_user_orders'
};

// ==========================================
// 1. THEME / DARK MODE
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem(TECHNOVA_STORAGE.THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    updateThemeToggleUI();
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(TECHNOVA_STORAGE.THEME_KEY, isDark ? 'dark' : 'light');
    updateThemeToggleUI();
    showToast(isDark ? '🌙 Đã chuyển sang chế độ Tối' : '☀️ Đã chuyển sang chế độ Sáng', 'info');
}

function updateThemeToggleUI() {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.innerHTML = isDark
            ? `<i data-lucide="sun" class="w-5 h-5 text-amber-400"></i>`
            : `<i data-lucide="moon" class="w-5 h-5 text-slate-600 dark:text-slate-300"></i>`;
    });
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Chạy khởi tạo theme ngay
initTheme();

// ==========================================
// 2. HELPER UTILITIES
// ==========================================
function formatPrice(amount) {
    if (typeof amount !== 'number') amount = Number(amount) || 0;
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }).format(amount).replace('₫', 'đ');
}

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    return result;
}

function getProductById(id) {
    const numId = Number(id);
    return TECHNOVA_DATA.products.find(p => p.id === numId);
}

function getProductBySlug(slug) {
    return TECHNOVA_DATA.products.find(p => p.slug === slug);
}

// ==========================================
// 3. TOAST NOTIFICATION SYSTEM
// ==========================================
function ensureToastContainer() {
    let container = document.getElementById('technova-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'technova-toast-container';
        container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0';
        document.body.appendChild(container);
    }
    return container;
}

function showToast(message, type = 'success', duration = 3000) {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto transform transition-all duration-300 ease-out translate-y-3 opacity-0 flex items-center gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md text-sm font-medium';
    
    let icon = 'check-circle-2';
    let colorClass = 'bg-white/95 dark:bg-slate-900/95 border-emerald-500/30 text-slate-800 dark:text-slate-100 shadow-emerald-500/10';
    let iconColor = 'text-emerald-500';

    if (type === 'error') {
        icon = 'alert-circle';
        colorClass = 'bg-white/95 dark:bg-slate-900/95 border-rose-500/30 text-slate-800 dark:text-slate-100 shadow-rose-500/10';
        iconColor = 'text-rose-500';
    } else if (type === 'info') {
        icon = 'info';
        colorClass = 'bg-white/95 dark:bg-slate-900/95 border-blue-500/30 text-slate-800 dark:text-slate-100 shadow-blue-500/10';
        iconColor = 'text-blue-500';
    } else if (type === 'warning') {
        icon = 'alert-triangle';
        colorClass = 'bg-white/95 dark:bg-slate-900/95 border-amber-500/30 text-slate-800 dark:text-slate-100 shadow-amber-500/10';
        iconColor = 'text-amber-500';
    }

    toast.className += ` ${colorClass}`;
    toast.innerHTML = `
        <div class="flex-shrink-0 ${iconColor}">
            <i data-lucide="${icon}" class="w-5 h-5"></i>
        </div>
        <div class="flex-1 text-xs sm:text-sm leading-snug">${message}</div>
        <button class="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors" onclick="this.parentElement.remove()">
            <i data-lucide="x" class="w-4 h-4"></i>
        </button>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons({ root: toast });

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-3', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    });

    // Auto dismiss
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-3', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ==========================================
// 4. CART SYSTEM (localStorage)
// ==========================================
function getCart() {
    const raw = localStorage.getItem(TECHNOVA_STORAGE.CART_KEY);
    if (!raw) {
        // Khởi tạo mẫu 2 sản phẩm để trang giỏ hàng sinh động ngay
        const defaultCart = [
            { productId: 1, quantity: 1 },
            { productId: 6, quantity: 1 }
        ];
        localStorage.setItem(TECHNOVA_STORAGE.CART_KEY, JSON.stringify(defaultCart));
        return defaultCart;
    }
    try {
        return JSON.parse(raw) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(TECHNOVA_STORAGE.CART_KEY, JSON.stringify(cart));
    updateCartBadges();
}

function addToCart(productId, quantity = 1, showFeedback = true) {
    productId = Number(productId);
    quantity = Number(quantity) || 1;
    const product = getProductById(productId);
    if (!product) return;

    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.productId === productId);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }

    saveCart(cart);

    if (showFeedback) {
        showToast(`✓ Đã thêm <strong>${product.name}</strong> vào giỏ hàng`, 'success');
    }
}

function removeFromCart(productId, showFeedback = true) {
    productId = Number(productId);
    let cart = getCart();
    const removedItem = cart.find(item => item.productId === productId);
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);

    if (showFeedback && removedItem) {
        const prod = getProductById(productId);
        showToast(`Đã xóa ${prod ? prod.name : 'sản phẩm'} khỏi giỏ hàng`, 'info');
    }
}

function updateCartQuantity(productId, quantity) {
    productId = Number(productId);
    quantity = Number(quantity);
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    let cart = getCart();
    const item = cart.find(i => i.productId === productId);
    if (item) {
        item.quantity = quantity;
        saveCart(cart);
    }
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartDetails() {
    const cart = getCart();
    return cart.map(item => {
        const product = getProductById(item.productId);
        return {
            ...item,
            product,
            subtotal: product ? product.price * item.quantity : 0
        };
    }).filter(item => item.product !== undefined);
}

function getCartSubtotal() {
    const details = getCartDetails();
    return details.reduce((sum, item) => sum + item.subtotal, 0);
}

function clearCart() {
    localStorage.removeItem(TECHNOVA_STORAGE.CART_KEY);
    updateCartBadges();
}

function updateCartBadges() {
    const count = getCartCount();
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
        badge.textContent = count;
        if (count === 0) {
            badge.classList.add('hidden');
        } else {
            badge.classList.remove('hidden');
        }
    });
}

// ==========================================
// 5. WISHLIST SYSTEM (localStorage)
// ==========================================
function getWishlist() {
    const raw = localStorage.getItem(TECHNOVA_STORAGE.WISHLIST_KEY);
    if (!raw) {
        // Mẫu 3 sản phẩm ban đầu
        const defaultWishlist = [1, 3, 8];
        localStorage.setItem(TECHNOVA_STORAGE.WISHLIST_KEY, JSON.stringify(defaultWishlist));
        return defaultWishlist;
    }
    try {
        return JSON.parse(raw) || [];
    } catch (e) {
        return [];
    }
}

function saveWishlist(list) {
    localStorage.setItem(TECHNOVA_STORAGE.WISHLIST_KEY, JSON.stringify(list));
    updateWishlistBadges();
}

function isInWishlist(productId) {
    productId = Number(productId);
    const list = getWishlist();
    return list.includes(productId);
}

function toggleWishlist(productId) {
    productId = Number(productId);
    const product = getProductById(productId);
    let list = getWishlist();

    if (list.includes(productId)) {
        list = list.filter(id => id !== productId);
        saveWishlist(list);
        showToast(`Đã bỏ <strong>${product ? product.name : 'sản phẩm'}</strong> khỏi mục yêu thích`, 'info');
    } else {
        list.push(productId);
        saveWishlist(list);
        showToast(`✓ Đã thêm <strong>${product ? product.name : 'sản phẩm'}</strong> vào danh sách yêu thích!`, 'success');
    }

    updateWishlistUI();
}

function updateWishlistBadges() {
    const count = getWishlist().length;
    document.querySelectorAll('.wishlist-count-badge').forEach(badge => {
        badge.textContent = count;
        if (count === 0) {
            badge.classList.add('hidden');
        } else {
            badge.classList.remove('hidden');
        }
    });
}

function updateWishlistUI() {
    updateWishlistBadges();
    // Update all heart icons across page
    document.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
        const id = Number(btn.getAttribute('data-wishlist-btn'));
        const inList = isInWishlist(id);
        const icon = btn.querySelector('i');
        if (inList) {
            btn.classList.add('text-rose-500', 'fill-rose-500');
            btn.classList.remove('text-slate-400');
            if (icon) {
                icon.classList.add('fill-rose-500', 'text-rose-500');
            }
        } else {
            btn.classList.remove('text-rose-500', 'fill-rose-500');
            btn.classList.add('text-slate-400');
            if (icon) {
                icon.classList.remove('fill-rose-500', 'text-rose-500');
            }
        }
    });
}

// ==========================================
// 6. USER AUTHENTICATION (Mock)
// ==========================================
function getCurrentUser() {
    const raw = localStorage.getItem(TECHNOVA_STORAGE.USER_KEY);
    if (!raw) {
        return {
            name: 'Nguyễn Văn An',
            email: 'nguyenvanan@gmail.com',
            phone: '0987 654 321',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            address: '128 Đường Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
            city: 'TP. Hồ Chí Minh',
            role: 'VIP Diamond Member',
            joinDate: 'Tháng 1, 2025'
        };
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function saveCurrentUser(user) {
    localStorage.setItem(TECHNOVA_STORAGE.USER_KEY, JSON.stringify(user));
}

function logoutUser() {
    localStorage.removeItem(TECHNOVA_STORAGE.USER_KEY);
    showToast('Đã đăng xuất thành công', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// ==========================================
// 7. ORDER HISTORY SYSTEM (localStorage)
// ==========================================
function getOrders() {
    const raw = localStorage.getItem(TECHNOVA_STORAGE.ORDERS_KEY);
    if (!raw) {
        localStorage.setItem(TECHNOVA_STORAGE.ORDERS_KEY, JSON.stringify(TECHNOVA_DATA.orders));
        return TECHNOVA_DATA.orders;
    }
    try {
        return JSON.parse(raw) || [];
    } catch (e) {
        return TECHNOVA_DATA.orders;
    }
}

function saveOrder(newOrder) {
    const orders = getOrders();
    orders.unshift(newOrder);
    localStorage.setItem(TECHNOVA_STORAGE.ORDERS_KEY, JSON.stringify(orders));
    return newOrder;
}

function getOrderById(id) {
    const orders = getOrders();
    return orders.find(o => o.id === id);
}

// Khởi chạy đồng bộ badge khi DOM load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadges();
    updateWishlistBadges();
    updateWishlistUI();
});
