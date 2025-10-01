import { useEffect } from "react";
import { useUserStore } from "@/hooks/useUserStore";

export function UserStoreInitializer() {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, [setUser]);

  return null;
}