import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "Toll Passage Manager",
    description: "Review and manage congestion tax passages with hourly rules and fee caps.",
    icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme="light">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
