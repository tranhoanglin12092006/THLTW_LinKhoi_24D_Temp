/* ============================================================
   NovaTech — Cart & Checkout page logic
   ============================================================ */

function getCoupon(){ return JSON.parse(sessionStorage.getItem('estore_coupon') || 'null'); }

function cartTotals(){
  const cart = getCart();
  const subtotal = cart.reduce((s,i)=>{ const p=getProduct(i.id); return s + (p?p.price*i.qty:0); }, 0);
  const coupon = getCoupon();
  const discount = coupon ? Math.round(subtotal * coupon.percent / 100) : 0;
  const shipping = subtotal > 0 && subtotal < 500000 ? 30000 : 0;
  const total = Math.max(0, subtotal - discount) + shipping;
  return { subtotal, discount, shipping, total, coupon };
}

function renderCartPage(){
  const cart = getCart();
  const listEl = document.getElementById('cart-list');
  const emptyEl = document.getElementById('cart-empty');
  const summaryEl = document.getElementById('cart-summary-wrap');

  if (!cart.length){
    listEl.innerHTML = '';
    summaryEl.classList.add('hidden');
    emptyEl.classList.remove('hidden');
    return;
  }
  emptyEl.classList.add('hidden');
  summaryEl.classList.remove('hidden');

  listEl.innerHTML = cart.map(item => {
    const p = getProduct(item.id); if (!p) return '';
    return `
    <div class="flex gap-4 py-5 border-b border-slate-100 dark:border-slate-700">
      <a href="product-detail.html?id=${p.id}" class="w-24 h-24 rounded-2xl shrink-0 overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 p-2 flex items-center justify-center shadow-sm">
        ${p.image ? `
          <img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain rounded-xl" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
          <div class="tile w-full h-full rounded-xl hidden items-center justify-center" style="background:linear-gradient(135deg, ${CAT_COLOR[p.category]}14, ${CAT_COLOR[p.category]}33); color:${CAT_COLOR[p.category]}">${icon(p.category,'w-10 h-10')}</div>
        ` : `
          <div class="tile w-full h-full rounded-xl flex items-center justify-center" style="background:linear-gradient(135deg, ${CAT_COLOR[p.category]}14, ${CAT_COLOR[p.category]}33); color:${CAT_COLOR[p.category]}">${icon(p.category,'w-10 h-10')}</div>
        `}
      </a>
      <div class="flex-1 min-w-0">
        <div class="flex justify-between gap-2">
          <a href="product-detail.html?id=${p.id}" class="font-semibold text-sm text-slate-800 dark:text-slate-100 hover:text-primary line-clamp-2 transition-colors">${p.name}</a>
          <button onclick="removeFromCart(${p.id})" aria-label="Xóa" class="text-slate-400 hover:text-sale shrink-0 p-1">${icon('trash','w-4 h-4')}</button>
        </div>
        <p class="text-blue-600 dark:text-blue-400 font-bold mt-1">${fmtPrice(p.price)}</p>
        <div class="flex items-center justify-between mt-3">
          <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
            <button onclick="changeCartQty(${p.id},-1)" class="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white">${icon('minus','w-3.5 h-3.5')}</button>
            <span class="w-8 text-center text-sm font-bold">${item.qty}</span>
            <button onclick="changeCartQty(${p.id},1)" class="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white">${icon('plus','w-3.5 h-3.5')}</button>
          </div>
          <p class="text-sm font-extrabold text-slate-800 dark:text-slate-200">${fmtPrice(p.price*item.qty)}</p>
        </div>
      </div>
    </div>`;
  }).join('');

  renderCartSummary();
}

function renderCartSummary(){
  const t = cartTotals();
  const el = document.getElementById('cart-summary');
  if (!el) return;
  el.innerHTML = `
    <div class="flex justify-between text-sm mb-2.5"><span class="text-slate-500 dark:text-slate-400">Tạm tính</span><span class="font-medium text-slate-700 dark:text-slate-200">${fmtPrice(t.subtotal)}</span></div>
    ${t.coupon ? `<div class="flex justify-between text-sm mb-2.5"><span class="text-slate-500 dark:text-slate-400">Giảm giá (${t.coupon.code})</span><span class="font-medium text-success">-${fmtPrice(t.discount)}</span></div>` : ''}
    <div class="flex justify-between text-sm mb-4"><span class="text-slate-500 dark:text-slate-400">Phí vận chuyển</span><span class="font-medium text-slate-700 dark:text-slate-200">${t.shipping? fmtPrice(t.shipping) : 'Miễn phí'}</span></div>
    <div class="flex justify-between border-t border-slate-100 dark:border-slate-700 pt-4 mb-1"><span class="font-semibold text-slate-800 dark:text-white">Tổng cộng</span><span class="text-xl font-bold text-primary">${fmtPrice(t.total)}</span></div>`;
}

