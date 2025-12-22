import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { MetaPixel } from "@/components/meta-pixel";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Best Student Counseling Office in Bangladesh | IMS Services",
  description:
    "IMS Services - Top rated student counseling & international education consultancy in Bangladesh. Expert guidance for university applications, IELTS preparation, visa assistance & scholarships. Serving students for over 20 years.",
  keywords: [
    "best student counseling office in Bangladesh",
    "international education consultancy",
    "university application assistance",
    "IELTS coaching Bangladesh",
    "student visa guidance",
    "UK universities admission",
    "Australia study visa",
    "Canada education consultancy",
    "education counselor Bangladesh",
    "student counseling center",
  ],
  generator: "v0.app",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://ims-services.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Best Student Counseling Office in Bangladesh | IMS Services",
    description:
      "Get expert guidance for international education, university admissions, and student visas from Bangladesh's leading education consultancy.",
    type: "website",
    locale: "en_BD",
    url: "/",
    siteName: "IMS Services",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "IMS Services - Education Consultancy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Student Counseling Office in Bangladesh | IMS Services",
    description:
      "Top education consultancy for international student guidance, university admissions & visa assistance.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code", // Add your actual code
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "IMS Services",
    description:
      "Best student counseling office in Bangladesh providing international education consultation and guidance",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://ims-services.com",
    logo: "/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguageId: "en",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "BD",
      addressLocality: "Dhaka",
    },
    areaServed: ["BD", "GB", "US", "AU", "CA"],
    sameAs: [
      "https://www.facebook.com/imsservices",
      "https://www.linkedin.com/company/ims-services",
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) - Only load on public pages, not on admin */}
        <GoogleAnalytics />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="IMS Services" />
        <meta name="copyright" content="IMS Services" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <MetaPixel />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

function GoogleAnalytics() {
  // Only load Google Analytics on client side and not on admin pages
  return (
    <>
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-YE9YX1NZX5"
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (!window.location.pathname.startsWith('/admin')) {
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YE9YX1NZX5');
            }
          `,
        }}
      />
    </>
  );
}
