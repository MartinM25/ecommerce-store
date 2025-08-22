import Header from "@/components/layout/Header";
import Categories from "@/components/layout/Categories";
import Footer from "@/components/layout/Footer";
import Showcase from "@/components/layout/Showcase";

export default function Home() {
  return (
    <div className="min-h-screen bg-white border-2-green">
      <Header />
      <Categories />
      <Showcase />
      <Footer />
    </div>
  )
}