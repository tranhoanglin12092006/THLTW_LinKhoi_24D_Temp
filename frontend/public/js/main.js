/* ============================================================
   NovaTech — Core: icons, header/footer, theme, toast,
   cart/wishlist storage helpers shared by every page.
   ============================================================ */

const ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  heartFill: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.6 6.1 20.5l1.2-6.5-4.8-4.6 6.6-.9L12 2.5Z"/></svg>',
  starEmpty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.6 6.1 20.5l1.2-6.5-4.8-4.6 6.6-.9L12 2.5Z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="14" height="11"/><path d="M15 9h4l3 3v5h-7z"/><circle cx="6" cy="19" r="2"/><circle cx="17" cy="19" r="2"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.3-6.4L21 8M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16m0 5v-5h5"/></svg>',
  headset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="1" y="14" width="6" height="7" rx="2"/><rect x="17" y="14" width="6" height="7" rx="2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16M7 12h10M10 19h4"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7L22 6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .7a2 2 0 0 1 1.7 2Z"/></svg>',
  mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/></svg>',
  smartphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  laptop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M1 20h22"/></svg>',
  tablet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M12 18h.01"/></svg>',
  headphones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="1" y="14" width="6" height="7" rx="2"/><rect x="17" y="14" width="6" height="7" rx="2"/></svg>',
  watch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><path d="M12 9v3l2 2M9 3h6M9 21h6"/></svg>',
  gamepad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3M15.2 12h.01M17.8 10h.01"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-2h6l2 2h3v11H4Z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  plug: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6M15 2v6M7 8h10v4a5 5 0 0 1-10 0Z"/><path d="M12 17v5"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l.5-4H13V7.5c0-1.2.4-2 2-2h2V2h-3c-3 0-4.5 1.8-4.5 4.7V10H7v4h2.5v8Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12s0-3.4-.4-5A3 3 0 0 0 19.5 5C17.6 4.6 12 4.6 12 4.6s-5.6 0-7.5.4A3 3 0 0 0 2.4 7C2 8.6 2 12 2 12s0 3.4.4 5a3 3 0 0 0 2.1 2c1.9.4 7.5.4 7.5.4s5.6 0 7.5-.4a3 3 0 0 0 2.1-2c.4-1.6.4-5 .4-5ZM10 15.5v-7l6 3.5Z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 2c.4 2.3 2 4 4.5 4.2v3c-1.6.1-3-.4-4.5-1.3V15a6 6 0 1 1-6-6c.3 0 .6 0 1 .1v3.1a3 3 0 1 0 2 2.8V2Z"/></svg>',
  google: '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.6a4.8 4.8 0 0 1-2.1 3.2v2.6h3.4c2-1.8 3.1-4.5 3.1-7.7Z"/><path fill="#34A853" d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.2 13.6a6 6 0 0 1 0-3.8V7.1H2.7a10 10 0 0 0 0 9l3.5-2.5Z"/><path fill="#EA4335" d="M12 6.4c1.5 0 2.9.5 4 1.5l3-3A10 10 0 0 0 2.7 7.1l3.5 2.7c.7-2.5 3-4.3 5.8-4.3Z"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a1.8 1.8 0 0 0 1.5 2.7h17.4a1.8 1.8 0 0 0 1.5-2.7L13.7 3.9a1.8 1.8 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/></svg>',
};

function icon(name, cls) {
  return `<span class="${cls || 'w-5 h-5'} inline-flex shrink-0 items-center justify-center">${ICONS[name] || ''}</span>`;
}

function catIcon(cat) {
  return icon(cat, 'w-6 h-6');
}

/* ---------------- Theme ---------------- */
function initTheme() {
  const saved = localStorage.getItem('estore_theme');
  document.documentElement.classList.toggle('dark', saved === 'dark');
}

function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('estore_theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.innerHTML = document.documentElement.classList.contains('dark') ? icon('sun', 'w-5 h-5') : icon('moon', 'w-5 h-5');
}
initTheme();

