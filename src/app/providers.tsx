"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" attribute="class">
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
    </QueryClientProvider>
  );
}
