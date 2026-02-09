import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Moonkissed - Your Cosmic Blueprint",
    description: "Discover your personalized astrology readings with AI-powered insights. Your cosmic blueprint, beautifully revealed.",
    keywords: ["astrology", "birth chart", "zodiac", "horoscope", "AI astrology"],
    authors: [{ name: "Moonkissed" }],
    creator: "Moonkissed",
    publisher: "Moonkissed",
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://moonkissed.app",
        title: "Moonkissed - Your Cosmic Blueprint",
        description: "Discover your personalized astrology readings with AI-powered insights.",
        siteName: "Moonkissed",
    },
    twitter: {
        card: "summary_large_image",
        title: "Moonkissed - Your Cosmic Blueprint",
        description: "Discover your personalized astrology readings with AI-powered insights.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
