/**
 * TECHNOVA E-COMMERCE STORE - DATA REPOSITORY
 * Dữ liệu sản phẩm, danh mục, tin tức, thương hiệu và đánh giá mẫu
 */

const TECHNOVA_DATA = {
    categories: [
        {
            id: 'phone',
            name: 'Điện thoại',
            icon: 'smartphone',
            count: 42,
            image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=500&q=80',
            description: 'iPhone, Samsung, Xiaomi chính hãng'
        },
        {
            id: 'laptop',
            name: 'Laptop',
            icon: 'laptop',
            count: 36,
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80',
            description: 'MacBook, Gaming, Ultrabook cao cấp'
        },
        {
            id: 'tablet',
            name: 'Tablet',
            icon: 'tablet',
            count: 24,
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=500&q=80',
            description: 'iPad Pro, Galaxy Tab sáng tạo đỉnh cao'
        },
        {
            id: 'headphone',
            name: 'Tai nghe',
            icon: 'headphones',
            count: 58,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
            description: 'Âm thanh Hi-Res, chống ồn chủ động'
        },
        {
            id: 'watch',
            name: 'Đồng hồ',
            icon: 'watch',
            count: 31,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
            description: 'Smartwatch theo dõi sức khỏe và thể thao'
        },
        {
            id: 'gaming',
            name: 'Gaming Gear',
            icon: 'gamepad-2',
            count: 45,
            image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=500&q=80',
            description: 'PlayStation, Nintendo, ROG console'
        },
        {
            id: 'camera',
            name: 'Camera & Lens',
            icon: 'camera',
            count: 19,
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80',
            description: 'Máy ảnh Mirrorless chuyên nghiệp'
        },
        {
            id: 'smarthome',
            name: 'Smart Home',
            icon: 'home',
            count: 28,
            image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=500&q=80',
            description: 'Thiết bị nhà thông minh hiện đại'
        },
        {
            id: 'accessories',
            name: 'Phụ kiện',
            icon: 'plug',
            count: 67,
            image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=500&q=80',
            description: 'Sạc nhanh GaN, bàn phím cơ, chuột cao cấp'
        }
    ],

    brands: [
        { name: 'Apple', logo: 'Apple' },
        { name: 'Samsung', logo: 'Samsung' },
        { name: 'Sony', logo: 'Sony' },
        { name: 'Asus', logo: 'ASUS' },
        { name: 'Dell', logo: 'Dell' },
        { name: 'Lenovo', logo: 'Lenovo' },
        { name: 'HP', logo: 'HP' },
        { name: 'Xiaomi', logo: 'Xiaomi' }
    ],

    products: [
        {
            id: 1,
            name: 'Apple iPhone 16 Pro Max 256GB - Titan Tự Nhiên',
            slug: 'apple-iphone-16-pro-max-256gb',
            category: 'phone',
            categoryName: 'Điện thoại',
            brand: 'Apple',
            price: 34990000,
            oldPrice: 38990000,
            discount: 10,
            rating: 5.0,
            reviews: 248,
            stock: 18,
            sold: 84,
            badge: 'HOT',
            isNew: true,
            isHot: true,
            isSale: true,
            sku: 'TN-IP16PM-256',
            image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'iPhone 16 Pro Max đỉnh cao công nghệ với chip A18 Pro mạnh mẽ, khung viền Titan siêu nhẹ, camera tele 5x Tetraprism đột phá và nút điều khiển Camera Control hoàn toàn mới.',
            specs: {
                'Màn hình': '6.9 inch Super Retina XDR OLED, 120Hz ProMotion',
                'Chip xử lý': 'Apple A18 Pro 3nm 6 nhân CPU, 6 nhân GPU',
                'RAM & Bộ nhớ': '8GB RAM | 256GB NVMe',
                'Camera sau': 'Chính 48MP + Góc siêu rộng 48MP + Tele 12MP 5x',
                'Pin & Sạc': '4.685 mAh, Sạc nhanh 30W, MagSafe 25W',
                'Kháng nước': 'IP68 (sâu 6 mét trong 30 phút)'
            },
            warranty: '24 tháng chính hãng Apple Việt Nam, 1 đổi 1 trong 30 ngày đầu'
        },
        {
            id: 2,
            name: 'Samsung Galaxy S24 Ultra 5G 512GB AI Phone',
            slug: 'samsung-galaxy-s24-ultra-5g-512gb',
            category: 'phone',
            categoryName: 'Điện thoại',
            brand: 'Samsung',
            price: 29990000,
            oldPrice: 35990000,
            discount: 17,
            rating: 4.9,
            reviews: 182,
            stock: 12,
            sold: 69,
            badge: 'SALE',
            isNew: false,
            isHot: true,
            isSale: true,
            sku: 'TN-S24U-512',
            image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Galaxy S24 Ultra mở ra kỷ nguyên Galaxy AI thông minh vượt bậc. Khung Titan cao cấp, bút S-Pen tích hợp, màn hình phẳng chống chói hàng đầu thế giới Corning Gorilla Armor.',
            specs: {
                'Màn hình': '6.8 inch Dynamic AMOLED 2X QHD+, 1-120Hz, 2600 nits',
                'Chip xử lý': 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
                'RAM & Bộ nhớ': '12GB LPDDR5X | 512GB UFS 4.0',
                'Camera sau': '200MP OIS + 50MP 5x + 10MP 3x + 12MP UW',
                'Pin & Sạc': '5.000 mAh, Sạc nhanh 45W, Sạc không dây 15W',
                'Bút S-Pen': 'Tích hợp sẵn trong thân máy'
            },
            warranty: '12 tháng chính hãng Samsung, bảo hành rơi vỡ Samsung Care+'
        },
        {
            id: 3,
            name: 'Apple MacBook Pro 16 inch M3 Max (36GB/1TB)',
            slug: 'apple-macbook-pro-16-inch-m3-max',
            category: 'laptop',
            categoryName: 'Laptop',
            brand: 'Apple',
            price: 79990000,
            oldPrice: 85990000,
            discount: 7,
            rating: 5.0,
            reviews: 95,
            stock: 7,
            sold: 38,
            badge: 'NEW',
            isNew: true,
            isHot: true,
            isSale: false,
            sku: 'TN-MBP16-M3MAX',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Quái vật hiệu năng dành cho chuyên gia đồ họa, dựng phim 8K và lập trình viên AI. Màn hình Liquid Retina XDR sáng 1600 nits đỉnh cao cùng thời lượng pin lên đến 22 tiếng.',
            specs: {
                'Màn hình': '16.2 inch Liquid Retina XDR (3456 x 2234), 120Hz ProMotion',
                'CPU & GPU': 'Apple M3 Max 14-core CPU, 30-core GPU, 16-core Neural Engine',
                'Bộ nhớ': '36GB Unified Memory | 1TB SSD Siêu tốc',
                'Cổng kết nối': '3x Thunderbolt 4, HDMI 8K, SDXC, MagSafe 3',
                'Trọng lượng': '2.14 kg',
                'Hệ điều hành': 'macOS Sonoma / Sequoia'
            },
            warranty: '24 tháng bảo hành Apple Care ủy quyền chính hãng'
        },
        {
            id: 4,
            name: 'ASUS ROG Zephyrus G16 OLED Gaming Laptop RTX 4080',
            slug: 'asus-rog-zephyrus-g16-oled-rtx4080',
            category: 'laptop',
            categoryName: 'Laptop',
            brand: 'Asus',
            price: 64990000,
            oldPrice: 71990000,
            discount: 10,
            rating: 4.8,
            reviews: 73,
            stock: 9,
            sold: 41,
            badge: 'HOT',
            isNew: true,
            isHot: true,
            isSale: false,
            sku: 'TN-ROG-G16-4080',
            image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Laptop gaming mỏng nhẹ cao cấp nhất của ASUS với màn hình ROG Nebula OLED 240Hz, chip Intel Core Ultra 9 và card đồ họa NVIDIA GeForce RTX 4080 12GB TGP 115W.',
            specs: {
                'Màn hình': '16 inch 2.5K (2560x1600) OLED 240Hz 0.2ms, DCI-P3 100%',
                'CPU': 'Intel Core Ultra 9 185H (16 nhân, 22 luồng, up to 5.1GHz)',
                'GPU': 'NVIDIA GeForce RTX 4080 12GB GDDR6',
                'RAM & Ổ cứng': '32GB LPDDR5X 7467MHz | 2TB PCIe 4.0 NVMe SSD',
                'Tản nhiệt': 'Buồng hơi Vapor Chamber + Keo tản nhiệt kim loại lỏng',
                'Trọng lượng': '1.85 kg siêu mỏng chỉ 1.49 cm'
            },
            warranty: '24 tháng ASUS VIP Service toàn cầu'
        },
        {
            id: 5,
            name: 'Dell XPS 15 9530 OLED Touch (Core i9 / RTX 4070)',
            slug: 'dell-xps-15-9530-oled-touch',
            category: 'laptop',
            categoryName: 'Laptop',
            brand: 'Dell',
            price: 52990000,
            oldPrice: 59990000,
            discount: 12,
            rating: 4.7,
            reviews: 64,
            stock: 14,
            sold: 52,
            badge: null,
            isNew: false,
            isHot: false,
            isSale: true,
            sku: 'TN-DELL-XPS15',
            image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Biểu tượng laptop doanh nhân cao cấp với vỏ nhôm nguyên khối phay CNC và chiếu nghỉ tay carbon fiber. Màn hình 3.5K OLED cảm ứng hiển thị màu sắc chính xác 100% Adobe RGB.',
            specs: {
                'Màn hình': '15.6 inch 3.5K (3456x2160) InfinityEdge OLED Touch, 400 nits',
                'CPU': 'Intel Core i9-13900H (14 nhân, 20 luồng, 5.4GHz)',
                'GPU': 'NVIDIA GeForce RTX 4070 8GB GDDR6',
                'RAM & Ổ cứng': '32GB DDR5 4800MHz | 1TB SSD NVMe',
                'Âm thanh': 'Hệ thống 4 loa Waves Nx 3D audio 8W',
                'Pin': '86Wh cho 10 tiếng làm việc văn phòng'
            },
            warranty: '12 tháng bảo hành Dell ProSupport tại nhà 24/7'
        },
        {
            id: 6,
            name: 'Sony WH-1000XM5 Chống Ồn Đầu Bảng Hi-Res Audio',
            slug: 'sony-wh-1000xm5-wireless-noise-cancelling',
            category: 'headphone',
            categoryName: 'Tai nghe',
            brand: 'Sony',
            price: 7490000,
            oldPrice: 8990000,
            discount: 17,
            rating: 4.9,
            reviews: 312,
            stock: 35,
            sold: 140,
            badge: 'SALE',
            isNew: false,
            isHot: true,
            isSale: true,
            sku: 'TN-SONY-XM5',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Tai nghe trùm đầu chống ồn chủ động xuất sắc nhất với 2 bộ xử lý chuyên dụng V1 và QN1, 8 micro thu âm phân tích tiếng ồn thời gian thực và thời lượng pin 30 giờ.',
            specs: {
                'Driver': '30mm màng sợi carbon nhẹ và độ cứng cao',
                'Công nghệ': 'LDAC, DSEE Extreme, 360 Reality Audio',
                'Chống ồn': 'Auto NC Optimizer tự động tối ưu theo áp suất',
                'Thời lượng pin': '30 giờ (bật NC), sạc nhanh 3 phút nghe 3 giờ',
                'Kết nối': 'Bluetooth 5.2, Multipoint đa thiết bị',
                'Trọng lượng': '250g đệm tai da tổng hợp êm ái'
            },
            warranty: '12 tháng chính hãng Sony Việt Nam'
        },
        {
            id: 7,
            name: 'Apple AirPods Max Wireless Headphone - Silver',
            slug: 'apple-airpods-max-silver',
            category: 'headphone',
            categoryName: 'Tai nghe',
            brand: 'Apple',
            price: 11990000,
            oldPrice: 13990000,
            discount: 14,
            rating: 4.8,
            reviews: 147,
            stock: 16,
            sold: 76,
            badge: null,
            isNew: false,
            isHot: false,
            isSale: true,
            sku: 'TN-AIRPODS-MAX',
            image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Thiết kế sang trọng với vòm trùm đầu lưới thoáng khí và đệm tai memory foam bọc vải dệt tùy chỉnh. Âm thanh vòm Spatial Audio định vị không gian và chip Apple H1 từng bên tai.',
            specs: {
                'Chip xử lý': '2 chip Apple H1 (mỗi bên earcup)',
                'Driver': 'Driver dynamic 40mm do Apple tự thiết kế',
                'Tính năng': 'Active Noise Cancellation, Transparency Mode, Adaptive EQ',
                'Thời lượng pin': '20 giờ nghe nhạc liên tục khi bật ANC',
                'Vỏ tai': 'Nhôm anodized cao cấp có Digital Crown xoay vặn'
            },
            warranty: '12 tháng chính hãng Apple tại các đại lý ủy quyền'
        },
        {
            id: 8,
            name: 'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium',
            slug: 'apple-watch-ultra-2-gps-cellular-49mm',
            category: 'watch',
            categoryName: 'Đồng hồ',
            brand: 'Apple',
            price: 20990000,
            oldPrice: 22990000,
            discount: 9,
            rating: 5.0,
            reviews: 139,
            stock: 15,
            sold: 62,
            badge: 'NEW',
            isNew: true,
            isHot: true,
            isSale: false,
            sku: 'TN-AW-ULTRA2',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Đồng hồ thể thao dã ngoại chuyên nghiệp với vỏ Titan chuẩn hàng không vũ trụ 49mm, màn hình sáng kỷ lục 3000 nits, cảm biến lặn sâu 40m và thời lượng pin 72 giờ ở chế độ tiết kiệm.',
            specs: {
                'Kích thước': '49 x 44 x 14.4 mm | Khung Titanium cấp độ 5',
                'Màn hình': 'Always-On Retina OLED 3000 nits, mặt kính Sapphire',
                'Chip': 'Apple S9 SiP 64-bit, thao tác chạm hai lần Double Tap',
                'Cảm biến': 'Đo điện tâm đồ ECG, nồng độ oxy trong máu SpO2, đo độ sâu',
                'Chuẩn bền': 'MIL-STD 810H, chống nước 100m, lặn EN13319'
            },
            warranty: '12 tháng chính hãng Apple toàn quốc'
        },
        {
            id: 9,
            name: 'Samsung Galaxy Watch 6 Classic 47mm LTE Sapphire',
            slug: 'samsung-galaxy-watch-6-classic-47mm',
            category: 'watch',
            categoryName: 'Đồng hồ',
            brand: 'Samsung',
            price: 7990000,
            oldPrice: 9490000,
            discount: 16,
            rating: 4.8,
            reviews: 110,
            stock: 22,
            sold: 88,
            badge: 'HOT',
            isNew: false,
            isHot: true,
            isSale: true,
            sku: 'TN-GW6-CLASSIC',
            image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Vòng bezel xoay vật lý huyền thoại tái xuất trên Galaxy Watch 6 Classic cùng màn hình lớn hơn 20%, theo dõi thành phần cơ thể BIA và phân tích giấc ngủ chuyên sâu.',
            specs: {
                'Kích thước': '47mm mặt thép không gỉ, kính Sapphire chống trầy',
                'Màn hình': '1.5 inch Super AMOLED 480x480 pixels',
                'Chip': 'Exynos W930 1.4GHz, RAM 2GB, Bộ nhớ 16GB',
                'Tính năng': 'Đo huyết áp, điện tâm đồ ECG, cảm biến BioActive 3-in-1',
                'Pin': '425 mAh, Sạc không dây nhanh WPC'
            },
            warranty: '12 tháng chính hãng Samsung Electronics Việt Nam'
        },
        {
            id: 10,
            name: 'Apple iPad Pro 11 inch M4 Ultra Retina Tandem OLED',
            slug: 'apple-ipad-pro-11-inch-m4-oled',
            category: 'tablet',
            categoryName: 'Tablet',
            brand: 'Apple',
            price: 27990000,
            oldPrice: 29990000,
            discount: 7,
            rating: 5.0,
            reviews: 88,
            stock: 11,
            sold: 43,
            badge: 'NEW',
            isNew: true,
            isHot: true,
            isSale: false,
            sku: 'TN-IPAD-M4-11',
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1589739900266-43b2843f4c12?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Chiếc iPad mỏng nhất từ trước đến nay chỉ 5.3mm với màn hình đột phá Ultra Retina XDR sử dụng công nghệ tấm nền Tandem OLED 2 lớp và sức mạnh từ chip thế hệ mới Apple M4.',
            specs: {
                'Màn hình': '11 inch Tandem OLED, 1000 nits toàn màn hình (1600 nits HDR)',
                'Chip xử lý': 'Apple M4 9-core CPU, 10-core GPU, dò tia phần cứng',
                'Độ mỏng': '5.3 mm siêu nhẹ 444g',
                'Phụ kiện hỗ trợ': 'Apple Pencil Pro cảm ứng lực bóp, Magic Keyboard mới',
                'Cổng kết nối': 'Thunderbolt / USB 4 tốc độ 40Gb/s'
            },
            warranty: '12 tháng chính hãng Apple tại Việt Nam'
        },
        {
            id: 11,
            name: 'Sony PlayStation 5 Slim Standard Edition (Ổ đĩa Blu-ray)',
            slug: 'sony-playstation-5-slim-standard',
            category: 'gaming',
            categoryName: 'Gaming Gear',
            brand: 'Sony',
            price: 13490000,
            oldPrice: 15490000,
            discount: 13,
            rating: 4.9,
            reviews: 215,
            stock: 20,
            sold: 115,
            badge: 'SALE',
            isNew: false,
            isHot: true,
            isSale: true,
            sku: 'TN-PS5-SLIM',
            image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Máy chơi game thế hệ mới PlayStation 5 Slim thiết kế gọn gàng hơn 30%, dung lượng SSD tăng lên 1TB tốc độ siêu nhanh và tặng kèm tay cầm DualSense công nghệ phản hồi xúc giác Haptic.',
            specs: {
                'CPU': 'AMD Zen 2 8 nhân 16 luồng xung nhịp tối đa 3.5GHz',
                'GPU': 'AMD RDNA 2 xung nhịp 2.23GHz đạt 10.3 TFLOPS',
                'Bộ nhớ': 'SSD PCIe Gen 4 dung lượng 1TB (tốc độ đọc 5.5GB/s)',
                'Độ phân giải': 'Hỗ trợ 4K 120Hz, 8K, HDR và Ray Tracing',
                'Ổ đĩa': 'Ultra HD Blu-ray Disc Drive tháo rời'
            },
            warranty: '12 tháng chính hãng Sony Việt Nam'
        },
        {
            id: 12,
            name: 'Máy Chơi Game Cầm Tay ASUS ROG Ally X (24GB / 1TB)',
            slug: 'asus-rog-ally-x-handheld-gaming',
            category: 'gaming',
            categoryName: 'Gaming Gear',
            brand: 'Asus',
            price: 23990000,
            oldPrice: 25990000,
            discount: 8,
            rating: 4.8,
            reviews: 58,
            stock: 8,
            sold: 34,
            badge: 'NEW',
            isNew: true,
            isHot: true,
            isSale: false,
            sku: 'TN-ROG-ALLYX',
            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1612287232230-058b73f8e6c4?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Nâng cấp toàn diện cho chiếc PC gaming cầm tay hàng đầu: RAM 24GB LPDDR5X siêu nhanh, pin tăng gấp đôi lên 80Wh, cần joystick chống trôi Hall Effect và 2 cổng USB-C cao cấp.',
            specs: {
                'APU': 'AMD Ryzen Z1 Extreme 8 nhân 16 luồng 24MB cache',
                'RAM & Ổ cứng': '24GB LPDDR5X-7500 | 1TB PCIe 4.0 NVMe SSD M.2 2280',
                'Màn hình': '7 inch FHD 120Hz 100% sRGB, cảm ứng 10 điểm, FreeSync Premium',
                'Pin': '80Wh (gấp đôi thế hệ trước), sạc nhanh 65W PD',
                'Hệ điều hành': 'Windows 11 Home chính hãng kèm Armoury Crate SE'
            },
            warranty: '24 tháng bảo hành chính hãng ASUS Việt Nam'
        },
        {
            id: 13,
            name: 'Máy Ảnh Mirrorless Sony Alpha A7 IV (Body Only)',
            slug: 'sony-alpha-a7-iv-body',
            category: 'camera',
            categoryName: 'Camera & Lens',
            brand: 'Sony',
            price: 52990000,
            oldPrice: 58990000,
            discount: 10,
            rating: 5.0,
            reviews: 82,
            stock: 6,
            sold: 29,
            badge: 'HOT',
            isNew: false,
            isHot: true,
            isSale: false,
            sku: 'TN-SONY-A7M4',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Tiêu chuẩn máy ảnh Full-Frame đa năng cho cả chụp ảnh nghệ thuật và quay phim điện ảnh 4K 60p 10-bit 4:2:2. Cảm biến Exmor R CMOS 33MP chiếu sáng sau và chip BIONZ XR.',
            specs: {
                'Cảm biến': 'Full-frame Exmor R BSI CMOS 33MP',
                'Bộ xử lý': 'BIONZ XR tốc độ xử lý nhanh gấp 8 lần',
                'Quay video': '4K 60p 10-Bit 4:2:2, S-Cinetone, S-Log3',
                'Lấy nét': '759 điểm AF theo pha bao phủ 94% khung hình',
                'Chống rung': '5 trục trong thân máy SteadyShot INSIDE 5.5 stops'
            },
            warranty: '24 tháng bảo hành chính hãng Sony Việt Nam'
        },
        {
            id: 14,
            name: 'Máy Ảnh Mirrorless Fujifilm X-T5 Kèm Lens XF 16-80mm',
            slug: 'fujifilm-x-t5-xf-16-80mm',
            category: 'camera',
            categoryName: 'Camera & Lens',
            brand: 'Fujifilm',
            price: 48990000,
            oldPrice: 53990000,
            discount: 9,
            rating: 4.9,
            reviews: 49,
            stock: 5,
            sold: 21,
            badge: 'NEW',
            isNew: true,
            isHot: false,
            isSale: false,
            sku: 'TN-FUJI-XT5',
            image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Nghệ thuật nhiếp ảnh đậm chất hoài cổ với 19 giả lập màu phim Film Simulation trứ danh. Cảm biến X-Trans CMOS 5 HR 40.2MP sắc nét kinh ngạc cùng hệ thống chống rung 7 stops.',
            specs: {
                'Cảm biến': 'APS-C X-Trans CMOS 5 HR 40.2 Megapixels',
                'Giả lập phim': '19 Film Simulations (Nostalgic Neg, Classic Chrome...)',
                'Chống rung': 'IBIS 5 trục lên đến 7.0 stops',
                'Ống kính': 'XF 16-80mm f/4 R OIS WR đa dụng kháng thời tiết',
                'Quay video': '6.2K 30p 10-bit 4:2:2 trong thân máy'
            },
            warranty: '24 tháng bảo hành chính hãng Fujifilm Việt Nam'
        },
        {
            id: 15,
            name: 'Chuột Không Dây Logitech MX Master 3S Performance',
            slug: 'logitech-mx-master-3s-graphite',
            category: 'accessories',
            categoryName: 'Phụ kiện',
            brand: 'Logitech',
            price: 2190000,
            oldPrice: 2690000,
            discount: 19,
            rating: 4.9,
            reviews: 420,
            stock: 48,
            sold: 210,
            badge: 'SALE',
            isNew: false,
            isHot: true,
            isSale: true,
            sku: 'TN-MX-MASTER-3S',
            image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Chuột công thái học huyền thoại dành cho lập trình viên và sáng tạo nội dung. Cảm biến Darkfield 8.000 DPI lướt mượt trên mọi bề mặt kể cả mặt kính, con lăn MagSpeed siêu tốc điện từ.',
            specs: {
                'Cảm biến': 'Darkfield độ chính xác cao 8000 DPI',
                'Nút click': 'Quiet Clicks giảm 90% tiếng ồn',
                'Con lăn': 'MagSpeed cuộn 1.000 dòng trong 1 giây',
                'Kết nối': 'Bluetooth Low Energy & Đầu thu Logi Bolt (kết nối 3 máy)',
                'Pin': 'Pin sạc USB-C dùng đến 70 ngày một lần sạc'
            },
            warranty: '12 tháng 1 đổi 1 chính hãng Logitech'
        },
        {
            id: 16,
            name: 'Củ Sạc Nhanh Anker Prime 100W GaN 3 Cổng (2C1A)',
            slug: 'anker-prime-100w-gan-charger',
            category: 'accessories',
            categoryName: 'Phụ kiện',
            brand: 'Anker',
            price: 1590000,
            oldPrice: 1990000,
            discount: 20,
            rating: 4.8,
            reviews: 260,
            stock: 60,
            sold: 340,
            badge: 'SALE',
            isNew: false,
            isHot: true,
            isSale: true,
            sku: 'TN-ANKER-100W',
            image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Công nghệ bán dẫn GaNPrime thế hệ mới nhỏ hơn 43% so với củ sạc MacBook thông thường. Tự động điều phối công suất thông minh PowerIQ 4.0 và bảo vệ kiểm soát nhiệt ActiveShield 2.0.',
            specs: {
                'Công suất tối đa': '100W Power Delivery',
                'Số cổng': '2x USB-C + 1x USB-A sạc cùng lúc 3 thiết bị',
                'Tương thích': 'MacBook Pro, iPhone 16/15, Galaxy S24, iPad, Laptop Dell/HP',
                'Kích thước': 'Siêu nhỏ gọn, chân gập 90 độ tiện lợi di chuyển'
            },
            warranty: '24 tháng 1 đổi 1 chính hãng Anker Việt Nam'
        },
        {
            id: 17,
            name: 'Bàn Phím Cơ Custom Không Dây Keychron Q1 Pro QMK/VIA',
            slug: 'keychron-q1-pro-wireless-custom-keyboard',
            category: 'accessories',
            categoryName: 'Phụ kiện',
            brand: 'Keychron',
            price: 4390000,
            oldPrice: 4890000,
            discount: 10,
            rating: 4.9,
            reviews: 114,
            stock: 14,
            sold: 56,
            badge: null,
            isNew: false,
            isHot: false,
            isSale: false,
            sku: 'TN-KEYCHRON-Q1PRO',
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Thân phím kim loại nhôm 6063 CNC nguyên khối sang trọng, thiết kế Double Gasket Mount êm ái, kết nối Bluetooth 5.1 cùng khả năng lập trình phím không giới hạn qua web QMK/VIA.',
            specs: {
                'Khung vỏ': 'Nhôm CNC phay mạ điện toàn phần',
                'Layout': '75% nhỏ gọn kèm núm xoay kim loại Rotary Encoder',
                'Switch': 'Keychron K Pro Banana / Red hỗ trợ Hot-swap',
                'Keycap': 'KSA profile Double-shot PBT chống bóng',
                'Kết nối': 'Bluetooth 5.1 & Type-C có dây, tương thích macOS/Windows'
            },
            warranty: '12 tháng chính hãng'
        },
        {
            id: 18,
            name: 'Loa Bluetooth Di Động Marshall Stanmore III Chính Hãng',
            slug: 'marshall-stanmore-iii-bluetooth-speaker',
            category: 'headphone',
            categoryName: 'Tai nghe',
            brand: 'Marshall',
            price: 8990000,
            oldPrice: 9990000,
            discount: 10,
            rating: 4.8,
            reviews: 132,
            stock: 12,
            sold: 67,
            badge: 'HOT',
            isNew: false,
            isHot: true,
            isSale: false,
            sku: 'TN-MARSHALL-STAN3',
            image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Âm trường rộng hơn bao giờ hết với hệ thống Dynamic Loudness cân bằng dải tần chuẩn xác. Thiết kế Rock n Roll cổ điển với núm xoay đồng thau điều chỉnh Bass/Treble mượt mà.',
            specs: {
                'Công suất': '80W Class-D (1 loa trầm 50W + 2 loa tweeter 15W)',
                'Dải tần đáp ứng': '45 – 20.000 Hz âm trầm chắc nịch',
                'Kết nối': 'Bluetooth 5.2 thế hệ mới, cổng AUX 3.5mm, cổng RCA',
                'Ứng dụng': 'Marshall Bluetooth App tùy chỉnh EQ tiện lợi'
            },
            warranty: '12 tháng phân phối ủy quyền ASH Việt Nam'
        },
        {
            id: 19,
            name: 'Bộ Điều Khiển Trung Tâm Nhà Thông Minh Apple HomePod Mini',
            slug: 'apple-homepod-mini-smart-speaker',
            category: 'smarthome',
            categoryName: 'Smart Home',
            brand: 'Apple',
            price: 2490000,
            oldPrice: 2990000,
            discount: 17,
            rating: 4.7,
            reviews: 98,
            stock: 25,
            sold: 104,
            badge: null,
            isNew: false,
            isHot: false,
            isSale: true,
            sku: 'TN-HOMEPOD-MINI',
            image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Trợ lý âm thanh thông minh Siri, kiêm trung tâm điều khiển nhà thông minh Apple HomeKit và chuẩn kết nối Thread / Matter. Âm thanh vòm 360 độ ngập tràn căn phòng nhỏ gọn.',
            specs: {
                'Driver': 'Driver toàn dải và hai bộ tản nhiệt thụ động triệt tiêu rung chấn',
                'Micro': '4 microphone trường xa nhận lệnh giọng nói chính xác',
                'Bộ xử lý': 'Apple S5 chip âm thanh tính toán thời gian thực',
                'Kết nối': 'Wi-Fi 802.11n, Bluetooth 5.0, Matter & Thread border router'
            },
            warranty: '12 tháng chính hãng Apple'
        },
        {
            id: 20,
            name: 'Máy Chơi Game Nintendo Switch OLED Model - White',
            slug: 'nintendo-switch-oled-model-white',
            category: 'gaming',
            categoryName: 'Gaming Gear',
            brand: 'Nintendo',
            price: 7690000,
            oldPrice: 8990000,
            discount: 14,
            rating: 4.9,
            reviews: 290,
            stock: 28,
            sold: 180,
            badge: 'SALE',
            isNew: false,
            isHot: true,
            isSale: true,
            sku: 'TN-NSW-OLED',
            image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Màn hình 7 inch OLED rực rỡ với màu sắc sâu thẳm, chân đế rộng điều chỉnh nhiều góc độ, dock sạc tích hợp cổng LAN có dây và bộ nhớ trong 64GB cho trải nghiệm giải trí bất tận.',
            specs: {
                'Màn hình': '7.0 inch OLED cảm ứng đa điểm 1280 x 720',
                'Chế độ chơi': 'TV Mode, Tabletop Mode, Handheld Mode',
                'Bộ nhớ': '64GB trong máy, hỗ trợ thẻ nhớ microSD lên đến 2TB',
                'Thời lượng pin': 'Từ 4.5 đến 9 giờ tùy tựa game',
                'Cổng xuất hình': 'HDMI 1080p 60fps khi gắn dock'
            },
            warranty: '12 tháng chính hãng Nintendo'
        },
        {
            id: 21,
            name: 'Điện Thoại Xiaomi 14 Leica Pro 5G Snapdragon 8 Gen 3',
            slug: 'xiaomi-14-leica-pro-5g',
            category: 'phone',
            categoryName: 'Điện thoại',
            brand: 'Xiaomi',
            price: 19990000,
            oldPrice: 22990000,
            discount: 13,
            rating: 4.8,
            reviews: 104,
            stock: 14,
            sold: 58,
            badge: 'NEW',
            isNew: true,
            isHot: false,
            isSale: true,
            sku: 'TN-MI14-PRO',
            image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Ống kính quang học Leica Summilux huyền thoại kết hợp cùng chip xử lý Snapdragon 8 Gen 3 đỉnh cao và hệ điều hành Xiaomi HyperOS mượt mà đột phá.',
            specs: {
                'Màn hình': '6.36 inch AMOLED 1.5K 120Hz LTPO, 3000 nits',
                'Camera': 'Cụm 3 camera Leica 50MP chuyên nghiệp',
                'Chip': 'Qualcomm Snapdragon 8 Gen 3 (4nm)',
                'Pin & Sạc': '4.610 mAh, Sạc có dây siêu tốc 90W HyperCharge, sạc không dây 50W'
            },
            warranty: '18 tháng chính hãng Xiaomi Việt Nam'
        },
        {
            id: 22,
            name: 'Laptop Lenovo ThinkPad X1 Carbon Gen 12 Ultralight',
            slug: 'lenovo-thinkpad-x1-carbon-gen-12',
            category: 'laptop',
            categoryName: 'Laptop',
            brand: 'Lenovo',
            price: 49990000,
            oldPrice: 55990000,
            discount: 11,
            rating: 4.9,
            reviews: 62,
            stock: 8,
            sold: 31,
            badge: null,
            isNew: false,
            isHot: false,
            isSale: false,
            sku: 'TN-THINKPAD-X1G12',
            image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Đỉnh cao doanh nhân siêu bền chuẩn quân sự MIL-STD 810H. Trọng lượng nhẹ khó tin chỉ 1.09 kg với bàn phím huyền thoại ThinkPad và vi xử lý Intel Core Ultra AI.',
            specs: {
                'Màn hình': '14 inch 2.8K (2880x1800) OLED 120Hz chống chói',
                'CPU': 'Intel Core Ultra 7 155H tích hợp NPU AI Boost',
                'RAM & Ổ cứng': '32GB LPDDR5X | 1TB SSD PCIe 4.0 Opal 2.0',
                'Trọng lượng': '1.09 kg vỏ sợi carbon tái chế cao cấp'
            },
            warranty: '36 tháng bảo hành Lenovo Premier Support'
        },
        {
            id: 23,
            name: 'Máy Tính Bảng Samsung Galaxy Tab S9 Ultra 512GB (5G)',
            slug: 'samsung-galaxy-tab-s9-ultra-512gb',
            category: 'tablet',
            categoryName: 'Tablet',
            brand: 'Samsung',
            price: 25990000,
            oldPrice: 31990000,
            discount: 19,
            rating: 4.8,
            reviews: 77,
            stock: 10,
            sold: 45,
            badge: 'SALE',
            isNew: false,
            isHot: false,
            isSale: true,
            sku: 'TN-TABS9U-512',
            image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1589739900266-43b2843f4c12?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Màn hình khổng lồ 14.6 inch Dynamic AMOLED 2X biến tablet thành cỗ máy làm việc chuyên nghiệp với Samsung DeX và bút S-Pen kháng nước bụi chuẩn IP68.',
            specs: {
                'Màn hình': '14.6 inch Dynamic AMOLED 2X 120Hz HDR10+',
                'Chip': 'Snapdragon 8 Gen 2 for Galaxy',
                'Kháng nước': 'IP68 cả máy và bút S-Pen',
                'Pin': '11.200 mAh hỗ trợ sạc nhanh 45W'
            },
            warranty: '12 tháng chính hãng Samsung'
        },
        {
            id: 24,
            name: 'Camera Drone DJI Mini 4 Pro Fly More Combo Plus',
            slug: 'dji-mini-4-pro-fly-more-combo',
            category: 'camera',
            categoryName: 'Camera & Lens',
            brand: 'DJI',
            price: 24490000,
            oldPrice: 26990000,
            discount: 9,
            rating: 5.0,
            reviews: 145,
            stock: 12,
            sold: 70,
            badge: 'HOT',
            isNew: true,
            isHot: true,
            isSale: false,
            sku: 'TN-DJI-MINI4P',
            image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
            thumbnails: [
                'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80'
            ],
            description: 'Flycam trọng lượng siêu nhẹ dưới 249g với hệ thống cảm biến tránh vật cản đa hướng 360 độ, quay video 4K 60fps HDR quay dọc True Vertical Shooting và thời gian bay 45 phút.',
            specs: {
                'Trọng lượng': '< 249g không cần xin giấy phép ở nhiều quốc gia',
                'Cảm biến': '1/1.3 inch CMOS 48MP khẩu f/1.7',
                'Truyền video': 'DJI O4 khoảng cách truyền xa 20km FHD',
                'Thời gian bay': 'Lên đến 45 phút với pin thông minh Intelligent Flight Battery Plus'
            },
            warranty: '12 tháng chính hãng DJI Care Refresh'
        }
    ],

    news: [
        {
            id: 1,
            title: 'Đánh Giá Chi Tiết iPhone 16 Pro Max: Nút Camera Control Và Chip A18 Pro Đột Phá Như Thế Nào?',
            slug: 'danh-gia-chi-tiet-iphone-16-pro-max',
            category: 'Điện thoại',
            date: '25 Tháng 9, 2026',
            author: 'Lê Minh Quân',
            readTime: '6 phút đọc',
            image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
            description: 'Khám phá tất cả những điểm mới trên siêu phẩm iPhone 16 Pro Max với camera zoom 5x, thời lượng pin trâu nhất lịch sử Apple và trí tuệ nhân tạo Apple Intelligence.',
            tags: ['Apple', 'iPhone 16 Pro Max', 'Đánh giá']
        },
        {
            id: 2,
            title: 'Top 5 Laptop Gaming Đáng Mua Nhất 2026 Cho Game Thủ Và Dân Sáng Tạo',
            slug: 'top-5-laptop-gaming-dang-mua-nhat-2026',
            category: 'Laptop',
            date: '22 Tháng 9, 2026',
            author: 'Nguyễn Trần Hưng',
            readTime: '8 phút đọc',
            image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
            description: 'Tổng hợp những mẫu laptop trang bị card RTX 40 series và chip Intel Core Ultra thế hệ mới sở hữu màn hình OLED 240Hz sắc nét nhất hiện nay.',
            tags: ['Laptop Gaming', 'ASUS ROG', 'Dell', 'Lenovo']
        },
        {
            id: 3,
            title: 'So Sánh Sony WH-1000XM5 Và AirPods Max: Đâu Là Vua Chống Ồn?',
            slug: 'so-sanh-sony-wh1000xm5-va-airpods-max',
            category: 'Tai nghe',
            date: '18 Tháng 9, 2026',
            author: 'Trần Hoàng Lâm',
            readTime: '5 phút đọc',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            description: 'Cuộc đối đầu đỉnh cao giữa đại diện âm thanh Nhật Bản và thiết kế tối giản xa xỉ của Apple. Xem ngay phân tích chi tiết về chất âm và độ êm ái.',
            tags: ['Sony', 'AirPods Max', 'Tai nghe chống ồn']
        },
        {
            id: 4,
            title: 'Xu Hướng Nhà Thông Minh 2026: Chuẩn Matter Và Trợ Lý AI Thay Đổi Cuộc Sống',
            slug: 'xu-huong-nha-thong-minh-2026',
            category: 'Smart Home',
            date: '15 Tháng 9, 2026',
            author: 'Vũ Quốc Bảo',
            readTime: '7 phút đọc',
            image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
            description: 'Cách các thiết bị IoT thông minh liên kết liền mạch qua giao thức Matter, tiết kiệm điện năng và tự động hóa căn hộ của bạn một cách an toàn.',
            tags: ['Smart Home', 'Matter', 'AI IoT']
        },
        {
            id: 5,
            title: 'Mẹo Chọn Bàn Phím Cơ Phù Hợp Cho Người Mới Bắt Đầu Và Dân Văn Phòng',
            slug: 'meo-chon-ban-phim-co-cho-nguoi-moi',
            category: 'Tips & Tricks',
            date: '10 Tháng 9, 2026',
            author: 'Đỗ Tuấn Kiệt',
            readTime: '5 phút đọc',
            image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
            description: 'Phân biệt Linear, Tactile, Clicky switch; cách chọn layout 75%, TKL và kinh nghiệm custom bàn phím gõ êm mượt không đau mỏi cổ tay.',
            tags: ['Bàn phím cơ', 'Keychron', 'Phụ kiện']
        },
        {
            id: 6,
            title: 'Đại Tiệc Công Nghệ Tháng 10: Giảm Đến 50% Toàn Bộ Sản Phẩm Chính Hãng',
            slug: 'dai-tiec-cong-nghe-thang-10-giam-50',
            category: 'Khuyến mãi',
            date: '05 Tháng 9, 2026',
            author: 'Ban Biên Tập TECHNOVA',
            readTime: '3 phút đọc',
            image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
            description: 'Chương trình khuyến mãi lớn nhất quý 3 tại Technova Store: Voucher giảm sốc 1 triệu đồng, trả góp 0% lãi suất và tặng kèm gói bảo hành vàng VIP.',
            tags: ['Khuyến mãi', 'Flash Sale', 'Voucher']
        }
    ],

    orders: [
        {
            id: 'TN-89241',
            date: '24/09/2026',
            customer: {
                name: 'Nguyễn Văn An',
                phone: '0987 654 321',
                email: 'nguyenvanan@gmail.com',
                address: '128 Đường Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
            },
            status: 'Đang giao',
            statusClass: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
            paymentMethod: 'Chuyển khoản ngân hàng (QR Code)',
            isPaid: true,
            shippingFee: 0,
            discount: 500000,
            items: [
                {
                    productId: 1,
                    name: 'Apple iPhone 16 Pro Max 256GB - Titan Tự Nhiên',
                    price: 34990000,
                    quantity: 1,
                    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
                },
                {
                    productId: 16,
                    name: 'Củ Sạc Nhanh Anker Prime 100W GaN 3 Cổng (2C1A)',
                    price: 1590000,
                    quantity: 1,
                    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
                }
            ],
            total: 36080000
        },
        {
            id: 'TN-87115',
            date: '15/09/2026',
            customer: {
                name: 'Trần Thị Mai',
                phone: '0912 345 678',
                email: 'maitran.design@gmail.com',
                address: 'Số 45 Ngõ 12 Đào Tấn, Phường Cống Vị, Quận Ba Đình, Hà Nội'
            },
            status: 'Đã giao',
            statusClass: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
            paymentMethod: 'Thanh toán khi nhận hàng (COD)',
            isPaid: true,
            shippingFee: 0,
            discount: 0,
            items: [
                {
                    productId: 6,
                    name: 'Sony WH-1000XM5 Chống Ồn Đầu Bảng Hi-Res Audio',
                    price: 7490000,
                    quantity: 1,
                    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
                }
            ],
            total: 7490000
        },
        {
            id: 'TN-85090',
            date: '02/09/2026',
            customer: {
                name: 'Lê Hoàng Long',
                phone: '0903 889 911',
                email: 'longlh.developer@gmail.com',
                address: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh'
            },
            status: 'Đã giao',
            statusClass: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
            paymentMethod: 'Ví điện tử MoMo',
            isPaid: true,
            shippingFee: 0,
            discount: 1000000,
            items: [
                {
                    productId: 15,
                    name: 'Chuột Không Dây Logitech MX Master 3S Performance',
                    price: 2190000,
                    quantity: 1,
                    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80'
                },
                {
                    productId: 17,
                    name: 'Bàn Phím Cơ Custom Không Dây Keychron Q1 Pro QMK/VIA',
                    price: 4390000,
                    quantity: 1,
                    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
                }
            ],
            total: 5580000
        },
        {
            id: 'TN-83210',
            date: '18/08/2026',
            customer: {
                name: 'Phạm Đức Duy',
                phone: '0977 123 456',
                email: 'duy.pham@gmail.com',
                address: '15 Lê Lợi, Phường Vĩnh Ninh, TP. Huế'
            },
            status: 'Đã hủy',
            statusClass: 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
            paymentMethod: 'Thanh toán khi nhận hàng (COD)',
            isPaid: false,
            shippingFee: 30000,
            discount: 0,
            items: [
                {
                    productId: 11,
                    name: 'Sony PlayStation 5 Slim Standard Edition (Ổ đĩa Blu-ray)',
                    price: 13490000,
                    quantity: 1,
                    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80'
                }
            ],
            total: 13520000
        }
    ]
};

window.TECHNOVA_DATA = TECHNOVA_DATA;
