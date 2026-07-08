import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { preload } from "react-dom";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vortex | Interactive CFD Visualization",
  description: "Interactive 3D WebGL CFD Showcase",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ⚡ Bolt: Preload heavy 3D assets early in the server HTML response.
  // Since the 3D Scene is dynamically imported (CSR only), the browser wouldn't
  // know about these assets until the React bundle loads and executes.
  // Preloading them here significantly improves the time-to-interactive for the 3D scene.
  preload('/assets/streamlines.gltf', { as: 'fetch', crossOrigin: 'anonymous' });
  preload('/assets/cylinder.gltf', { as: 'fetch', crossOrigin: 'anonymous' });

  // Preload Environment HDR map

  preload('/assets/potsdamer_platz_1k.hdr', { as: 'fetch', crossOrigin: 'anonymous' });

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-white/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
