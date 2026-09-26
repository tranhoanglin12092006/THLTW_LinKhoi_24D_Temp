import "./globals.css";
import "./style.css";
import Script from "next/script";

export const metadata = {
  title: "NovaTech",
  description: "Siêu thị thiết bị công nghệ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <body>
        {children}

        {/* Dữ liệu sản phẩm, danh mục... */}
        <Script
          src="/js/data.js"
          strategy="afterInteractive"
        />

        {/* File JS chính render Header, Footer, Product... */}
        <Script
          src="/js/main.js"
          strategy="afterInteractive"
        />
        {/* File JS chính render Header, Footer, Product... */}
        <Script
          src="/js/product.js"
          strategy="afterInteractive"
        />
      </body>

    </html>
  );
}