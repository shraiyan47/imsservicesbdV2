"use client"

import { useState } from "react";
import { usePoundRate } from "@/contexts/PoundRateContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateInvoicePDF } from "@/lib/generate-invoice";

export default function Costing() {
  const { poundRate, loading } = usePoundRate();

  // State for filters
  const [location, setLocation] = useState<"london" | "outside">("london");
  const [dependents, setDependents] = useState(0);
  const [tuitionFee, setTuitionFee] = useState(12000); // Default tuition fee
  const [paidTuitionFee, setPaidTuitionFee] = useState("");

  // Cost constants (per month)
  const LONDON_SINGLE = 1529;
  const OUTSIDE_LONDON_SINGLE = 1171;
  const LONDON_DEPENDENT = 845;
  const OUTSIDE_LONDON_DEPENDENT = 680;
  const MONTHS = 9;

  // Calculate monthly accommodation cost
  const monthlyAccommodationCost =
    (location === "london" ? LONDON_SINGLE : OUTSIDE_LONDON_SINGLE) +
    dependents * (location === "london" ? LONDON_DEPENDENT : OUTSIDE_LONDON_DEPENDENT);

  // Calculate total 9-month accommodation cost
  const totalAccommodationPounds = monthlyAccommodationCost * MONTHS;
  const totalAccommodationBDT = totalAccommodationPounds * poundRate;

  // Calculate remaining tuition fee
  const tuitionFeeNum = tuitionFee ? parseInt(tuitionFee) : 0;
  const paidTuitionFeeNum = paidTuitionFee ? parseInt(paidTuitionFee) : 0;
  const remainingTuitionFee = Math.max(0, tuitionFeeNum - paidTuitionFeeNum);

  // Calculate total bank statement requirement
  const totalBankStatementPounds = totalAccommodationPounds + remainingTuitionFee;
  const totalBankStatementBDT = totalBankStatementPounds * poundRate;

  const formatCurrency = (amount: number, symbol: string) => {
    if (symbol === "£") {
      return `£${amount.toLocaleString()}`;
    }
    return `৳${Math.round(amount).toLocaleString('en-BD')}`;
  };

  const handleGenerateInvoice = async () => {
    const rateNum = Number(poundRate) || 0;
    if (rateNum === 0) {
      alert("Please wait for the exchange rate to load");
      return;
    }

    try {
      await generateInvoicePDF({
        poundRate: rateNum,
        location,
        dependents,
        tuitionFee: tuitionFeeNum,
        paidTuitionFee: paidTuitionFeeNum,
        totalAccommodationPounds,
        totalAccommodationBDT,
        remainingTuitionFee,
        totalBankStatementPounds,
        totalBankStatementBDT,
        LONDON_SINGLE,
        OUTSIDE_LONDON_SINGLE,
        LONDON_DEPENDENT,
        OUTSIDE_LONDON_DEPENDENT,
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Error generating invoice. Please try again.");
    }
  };

  return (
    <section id="costing" className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-navy-dark">
            Transparent Cost Calculator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Use our calculator to understand the total accommodation and tuition fees needed for your UK education journey (based on gov.uk standards).
          </p>
          <small className="text-xs text-red-500 mt-2 block">
            * All costs are estimates and may vary based on individual circumstances. Please consult with our counselors for personalized advice.
          </small>
          <small className="text-xs text-red-500 mt-1 block">
            * Exchange rate is fetched in real-time and may fluctuate.  
          </small>
        </div>

        {loading || poundRate === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading exchange rate...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Filters Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Your Scenario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Location Filter */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Where will you live?
                    </Label>
                    <RadioGroup value={location} onValueChange={(value: any) => setLocation(value)}>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="london" id="london" />
                        <Label htmlFor="london" className="cursor-pointer flex-1 font-normal">
                          Inside London (£{LONDON_SINGLE}/month)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="outside" id="outside" />
                        <Label htmlFor="outside" className="cursor-pointer flex-1 font-normal">
                          Outside London (£{OUTSIDE_LONDON_SINGLE}/month)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Dependents Filter */}
                  <div className="space-y-3">
                    <Label htmlFor="dependents" className="text-base font-semibold">
                      Number of Dependents
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDependents(Math.max(0, dependents - 1))}
                      >
                        −
                      </Button>
                      <Input
                        id="dependents"
                        type="number"
                        min="0"
                        value={dependents}
                        onChange={(e) => setDependents(Math.max(0, parseInt(e.target.value) || 0))}
                        className="text-center w-20"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDependents(dependents + 1)}
                      >
                        +
                      </Button>
                      <span className="text-sm text-gray-600">
                        (£{location === "london" ? LONDON_DEPENDENT : OUTSIDE_LONDON_DEPENDENT}/month each)
                      </span>
                    </div>
                  </div>

                  {/* Tuition Fee */}
                  <div className="space-y-3">
                    <Label htmlFor="tuition" className="text-base font-semibold">
                      Tuition Fee (Optional)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        £
                      </span>
                      <Input
                        id="tuition"
                        type="number"
                        placeholder="Leave empty if only accommodation needed"
                        value={tuitionFee}
                        onChange={(e) => setTuitionFee(e.target.value)}
                        className="pl-7"
                      />
                    </div>
                  </div>

                  {/* Paid Tuition Fee */}
                  {tuitionFeeNum > 0 && (
                    <div className="space-y-3">
                      <Label htmlFor="paid" className="text-base font-semibold">
                        Tuition Fee Already Paid
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          £
                        </span>
                        <Input
                          id="paid"
                          type="number"
                          placeholder="0"
                          value={paidTuitionFee}
                          onChange={(e) => setPaidTuitionFee(e.target.value)}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Accommodation Cost Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>9 Months Accommodation Cost</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Monthly Breakdown:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <p className="text-gray-600">Main</p>
                        <p className="font-semibold">
                          £{location === "london" ? LONDON_SINGLE : OUTSIDE_LONDON_SINGLE}
                        </p>
                      </div>
                      {dependents > 0 && (
                        <div>
                          <p className="text-gray-600">
                            Dependents ({dependents})
                          </p>
                          <p className="font-semibold">
                            £{dependents * (location === "london" ? LONDON_DEPENDENT : OUTSIDE_LONDON_DEPENDENT)}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="border-t pt-2">
                      <p className="text-sm text-gray-600">Monthly Total</p>
                      <p className="text-lg font-bold text-blue-600">
                        £{monthlyAccommodationCost.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">× 9 Months = Total</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">GBP:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatCurrency(totalAccommodationPounds, "£")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">BDT:</span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(totalAccommodationBDT, "৳")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bank Statement Requirement */}
              <Card className="border-2 border-green-400 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    Total Bank Statement Requirement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tuitionFeeNum > 0 && (
                    <div className="space-y-2 pb-4 border-b">
                      <p className="text-sm text-gray-600">Accommodation (9 months)</p>
                      <p className="font-semibold text-gray-700">
                        £{totalAccommodationPounds.toLocaleString()}
                      </p>
                      
                      <p className="text-sm text-gray-600 mt-3">Remaining Tuition Fee</p>
                      <p className="font-semibold text-gray-700">
                        £{remainingTuitionFee.toLocaleString()}
                      </p>
                      {paidTuitionFeeNum > 0 && (
                        <p className="text-xs text-gray-500">
                          (£{tuitionFeeNum} − £{paidTuitionFeeNum} = £{remainingTuitionFee})
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      {tuitionFeeNum > 0
                        ? "Accommodation + Remaining Tuition"
                        : "Accommodation Only"}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-700">GBP:</span>
                        <span className="text-3xl font-bold text-green-700">
                          {formatCurrency(totalBankStatementPounds, "£")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-700">BDT:</span>
                        <span className="text-3xl font-bold text-green-700">
                          {formatCurrency(totalBankStatementBDT, "৳")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Get Invoice Button */}
                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleGenerateInvoice}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Get Invoice (PDF)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}