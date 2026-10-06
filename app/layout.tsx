import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { getWhatsAppNumber } from "@/lib/content";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://autoprogarage.co.ke";

export const viewport: Viewport = {
  themeColor: "#0C0D0E",
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
    "East Africa's premier automotive repair, panel beating and diagnostics workshop in Nairobi. Trusted by Kenya's most discerning drivers. Book a service in minutes.",
  keywords: [
    "garage Nairobi", "car service Kenya", "panel beating Nairobi", "engine diagnostics Kenya",
    "wheel alignment Nairobi", "car AC servicing", "insurance claim repairs Kenya",
    "pre-purchase inspection Nairobi", "best garage Kenya", "AutoPro Garage"
  ],
  authors: [{ name: "Brian Mugambi Mbaabu" }],
  creator: "AutoPro Garage",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "AutoPro Garage — Drive in broken. Drive out brilliant.",
    description: "Premium automotive care in Nairobi, Kenya. Book a service in minutes.",
    siteName: "AutoPro Garage",
    locale: "en_KE",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "AutoPro Garage workshop" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoPro Garage",
    description: "Drive in broken. Drive out brilliant.",
    images: ["/og.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" }
  },
  icons: { icon: "/favicon.ico" }
};

const buildJsonLd = (telephone: string) => ({
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "AutoPro Garage",
  image: `${siteUrl}/og.jpg`,
  url: siteUrl,
  telephone,
  priceRange: "KSh",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Enterprise Road, Industrial Area",
    addressLocality: "Nairobi",
    addressCountry: "KE"
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "07:30",
      closes: "18:30"
    }
  ],
  sameAs: [
    "https://facebook.com/autoprogarage",
    "https://instagram.com/autoprogarage",
    "https://tiktok.com/@autoprogarage",
    "https://linkedin.com/company/autoprogarage"
  ]
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = buildJsonLd(`+${await getWhatsAppNumber()}`);
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
