/* ============================================================
   NovaTech — Shop listing (filter/sort/pagination)
   and Product Detail page logic.
   ============================================================ */

const PAGE_SIZE = 8;
let shopState = { cat: [], price: [], brand: [], rating: 0, sort: 'newest', q: '', page: 1 };

function qs(name) { return new URLSearchParams(window.location.search).get(name); }

function initShopState() {
  const cat = qs('cat'); if (cat) shopState.cat = [cat];
  if (qs('sale')) shopState.price = [];
  shopState.q = qs('q') || '';
  const sort = qs('sort'); if (sort === 'new') shopState.sort = 'newest';
}

const PRICE_RANGES = [
  { id: 'r1', label: '0 - 1 triệu', min: 0, max: 1000000 },
  { id: 'r2', label: '1 - 5 triệu', min: 1000000, max: 5000000 },
  { id: 'r3', label: '5 - 10 triệu', min: 5000000, max: 10000000 },
  { id: 'r4', label: '10 - 20 triệu', min: 10000000, max: 20000000 },
  { id: 'r5', label: 'Trên 20 triệu', min: 20000000, max: Infinity },
];

function shopSidebarHTML() {
  return `
  <div class="space-y-7">
    <div>
      <h3 class="font-semibold text-slate-800 dark:text-white mb-3">Danh mục</h3>
      <div class="space-y-2 text-sm">
        ${CATEGORIES.map(c => `
          <label class="flex items-center gap-2.5 cursor-pointer text-slate-600 dark:text-slate-300">
            <input type="checkbox" onchange="toggleFilter('cat','${c.id}')" ${shopState.cat.includes(c.id) ? 'checked' : ''} class="rounded border-slate-300 text-primary focus:ring-primary">
            ${c.name} <span class="text-slate-400">(${c.count})</span>
          </label>`).join('')}
      </div>
    </div>
    <div>
      <h3 class="font-semibold text-slate-800 dark:text-white mb-3">Khoảng giá</h3>
      <div class="space-y-2 text-sm">
        ${PRICE_RANGES.map(r => `
          <label class="flex items-center gap-2.5 cursor-pointer text-slate-600 dark:text-slate-300">
            <input type="checkbox" onchange="toggleFilter('price','${r.id}')" ${shopState.price.includes(r.id) ? 'checked' : ''} class="rounded border-slate-300 text-primary focus:ring-primary">
            ${r.label}
          </label>`).join('')}
      </div>
    </div>
    <div>
      <h3 class="font-semibold text-slate-800 dark:text-white mb-3">Thương hiệu</h3>
      <div class="space-y-2 text-sm max-h-40 overflow-y-auto pr-1">
        ${BRANDS.map(b => `
          <label class="flex items-center gap-2.5 cursor-pointer text-slate-600 dark:text-slate-300">
            <input type="checkbox" onchange="toggleFilter('brand','${b}')" ${shopState.brand.includes(b) ? 'checked' : ''} class="rounded border-slate-300 text-primary focus:ring-primary">
            ${b}
          </label>`).join('')}
      </div>
    </div>
    <div>
      <h3 class="font-semibold text-slate-800 dark:text-white mb-3">Đánh giá</h3>
      <div class="space-y-2 text-sm">
        ${[5, 4, 3].map(r => `
          <button onclick="setRatingFilter(${r})" class="flex items-center gap-1.5 ${shopState.rating === r ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}">
            ${starsHTML(r)} <span>trở lên</span>
          </button>`).join('')}
      </div>
    </div>
    <button onclick="resetFilters()" class="text-sm text-primary font-medium hover:underline">Xóa tất cả bộ lọc</button>
  </div>`;
}

function toggleFilter(type, value) {
  const arr = shopState[type];
  const i = arr.indexOf(value);
  if (i > -1) arr.splice(i, 1); else arr.push(value);
  shopState.page = 1;
  renderShopPage();
}
function setRatingFilter(r) { shopState.rating = shopState.rating === r ? 0 : r; renderShopPage(); }
function resetFilters() { shopState = { cat: [], price: [], brand: [], rating: 0, sort: 'newest', q: '', page: 1 }; renderShopPage(); }

