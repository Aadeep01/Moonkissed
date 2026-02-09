import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
	subsets: ["latin"],
	weight: ["400", "600", "700"],
	variable: "--font-cormorant",
	display: "swap",
});

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Moonkissed - Your Cosmic Blueprint",
	description:
		"Discover your personalized astrology readings with AI-powered insights. Your cosmic blueprint, beautifully revealed.",
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
		<html lang="en" className={`${cormorant.variable} ${inter.variable}`} suppressHydrationWarning>
			<body className="font-sans">{children}</body>
		</html>
	);
}
