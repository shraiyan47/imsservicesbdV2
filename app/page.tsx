import { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: "Best Student Counseling Office in Bangladesh | IMS Services",
  description:
    "IMS Services - Leading student counseling & international education consultancy in Bangladesh. Get expert guidance for university admissions, IELTS, visa assistance and scholarships.",
  keywords: [
    "best student counseling in Bangladesh",
    "international education consultancy",
    "university application",
    "IELTS coaching",
    "student visa guidance",
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'IMS Services',
  description:
    'Best student counseling office in Bangladesh - International education consultancy',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://ims-services.com',
  telephone: '+8801234567890',
  areaServed: ['BD', 'GB', 'US', 'AU', 'CA'],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'BD',
    addressLocality: 'Dhaka',
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </>
  );
}
