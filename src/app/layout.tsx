import type { Metadata } from "next";
import "./globals.css";
import Footer from "../components/Footer";
import { assetPrefix } from "../../next.config";
import FullPageLoader from "../components/FullPageLoader";

export const metadata: Metadata = {
  title: "Creative Hub Hackathon",
  description: "Creative Hub Hackathon website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex" />
        <link rel="icon" href={`${assetPrefix}/assets/favicon/favicon.ico`} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${assetPrefix}/assets/favicon/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${assetPrefix}/assets/favicon/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${assetPrefix}/assets/favicon/favicon-16x16.png`}
        />
        <link rel="manifest" href={`${assetPrefix}/assets/favicon/site.webmanifest`} />
        <link
          rel="mask-icon"
          href={`${assetPrefix}/assets/favicon/safari-pinned-tab.svg`}
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#4d68f1" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="antialiased">
        <FullPageLoader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
