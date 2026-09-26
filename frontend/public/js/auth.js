/* ============================================================
   NovaTech — Auth (login/register/forgot), Profile,
   Orders and Wishlist page logic. Mocked with localStorage.
   ============================================================ */

function getUsers(){ return JSON.parse(localStorage.getItem('estore_users') || '[]'); }
function getCurrentUser(){ return JSON.parse(localStorage.getItem('estore_user') || 'null'); }
function logout(){ localStorage.removeItem('estore_user'); window.location.href = 'login.html'; }

function fieldError(inputEl, msg){
  const wrap = inputEl.closest('div');
  let err = wrap.querySelector('.field-error');
  if (msg){
    inputEl.classList.add('border-sale','focus:ring-sale/30');
    inputEl.classList.remove('border-slate-200','dark:border-slate-700');
    if (!err){ err = document.createElement('p'); err.className='field-error text-xs text-sale mt-1.5'; wrap.appendChild(err); }
    err.textContent = msg;
  } else {
    inputEl.classList.remove('border-sale','focus:ring-sale/30');
    inputEl.classList.add('border-slate-200');
    if (err) err.remove();
  }
}

function handleLogin(e){
  e.preventDefault();
  const form = e.target;
  const email = form.email, pass = form.password;
  let ok = true;
  if (!/^\S+@\S+\.\S+$/.test(email.value)){ fieldError(email, 'Email không hợp lệ'); ok = false; } else fieldError(email, '');
  if (pass.value.length < 6){ fieldError(pass, 'Mật khẩu phải có ít nhất 6 ký tự'); ok = false; } else fieldError(pass, '');
  if (!ok) return;
  const user = getUsers().find(u => u.email === email.value) || { name: email.value.split('@')[0], email: email.value, phone:'', address:'' };
  localStorage.setItem('estore_user', JSON.stringify(user));
  showToast('Đăng nhập thành công. Chào mừng bạn trở lại!', 'success');
  setTimeout(()=> window.location.href = 'index.html', 700);
}

function passwordStrength(pw){
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}
function updateStrengthBar(pw){
  const bar = document.getElementById('strength-bar'); const label = document.getElementById('strength-label');
  if (!bar) return;
  const s = passwordStrength(pw);
  const levels = [
    { w:'5%', color:'bg-slate-200 dark:bg-slate-700', text:'' },
    { w:'25%', color:'bg-sale', text:'Yếu' },
    { w:'50%', color:'bg-orange-500', text:'Trung bình' },
    { w:'75%', color:'bg-amber-400', text:'Khá' },
    { w:'100%', color:'bg-success', text:'Mạnh' },
  ];
  const l = levels[s];
  bar.style.width = l.w; bar.className = `h-1.5 rounded-full transition-all duration-300 ${l.color}`;
  label.textContent = pw ? l.text : '';
}

function handleRegister(e){
  e.preventDefault();
  const f = e.target;
  let ok = true;
  if (f.name.value.trim().length < 2){ fieldError(f.name,'Vui lòng nhập họ tên'); ok=false; } else fieldError(f.name,'');
  if (!/^\S+@\S+\.\S+$/.test(f.email.value)){ fieldError(f.email,'Email không hợp lệ'); ok=false; } else fieldError(f.email,'');
  if (!/^0\d{9}$/.test(f.phone.value)){ fieldError(f.phone,'Số điện thoại không hợp lệ (VD: 0901234567)'); ok=false; } else fieldError(f.phone,'');
  if (f.password.value.length < 6){ fieldError(f.password,'Mật khẩu phải có ít nhất 6 ký tự'); ok=false; } else fieldError(f.password,'');
  if (f.confirm.value !== f.password.value){ fieldError(f.confirm,'Mật khẩu xác nhận không khớp'); ok=false; } else fieldError(f.confirm,'');
  if (!f.agree.checked){ showToast('Vui lòng đồng ý với điều khoản sử dụng', 'error'); ok=false; }
  if (!ok) return;
  const users = getUsers();
  const user = { name:f.name.value, email:f.email.value, phone:f.phone.value, address:'' };
  users.push(user); localStorage.setItem('estore_users', JSON.stringify(users));
  localStorage.setItem('estore_user', JSON.stringify(user));
  showToast('Tạo tài khoản thành công!', 'success');
  setTimeout(()=> window.location.href = 'index.html', 700);
}

