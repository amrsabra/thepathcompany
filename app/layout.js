import { Inter } from "next/font/google";
import "./globals.css";
import SubscriptionLinker from "./components/SubscriptionLinker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
export const metadata = {
  title: "TPC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SubscriptionLinker>
          {children}
        </SubscriptionLinker>
      </body>
    </html>
  );
}
