import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["400","500","600","700","800"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://autoprogarage.co.ke";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0A1118" }
  ],
  width: "device-width",
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AutoPro Garage — Precision engineered. Passion driven.",
    template: "%s · AutoPro Garage"
  },
  description:
    "East Africa's premier automotive repair, panel beating and diagnostics workshop. Trusted by Kenya's most discerning drivers. Book a service in minutes.",
  keywords: [
    "garage Nairobi","car service Kenya","panel beating","engine diagnostics",
    "wheel alignment","car AC servicing","insurance claim repairs","pre-purchase inspection",
    "best garage Kenya","AutoPro"
  ],
  authors: [{ name: "Brian Mugambi Mbaabu" }],
  creator: "AutoPro Garage",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "AutoPro Garage — Drive In Broken. Drive Out Brilliant.",
    description: "Premium automotive care in Kenya. Book a service in minutes.",
    siteName: "AutoPro Garage",
    locale: "en_KE",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "AutoPro Garage" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoPro Garage",
    description: "Drive In Broken. Drive Out Brilliant.",
    images: ["/og.jpg"]
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  icons: { icon: "/favicon.ico" }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "AutoPro Garage",
  image: `${siteUrl}/og.jpg`,
  url: siteUrl,
  telephone: "+254727718981",
  priceRange: "KSh",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Enterprise Road",
    addressLocality: "Nairobi",
    addressCountry: "KE"
  },
  openingHoursSpecification: [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    opens: "07:30", closes: "18:30"
  }],
  sameAs: [
    "https://facebook.com/autoprogarage",
    "https://instagram.com/autoprogarage",
    "https://tiktok.com/@autoprogarage",
    "https://linkedin.com/company/autoprogarage"
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-brand-green focus:px-4 focus:py-2 focus:rounded">
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
        <CookieBanner />
      </body>
    </html>
  );
}
