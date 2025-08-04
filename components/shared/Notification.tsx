import { toast } from "sonner"
import { useEffect } from "react";

interface NotificationProps {
  message: string;
  variant?: "default" | "success" | "destructive" | null;
}

  const Notification: React.FC<NotificationProps> = ({ message, variant="success" }) => {
  
    useEffect(() => {
      const notification = (message: string) => {
        toast(message, {
          duration: 5000,
          style: {
            backgroundColor: variant === "destructive" ? "#f44336" : "#4caf50",
            color: "#fff",
          },
        });
      };
  
      notification(message);
    }, [message]);
  
    return null;
  };
  
  export { Notification };