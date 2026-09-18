import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Simple number to words function for Indian Rupees
function numberToWords(num) {
  if (isNaN(num) || num === null) return '';
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if ((num = num.toString()).length > 9) return 'overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim();
}

export const generateInvoice = async (bookingDetails) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    // Load logo image
    const imgData = '/Content/images/logo.png';
    
    try {
      const response = await fetch(imgData);
      if (response.ok) {
        const blob = await response.blob();
        const base64data = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        doc.addImage(base64data, 'PNG', margin, 10, 40, 15);
      } else {
        throw new Error('Image not found');
      }
    } catch (err) {
      console.error("Failed to load logo for PDF", err);
      doc.setFontSize(18);
      doc.setTextColor(35, 53, 96);
      doc.setFont('helvetica', 'bold');
      doc.text("XRAi Digital", margin, 20);
    }

    // Title Box
    doc.setDrawColor(200);
    doc.setFillColor(245, 247, 250);
    doc.rect(margin, 35, pageWidth - (margin * 2), 10, 'FD');
    doc.setFontSize(14);
    doc.setTextColor(35, 53, 96);
    doc.setFont('helvetica', 'bold');
    doc.text("INVOICE", pageWidth / 2, 42, { align: 'center' });

    // Details Box Layout dynamically using autoTable for clean alignment
    const boxTop = 50;
    
    let dateStr = '';
    let timeStr = '';
    
    if (bookingDetails.created_on) {
      const d = new Date(bookingDetails.created_on);
      if (!isNaN(d.getTime())) {
        dateStr = d.toLocaleDateString('en-GB').replace(/\//g, '-');
        timeStr = d.toLocaleTimeString('en-GB');
      } else {
        dateStr = String(bookingDetails.created_on);
      }
    } else {
      const now = new Date();
      dateStr = bookingDetails.bookingDate || bookingDetails.visit_date || now.toLocaleDateString('en-GB').replace(/\//g, '-');
      timeStr = bookingDetails.slot || bookingDetails.slot_name || now.toLocaleTimeString('en-GB');
    }

    const patientId = String(bookingDetails.patient?.patientId || bookingDetails.patientId || bookingDetails.patient?.id || bookingDetails.patient_id || 'N/A');
    const patientName = String(bookingDetails.patient?.patientName || bookingDetails.patientName || bookingDetails.patient_name || 'N/A');
    const address = String(bookingDetails.patient?.address || bookingDetails.address || 'N/A');
    const ageSex = `${bookingDetails.patient?.age || bookingDetails.age || ''} / ${bookingDetails.patient?.gender || bookingDetails.gender || ''}`;

    autoTable(doc, {
      startY: boxTop,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2, textColor: [50, 50, 50] },
      columnStyles: {
        0: { cellWidth: 26, fontStyle: 'bold' },
        1: { cellWidth: (pageWidth - margin * 2) / 2 - 26, fontStyle: 'normal' },
        2: { cellWidth: 22, fontStyle: 'bold' },
        3: { cellWidth: (pageWidth - margin * 2) / 2 - 22, fontStyle: 'normal' }
      },
      body: [
        [
          { content: 'Customer Details', colSpan: 2, styles: { fontStyle: 'bold', fontSize: 11, textColor: [35, 53, 96] } },
          { content: 'Invoice Details', colSpan: 2, styles: { fontStyle: 'bold', fontSize: 11, textColor: [35, 53, 96] } }
        ],
        [
          'Patient ID:', patientId,
          'Invoice No:', `XRAI/INV/${bookingDetails.id}`
        ],
        [
          'Patient Name:', patientName,
          'Date:', `${dateStr}`
        ],
        [
          'Age/Sex:', ageSex,
          { content: '(system generated)', colSpan: 2, styles: { fontStyle: 'italic', fontSize: 9 } }
        ],
        [
          'Address:', address,
          '', ''
        ]
      ]
    });

    const tableStartY = doc.lastAutoTable.finalY + 10;

    // Table
    const tableData = [];
    let subtotal = 0;
    let itemDiscounts = 0;
    
    if (bookingDetails.services && bookingDetails.services.length > 0) {
      bookingDetails.services.forEach((svc, index) => {
        const price = parseFloat(svc.price || svc.netPayable || 0);
        const discount = parseFloat(svc.discount || 0);
        const total = price - discount;
        
        subtotal += price; 
        itemDiscounts += discount;
        
        tableData.push([
          index + 1,
          svc.service || '-',
          svc.bodyPart || '-',
          price.toFixed(2),
          discount > 0 ? discount.toFixed(2) : '-',
          total.toFixed(2)
        ]);
      });
    }

    let grossAmount = parseFloat(bookingDetails.gross_amount || subtotal);
    let finalAmount = parseFloat(bookingDetails.amount || grossAmount);
    let invoiceDiscount = grossAmount - finalAmount;
    
    if (invoiceDiscount < 0) invoiceDiscount = 0;
    
    let totalDiscount = itemDiscounts + invoiceDiscount;

    autoTable(doc, {
      startY: tableStartY,
      head: [['S.No', 'Service Details', 'Body Part', 'Amount', 'Discount', 'Net Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [245, 247, 250], textColor: [35, 53, 96], fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        1: { halign: 'left' },
        2: { halign: 'left' },
        3: { halign: 'right', cellWidth: 25 },
        4: { halign: 'right', cellWidth: 25 },
        5: { halign: 'right', cellWidth: 30 }
      },
      styles: { fontSize: 9 }
    });

    const finalY = doc.lastAutoTable.finalY + 5;

    // Left Totals (Payment Mode)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(35, 53, 96);
    doc.text("Payment Mode", margin, finalY + 5);
    doc.setLineWidth(0.5);
    doc.setDrawColor(200);
    doc.line(margin, finalY + 6, margin + 30, finalY + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(String(bookingDetails.payment_mode || bookingDetails.paymentMethod || 'PAY AT HOME').toUpperCase(), margin, finalY + 12);

    // Right Totals
    const totalBoxX = pageWidth - 90;
    const totalBoxW = 76;
    
    // We only show discount row if there's a discount
    const summaryBody = [
      ['Sub Total:', 'Rs. ' + subtotal.toFixed(2)]
    ];
    
    if (totalDiscount > 0) {
      summaryBody.push(['Total Discount:', '- Rs. ' + totalDiscount.toFixed(2)]);
    }
    
    summaryBody.push(['Total Amount:', 'Rs. ' + finalAmount.toFixed(2)]);

    autoTable(doc, {
      startY: finalY,
      margin: { left: totalBoxX },
      tableWidth: totalBoxW,
      theme: 'plain',
      body: summaryBody,
      columnStyles: {
        0: { fontStyle: 'bold', halign: 'left', cellWidth: 40, textColor: [50, 50, 50] },
        1: { halign: 'right', fontStyle: 'bold', textColor: [0, 0, 0] }
      },
      styles: { fontSize: 10, cellPadding: 1 },
      didParseCell: function(data) {
        if (data.row.index === summaryBody.length - 1) { // Last row (Total)
           data.cell.styles.fontSize = 12;
           data.cell.styles.textColor = [35, 53, 96];
        }
      }
    });

    const amountInWordsY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    const amountWords = numberToWords(Math.round(finalAmount));
    if (amountWords) {
      doc.text(`Amount in words: ${amountWords} Rupees Only.`, pageWidth / 2, amountInWordsY, { align: 'center' });
    }

    // Declaration
    const declarationY = amountInWordsY + 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.setDrawColor(200);
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, declarationY, pageWidth - (margin * 2), 22, 'FD');
    doc.text("Declaration:", margin + 2, declarationY + 5);
    doc.setFont('helvetica', 'normal');
    
    const declText = "We declare that this invoice shows the actual price of the services described and that all particulars are true and correct.";
    const splitDecl = doc.splitTextToSize(declText, pageWidth - margin * 2 - 105);
    doc.text(splitDecl, margin + 2, declarationY + 11);
    
    doc.setFont('helvetica', 'bold');
    doc.text("for U4RAD Technologies Private Limited", pageWidth - margin - 2, declarationY + 7, { align: 'right' });
    doc.text("Authorized Signatory", pageWidth - margin - 2, declarationY + 18, { align: 'right' });
    
    doc.line(pageWidth - 100, declarationY, pageWidth - 100, declarationY + 22);

    // Footer Company Info
    const footerY = declarationY + 28;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'bold');
    doc.text("U4RAD Technologies Private Limited", pageWidth / 2, footerY, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text("C406, 4th Floor Nirvana Courtyard, Sector-50 Gurugram Haryana 122018", pageWidth / 2, footerY + 5, { align: 'center' });
    doc.text("PAN: AADCU5592R | UAM: HR-05-0125218", pageWidth / 2, footerY + 10, { align: 'center' });
    doc.text("Contact: 0124 - 4254012 | Email: info@xraidigital.com", pageWidth / 2, footerY + 15, { align: 'center' });

    // Save the PDF
    doc.save(`Invoice_${bookingDetails.id}.pdf`);
  } catch (error) {
    console.error("Error generating invoice:", error);
    alert("Error generating invoice: " + error.message);
  }
};
