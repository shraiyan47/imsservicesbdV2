"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

interface CompanyInfo {
  phone: string;
  email: string;
  address: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/submissions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setMessage("Message sent successfully! We will contact you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy-dark">
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? We&apos;re here to help
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {companyInfo && (
              <>
                <a href={`tel:${companyInfo.phone}`}>
                  <Card>
                    <CardHeader className="flex flex-row items-start gap-4">
                      <Phone className="w-6 h-6 text-purple-accent flex-shrink-0 mt-1" />
                      <div>
                        <CardTitle className="text-lg">Phone</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {companyInfo.phone}
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                </a>
                <a href={`mailto:${companyInfo.email}`} className="block ">
                  <Card>
                    <CardHeader className="flex flex-row items-start gap-4">
                      <Mail className="w-6 h-6 text-purple-accent flex-shrink-0 mt-1" />
                      <div>
                        <CardTitle className="text-lg">Email</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {companyInfo.email}
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                </a>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-4">
                    <MapPin className="w-6 h-6 text-purple-accent flex-shrink-0 mt-1" />
                    <div>
                      <CardTitle className="text-lg">Address</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {companyInfo.address}
                      </p>
                    </div>
                  </CardHeader>
                  <div className="flex justify-center items-center">
                    <div className="mt-4 border rounded-lg overflow-hidden">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4510.457970888686!2d90.34237553160253!3d23.753188408223718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bfc1d1e33765%3A0x5c0e5a3ae41b255a!2sIMS%20Services!5e1!3m2!1sen!2sbd!4v1766155923200!5m2!1sen!2sbd"
                        width="400"
                        height="300"
                        style={{ border: "0" }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 max-w-2xl mx-auto"
              >
                {message && (
                  <div
                    className={`p-4 rounded-lg ${
                      message.includes("successfully")
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div>
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email *"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Your Phone Number *"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Subject *"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <textarea
                    placeholder="Your Message *"
                    required
                    rows={9}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
