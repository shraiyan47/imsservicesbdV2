'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface CompanyInfo {
  phone: string
  email: string
  address: string
  facebookUrl: string
  whatsappUrl: string
}

export default function Footer() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await fetch('/api/company-info')
        const data = await res.json()
        setCompanyInfo(data)
      } catch (error) {
        console.error('Error fetching company info:', error)
      }
    }

    fetchCompanyInfo()
  }, [])

  return (
    <footer className="bg-navy-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">IMS Services</h3>
            <p className="text-white/80 text-sm">
              Your trusted partner in international education and student consultancy.
            </p>
            {companyInfo && (
              <p className="text-white/80 text-sm mt-4">
                {companyInfo.address}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#services" className="text-white/80 hover:text-purple-accent transition-colors">Services</Link></li>
              <li><Link href="#destinations" className="text-white/80 hover:text-purple-accent transition-colors">Destinations</Link></li>
              <li><Link href="#testimonials" className="text-white/80 hover:text-purple-accent transition-colors">Testimonials</Link></li>
              <li><Link href="#partners" className="text-white/80 hover:text-purple-accent transition-colors">Partners</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="text-white/80 hover:text-purple-accent transition-colors">University Application</a></li>
              <li><a href="#services" className="text-white/80 hover:text-purple-accent transition-colors">Visa Assistance</a></li>
              <li><a href="#services" className="text-white/80 hover:text-purple-accent transition-colors">Test Preparation</a></li>
              <li><a href="#services" className="text-white/80 hover:text-purple-accent transition-colors">Career Guidance</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              {companyInfo && (
                <>
                  <li className="text-white/80">Phone: {companyInfo.phone}</li>
                  <li><a href={`mailto:${companyInfo.email}`} className="text-white/80 hover:text-purple-accent transition-colors">Email: {companyInfo.email}</a></li>
                  <li className="pt-2">
                    <div className="flex gap-4">
                      {companyInfo.facebookUrl && (
                        <a href={companyInfo.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-purple-accent transition-colors">Facebook</a>
                      )}
                      {companyInfo.whatsappUrl && (
                        <a href={companyInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-purple-accent transition-colors">WhatsApp</a>
                      )}
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
            <p>&copy; 2025 IMS Services. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-purple-accent transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-purple-accent transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-purple-accent transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
