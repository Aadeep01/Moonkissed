"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export function ChartPageHeader() {
	return (
		<div className="flex items-center gap-4">
			<Link
				href="/dashboard"
				className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
			>
				Dashboard
			</Link>
			<button
				type="button"
				onClick={() => signOut({ callbackUrl: "/auth/signin" })}
				className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
				aria-label="Sign Out"
			>
				<LogOut className="w-4 h-4" />
			</button>
		</div>
	);
}
