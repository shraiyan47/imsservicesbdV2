"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Service {
  _id: string;
  title: string;
  description: string;
  icon?: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/admin/services");
        const data = await res.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="services" className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy-dark">
            Your Gateway to World-Class Education
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            IMS Services is a leading international student consultancy agency with headquarters in Dhaka and global offices across United Kingdom (London), United States (New York), and Australia (Melbourne). Our main focus is on the international student market, aiming to create exceptional opportunities for our students. We have successfully placed candidates in top universities across various sectors, such as law, economics, medicine, engineering, and business. 
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services?.map((service) => (
            <Card
              key={service?._id}
              className="border-l-4 border-l-purple-accent hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                {service?.icon ? (
                  <div className="mb-4 text-3xl">
                    <i className={service?.icon}></i>
                  </div>
                ) : (
                  <div className="mb-4 text-3xl">
                    <i className="fa fa-star"></i>
                  </div>
                )}
                <CardTitle className="text-navy-dark">
                  {service?.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service?.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
