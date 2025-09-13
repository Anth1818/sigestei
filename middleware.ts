import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas protegidas
const protectedRoutes = [
  "/dashboard",
  "/reports",
  "/viewInventory",
  "/viewRequests",
  "/viewUsers",
  "/addUser",
  "/addRequest",
  "/editUser",
  "/editComputerEquipment",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si la ruta es pública, permite el acceso
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Verifica si existe la cookie de sesión (ejemplo: 'auth-token')
  const token = request.cookies.get("auth-token");

  if (!token) {
    // Si no hay token, redirige a login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay token, permite el acceso
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/reports",
    "/viewInventory",
    "/viewRequests",
    "/viewUsers",
    "/addUser",
    "/addRequest",
    "/editUser",
    "/editComputerEquipment",
  ],
};
