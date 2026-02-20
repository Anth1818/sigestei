"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReactNode } from "react";
import { UserStoreInitializer } from "./UserStoreInitializer";
import { SessionExpirationAlert } from "@/components/shared/SessionExpirationAlert";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10, // 10 segundos
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserStoreInitializer /> 
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        themes={["light", "dark", "theme-blue", "theme-violet", "theme-orange"]}
      >
        {children}
        <SessionExpirationAlert />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
