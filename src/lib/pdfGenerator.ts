import PDFDocument from 'pdfkit/js/pdfkit.standalone.js';

export async function generateTopRankPDF(recomData: any[], batch: string) {
  return new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 }); // Added more margin around page
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Use built-in fonts (safe for Vercel)
      doc.font('Courier');

      recomData.forEach((data, dataIndex) => {
        if (dataIndex > 0) doc.addPage();

        // === Title ===
        doc
          .font('Courier-Bold')
          .fontSize(18)
          .text('Interview List Report', { align: 'center' });
        doc.moveDown(0.5);

        // === Info Section ===
        doc.font('Courier').fontSize(12);
        doc.text(`Role: ${data.role}`);
        doc.text(`Batch: ${batch}`);
        doc.text(`Interview Date: ${data.interviewDate}`);
        doc.moveDown(1.5);

        // === Table Layout ===
        const startX = 60; // left margin
        let y = doc.y;

        // Adjusted column widths
        const col1 = startX; // No
        const col2 = col1 + 50; // Name
        const col3 = col2 + 150; // Email
        const col4 = col3 + 180; // Link (Meet)
        const col5 = col4 + 100;

        const rowHeight = 25;

        // Draw header function (for reuse after page breaks)
        const drawTableHeader = () => {
          doc.font('Courier-Bold').fontSize(12);
          doc.text('No', col1, y);
          doc.text('Name', col2, y);
          doc.text('Email', col3, y);
          doc.text('Link', col4, y, { width: 120 }); // set width limit to prevent overflow
          doc.text('Time', col5, y, { width: 120 }); // set width limit to prevent overflow
          y += rowHeight;
          doc
            .moveTo(startX, y - 10)
            .lineTo(550, y - 10)
            .stroke(); // underline
        };

        drawTableHeader();

        // === Table Rows ===
        doc.font('Courier').fontSize(9);
        data.rank.forEach((item: any, index: number) => {
          // Check page overflow
          if (y > doc.page.height - 80) {
            doc.addPage();
            y = 80;
            drawTableHeader();
          }
          //   console.log(item.timeStart)

          // Wrap text if long
          doc.text(`${item.rank}`, col1, y);
          doc.text(item.candidateName || '-', col2, y, { width: 140 });
          doc.text(item.candidateEmail || '-', col3, y, { width: 170 });
          doc.text(item.link || '-', col4, y, { width: 120 });
          doc.text(item.interviewTime || '-', col5, y, { width: 100 });
          y += rowHeight;
        });
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