/* ---------------- Storage: cart & wishlist ---------------- */
function getCart() {
  return JSON.parse(localStorage.getItem('estore_cart') || '[]');
}

function saveCart(c) {
  localStorage.setItem('estore_cart', JSON.stringify(c));
  updateHeaderCounts();
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.qty += qty;
  else cart.push({ id, qty });
  saveCart(cart);
  const p = getProduct(id);
  showToast(`Đã thêm "${p ? p.name : 'sản phẩm'}" vào giỏ hàng`, 'success');
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function changeCartQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) return removeFromCart(id);
  saveCart(cart);
  if (typeof renderCartPage === 'function') renderCartPage();
}

function cartTotalQty() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}

function getWishlist() {
  return JSON.parse(localStorage.getItem('estore_wishlist') || '[]');
}

function isWished(id) {
  return getWishlist().includes(id);
}

function toggleWishlist(id) {
  let w = getWishlist();
  const p = getProduct(id);
  if (w.includes(id)) {
    w = w.filter(x => x !== id);
    showToast(`Đã bỏ "${p ? p.name : 'sản phẩm'}" khỏi yêu thích`, 'default');
  } else {
    w.push(id);
    showToast(`Đã thêm "${p ? p.name : 'sản phẩm'}" vào yêu thích`, 'success');
  }
  localStorage.setItem('estore_wishlist', JSON.stringify(w));
  updateHeaderCounts();
  document.querySelectorAll(`[data-wish="${id}"]`).forEach(btn => {
    btn.classList.toggle('text-rose-500', w.includes(id));
    btn.classList.toggle('text-slate-400', !w.includes(id));
    btn.innerHTML = icon(w.includes(id) ? 'heartFill' : 'heart', 'w-[18px] h-[18px]');
  });
  if (typeof renderWishlistPage === 'function') renderWishlistPage();
}

function updateHeaderCounts() {
  const c = document.getElementById('cart-count');
  if (c) c.textContent = cartTotalQty();
  const w = document.getElementById('wishlist-count');
  if (w) w.textContent = getWishlist().length;
}

