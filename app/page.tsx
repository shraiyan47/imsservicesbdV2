import TopBar from "@/components/sections/top-bar";
import Navbar from "@/components/sections/navbar";
import Banner from "@/components/sections/banner";
import Services from "@/components/sections/services";
import Destinations from "@/components/sections/destinations";
import Testimonials from "@/components/sections/testimonials";
import Blog from "@/components/sections/blog";
import Partners from "@/components/sections/partners";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Navbar />
      <Banner />
      <Services />
      <Destinations />
      <Testimonials />
      <Blog />
      <Partners />
      <Contact />
      <Footer />
    </div>
  );
}
