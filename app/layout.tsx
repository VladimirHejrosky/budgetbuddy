import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import NavigationBar from "@/components/navigation/navigation-bar";

export const metadata: Metadata = {
  title: "BudgetBuddy",
  description: "Správa financí",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavigationBar />
          <main className="min-h-screen py-20 px-5">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