/* ---------------- Toast ---------------- */
function showToast(msg, type = 'default') {
  let wrap = document.getElementById('toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toast-wrap';
    wrap.className = 'fixed top-20 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none';
    document.body.appendChild(wrap);
  }
  const colors = {
    success: 'border-emerald-500 text-emerald-600 dark:text-emerald-400',
    error: 'border-rose-500 text-rose-600 dark:text-rose-400',
    default: 'border-primary text-primary'
  };
  const t = document.createElement('div');
  t.className = `animate-toast pointer-events-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-l-4 ${colors[type] || colors.default} shadow-xl rounded-xl px-4 py-3 text-sm flex items-center gap-2.5`;
  t.innerHTML = `${icon(type === 'error' ? 'alert' : 'check', 'w-4 h-4')}<span class="text-slate-700 dark:text-slate-100 font-medium">${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(-6px)';
    t.style.transition = 'all .25s ease';
    setTimeout(() => t.remove(), 250);
  }, 2800);
}

/* ---------------- Star rating ---------------- */
function starsHTML(rating) {
  let out = '';
  for (let i = 1; i <= 5; i++) {
    out += icon(i <= Math.round(rating) ? 'star' : 'starEmpty', `w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}`);
  }
  return out;
}

/* ---------------- Product card (shared everywhere) ---------------- */
function productCardHTML(p) {
  const badgeColor = p.badge === 'NEW' ? 'bg-emerald-600' : p.badge === 'HOT' ? 'bg-amber-500' : p.badge === 'SALE' ? 'bg-rose-500' : 'bg-primary';
  const badgeEmoji = p.badge === 'HOT' ? '🔥' : p.badge === 'NEW' ? '✨' : p.badge === 'SALE' ? '⚡' : '';
  const hasImg = Boolean(p.image);
  return `
  <div class="product-card group bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-100 dark:border-slate-700/70 overflow-hidden hover:shadow-2xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
    <div class="relative overflow-hidden bg-slate-50 dark:bg-slate-900/50 aspect-square flex items-center justify-center p-3">
      <a href="product-detail.html?id=${p.id}" class="w-full h-full flex items-center justify-center relative overflow-hidden rounded-xl bg-white dark:bg-slate-800/50">
        ${hasImg ? `
          <img src="${p.image}" alt="${p.name}" loading="lazy" class="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
          <div class="tile w-full h-full rounded-xl hidden items-center justify-center" style="background:linear-gradient(135deg, ${CAT_COLOR[p.category]}14, ${CAT_COLOR[p.category]}33); color:${CAT_COLOR[p.category]}">
            ${icon(p.category, 'w-16 h-16')}
          </div>
        ` : `
          <div class="tile w-full h-full rounded-xl flex items-center justify-center" style="background:linear-gradient(135deg, ${CAT_COLOR[p.category]}14, ${CAT_COLOR[p.category]}33); color:${CAT_COLOR[p.category]}">
            ${icon(p.category, 'w-16 h-16')}
          </div>
        `}
      </a>
      ${p.badge ? `<span class="absolute top-3 left-3 ${badgeColor} text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">${badgeEmoji} ${p.badge}${p.badge === 'SALE' ? ` -${p.discount}%` : ''}</span>` : ''}
      <button data-wish="${p.id}" onclick="toggleWishlist(${p.id})" aria-label="Yêu thích" class="${isWished(p.id) ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/60' : 'text-slate-400 bg-white/90 dark:bg-slate-800/90 hover:text-rose-500'} absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all hover:scale-110 active:scale-95">
        ${icon(isWished(p.id) ? 'heartFill' : 'heart', 'w-[18px] h-[18px]')}
      </button>
      <div class="quick-actions absolute bottom-3 left-3 right-3 hidden md:block">
        <a href="product-detail.html?id=${p.id}" class="w-full bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 hover:bg-primary hover:text-white font-medium text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-lg backdrop-blur-sm transition-all">
          ${icon('eye', 'w-3.5 h-3.5')} Xem chi tiết
        </a>
      </div>
    </div>
    <div class="p-4 flex-1 flex flex-col justify-between">
      <div>
        <div class="flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
          <span>${p.brand}</span>
          <span class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium lowercase tracking-normal">● còn ${p.stock}</span>
        </div>
        <a href="product-detail.html?id=${p.id}" class="font-semibold text-sm text-slate-800 dark:text-slate-100 line-clamp-2 hover:text-primary transition-colors leading-snug">
          ${p.name}
        </a>
        <div class="flex items-center gap-1 mt-2">
          ${starsHTML(p.rating)}
          <span class="text-xs text-slate-400 font-medium ml-1">(${p.reviews})</span>
        </div>
      </div>
      <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <div class="flex items-baseline gap-2 mb-2.5">
          <span class="text-base font-extrabold text-blue-600 dark:text-blue-400">${fmtPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="text-xs text-slate-400 line-through">${fmtPrice(p.oldPrice)}</span>` : ''}
        </div>
        <button onclick="addToCart(${p.id})" class="w-full bg-slate-900 hover:bg-primary text-white dark:bg-primary dark:hover:bg-primary-dark text-xs font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:shadow-primary/25 active:scale-[0.98]">
          ${icon('cart', 'w-3.5 h-3.5')} Thêm vào giỏ
        </button>
      </div>
    </div>
  </div>`;
}

function productGrid(list, cols) {
  const gridCols = cols || 'grid-cols-2 md:grid-cols-4';
  return `<div class="relative grid ${gridCols} gap-4 md:gap-6 stagger w-full">${list.map(productCardHTML).join('')}</div>`;
}

