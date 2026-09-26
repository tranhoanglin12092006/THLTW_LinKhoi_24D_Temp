import Header from "@/components/shop/Header";
import Footer from "@/components/shop/Footer";

export default function ShopLayout({ children }) {
    return (

        <div className="">

            <Header />

            <main>{children}</main>

            <Footer />

        </div>

    );
}
