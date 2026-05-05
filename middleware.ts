import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") && (!req.auth?.user || (req.auth.user.role !== "ADMIN" && req.auth.user.role !== "STAFF"))) {
    const url = req.nextUrl.clone();
    url.pathname = "/cuenta/iniciar-sesion";
    url.searchParams.set("callbackUrl", pathname);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/admin/:path*", "/cuenta/((?!iniciar-sesion|registro|verificar|error).*)"],
};
