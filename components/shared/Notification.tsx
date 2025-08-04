import { useEffect } from "react";
import { toast } from "sonner";

interface NotificationProps {
  message: string;
  variant?: "default" | "success" | "destructive" | null;
}


const Notification: React.FC<NotificationProps> = ({
  message,
  variant = "success",
}) => {
  useEffect(() => {
    if (message) {
      // Cierra cualquier toast anterior con el mismo id antes de mostrar uno nuevo
      toast.dismiss("notification-toast");
      toast(message, {
        id: message,
        action: {
          label: "Cerrar",
          onClick: () => toast.dismiss("notification-toast"),
        },
        // style: {
        //   backgroundColor: variant === "destructive" ? "#f44336" : "#4caf50",
        //   color: "white",
        // },
      });
    }
  }, [message, variant]);
  return null;
};

export { Notification };
