"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface SessionInfo {
  isExpiring: boolean;
  timeLeft: number; // en milisegundos
}

// Rutas públicas donde no se debe verificar la sesión
const PUBLIC_ROUTES = ["/login", "/", "/home"];

export const useSessionExpiration = (): SessionInfo => {
  const pathname = usePathname();
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    isExpiring: false,
    timeLeft: 0,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname || "");

  useEffect(() => {
    // No ejecutar en rutas públicas
    if (isPublicRoute) {
      return;
    }

    const checkSession = async () => {
      try {
        // Llamar al endpoint API para obtener el tiempo de expiración
        const response = await fetch("/api/session");
        const data = await response.json();

        if (!data.authenticated || data.timeLeft <= 0) {
          setSessionInfo({ isExpiring: false, timeLeft: 0 });
          return;
        }

        const timeLeft = data.timeLeft;
        // Si faltan 10 minutos o menos (600000 milisegundos) para una sesión de 8 horas
        const isExpiring = timeLeft <= 600000;

        setSessionInfo(prev => {
          // Solo actualizar si cambió el estado de isExpiring o el tiempo
          if (prev.isExpiring !== isExpiring || (isExpiring && prev.timeLeft !== timeLeft)) {
            return { isExpiring, timeLeft };
          }
          return prev;
        });

        // Programar siguiente verificación
        const nextCheck = isExpiring ? 5000 : 30000; // 5s si expirando, 30s si no
        timeoutRef.current = setTimeout(checkSession, nextCheck);
      } catch (error) {
        setSessionInfo({ isExpiring: false, timeLeft: 0 });
      }
    };

    // Verificación inicial
    checkSession();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPublicRoute, pathname]);

  return sessionInfo;
};