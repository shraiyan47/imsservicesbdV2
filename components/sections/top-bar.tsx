"use client";

import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import StudentFormModal from "@/components/forms/student-form-modal";

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
  const [countries, setCountries] = useState<string[]>(["Bangladesh","USA", "Canada", "Australia", "UK", "Germany", "France",  "Netherlands", "Sweden", "New Zealand", "Ireland", "Malta", "Cyprus"]);
  const [subjects, setSubjects] = useState<string[]>(["Computer Science", "Business", "Engineering", "Medicine", "Arts", "Law", "Psychology", "Biology", "Economics", "Architecture", "Nursing", "Education", "Environmental Science"]);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await fetch("/api/admin/company-info");
        const data = await res.json();
        setCompanyInfo(data);
      } catch (error) {
        console.error("Error fetching company info:", error);
      }
    };

    fetchCompanyInfo();
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

        <div className="flex items-center gap-6">
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
          <StudentFormModal
            open={showStudentForm}
            onOpenChange={setShowStudentForm}
            onClose={() => setShowStudentForm(false)}
            countries={countries}
            subjects={subjects}
          />
        </div>
      </div>
    </div>
  );
}
