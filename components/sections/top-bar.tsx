"use client";

import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import StudentFormModal from "@/components/forms/student-form-modal";
import Link from "next/link";
import { usePoundRate } from "@/contexts/PoundRateContext";

interface TopBarProps {
  onStartNowClick: () => void;
}

interface CompanyInfo {
  phone: string;
  email: string;
  whatsappUrl: string;
}


export default function TopBar() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [isNotMainDomain, setIsNotMainDomain] = useState(false);
  const { poundRate, loading } = usePoundRate();

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await fetch("/api/company-info");
        const data = await res.json();
        setCompanyInfo(data);
      } catch (error) {
        console.error("Error fetching company info:", error);
      }
    };

    fetchCompanyInfo();
  }, []);

  // Auto-trigger Start Now modal on first visit
  useEffect(() => {
    const isTriggered = sessionStorage.getItem("studentFormTriggered");
    if (!isTriggered) {
      setShowStudentForm(true);
      sessionStorage.setItem("studentFormTriggered", "1");
    }
  }, []);

  // Check if domain is NOT imsservicesbd.com
  useEffect(() => {
    const domain = new URL(location.href).hostname;
    setIsNotMainDomain(!domain.includes("imsservicesbd.com"));
  }, []);

  return (
    <div className="bg-navy-dark text-white h-10 flex items-center px-6">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Button
            onClick={() => setShowStudentForm(true)}
            className="bg-purple-accent text-white hover:bg-purple-accent/90 text-xs h-7"
          >
            Start Now
          </Button>
        </div>

        {isNotMainDomain && (
          <div className="flex items-center">
            <Link
              className="text-white hover:text-purple-accent transition-colors text-xs font-medium"
              href="/admin/login"
            >
              Admin Login
            </Link>
          </div>
        )}

        <div className="hidden md:flex items-center gap-6">
          {companyInfo && (
            <>
              <a
                href={`tel:${companyInfo.phone}`}
                className="flex items-center gap-2 text-xs hover:text-purple-accent transition-colors"
              >
                <Phone size={14} />
                <span>{companyInfo.phone}</span>
              </a>

              <a
                href={`mailto:${companyInfo.email}`}
                className="flex items-center gap-2 text-xs hover:text-purple-accent transition-colors"
              >
                <Mail size={14} />
                <span>{companyInfo.email}</span>
              </a>

              <a
                href={companyInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:text-purple-accent transition-colors"
              >
                WhatsApp
              </a>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-4">
          {companyInfo && (
            <>
              <a
                href={`tel:${companyInfo.phone}`}
                className="text-xs hover:text-purple-accent transition-colors"
              >
                <Phone size={14} />
              </a>

              <a
                href={`mailto:${companyInfo.email}`}
                className="text-xs hover:text-purple-accent transition-colors"
              >
                <Mail size={14} />
              </a>

              <a
                href={companyInfo.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:text-purple-accent transition-colors"
              >
                WhatsApp
              </a>
            </>
          )}
        </div>

        <div className="ml-1 text-xs">
          {!loading && poundRate > 0 ? `GBP to BDT: ${Number(poundRate).toFixed(2)}` : "Loading exchange rate..."}
        </div>

        <StudentFormModal
          open={showStudentForm}
          onOpenChange={setShowStudentForm}
          onClose={() => setShowStudentForm(false)}
        />
      </div>
    </div>
  );
}
