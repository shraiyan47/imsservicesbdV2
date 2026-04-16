import jsPDF from "jspdf";

interface InvoiceData {
    poundRate: number;
    location: "london" | "outside";
    dependents: number;
    tuitionFee: number;
    paidTuitionFee: number;
    totalAccommodationPounds: number;
    totalAccommodationBDT: number;
    remainingTuitionFee: number;
    totalBankStatementPounds: number;
    totalBankStatementBDT: number;
    LONDON_SINGLE: number;
    OUTSIDE_LONDON_SINGLE: number;
    LONDON_DEPENDENT: number;
    OUTSIDE_LONDON_DEPENDENT: number;
}

export async function generateInvoicePDF(data: InvoiceData) {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Add logo in top right corner
    try {
        const logoImg = new Image();
        logoImg.src = "/logo.png";
        await new Promise((resolve) => {
            logoImg.onload = () => {
                const logoWidth = 30;
                const logoHeight = 20;
                const padding = 10;
                pdf.addImage(
                    logoImg,
                    "PNG",
                    pageWidth - logoWidth - padding,
                    padding,
                    logoWidth,
                    logoHeight
                );
                resolve(null);
            };
        });
    } catch (error) {
        console.error("Error loading logo:", error);
    }

    // Title
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("IMS Services - Cost Estimation Invoice", 20, 30);

    // Exchange Rate and Date Info
    const today = new Date();
    const dateString = today.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const poundRateNum = Number(data.poundRate) || 0;

    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Generated on: ${dateString}`, 20, 45);
    pdf.text(`Exchange Rate (GBP to BDT): 1 GBP = BDT ${poundRateNum.toFixed(2)}`, 20, 52);

    // Scenario Details
    pdf.setFontSize(12);
    pdf.setTextColor(0);
    pdf.setFont("helvetica", "bold");
    pdf.text("Scenario Details:", 20, 65);
    pdf.text("-----------------------------------------------------------------------", 20, 68);

    pdf.setFontSize(10);
    let yPosition = 73;
    let xPositionForCost = 110;
    pdf.text(
        `Location: ${data.location === "london" ? "Inside London" : "Outside London"}`,
        20,
        yPosition
    );
    yPosition += 7;
    pdf.text(`Number of Dependents: ${data.dependents}`, 20, yPosition);

    if (data.tuitionFee > 0) {
        yPosition += 7;
        pdf.text(`Tuition Fee: £${data.tuitionFee.toLocaleString()}`, 20, yPosition);
        yPosition += 7;
        pdf.text(
            `Tuition Fee Paid: £${data.paidTuitionFee.toLocaleString()}`,
            20,
            yPosition
        );
    }

    // Cost Breakdown
    yPosition += 12;
    pdf.setFontSize(12);
    pdf.text("Cost Breakdown:", 20, yPosition);
    pdf.text("-----------------------------------------------------------------------", 20, yPosition + 3);

    yPosition += 10;
    pdf.setFontSize(10);
    pdf.text(`${data.location === "london" ? "Inside London Living Cost For Student" : "Outside London Living Cost For Student"}`, 20, yPosition);
    yPosition += 6;
    pdf.setFontSize(10);
    pdf.text(`GBP: £${data.location === "london" ? data.LONDON_SINGLE : data.OUTSIDE_LONDON_SINGLE} /month`, xPositionForCost, yPosition);
    yPosition += 6;
    pdf.setFontSize(10);
    pdf.text(`BDT: ${Math.round(data.location === "london" ? data.LONDON_SINGLE * poundRateNum : data.OUTSIDE_LONDON_SINGLE * poundRateNum).toLocaleString("en-BD")} /month`, xPositionForCost, yPosition);
    // dependents total cost
    if (data.dependents > 0) {
        yPosition += 6;
        pdf.setFontSize(10);
        pdf.text(`Dependent - ${data.dependents} Living Cost:`, 20, yPosition);
        yPosition += 6;
        pdf.setFontSize(10);
        pdf.text(`GBP: £${data.location === "london" ? (data.LONDON_DEPENDENT * data.dependents) : (data.OUTSIDE_LONDON_DEPENDENT * data.dependents)} /month`, xPositionForCost, yPosition);
        yPosition += 6;
        pdf.text(`BDT: ${Math.round((data.location === "london" ? (data.LONDON_DEPENDENT * data.dependents) : (data.OUTSIDE_LONDON_DEPENDENT * data.dependents)) * poundRateNum).toLocaleString("en-BD")} /month`, xPositionForCost, yPosition);
    }

    yPosition += 6;
    pdf.setFontSize(10);
    pdf.text("Total 9 Months Accommodation Cost:", 20, yPosition);
    yPosition += 6;
    pdf.text(`GBP:  £${data.totalAccommodationPounds.toLocaleString()}`, xPositionForCost, yPosition);
    yPosition += 6;
    pdf.text(`BDT: ${Math.round(data.totalAccommodationBDT).toLocaleString("en-BD")}`, xPositionForCost, yPosition);

    if (data.remainingTuitionFee > 0) {
        yPosition += 10;
        pdf.text("Remaining Tuition Fee:", 20, yPosition);
        yPosition += 6;
        pdf.text(`GBP: £${data.remainingTuitionFee.toLocaleString()}`, xPositionForCost, yPosition);
    }

    // Total Bank Statement Requirement
    yPosition += 12;
    pdf.setFontSize(12);
    pdf.setTextColor(34, 139, 34); // Green color
    pdf.text("Total Bank Statement Requirement:", 20, yPosition);
    pdf.text("-----------------------------------------------------------------------", 20, yPosition + 3);

    yPosition += 10;
    pdf.setFontSize(11);
    pdf.text(`GBP: (£${data.remainingTuitionFee.toLocaleString()}+${data.totalAccommodationPounds.toLocaleString()}) =                                                     £${data.totalBankStatementPounds.toLocaleString()}`, 20, yPosition);
    yPosition += 8;
    pdf.text(
        `BDT: ${Math.round(data.totalBankStatementBDT).toLocaleString("en-BD")}`,
        xPositionForCost,
        yPosition
    );

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    yPosition = pageHeight - 15;
    pdf.text(
        "*This is an estimate. All costs may vary based on individual circumstances. Consult with our counselors for personalized advice.",
        10,
        yPosition
    );
    yPosition += 6;
    pdf.text("**Exchange rates are provided as reference and may fluctuate.", 10, yPosition);

    // Download PDF
    const filename = `IMS_Invoice_${dateString.replace(/\s/g, "_")}.pdf`;
    pdf.save(filename);
}