/* ---------------- Header / Footer ---------------- */
function headerHTML(active) {
  const link = (page, label) => {
    const isAct = active === page;
    return `<a href="${page}" class="px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${isAct
      ? 'bg-primary text-white shadow-sm shadow-primary/30 font-semibold'
      : 'font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
      }">${label}</a>`;
  };

  return `
  <!-- Top Bar -->
  <div class="bg-slate-900 text-slate-300 text-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
      <div class="flex items-center gap-2 truncate">
        <span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">✓</span>
        <p class="truncate font-medium">Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500.000đ • Hotline: 1900 8899</p>
      </div>
      <div class="hidden sm:flex items-center gap-5">
        <span class="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">${icon('phone', 'w-3.5 h-3.5')} 1900 8899</span>
        <span class="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">${icon('mail', 'w-3.5 h-3.5')} support@novatech.vn</span>
        <a href="orders.html" class="text-slate-300 hover:text-primary transition-colors font-medium">Theo dõi đơn hàng</a>
      </div>
    </div>
  </div>

  <!-- Main Header -->
  <div class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
      <button id="mobile-menu-btn" class="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">${icon('menu', 'w-6 h-6')}</button>
      
      <!-- Brand Logo -->
      <a href="index.html" class="flex items-center gap-3 shrink-0 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="font-extrabold text-2xl tracking-tight leading-none text-slate-900 dark:text-white flex items-center">
            Nova<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Tech</span>
          </span>
          <span class="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-1">Smart Life • Future Tech</span>
        </div>
      </a>

      <!-- Search Input -->
      <form onsubmit="event.preventDefault(); window.location.href='/products?q='+encodeURIComponent(this.q.value)" class="hidden md:flex flex-1 max-w-xl mx-4">
        <div class="flex w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all">
          <input name="q" type="search" placeholder="Tìm kiếm điện thoại, laptop, tai nghe, gaming..." aria-label="Tìm kiếm sản phẩm" class="flex-1 px-5 py-2.5 text-sm bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-slate-400">
          <button type="submit" aria-label="Tìm kiếm" class="bg-primary hover:bg-primary-dark text-white px-5 flex items-center justify-center transition-colors">
            ${icon('search', 'w-4 h-4')}
          </button>
        </div>
      </form>

      <!-- Right Action Icons -->
      <div class="flex items-center gap-1 sm:gap-2 ml-auto">
        <button id="theme-toggle" onclick="toggleTheme()" aria-label="Chuyển giao diện sáng/tối" class="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          ${document.documentElement.classList.contains('dark') ? icon('sun', 'w-5 h-5') : icon('moon', 'w-5 h-5')}
        </button>
        
        <a href="wishlist.html" aria-label="Sản phẩm yêu thích" class="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          ${icon('heart', 'w-5 h-5')}
          <span id="wishlist-count" class="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">0</span>
        </a>
        
        <a href="login.html" aria-label="Tài khoản" class="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          ${icon('user', 'w-5 h-5')}
        </a>
        
        <a href="cart.html" aria-label="Giỏ hàng" class="relative flex items-center gap-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border border-blue-100 dark:border-slate-700 pl-3.5 pr-4 h-10 rounded-full text-slate-700 dark:text-slate-200 hover:border-primary/40 transition-all shadow-sm">
          <span class="text-primary">${icon('cart', 'w-5 h-5')}</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">Giỏ:</span>
          <span id="cart-count" class="text-sm font-extrabold text-primary">0</span>
        </a>
      </div>
    </div>

    <!-- Mobile Search Form -->
    <form onsubmit="event.preventDefault(); window.location.href='/products?q='+encodeURIComponent(this.q.value)" class="md:hidden px-4 pb-3">
      <div class="flex bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full overflow-hidden">
        <input name="q" type="search" placeholder="Tìm kiếm sản phẩm..." class="flex-1 px-4 py-2 text-sm bg-transparent outline-none dark:text-white">
        <button class="bg-primary text-white px-4">${icon('search', 'w-4 h-4')}</button>
      </div>
    </form>

    <!-- Desktop Centered Navigation Bar -->
    <nav class="hidden lg:block border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3">
        ${link('index.html', 'Trang chủ')}
        ${link('/products', 'Sản phẩm')}
        
        <div class="relative group">
          <button class="px-4 py-1.5 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5">
            Danh mục ${icon('chevronDown', 'w-3.5 h-3.5')}
          </button>
          <div class="absolute left-1/2 -translate-x-1/2 top-full pt-2 hidden group-hover:block z-50">
            <div class="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-700 py-2 w-64 animate-fade-in divide-y divide-slate-100 dark:divide-slate-700/50">
              <div class="p-1.5 grid grid-cols-1 gap-0.5">
                ${CATEGORIES.map(c => `
                  <a href="/products?cat=${c.id}" class="flex items-center gap-3 px-3 py-2 text-sm rounded-xl text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 transition-colors">
                    <span class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-primary shrink-0">${catIcon(c.icon)}</span>
                    <span class="font-medium">${c.name}</span>
                    <span class="ml-auto text-xs text-slate-400">(${c.count})</span>
                  </a>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <a href="/products?sale=1" class="px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${active === '/products?sale=1'
      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 shadow-sm'
      : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
    }">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Khuyến mãi <span class="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">HOT</span>
        </a>

        ${link('news.html', 'Tin tức')}
        ${link('about.html', 'Giới thiệu')}
        ${link('contact.html', 'Liên hệ')}
      </div>
    </nav>
  </div>

  <!-- Mobile Drawer Menu -->
  <div id="mobile-menu" class="hidden lg:hidden fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="document.getElementById('mobile-menu').classList.add('hidden')"></div>
    <div class="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 p-6 overflow-y-auto animate-fade-in shadow-2xl">
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <span class="font-extrabold text-lg text-slate-900 dark:text-white">Nova<span class="text-primary">Tech</span></span>
        </div>
        <button onclick="document.getElementById('mobile-menu').classList.add('hidden')" class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">${icon('x', 'w-5 h-5')}</button>
      </div>

      <nav class="flex flex-col gap-1 text-sm font-medium">
        <a href="index.html" class="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">Trang chủ <span>→</span></a>
        <a href="/products" class="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">Sản phẩm <span>→</span></a>
        <a href="/products?sale=1" class="flex items-center justify-between py-2.5 px-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30">🔥 Khuyến mãi HOT <span class="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">SALE</span></a>
        <a href="news.html" class="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">Tin tức <span>→</span></a>
        <a href="about.html" class="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">Giới thiệu <span>→</span></a>
        <a href="contact.html" class="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">Liên hệ <span>→</span></a>
        <a href="login.html" class="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">Tài khoản <span>→</span></a>
        
        <p class="text-xs uppercase font-bold text-slate-400 mt-5 mb-2 px-3 tracking-wider">Danh mục sản phẩm</p>
        <div class="grid grid-cols-2 gap-2">
          ${CATEGORIES.map(c => `
            <a href="/products?cat=${c.id}" class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary text-xs text-slate-700 dark:text-slate-300">
              <span class="text-primary">${catIcon(c.icon)}</span> ${c.name}
            </a>
          `).join('')}
        </div>
      </nav>
    </div>
  </div>`;
}

function footerHTML() {
  return `
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
    <div class="col-span-2 md:col-span-1">
      <a href="index.html" class="flex items-center gap-2.5 mb-4 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <div class="flex flex-col">
          <span class="font-extrabold text-xl tracking-tight text-white flex items-center">
            Nova<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Tech</span>
          </span>
          <span class="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Smart Life • Future Tech</span>
        </div>
      </a>
      <p class="text-sm text-slate-400 mb-5 leading-relaxed">Hệ thống phân phối thiết bị công nghệ chính hãng hàng đầu Việt Nam. Cam kết 100% chính hãng, bảo hành uy tín, trải nghiệm đỉnh cao.</p>
      <div class="flex gap-2.5">
        ${['facebook', 'instagram', 'youtube', 'tiktok'].map(s => `<a href="#" aria-label="${s}" class="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-primary flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:scale-105">${icon(s, 'w-4 h-4')}</a>`).join('')}
      </div>
    </div>
    <div>
      <h4 class="text-white font-bold text-sm uppercase tracking-wider mb-4">Mua hàng & Sản phẩm</h4>
      <ul class="space-y-2.5 text-sm text-slate-400">
        <li><a href="/products" class="hover:text-primary transition-colors">Tất cả sản phẩm</a></li>
        <li><a href="/products?sale=1" class="hover:text-primary transition-colors flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Khuyến mãi hot</a></li>
        <li><a href="/products?sort=new" class="hover:text-primary transition-colors">Sản phẩm mới nhất</a></li>
        <li><a href="/products?sort=bestseller" class="hover:text-primary transition-colors">Bán chạy nhất</a></li>
      </ul>
    </div>
    <div>
      <h4 class="text-white font-bold text-sm uppercase tracking-wider mb-4">Chính sách & Hỗ trợ</h4>
      <ul class="space-y-2.5 text-sm text-slate-400">
        <li><a href="contact.html" class="hover:text-primary transition-colors">Trung tâm bảo hành</a></li>
        <li><a href="#" class="hover:text-primary transition-colors">Chính sách vận chuyển hỏa tốc</a></li>
        <li><a href="#" class="hover:text-primary transition-colors">Đổi trả 1-1 trong 30 ngày</a></li>
        <li><a href="#" class="hover:text-primary transition-colors">Hướng dẫn thanh toán & trả góp</a></li>
        <li><a href="#" class="hover:text-primary transition-colors">Câu hỏi thường gặp</a></li>
      </ul>
    </div>
    <div>
      <h4 class="text-white font-bold text-sm uppercase tracking-wider mb-4">Thông tin liên hệ</h4>
      <ul class="space-y-3 text-sm text-slate-400">
        <li class="flex gap-2.5 items-start">${icon('mapPin', 'w-4 h-4 mt-0.5 text-primary')} <span>12 Lê Lợi, Bến Nghé, Quận 1, TP. Hồ Chí Minh</span></li>
        <li class="flex gap-2.5 items-center">${icon('phone', 'w-4 h-4 text-primary')} <span class="text-white font-semibold">1900 8899</span> (8:00 - 21:30)</li>
        <li class="flex gap-2.5 items-center">${icon('mail', 'w-4 h-4 text-primary')} <span>support@novatech.vn</span></li>
      </ul>
      <div class="mt-5 pt-4 border-t border-slate-800">
        <p class="text-xs text-slate-500 mb-2">Phương thức thanh toán hỗ trợ:</p>
        <div class="flex gap-2 items-center text-xs text-slate-400 font-bold">
          <span class="px-2 py-1 bg-slate-800 rounded">VISA</span>
          <span class="px-2 py-1 bg-slate-800 rounded">MasterCard</span>
          <span class="px-2 py-1 bg-slate-800 rounded text-pink-400">MoMo</span>
          <span class="px-2 py-1 bg-slate-800 rounded text-blue-400">VNPay</span>
          <span class="px-2 py-1 bg-slate-800 rounded">COD</span>
        </div>
      </div>
    </div>
  </div>
  <div class="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
    © 2026 NovaTech Store. Bản quyền thuộc về NovaTech Việt Nam. Mọi quyền được bảo lưu.
  </div>`;
}

function mountLayout(active) {
  const h = document.getElementById('app-header');
  if (h) h.innerHTML = headerHTML(active);
  const f = document.getElementById('app-footer');
  if (f) f.innerHTML = footerHTML();
  const btn = document.getElementById('mobile-menu-btn');
  if (btn) btn.addEventListener('click', () => document.getElementById('mobile-menu').classList.remove('hidden'));
  updateHeaderCounts();
  renderHomePage();
}

function renderHomePage() {
  if (typeof CATEGORIES === 'undefined' || typeof PRODUCTS === 'undefined') return;

  const fillIcon = (id, name, size) => {
    const target = document.getElementById(id);
    if (target) target.innerHTML = icon(name, size);
  };

  fillIcon('ic-truck', 'truck', 'w-5 h-5');
  fillIcon('ic-shield', 'shield', 'w-5 h-5');
  fillIcon('ic-refresh', 'refresh', 'w-5 h-5');
  fillIcon('feat-1', 'truck', 'w-7 h-7');
  fillIcon('feat-2', 'shield', 'w-7 h-7');
  fillIcon('feat-3', 'refresh', 'w-7 h-7');
  fillIcon('feat-4', 'headset', 'w-7 h-7');
  fillIcon('nl-icon', 'mail', 'w-6 h-6');

  const categories = document.getElementById('home-categories');
  if (categories) {
    categories.innerHTML = CATEGORIES.map(category => `
      <a href="/products?cat=${category.id}" class="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 text-center hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/50 transition-all duration-300 flex flex-col items-center">
        <div class="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-700/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 shadow-sm transition-all duration-300">${icon(category.icon, 'w-8 h-8')}</div>
        <p class="font-bold text-sm text-slate-800 dark:text-white group-hover:text-primary transition-colors">${category.name}</p>
        <p class="text-xs text-slate-400 mt-0.5">${category.count} sản phẩm</p>
      </a>`).join('');
  }

  const newProducts = document.getElementById('home-new');
  if (newProducts) newProducts.innerHTML = productGrid(PRODUCTS.filter(product => product.badge === 'NEW').slice(0, 4));

  const saleProducts = document.getElementById('home-sale');
  if (saleProducts) saleProducts.innerHTML = productGrid(PRODUCTS.filter(product => product.badge === 'SALE').slice(0, 4));

  const hotProducts = document.getElementById('home-hot');
  if (hotProducts) {
    hotProducts.innerHTML = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 4).map(product => `
      <div>${productCardHTML(product)}<p class="mt-2.5 px-1 text-[11px] text-slate-400 font-medium">Đã bán ${product.sold} · Còn ${product.stock} sản phẩm</p></div>`).join('');
  }

  const news = document.getElementById('home-news');
  if (news && typeof NEWS !== 'undefined') {
    news.innerHTML = NEWS.slice(0, 3).map(article => `
      <a href="/news" class="group bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-100 dark:border-slate-700/80 overflow-hidden hover:shadow-xl transition-all">
        <div class="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900"><img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy"></div>
        <div class="p-5"><p class="text-xs text-slate-400 mb-2">${article.category} · ${article.date}</p><h3 class="font-bold text-slate-800 dark:text-white line-clamp-2">${article.title}</h3><p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">${article.excerpt}</p></div>
      </a>`).join('');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => mountLayout(document.body.dataset.page), { once: true });
} else {
  mountLayout(document.body.dataset.page);
}

/* ---------------- Breadcrumb helper ---------------- */
function breadcrumbHTML(items) {
  return `<nav class="text-sm text-slate-500 dark:text-slate-400 mb-6 flex items-center flex-wrap gap-1.5">
    ${items.map((it, i) => i === items.length - 1
    ? `<span class="text-slate-700 dark:text-slate-200 font-semibold">${it.label}</span>`
    : `<a href="${it.href}" class="hover:text-primary transition-colors">${it.label}</a>${icon('chevronRight', 'w-3.5 h-3.5 text-slate-300 dark:text-slate-600')}`
  ).join('')}
  </nav>`;
}
