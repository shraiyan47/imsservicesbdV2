"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Country {
  _id: string;
  name: string;
  flag: string;
  image: string;
}

export default function Destinations() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("/api/countries");
        const data = await res.json();
        setCountries(data);
        if (data.length > 0) {
          setSelectedCountry(data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) {
    return (
      <section id="destinations" className="py-16 md:py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-muted-foreground">Loading destinations...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="destinations" className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header bar with search button */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy-dark">
            Study Abroad with the Best Student Consultancy in Bangladesh Your
            Path to Success!
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            IMS Services is the leading international student consultancy in
            Bangladesh with global offices in UK, USA & Australia. We provide
            expert guidance for university admissions, scholarships & visa
            services.
          </p>
        </div>
        <div className="h-12 md:h-16 bg-gradient-to-r from-navy-dark to-purple-accent rounded-lg mb-12 flex items-center justify-between px-6 text-white">
          <h2 className="text-2xl font-bold">Choose Your University</h2>
          <Link href="/universities">
            <Button className="bg-white text-navy-dark hover:bg-white/90">
              Search University
            </Button>
          </Link>
        </div>

        {/* Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {countries?.map((country) => (
            <Card
              key={country._id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => setSelectedCountry(country._id)}
            >
              <div
                className="h-40 bg-cover bg-center relative"
                style={{ backgroundImage: `url('${country.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div className="flex items-center space-x-2 backdrop-blur-xs p-2 rounded-md">
                    {/* <div className="text-3xl mb-2">{country.flag}</div> */}
                    <h3 className="text-white font-bold text-lg">
                      {country.name}
                    </h3>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  Top universities and programs
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
