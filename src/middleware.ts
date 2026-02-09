export { default } from "next-auth/middleware";

export const config = {
	matcher: ["/dashboard/:path*", "/chart/:path*", "/synastry/:path*"],
};
