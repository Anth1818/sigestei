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
  "/editEquipment",
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si la ruta es pública, permite el acceso
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Verifica si existe la cookie de sesión (ejemplo: 'auth-token')
  const token = request.cookies.get("auth-token")?.value;
  let roleId: number | undefined = undefined;

  if (token) {
    try {
      const base64Payload = token.split(".")[1];
      // Edge runtime: usa atob, no Buffer
      const payload = JSON.parse(globalThis.atob(base64Payload));
      roleId = Number(payload.role_id);
      // Verifica si el token ha expirado
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        // Token expirado, redirige a login
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (err) {
      // Opcional: console.error("Error decoding JWT:", err);
      roleId = undefined;
    }
  }

  if (!token || !roleId) {
    // Si no hay token o no se pudo extraer el rol, redirige a login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Mapa de acceso por rol
  const roleAccessMap: Record<number, string[]> = {
    1: [
      "/dashboard",
      "/viewInventory",
      "/viewRequests",
      "/viewUsers",
      "/addUser",
      "/addRequest",
      "/editUser",
      "/editEquipment",
      "/profile"
    ], // admin
    2: [
      "/dashboard",
      "/viewInventory",
      "/editEquipment",
      "/viewRequests",
      "/addRequest",
      "/profile"
    ], // coordinador
    3: ["/viewInventory", "/viewRequests", "/addRequest", "/editEquipment", "/profile"], // técnico
    4: ["/viewRequests", "/addRequest", "/profile"], // usuario final
  };

  const allowedRoutes = roleAccessMap[roleId] || [];
  // Si la ruta no está permitida para el rol, redirige a la primera permitida
  if (!allowedRoutes.some((route) => pathname.startsWith(route))) {
    const redirectUrl = new URL(allowedRoutes[0] || "/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Si hay token y la ruta está permitida, permite el acceso
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
    "/editEquipment",
    "/profile"
  ],
};
