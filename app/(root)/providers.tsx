"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/ThemeProvider";

interface ProviderProps {
  children: React.ReactNode;
  session?: any;
}

export default function Providers({ children, session }: ProviderProps) {
  return (
    <SessionProvider session={session} refetchInterval={0}>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}
