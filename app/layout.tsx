import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Component } from "@/components/ui/component";
import { PropsWithChildren } from "react";
import { ThemeProvider } from "@/lib/theme-provider";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { CurrentTime } from "@/components/local-time";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Timer - An app to count down the time",
  description: "Open source timer app to count down the time",
};

const RootLayout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <ThemeProvider defaultTheme="dark" attribute="class" enableSystem disableTransitionOnChange>
        <body className={cn(
          nunito.className,
          "bg-[#f7f1eb] dark:bg-[#201f1f] text-[#11181c] dark:text-[#ecedee] antialiased transition-colors duration-200 ease-in-out"
        )}>
          <div className="flex justify-between px-4 mt-4">
            <CurrentTime />
            <ThemeSwitcher />
          </div>
          
          <div className={cn(
            "p-4 m-4 rounded-lg",
          )}>
            {children}
          </div>
        </body>
      </ThemeProvider>
    </html>
  );
}

export default RootLayout;