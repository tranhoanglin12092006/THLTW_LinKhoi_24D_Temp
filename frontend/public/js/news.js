/* ============================================================
   NovaTech — News list & detail
   ============================================================ */

let newsState = { cat: 'Tất cả', page: 1 };
const NEWS_PAGE_SIZE = 4;
const NEWS_CATS = ['Tất cả', 'Công nghệ', 'Điện thoại', 'Laptop', 'Gaming', 'Tips & Tricks', 'Khuyến mãi'];

function newsCardHTML(n) {
  return `
  <a href="news-detail.html?slug=${n.slug}" class="group bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-100 dark:border-slate-700/80 overflow-hidden hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 block">
    <div class="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
      ${n.image ? `
        <img src="${n.image}" alt="${n.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
      ` : `
        <div class="tile w-full h-full flex items-center justify-center" style="background:linear-gradient(135deg,#2563EB14,#06B6D433)"><span class="text-primary">${icon('package', 'w-12 h-12')}</span></div>
      `}
      <span class="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 text-primary text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-sm shadow-sm">${n.category}</span>
    </div>
    <div class="p-5">
      <div class="flex items-center gap-2 text-xs text-slate-400 mb-2 font-medium"><span>Tác giả: ${n.author}</span><span>·</span><span>${n.date}</span></div>
      <h3 class="font-bold text-slate-800 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-snug">${n.title}</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">${n.excerpt}</p>
      <span class="text-sm text-primary font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">Đọc tiếp →</span>
    </div>
  </a>`;
}

function renderNewsFilters() {
  const wrap = document.getElementById('news-filters');
  if (!wrap) return;
  wrap.innerHTML = NEWS_CATS.map(c => `<button onclick="setNewsCat('${c}')" class="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${newsState.cat === c ? 'bg-primary text-white shadow-md shadow-primary/25' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary'}">${c}</button>`).join('');
}

function setNewsCat(c) {
  newsState.cat = c;
  newsState.page = 1;
  renderNewsPage();
}

function renderNewsPage() {
  renderNewsFilters();
  const list = newsState.cat === 'Tất cả' ? NEWS : NEWS.filter(n => n.category === newsState.cat);
  const totalPages = Math.max(1, Math.ceil(list.length / NEWS_PAGE_SIZE));
  newsState.page = Math.min(newsState.page, totalPages);
  const items = list.slice((newsState.page - 1) * NEWS_PAGE_SIZE, newsState.page * NEWS_PAGE_SIZE);
  const grid = document.getElementById('news-grid');
  if (grid) {
    grid.innerHTML = items.length ? items.map(newsCardHTML).join('') : `<p class="col-span-full text-center text-slate-400 py-16">Chưa có bài viết trong danh mục này.</p>`;
  }
  const pag = document.getElementById('news-pagination');
  if (pag) {
    pag.innerHTML = totalPages > 1 ? Array.from({ length: totalPages }, (_, i) => i + 1).map(i => `<button onclick="newsState.page=${i}; renderNewsPage()" class="w-9 h-9 rounded-lg text-sm font-medium ${i === newsState.page ? 'bg-primary text-white' : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}">${i}</button>`).join('') : '';
  }
}

function renderNewsDetailPage() {
  const n = NEWS.find(x => x.slug === qs('slug')) || NEWS[0];
  document.title = n.title + ' — NovaTech';
  const bc = document.getElementById('nd-breadcrumb');
  if (bc) {
    bc.innerHTML = breadcrumbHTML([{ label: 'Trang chủ', href: 'index.html' }, { label: 'Tin tức', href: 'news.html' }, { label: n.title, href: '#' }]);
  }
  const root = document.getElementById('nd-root');
  if (root) {
    root.innerHTML = `
      <span class="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-3">${n.category}</span>
      <h1 class="text-2xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-4 leading-tight">${n.title}</h1>
      <div class="flex items-center gap-3 text-sm text-slate-400 mb-6">
        <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">${n.author.charAt(0)}</span>
        <span class="font-medium text-slate-600 dark:text-slate-300">${n.author}</span><span>·</span><span>${n.date}</span>
      </div>
      ${n.image ? `
        <div class="aspect-[21/9] rounded-2xl overflow-hidden mb-8 shadow-lg">
          <img src="${n.image}" alt="${n.title}" class="w-full h-full object-cover">
        </div>
      ` : `
        <div class="tile aspect-[21/9] rounded-2xl mb-8" style="background:linear-gradient(135deg,#2563EB14,#06B6D433)"><span class="text-primary">${icon('package', 'w-16 h-16')}</span></div>
      `}
      <div class="prose-content text-slate-600 dark:text-slate-300 leading-relaxed space-y-5 text-base">
        <p class="font-medium text-slate-700 dark:text-slate-200 text-lg">${n.excerpt}</p>
        <p>${n.content}</p>
        <blockquote class="border-l-4 border-primary pl-4 italic text-slate-500 dark:text-slate-400 my-6 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-r-lg">"Công nghệ tốt nhất là công nghệ phục vụ và nâng tầm cuộc sống của bạn."</blockquote>
        <h3 class="text-xl font-bold text-slate-800 dark:text-white pt-2">Nhận định từ NovaTech</h3>
        <p>Đội ngũ chuyên gia công nghệ tại NovaTech sẽ liên tục cập nhật những phân tích chuyên sâu và hướng dẫn trải nghiệm thiết bị mới nhất. Quý khách hàng có thể trải nghiệm trực tiếp các sản phẩm này tại các showroom NovaTech trên toàn quốc.</p>
      </div>
      <div class="flex items-center gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
        <span class="text-sm font-semibold text-slate-500">Chia sẻ bài viết:</span>
        ${['facebook', 'tiktok', 'youtube'].map(s => `<a href="#" aria-label="${s}" class="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-colors">${icon(s, 'w-4 h-4')}</a>`).join('')}
      </div>`;
  }
  const rel = document.getElementById('nd-related');
  if (rel) {
    rel.innerHTML = NEWS.filter(x => x.id !== n.id).slice(0, 3).map(newsCardHTML).join('');
  }
}
