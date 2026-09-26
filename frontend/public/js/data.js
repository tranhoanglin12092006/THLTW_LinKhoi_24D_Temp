/* ============================================================
   NovaTech — Sample data
   ============================================================ */

const CATEGORIES = [
  { id: 'smartphone', name: 'Điện thoại', icon: 'smartphone', count: 5, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&auto=format&fit=crop&q=80' },
  { id: 'laptop', name: 'Laptop', icon: 'laptop', count: 4, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80' },
  { id: 'tablet', name: 'Tablet', icon: 'tablet', count: 2, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop&q=80' },
  { id: 'headphone', name: 'Tai nghe', icon: 'headphones', count: 3, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80' },
  { id: 'smartwatch', name: 'Đồng hồ', icon: 'watch', count: 2, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&auto=format&fit=crop&q=80' },
  { id: 'gaming', name: 'Gaming', icon: 'gamepad', count: 2, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&auto=format&fit=crop&q=80' },
  { id: 'camera', name: 'Camera', icon: 'camera', count: 1, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=80' },
  { id: 'accessories', name: 'Phụ kiện', icon: 'plug', count: 1, image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=400&auto=format&fit=crop&q=80' },
];

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Asus', 'Lenovo', 'Dell', 'HP', 'Xiaomi'];

/* colors used for placeholder tiles, per category (also used on detail gallery) */
const CAT_COLOR = {
  smartphone: '#2563EB', laptop: '#0F172A', tablet: '#06B6D4',
  headphone: '#7C3AED', smartwatch: '#F59E0B', gaming: '#EF4444',
  camera: '#059669', accessories: '#64748B'
};

const PRODUCTS = [
  {
    id: 1,
    name: 'iPhone 16 Pro Max 256GB',
    slug: 'iphone-16-pro-max-256gb',
    category: 'smartphone',
    brand: 'Apple',
    price: 29990000,
    oldPrice: 33990000,
    discount: 12,
    rating: 4.9,
    reviews: 328,
    stock: 15,
    badge: 'HOT',
    sold: 82,
    description: 'Chip A18 Pro mạnh mẽ, camera 48MP nâng cấp với cảm biến Quad-pixel, khung Titan bền bỉ sang trọng. Trải nghiệm mượt mà cho mọi tác vụ gaming và đồ họa chuyên nghiệp.',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    category: 'smartphone',
    brand: 'Samsung',
    price: 26990000,
    oldPrice: 29990000,
    discount: 10,
    rating: 4.8,
    reviews: 214,
    stock: 22,
    badge: 'NEW',
    sold: 41,
    description: 'Bút S Pen tích hợp, màn hình Dynamic AMOLED 2X 120Hz siêu nét, camera zoom 100x Space Zoom kết hợp sức mạnh Galaxy AI đột phá.',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 3,
    name: 'Xiaomi 14 Ultra',
    slug: 'xiaomi-14-ultra',
    category: 'smartphone',
    brand: 'Xiaomi',
    price: 19990000,
    oldPrice: 22990000,
    discount: 13,
    rating: 4.6,
    reviews: 97,
    stock: 30,
    badge: 'SALE',
    sold: 58,
    description: 'Hệ thống 4 camera Leica chuyên nghiệp khẩu độ biến thiên, hiệu năng Snapdragon 8 Gen 3 đỉnh cao và sạc siêu nhanh 90W HyperCharge.',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 4,
    name: 'iPhone 15 128GB',
    slug: 'iphone-15',
    category: 'smartphone',
    brand: 'Apple',
    price: 17990000,
    oldPrice: null,
    discount: 0,
    rating: 4.7,
    reviews: 512,
    stock: 40,
    badge: '',
    sold: 120,
    description: 'Dynamic Island thời thượng, camera chính 48MP sắc nét, mặt lưng kính pha màu cùng cổng kết nối USB-C đa năng hiện đại.',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 5,
    name: 'Samsung Galaxy A55 5G',
    slug: 'samsung-galaxy-a55-5g',
    category: 'smartphone',
    brand: 'Samsung',
    price: 9990000,
    oldPrice: 11490000,
    discount: 13,
    rating: 4.4,
    reviews: 145,
    stock: 50,
    badge: 'NEW',
    sold: 30,
    description: 'Khung viền kim loại sang trọng, màn hình Super AMOLED 120Hz, viên pin lớn 5000mAh và chuẩn chống nước kháng bụi IP67 bền bỉ.',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 6,
    name: 'MacBook Air M3 13"',
    slug: 'macbook-air-m3-13',
    category: 'laptop',
    brand: 'Apple',
    price: 27990000,
    oldPrice: 29990000,
    discount: 7,
    rating: 4.9,
    reviews: 266,
    stock: 18,
    badge: 'HOT',
    sold: 75,
    description: 'Chip M3 thế hệ mới với hiệu năng AI vượt trội, thiết kế nhôm nguyên khối mỏng chỉ 11.3mm, thời lượng pin ấn tượng lên đến 18 giờ.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 7,
    name: 'Dell XPS 13 Plus',
    slug: 'dell-xps-13-plus',
    category: 'laptop',
    brand: 'Dell',
    price: 32990000,
    oldPrice: null,
    discount: 0,
    rating: 4.6,
    reviews: 88,
    stock: 10,
    badge: 'NEW',
    sold: 19,
    description: 'Thiết kế tối giản liền khối tương lai, trackpad xúc giác ẩn dưới mặt kính, màn hình OLED InfinityEdge 3.5K sắc nét tuyệt mỹ.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 8,
    name: 'Asus ROG Zephyrus G14',
    slug: 'asus-rog-zephyrus-g14',
    category: 'laptop',
    brand: 'Asus',
    price: 38990000,
    oldPrice: 44990000,
    discount: 13,
    rating: 4.7,
    reviews: 132,
    stock: 8,
    badge: 'SALE',
    sold: 44,
    description: 'Sức mạnh đồ họa RTX 4060 cân mọi tựa game AAA, màn hình ROG Nebula OLED 120Hz 3K đỉnh cao, trọng lượng chỉ 1.5kg siêu di động.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 9,
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    slug: 'lenovo-thinkpad-x1-carbon',
    category: 'laptop',
    brand: 'Lenovo',
    price: 35990000,
    oldPrice: null,
    discount: 0,
    rating: 4.8,
    reviews: 71,
    stock: 12,
    badge: '',
    sold: 26,
    description: 'Chất liệu sợi carbon chuẩn quân đội siêu bền, bàn phím gõ êm đẳng cấp thế giới, bảo mật cấp độ doanh nghiệp ThinkShield.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 10,
    name: 'iPad Air M2 11" 128GB',
    slug: 'ipad-air-m2-11',
    category: 'tablet',
    brand: 'Apple',
    price: 16990000,
    oldPrice: 18990000,
    discount: 11,
    rating: 4.8,
    reviews: 190,
    stock: 25,
    badge: 'HOT',
    sold: 63,
    description: 'Trang bị chip Apple M2 vượt trội, hỗ trợ Apple Pencil Pro với cử chỉ bóp thông minh, màn hình Liquid Retina sắc nét chống chói.',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 11,
    name: 'Samsung Galaxy Tab S9',
    slug: 'samsung-galaxy-tab-s9',
    category: 'tablet',
    brand: 'Samsung',
    price: 15990000,
    oldPrice: 17990000,
    discount: 11,
    rating: 4.6,
    reviews: 64,
    stock: 15,
    badge: 'SALE',
    sold: 22,
    description: 'Màn hình Dynamic AMOLED 2X rực rỡ, chuẩn chống nước IP68 đầu tiên trên tablet cao cấp, tặng kèm bút S Pen chống nước siêu nhạy.',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 12,
    name: 'Sony WH-1000XM5 Chống Ồn',
    slug: 'sony-wh-1000xm5',
    category: 'headphone',
    brand: 'Sony',
    price: 8490000,
    oldPrice: 9990000,
    discount: 15,
    rating: 4.9,
    reviews: 401,
    stock: 35,
    badge: 'HOT',
    sold: 156,
    description: 'Công nghệ chống ồn Auto NC Optimizer hàng đầu thế giới, 8 micro thu âm chuẩn studio, chất âm Hi-Res Audio cùng thời lượng pin 30 giờ.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 13,
    name: 'AirPods Pro 2 USB-C',
    slug: 'airpods-pro-2',
    category: 'headphone',
    brand: 'Apple',
    price: 5990000,
    oldPrice: 6790000,
    discount: 12,
    rating: 4.8,
    reviews: 522,
    stock: 60,
    badge: 'NEW',
    sold: 98,
    description: 'Chống ồn chủ động mạnh gấp đôi thế hệ trước, âm thanh thích ứng Adaptive Audio, cổng sạc USB-C và hộp sạc tích hợp loa tìm kiếm Precision Finding.',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 14,
    name: 'Sony WF-1000XM5 True Wireless',
    slug: 'sony-wf-1000xm5',
    category: 'headphone',
    brand: 'Sony',
    price: 6290000,
    oldPrice: null,
    discount: 0,
    rating: 4.7,
    reviews: 83,
    stock: 28,
    badge: '',
    sold: 34,
    description: 'Tai nghe không dây nhỏ gọn đỉnh cao, màng loa Dynamic Driver X tái tạo âm bass sâu chắc và chi tiết giọng hát tuyệt đối trung thực.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 15,
    name: 'Apple Watch Series 9 GPS 45mm',
    slug: 'apple-watch-series-9',
    category: 'smartwatch',
    brand: 'Apple',
    price: 10990000,
    oldPrice: 11990000,
    discount: 8,
    rating: 4.8,
    reviews: 245,
    stock: 20,
    badge: 'HOT',
    sold: 71,
    description: 'Chip S9 SiP mạnh mẽ hàng đầu, thao tác chạm hai lần Double Tap kỳ diệu, màn hình sáng tới 2000 nits và tính năng theo dõi sức khỏe toàn diện.',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 16,
    name: 'Samsung Galaxy Watch 6 Classic',
    slug: 'samsung-galaxy-watch-6',
    category: 'smartwatch',
    brand: 'Samsung',
    price: 7490000,
    oldPrice: 8990000,
    discount: 17,
    rating: 4.5,
    reviews: 112,
    stock: 18,
    badge: 'SALE',
    sold: 29,
    description: 'Vòng xoay bezel vật lý đặc trưng, mặt kính Sapphire bền bỉ cao cấp, theo dõi giấc ngủ chuyên sâu và điện tâm đồ ECG chính xác.',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 17,
    name: 'PlayStation 5 Slim 1TB',
    slug: 'playstation-5-slim',
    category: 'gaming',
    brand: 'Sony',
    price: 13990000,
    oldPrice: null,
    discount: 0,
    rating: 4.9,
    reviews: 380,
    stock: 14,
    badge: 'NEW',
    sold: 66,
    description: 'Kích thước nhỏ gọn hơn 30%, ổ SSD 1TB siêu tốc độ load game tức thì, công nghệ Ray Tracing chân thực cùng tay cầm DualSense phản hồi xúc giác đỉnh cao.',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 18,
    name: 'Logitech G Pro X Superlight 2',
    slug: 'logitech-g-pro-x-superlight',
    category: 'gaming',
    brand: 'Asus',
    price: 2790000,
    oldPrice: 3290000,
    discount: 15,
    rating: 4.7,
    reviews: 159,
    stock: 45,
    badge: 'SALE',
    sold: 88,
    description: 'Chuột gaming thi đấu Esports siêu nhẹ chỉ 60g, cảm biến HERO 2 32.000 DPI, switch lai quang học cơ học LIGHTFORCE độ trễ gần như bằng 0.',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 19,
    name: 'Sony Alpha A7 IV Body',
    slug: 'sony-alpha-a7-iv',
    category: 'camera',
    brand: 'Sony',
    price: 52990000,
    oldPrice: 57990000,
    discount: 9,
    rating: 4.9,
    reviews: 56,
    stock: 6,
    badge: 'HOT',
    sold: 18,
    description: 'Cảm biến Full-frame Exmor R 33MP, bộ xử lý hình ảnh BIONZ XR, quay video 4K 60p 10-bit 4:2:2 chuyên nghiệp cùng lấy nét tự động AI theo thời gian thực.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 20,
    name: 'Anker PowerCore 20000mAh 65W',
    slug: 'anker-powercore-20000mah',
    category: 'accessories',
    brand: 'HP',
    price: 990000,
    oldPrice: 1290000,
    discount: 23,
    rating: 4.6,
    reviews: 302,
    stock: 80,
    badge: 'SALE',
    sold: 210,
    description: 'Pin sạc dự phòng dung lượng chuẩn 20000mAh hỗ trợ sạc nhanh chuẩn Power Delivery 65W cho cả laptop và smartphone, bảo vệ đa tầng an toàn tuyệt đối.',
    image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'
    ]
  }
];

const NEWS = [
  {
    id: 1,
    slug: 'iphone-16-pro-max-danh-gia',
    category: 'Điện thoại',
    date: '20/09/2026',
    title: 'Đánh giá chi tiết iPhone 16 Pro Max sau 1 tháng sử dụng thực tế',
    excerpt: 'Hiệu năng A18 Pro, nút Camera Control và thời lượng pin của siêu phẩm Apple có thực sự đáng để nâng cấp?',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    content: 'Sau một tháng gắn bó, iPhone 16 Pro Max cho thấy sự cải thiện rõ rệt về hiệu năng xử lý đồ họa nhờ chip A18 Pro, trong khi hệ thống camera 48MP mang lại chi tiết ấn tượng ngay cả trong điều kiện thiếu sáng. Thời lượng pin đáp ứng tốt một ngày làm việc dài mà không cần sạc bổ sung. Khung Titan giúp máy nhẹ hơn nhưng vẫn giữ được độ bền cao. Với những ai đang dùng iPhone 13 trở về trước, đây là một bản nâng cấp đáng cân nhắc.',
    author: 'Minh Anh'
  },
  {
    id: 2,
    slug: 'top-laptop-gaming-2026',
    category: 'Laptop',
    date: '15/09/2026',
    title: 'Top 5 laptop gaming đột phá đáng mua nhất năm 2026',
    excerpt: 'Từ phân khúc tầm trung đến cỗ máy chiến game cao cấp, điểm mặt những lựa chọn mỏng nhẹ và tản nhiệt đỉnh nhất.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
    content: 'Thị trường laptop gaming năm 2026 chứng kiến sự cạnh tranh khốc liệt giữa các dòng chip mới. Asus ROG Zephyrus G14 tiếp tục dẫn đầu phân khúc mỏng nhẹ nhờ khả năng tản nhiệt hiệu quả. Trong khi đó, các dòng máy tầm trung từ Lenovo và Dell mang đến hiệu năng chơi game 1080p ổn định với mức giá dễ tiếp cận hơn. Bài viết tổng hợp 5 lựa chọn tốt nhất theo từng ngân sách cụ thể.',
    author: 'Quốc Bảo'
  },
  {
    id: 3,
    slug: 'meo-tang-tuoi-tho-pin',
    category: 'Tips & Tricks',
    date: '10/09/2026',
    title: '7 mẹo khoa học đơn giản giúp kéo dài tuổi thọ pin điện thoại',
    excerpt: 'Những thói quen sạc pin đúng cách giúp thiết bị của bạn giữ được dung lượng tối đa suốt nhiều năm.',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
    content: 'Sạc pin từ 20% đến 80% thay vì để cạn kiệt hoàn toàn là một trong những cách hiệu quả nhất để kéo dài tuổi thọ pin lithium-ion. Ngoài ra, tránh để thiết bị ở nhiệt độ quá cao khi sạc, tắt các tính năng không cần thiết chạy nền, và cập nhật phần mềm thường xuyên cũng góp phần tối ưu hóa mức tiêu thụ năng lượng.',
    author: 'Thu Hà'
  },
  {
    id: 4,
    slug: 'flash-sale-thang-9',
    category: 'Khuyến mãi',
    date: '05/09/2026',
    title: 'Mega Flash Sale: Giảm bùng nổ đến 50% cho loạt flagship công nghệ',
    excerpt: 'Cơ hội săn deal hot không thể bỏ lỡ tại NovaTech với hàng ngàn voucher giảm giá và quà tặng công nghệ.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
    content: 'Từ ngày 5 đến 10 tháng 9, NovaTech triển khai chương trình Flash Sale với mức giảm giá lên đến 50% cho các sản phẩm thuộc danh mục tai nghe, phụ kiện và một số mẫu điện thoại được yêu thích. Số lượng có hạn, khách hàng nên đặt hàng sớm để không bỏ lỡ ưu đãi.',
    author: 'NovaTech Marketing'
  },
  {
    id: 5,
    slug: 'xu-huong-cong-nghe-2027',
    category: 'Công nghệ',
    date: '28/08/2026',
    title: '5 xu hướng công nghệ thông minh sẽ định hình thế giới số năm 2027',
    excerpt: 'On-device AI thế hệ mới, pin thể rắn sạc 5 phút và kỷ nguyên thiết bị đeo không màn hình.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
    content: 'Trí tuệ nhân tạo xử lý trực tiếp trên thiết bị (on-device AI) đang trở thành tiêu chuẩn mới cho smartphone và laptop cao cấp, giúp tăng tốc độ phản hồi và bảo mật dữ liệu người dùng. Bên cạnh đó, công nghệ pin thể rắn hứa hẹn cải thiện đáng kể thời lượng sử dụng, còn màn hình gập tiếp tục được hoàn thiện về độ bền bản lề.',
    author: 'Minh Anh'
  },
  {
    id: 6,
    slug: 'huong-dan-chon-mua-laptop',
    category: 'Tips & Tricks',
    date: '20/08/2026',
    title: 'Cẩm nang toàn diện: Cách chọn mua laptop chuẩn xác cho từng ngành nghề',
    excerpt: 'Bí quyết cân đối giữa hiệu năng CPU/GPU, màn hình hiển thị và thời lượng pin theo nhu cầu thực tế.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    content: 'Trước khi quyết định mua laptop, hãy xác định rõ nhu cầu chính: văn phòng, thiết kế đồ họa hay chơi game. Với dân văn phòng, ưu tiên thời lượng pin và trọng lượng nhẹ. Với thiết kế, màn hình màu chuẩn và RAM lớn là yếu tố quan trọng. Người chơi game nên tập trung vào card đồ họa rời và tản nhiệt hiệu quả.',
    author: 'Quốc Bảo'
  }
];

/* -------- Helpers -------- */
function fmtPrice(n) {
  return Number(n || 0).toLocaleString('vi-VN') + '₫';
}

function getProduct(idOrSlug) {
  return PRODUCTS.find(p => p.id == idOrSlug || p.slug === idOrSlug);
}

function getRelated(product, count = 4) {
  return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, count);
}