function handleForgot(e){
  e.preventDefault();
  const email = e.target.email;
  if (!/^\S+@\S+\.\S+$/.test(email.value)){ fieldError(email,'Email không hợp lệ'); return; }
  fieldError(email,'');
  document.getElementById('forgot-form').classList.add('hidden');
  document.getElementById('forgot-success').classList.remove('hidden');
}

/* ================= Profile ================= */
function renderProfilePage(){
  const user = getCurrentUser() || { name:'Khách', email:'', phone:'', address:'' };
  document.getElementById('profile-name').textContent = user.name;
  document.getElementById('profile-email').textContent = user.email || 'Chưa đăng nhập';
  const f = document.getElementById('profile-form');
  f.name.value = user.name || ''; f.email.value = user.email || ''; f.phone.value = user.phone || ''; f.address.value = user.address || '';
}
function saveProfile(e){
  e.preventDefault(); const f = e.target;
  const user = { name:f.name.value, email:f.email.value, phone:f.phone.value, address:f.address.value };
  localStorage.setItem('estore_user', JSON.stringify(user));
  showToast('Cập nhật thông tin thành công', 'success');
  renderProfilePage();
}

/* ================= Wishlist page ================= */
function renderWishlistPage(){
  const ids = getWishlist();
  const grid = document.getElementById('wishlist-grid');
  const empty = document.getElementById('wishlist-empty');
  if (!ids.length){ grid.innerHTML=''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  grid.innerHTML = productGrid(ids.map(id=>getProduct(id)).filter(Boolean));
}

/* ================= Orders ================= */
const STATUS_STYLE = {
  'Chờ xử lý':'bg-amber-100 text-amber-700', 'Đang giao':'bg-blue-100 text-blue-700',
  'Đã giao':'bg-green-100 text-green-700', 'Đã hủy':'bg-red-100 text-red-700'
};
function renderOrdersPage(){
  const orders = JSON.parse(localStorage.getItem('estore_orders') || '[]');
  const wrap = document.getElementById('orders-table');
  const empty = document.getElementById('orders-empty');
  if (!orders.length){ wrap.innerHTML=''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  wrap.innerHTML = `
  <div class="overflow-x-auto">
  <table class="w-full text-sm min-w-[640px]">
    <thead><tr class="text-left text-slate-400 border-b border-slate-100 dark:border-slate-700">
      <th class="py-3 font-medium">Mã đơn</th><th class="py-3 font-medium">Ngày đặt</th><th class="py-3 font-medium">Sản phẩm</th><th class="py-3 font-medium">Tổng tiền</th><th class="py-3 font-medium">Trạng thái</th><th class="py-3 font-medium"></th>
    </tr></thead>
    <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
      ${orders.map(o=>`
      <tr>
        <td class="py-3.5 font-medium text-slate-700 dark:text-slate-200">#${o.id}</td>
        <td class="py-3.5 text-slate-500">${o.date}</td>
        <td class="py-3.5 text-slate-500">${o.items.length} sản phẩm</td>
        <td class="py-3.5 font-semibold text-primary">${fmtPrice(o.total)}</td>
        <td class="py-3.5"><span class="px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[o.status]}">${o.status}</span></td>
        <td class="py-3.5"><a href="order-detail.html?id=${o.id}" class="text-primary text-sm font-medium hover:underline">Xem chi tiết</a></td>
      </tr>`).join('')}
    </tbody>
  </table></div>`;
}

function renderOrderDetailPage(){
  const orders = JSON.parse(localStorage.getItem('estore_orders') || '[]');
  const order = orders.find(o => o.id === qs('id')) || orders[0];
  const root = document.getElementById('order-detail-root');
  if (!order){ root.innerHTML = `<div class="text-center py-20"><p class="text-slate-400 mb-4">Chưa có đơn hàng nào để hiển thị.</p><a href="shop.html" class="text-primary font-medium hover:underline">Bắt đầu mua sắm</a></div>`; return; }
  const steps = ['Đặt hàng','Xác nhận','Đóng gói','Đang giao','Đã giao'];
  const activeStep = order.status === 'Đã hủy' ? 0 : order.status === 'Chờ xử lý' ? 1 : order.status === 'Đang giao' ? 3 : 4;
  root.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-8">
      <div><h1 class="text-xl font-bold text-slate-800 dark:text-white">Đơn hàng #${order.id}</h1><p class="text-sm text-slate-400">Đặt ngày ${order.date}</p></div>
      <span class="px-3 py-1.5 rounded-full text-sm font-medium ${STATUS_STYLE[order.status]}">${order.status}</span>
    </div>
    <div class="flex items-center mb-10 overflow-x-auto pb-2">
      ${steps.map((s,i)=>`
        <div class="flex items-center ${i<steps.length-1?'flex-1 min-w-[90px]':''}">
          <div class="flex flex-col items-center gap-2 shrink-0">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${i<=activeStep?'bg-primary text-white':'bg-slate-100 dark:bg-slate-700 text-slate-400'}">${i+1}</div>
            <span class="text-xs text-slate-500 whitespace-nowrap">${s}</span>
          </div>
          ${i<steps.length-1?`<div class="flex-1 h-0.5 mx-2 ${i<activeStep?'bg-primary':'bg-slate-100 dark:bg-slate-700'}"></div>`:''}
        </div>`).join('')}
    </div>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="md:col-span-2">
        <h3 class="font-semibold text-slate-800 dark:text-white mb-3">Sản phẩm</h3>
        ${order.items.map(it=>{ const p=getProduct(it.id); if(!p) return ''; return `
        <div class="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-700">
          <div class="w-14 h-14 rounded-xl shrink-0 overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-1 flex items-center justify-center shadow-sm">
            ${p.image ? `<img src="${p.image}" alt="${p.name}" class="w-full h-full object-contain rounded-lg">` : `<div class="tile w-full h-full rounded-lg" style="background:linear-gradient(135deg, ${CAT_COLOR[p.category]}14, ${CAT_COLOR[p.category]}33); color:${CAT_COLOR[p.category]}">${icon(p.category,'w-6 h-6')}</div>`}
          </div>
          <div class="flex-1"><p class="text-sm font-medium text-slate-800 dark:text-slate-200">${p.name}</p><p class="text-xs text-slate-400">SL: ${it.qty}</p></div>
          <p class="text-sm font-bold text-slate-800 dark:text-slate-200">${fmtPrice(p.price*it.qty)}</p>
        </div>`; }).join('')}
      </div>
      <div>
        <div class="border border-slate-100 dark:border-slate-700 rounded-xl p-5 mb-5">
          <h3 class="font-semibold text-slate-800 dark:text-white mb-2 text-sm">Thanh toán</h3>
          <p class="text-sm text-slate-500 mb-1">Phương thức: Thanh toán khi nhận hàng</p>
          <p class="text-lg font-bold text-primary mt-2">${fmtPrice(order.total)}</p>
        </div>
        <div class="border border-slate-100 dark:border-slate-700 rounded-xl p-5">
          <h3 class="font-semibold text-slate-800 dark:text-white mb-2 text-sm">Giao đến</h3>
          <p class="text-sm text-slate-500">${(getCurrentUser()||{}).address || 'Chưa cập nhật địa chỉ'}</p>
        </div>
      </div>
    </div>`;
}
