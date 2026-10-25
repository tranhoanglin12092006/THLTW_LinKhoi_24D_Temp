import "./globals.css";
import "./style.css";
import Script from "next/script";
import ToastContainer from "@/components/common/Toast";

export const metadata = {
  title: "TECHNOVA - Siêu Thị Thiết Bị Điện Tử & Công Nghệ Cao Cấp",
  description:
    "TECHNOVA - Mua sắm điện thoại, laptop, tai nghe, đồng hồ và thiết bị điện tử chính hãng giá tốt nhất.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen flex flex-col antialiased">
        <ToastContainer />
        {children}
        <Script
          src="https://unpkg.com/lucide@latest"
          strategy="afterInteractive"
        />
        <Script
          src="/js/data.js"
          strategy="afterInteractive"
        />
        {/* beforeInteractive chủ yếu dành cho những script thực sự cần chạy trước khi Next.js hydrate trang. */}

        <Script
          src="/js/store.js"
          strategy="afterInteractive"
        />

        <Script
          src="/js/main.js"
          strategy="afterInteractive"
        />
        <Script id="restore-theme-after-hydration" strategy="afterInteractive">
          {"window.initTheme?.();"}
        </Script>
      </body>
    </html>
  );
}