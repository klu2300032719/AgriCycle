import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgriCycle — Farm Waste Marketplace",
  description:
    "Sell crop residue, banana stems, coconut shells, sugarcane waste, rice husk & manure to mushroom farms, biofuel companies, compost manufacturers and more. AI pricing, transport & analytics.",
  keywords: [
    "farm waste",
    "crop residue",
    "agricultural waste marketplace",
    "biofuel feedstock",
    "stubble burning alternative",
  ],
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
