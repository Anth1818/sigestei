import { useState } from "react";

export const useRequestActions = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleExpansion = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const updateRequestStatus = async (id: number, newStatus: string) => {
    setShowNotification(true);
    console.log(`Updating request ${id} status to ${newStatus}`);
    const timer = setTimeout(() => {
      setShowNotification(false);
      clearTimeout(timer);
    }, 2000);
  };

  const updateRequestPriority = async (id: number, newPriority: string) => {
    setShowNotification(true);
    console.log(`Updating request ${id} priority to ${newPriority}`);
    const timer = setTimeout(() => {
      setShowNotification(false);
      clearTimeout(timer);
    }, 2000);
  };

  return {
    expanded,
    showNotification,
    toggleExpansion,
    updateRequestStatus,
    updateRequestPriority,
  };
};