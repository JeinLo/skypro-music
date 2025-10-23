import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import ReduxProvider from "@/store/ReduxProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skypro Music",
  description: "Музыкальный плеер",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <html lang="ru">
        <body className={`${montserrat.variable}`}>
          {children}
        </body>
      </html>
    </ReduxProvider>
  );
}