'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: 'Services', href: '#services' },
    { label: 'Destinations', href: '#destinations' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Partners', href: '#partners' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-2xl font-bold bg-gradient-to-r from-navy-dark to-purple-accent bg-clip-text text-transparent">
              IMS
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-purple-accent transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Social Links */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://facebook.com/imsservices"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-purple-accent transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-purple-accent transition-colors"
              aria-label="WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371 0-.57 0-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.882 1.235c-.163.102-.314.271-.315.477-.015 3.516 2.934 6.748 6.15 6.748.597 0 1.19-.067 1.76-.22.188-.056.355.034.449.27l.84 2.126c.187.48-.115 1.001-.613 1.08-.756.13-1.545.097-2.345-.044-3.037-.608-5.694-2.486-7.359-5.052-1.665-2.566-1.948-5.46-1.269-8.217.682-2.823 2.424-5.28 4.834-6.87 2.41-1.59 5.213-2.324 8.104-1.903 2.89.42 5.388 1.907 7.014 4.26 1.626 2.352 2.018 5.14 1.085 7.68-.934 2.54-2.837 4.533-5.334 5.481-1.747.62-3.689.566-5.408-.13-.388-.155-.785.082-.87.482l-.69 2.35c-.127.434.23.834.673.834h.01c.916 0 1.814-.146 2.686-.428 3.404-1.09 6.373-3.516 7.925-6.74 1.552-3.223 1.148-6.923-.914-9.701-2.062-2.778-5.507-4.482-9.188-4.482z"/>
              </svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-sm font-medium text-foreground hover:text-purple-accent transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
