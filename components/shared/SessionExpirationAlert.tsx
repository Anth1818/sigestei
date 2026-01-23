"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, LogIn } from "lucide-react";
import { useSessionExpiration } from "@/hooks/useSessionExpiration";

export const SessionExpirationAlert = () => {
  const { isExpiring, timeLeft } = useSessionExpiration();
  const [showAlert, setShowAlert] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Mostrar alerta solo cuando está por expirar y no ha sido descartada
    if (isExpiring && !dismissed) {
      setShowAlert(true);
    }
    
    // Si ya no está expirando (renovó sesión de alguna forma), resetear estado
    if (!isExpiring) {
      setDismissed(false);
      setShowAlert(false);
    }
  }, [isExpiring, dismissed]);

  const formatTimeLeft = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleGoToLogin = () => {
    window.location.href = "/login";
  };

  const handleContinueSession = () => {
    setShowAlert(false);
    setDismissed(true);
  };

  // No renderizar nada si no hay alerta que mostrar
  if (!showAlert) {
    return null;
  }

  return (
    <Dialog open={showAlert} onOpenChange={(open) => {
      if (!open) {
        setShowAlert(false);
        setDismissed(true);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Sesión por expirar
          </DialogTitle>
          <DialogDescription  className="space-y-2">
            <span>Tu sesión expirará pronto y serás redirigido al login. <strong>Guarda cualquier cambio pendiente</strong> antes de que esto ocurra.</span>
            <span className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span>Tiempo restante: {formatTimeLeft(timeLeft)}</span>
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleContinueSession}
            className="flex items-center gap-2"
          >
            Continuar trabajando
          </Button>
          <Button
            onClick={handleGoToLogin}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
          >
            <LogIn className="h-4 w-4" />
            Ir al login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};