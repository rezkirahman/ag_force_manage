import { Montserrat } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/context";
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
});

export const metadata = {
  title: "AG Force",
  description: "Artha Graha",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={`${montserrat.className} ${montserrat.variable} text-gray-500`}>
        <AppWrapper>
            {children}
        </AppWrapper>
      </body>
    </html>
  );
}