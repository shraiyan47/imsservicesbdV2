"use client";

import { PoundRateProvider } from "@/contexts/PoundRateContext";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <PoundRateProvider>
      {children}
    </PoundRateProvider>
  );
}