function filteredProducts() {
  let list = [...PRODUCTS];
  if (shopState.q) list = list.filter(p => p.name.toLowerCase().includes(shopState.q.toLowerCase()));
  if (shopState.cat.length) list = list.filter(p => shopState.cat.includes(p.category));
  if (shopState.brand.length) list = list.filter(p => shopState.brand.includes(p.brand));
  if (shopState.price.length) list = list.filter(p => shopState.price.some(id => { const r = PRICE_RANGES.find(x => x.id === id); return p.price >= r.min && p.price < r.max; }));
  if (shopState.rating) list = list.filter(p => p.rating >= shopState.rating);
  switch (shopState.sort) {
    case 'priceAsc': list.sort((a, b) => a.price - b.price); break;
    case 'priceDesc': list.sort((a, b) => b.price - a.price); break;
    case 'rating': list.sort((a, b) => b.rating - a.rating); break;
    case 'bestseller': list.sort((a, b) => b.sold - a.sold); break;
    default: list.sort((a, b) => b.id - a.id);
  }
  return list;
}

function renderShopPage() {
  const list = filteredProducts();
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  shopState.page = Math.min(shopState.page, totalPages);
  const pageItems = list.slice((shopState.page - 1) * PAGE_SIZE, shopState.page * PAGE_SIZE);

  document.getElementById('shop-sidebar').innerHTML = shopSidebarHTML();
  document.getElementById('shop-count').textContent = `${list.length} sản phẩm`;
  document.getElementById('shop-grid').innerHTML = list.length
    ? productGrid(pageItems)
    : `<div class="text-center py-20 text-slate-400"><p class="text-lg font-medium mb-1">Không tìm thấy sản phẩm phù hợp</p><p class="text-sm">Hãy thử điều chỉnh lại bộ lọc của bạn.</p></div>`;

  const pag = document.getElementById('shop-pagination');
  if (totalPages > 1) {
    let html = `<button onclick="gotoPage(${shopState.page - 1})" ${shopState.page === 1 ? 'disabled' : ''} class="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center disabled:opacity-40 text-slate-500">‹</button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button onclick="gotoPage(${i})" class="w-9 h-9 rounded-lg text-sm font-medium ${i === shopState.page ? 'bg-primary text-white' : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}">${i}</button>`;
    }
    html += `<button onclick="gotoPage(${shopState.page + 1})" ${shopState.page === totalPages ? 'disabled' : ''} class="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center disabled:opacity-40 text-slate-500">›</button>`;
    pag.innerHTML = html;
  } else pag.innerHTML = '';
}
function gotoPage(p) { shopState.page = p; renderShopPage(); window.scrollTo({ top: 280, behavior: 'smooth' }); }

function initializeShopRoute() {
  const grid = document.getElementById('shop-grid');
  if (!grid) return;

  const breadcrumb = document.getElementById('shop-breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = breadcrumbHTML([
      { label: 'Trang chủ', href: '/' },
      { label: 'Sản phẩm', href: '/products' },
    ]);
  }

  const filterButton = document.getElementById('filter-mobile-btn');
  const filterDrawer = document.getElementById('filter-drawer');
  if (filterButton && filterDrawer) {
    filterButton.innerHTML = `${icon('filter', 'w-4 h-4')} Bộ lọc`;
    filterButton.addEventListener('click', () => filterDrawer.classList.remove('hidden'));
  }

  initShopState();
  renderShopPage();
}

window.initializeShopRoute = initializeShopRoute;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeShopRoute, { once: true });
} else {
  initializeShopRoute();
}

