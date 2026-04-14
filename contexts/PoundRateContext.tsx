"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface PoundRateContextType {
  poundRate: number;
  loading: boolean;
}

const PoundRateContext = createContext<PoundRateContextType | undefined>(undefined);

export function PoundRateProvider({ children }: { children: ReactNode }) {
  const [poundRate, setPoundRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoundRate = async () => {
      try {
        // Get yesterday and today's dates
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const formatDate = (date: Date) =>
          date.toISOString().split("T")[0];

        const startDate = formatDate(yesterday);
        const endDate = formatDate(today);

        const res = await fetch(
          `https://fxds-public-exchange-rates-api.oanda.com/cc-api/currencies?base=GBP&quote=BDT&data_type=general_currency_pair&start_date=${startDate}&end_date=${endDate}`
        );
        const data = await res.json();
        setPoundRate(data?.response?.[0]?.average_bid);
        console.log("Current Pound Rate:", data?.response?.[0]?.average_bid);
      } catch (error) {
        console.error("Error fetching pound rate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoundRate();
  }, []);

  return (
    <PoundRateContext.Provider value={{ poundRate, loading }}>
      {children}
    </PoundRateContext.Provider>
  );
}

export function usePoundRate() {
  const context = useContext(PoundRateContext);
  if (context === undefined) {
    throw new Error("usePoundRate must be used within a PoundRateProvider");
  }
  return context;
}
