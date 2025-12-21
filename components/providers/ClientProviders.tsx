"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReactNode } from "react";
import { UserStoreInitializer } from "./UserStoreInitializer";

const queryClient = new QueryClient();

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
      </ThemeProvider>
    </QueryClientProvider>
  );
}