/* ================= Product Detail ================= */
let pdQty = 1;
function renderProductDetail() {
  const p = getProduct(Number(qs('id')) || PRODUCTS[0].id);
  if (!p) { document.getElementById('pd-root').innerHTML = '<p class="py-20 text-center text-slate-400">Không tìm thấy sản phẩm.</p>'; return; }
  document.title = p.name + ' — NovaTech';
  document.getElementById('pd-breadcrumb').innerHTML = breadcrumbHTML([
    { label: 'Trang chủ', href: 'index.html' }, { label: 'Sản phẩm', href: 'shop.html' },
    { label: CATEGORIES.find(c => c.id === p.category).name, href: `shop.html?cat=${p.category}` }, { label: p.name, href: '#' }
  ]);
  const color = CAT_COLOR[p.category];
  const galleryImgs = p.images && p.images.length ? p.images : (p.image ? [p.image] : []);
  const mainImg = galleryImgs[0] || '';

  document.getElementById('pd-gallery').innerHTML = `
    <div id="pd-main" class="relative aspect-square rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center p-6 shadow-sm">
      ${mainImg ? `
        <img id="pd-main-img" src="${mainImg}" alt="${p.name}" class="w-full h-full object-contain rounded-2xl transition-all duration-300">
      ` : `
        <div class="tile w-full h-full rounded-2xl flex items-center justify-center" style="background:linear-gradient(135deg, ${color}14, ${color}33); color:${color}">
          ${icon(p.category, 'w-28 h-28')}
        </div>
      `}
    </div>
    ${galleryImgs.length > 1 ? `
      <div class="grid grid-cols-4 gap-3 mt-4">
        ${galleryImgs.map((img, i) => `
          <button onclick="pdThumb(${i}, '${img}')" class="aspect-square rounded-2xl border-2 ${i === 0 ? 'border-primary shadow-md' : 'border-slate-200 dark:border-slate-800'} overflow-hidden p-2 bg-white dark:bg-slate-900 transition-all hover:border-primary/70">
            <img src="${img}" alt="${p.name} ${i + 1}" class="w-full h-full object-contain rounded-xl">
          </button>
        `).join('')}
      </div>
    ` : ''}`;

  document.getElementById('pd-info').innerHTML = `
    ${p.badge ? `<span class="inline-block bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-full mb-3">${p.badge === 'HOT' ? '🔥 BEST SELLER' : p.badge}</span>` : ''}
    <h1 class="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white mb-2 leading-snug">${p.name}</h1>
    <div class="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-4">
      <span class="flex items-center gap-1">${starsHTML(p.rating)} <b class="text-slate-700 dark:text-slate-200 ml-1">${p.rating}</b></span>
      <span>(${p.reviews} đánh giá)</span><span>·</span><span>Mã SP: NV-${String(p.id).padStart(5, '0')}</span>
    </div>
    <div class="flex items-baseline gap-3 mb-2">
      <span class="text-3xl font-black text-blue-600 dark:text-blue-400">${fmtPrice(p.price)}</span>
      ${p.oldPrice ? `<span class="text-lg text-slate-400 line-through">${fmtPrice(p.oldPrice)}</span><span class="bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold px-2 py-0.5 rounded-full">-${p.discount}%</span>` : ''}
    </div>
    <p class="text-sm ${p.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-sale'} font-medium mb-6">${p.stock > 0 ? `✓ Còn hàng — ${p.stock} sản phẩm sẵn sàng giao nhanh` : 'Hết hàng'}</p>
    <div class="flex items-center gap-4 mb-6">
      <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800">
        <button onclick="pdQtyChange(-1)" class="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white">${icon('minus', 'w-4 h-4')}</button>
        <span id="pd-qty" class="w-10 text-center font-bold">1</span>
        <button onclick="pdQtyChange(1)" class="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white">${icon('plus', 'w-4 h-4')}</button>
      </div>
      <button data-wish="${p.id}" onclick="toggleWishlist(${p.id})" class="${isWished(p.id) ? 'text-rose-500 border-rose-500 bg-rose-50 dark:bg-rose-950/40' : 'text-slate-400 border-slate-200 dark:border-slate-700 hover:text-rose-500'} w-11 h-11 rounded-xl border flex items-center justify-center transition-colors shadow-sm">${icon(isWished(p.id) ? 'heartFill' : 'heart', 'w-5 h-5')}</button>
    </div>
    <div class="flex flex-col sm:flex-row gap-3 mb-8">
      <button onclick="addToCart(${p.id}, pdQty)" class="flex-1 bg-white dark:bg-slate-800 border-2 border-primary text-primary font-bold py-3.5 rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 shadow-sm">${icon('cart', 'w-5 h-5')} Thêm vào giỏ</button>
      <button onclick="addToCart(${p.id}, pdQty); window.location.href='checkout.html'" class="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-primary/25">Mua ngay hôm nay</button>
    </div>
    <div class="grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-700 pt-6 text-xs text-slate-500 dark:text-slate-400">
      <div class="flex flex-col items-center text-center gap-1.5">${icon('truck', 'w-5 h-5 text-primary')} Giao hàng miễn phí toàn quốc</div>
      <div class="flex flex-col items-center text-center gap-1.5">${icon('shield', 'w-5 h-5 text-primary')} Bảo hành chính hãng 12 tháng</div>
      <div class="flex flex-col items-center text-center gap-1.5">${icon('refresh', 'w-5 h-5 text-primary')} Đổi mới 1-1 trong 30 ngày</div>
    </div>`;

  document.getElementById('pd-tabs-content').innerHTML = `
    <div data-tab="desc" class="tab-pane text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${p.description}</div>
    <div data-tab="specs" class="tab-pane hidden text-sm">
      <table class="w-full text-left">
        <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
          ${[['Thương hiệu', p.brand], ['Danh mục', CATEGORIES.find(c => c.id === p.category).name], ['Bảo hành', '12 tháng chính hãng'], ['Xuất xứ', 'Chính hãng phân phối NovaTech']].map(([k, v]) => `<tr><td class="py-2.5 pr-4 text-slate-500 w-40">${k}</td><td class="py-2.5 font-medium text-slate-700 dark:text-slate-200">${v}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div data-tab="reviews" class="tab-pane hidden space-y-5">
      ${[['Nguyễn Văn An', 5, 'Sản phẩm nguyên seal chính hãng, đóng gói cực kỳ cẩn thận và giao nhanh trong ngày. NovaTech phục vụ rất chu đáo!'], ['Trần Hải Đăng', 5, 'Máy chuẩn chất lượng, camera chụp sắc nét, pin trâu dùng cả ngày. Rất đáng tiền, 5 sao cho shop!']].map(([name, r, text]) => `
      <div class="border-b border-slate-100 dark:border-slate-700 pb-5">
        <div class="flex items-center gap-2 mb-1"><span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">${name.charAt(0)}</span><span class="font-semibold text-sm text-slate-700 dark:text-slate-200">${name}</span></div>
        <div class="flex mb-1">${starsHTML(r)}</div>
        <p class="text-sm text-slate-600 dark:text-slate-300">${text}</p>
      </div>`).join('')}
    </div>
    <div data-tab="warranty" class="tab-pane hidden text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
      Sản phẩm được bảo hành chính hãng 12 tháng tại các trung tâm bảo hành ủy quyền hoặc trực tiếp tại hệ thống NovaTech. Cam kết lỗi 1 đổi 1 trong vòng 30 ngày đầu tiên nếu có lỗi kỹ thuật từ nhà sản xuất. Hỗ trợ kỹ thuật trọn đời máy.
    </div>`;

  document.getElementById('pd-related').innerHTML = productGrid(getRelated(p));
}
function pdThumb(i, src) {
  document.querySelectorAll('#pd-gallery button').forEach(b => b.classList.remove('border-primary', 'shadow-md'));
  const btns = document.querySelectorAll('#pd-gallery button');
  if (btns[i]) btns[i].classList.add('border-primary', 'shadow-md');
  const main = document.getElementById('pd-main-img');
  if (main && src) {
    main.style.opacity = '0.4';
    setTimeout(() => { main.src = src; main.style.opacity = '1'; }, 120);
  }
}
function pdQtyChange(d) { pdQty = Math.max(1, pdQty + d); document.getElementById('pd-qty').textContent = pdQty; }
function pdTab(name, el) {
  document.querySelectorAll('.tab-pane').forEach(t => t.classList.add('hidden'));
  document.querySelector(`.tab-pane[data-tab="${name}"]`).classList.remove('hidden');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('text-primary', 'border-primary'));
  el.classList.add('text-primary', 'border-primary');
}

/* ================= Flash sale countdown (home) ================= */
function startCountdown(elId, hours) {
  let end = Number(sessionStorage.getItem('flash_end_' + elId));
  if (!end) { end = Date.now() + hours * 3600 * 1000; sessionStorage.setItem('flash_end_' + elId, end); }
  const el = document.getElementById(elId);
  if (!el) return;
  function tick() {
    let diff = Math.max(0, end - Date.now());
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor(diff % 3600000 / 60000)).padStart(2, '0');
    const s = String(Math.floor(diff % 60000 / 1000)).padStart(2, '0');
    el.textContent = `${h} : ${m} : ${s}`;
  }
  tick(); setInterval(tick, 1000);
}