function applyCoupon(){
  const input = document.getElementById('coupon-input');
  const code = input.value.trim().toUpperCase();
  const valid = { 'SALE10': 10, 'SALE20': 20 };
  const msg = document.getElementById('coupon-msg');
  if (valid[code]){
    sessionStorage.setItem('estore_coupon', JSON.stringify({ code, percent: valid[code] }));
    msg.textContent = `Áp dụng mã "${code}" thành công — giảm ${valid[code]}%`;
    msg.className = 'text-xs text-success mt-2';
    renderCartSummary();
    if (typeof renderCheckoutSummary === 'function') renderCheckoutSummary();
  } else {
    msg.textContent = 'Mã giảm giá không hợp lệ. Thử "SALE10" hoặc "SALE20".';
    msg.className = 'text-xs text-sale mt-2';
  }
}

/* ================= Checkout ================= */
function renderCheckoutSummary(){
  const cart = getCart();
  const el = document.getElementById('checkout-items');
  if (!el) return;
  if (!cart.length){ window.location.href = 'cart.html'; return; }
  el.innerHTML = cart.map(item => { const p = getProduct(item.id); if (!p) return '';
    return `<div class="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-700">
      <div class="w-14 h-14 rounded-xl shrink-0 overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-1 flex items-center justify-center shadow-sm">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain rounded-lg">` : `<div class="tile w-full h-full rounded-lg" style="background:linear-gradient(135deg, ${CAT_COLOR[p.category]}14, ${CAT_COLOR[p.category]}33); color:${CAT_COLOR[p.category]}">${icon(p.category,'w-6 h-6')}</div>`}
      </div>
      <div class="flex-1 min-w-0"><p class="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-1">${p.name}</p><p class="text-xs text-slate-400">SL: ${item.qty}</p></div>
      <p class="text-sm font-bold text-slate-800 dark:text-slate-200">${fmtPrice(p.price*item.qty)}</p>
    </div>`; }).join('');
  renderCartSummary.call(null);
  const t = cartTotals();
  document.getElementById('checkout-summary').innerHTML = `
    <div class="flex justify-between text-sm mb-2.5"><span class="text-slate-500 dark:text-slate-400">Tạm tính</span><span>${fmtPrice(t.subtotal)}</span></div>
    ${t.coupon ? `<div class="flex justify-between text-sm mb-2.5"><span class="text-slate-500 dark:text-slate-400">Giảm giá</span><span class="text-success">-${fmtPrice(t.discount)}</span></div>` : ''}
    <div class="flex justify-between text-sm mb-4"><span class="text-slate-500 dark:text-slate-400">Vận chuyển</span><span>${t.shipping?fmtPrice(t.shipping):'Miễn phí'}</span></div>
    <div class="flex justify-between border-t border-slate-100 dark:border-slate-700 pt-4"><span class="font-semibold">Tổng cộng</span><span class="text-xl font-bold text-primary">${fmtPrice(t.total)}</span></div>`;
}

function submitOrder(e){
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()){ form.reportValidity(); return; }
  const orderId = 'DH' + Date.now().toString().slice(-8);
  const orders = JSON.parse(localStorage.getItem('estore_orders') || '[]');
  orders.unshift({ id: orderId, date: new Date().toLocaleDateString('vi-VN'), items: getCart(), total: cartTotals().total, status: 'Chờ xử lý' });
  localStorage.setItem('estore_orders', JSON.stringify(orders));
  localStorage.setItem('estore_cart', '[]');
  sessionStorage.removeItem('estore_coupon');
  showToast('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.', 'success');
  setTimeout(()=> window.location.href = 'order-detail.html?id=' + orderId, 900);
}
