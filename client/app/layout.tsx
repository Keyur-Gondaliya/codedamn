import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Provider from "@/components/Provider";
import ReduxProvider from "@/redux/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Codedamn Lite",
  description:
    "Ed-tech lite platform for creating cloud base sandbox for different frameworks and languages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <ReduxProvider>
            <ToastContainer
              autoClose={3000}
              position="top-center"
              theme="dark"
            />
            {children}
          </ReduxProvider>
        </Provider>
      </body>
    </html>
  );
}
