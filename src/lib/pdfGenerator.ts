import {
  formatJakartaHour,
  formatJakartaDate,
} from '@/hooks/date-format.hooks';
import PDFDocument from 'pdfkit/js/pdfkit.standalone.js';

export async function generateTopRankPDF(recomData: any[], batch: string) {
  return new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
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
        doc.text(`Interview Date: ${formatJakartaDate(data.interviewDate)}`);
        doc.moveDown(1.5);

        // === Table Layout ===
        const startX = 60; // left margin
        let y = doc.y;

        // Column widths (adjust these as needed)
        const colWidths = {
          no: 40,
          name: 130,
          email: 160,
          link: 160,
          time: 80,
        };

        // Calculate X positions
        const colX = {
          no: startX,
          name: startX + colWidths.no,
          email: startX + colWidths.no + colWidths.name,
          link: startX + colWidths.no + colWidths.name + colWidths.email,
          time:
            startX +
            colWidths.no +
            colWidths.name +
            colWidths.email +
            colWidths.link,
        };

        const rowHeight = 35;

        // === Draw table header ===
        const drawTableHeader = () => {
          doc.font('Courier-Bold').fontSize(12);
          doc.text('No', colX.no, y, { width: colWidths.no });
          doc.text('Name', colX.name, y, { width: colWidths.name });
          doc.text('Email', colX.email, y, { width: colWidths.email });
          doc.text('Link', colX.link, y, { width: colWidths.link });
          doc.text('Time', colX.time, y, { width: colWidths.time });
          y += rowHeight - 10;
          doc.moveTo(startX, y).lineTo(550, y).stroke();
          y += 10;
        };

        drawTableHeader();

        // === Table Rows ===
        doc.font('Courier').fontSize(9);

        data.rank.forEach((item: any, idx: number) => {
          // Check page overflow
          if (y > doc.page.height - 80) {
            doc.addPage();
            y = 80;
            drawTableHeader();
          }

          // Text content with width limit for wrapping
          doc.text(`${item.rank}`, colX.no, y, {
            width: colWidths.no,
            align: 'left',
          });
          doc.text(item.candidateName || '-', colX.name, y, {
            width: colWidths.name,
            align: 'left',
          });
          doc.text(item.candidateEmail || '-', colX.email, y, {
            width: colWidths.email,
            align: 'left',
          });
          doc.text(item.link, colX.link, y, {
            width: colWidths.link,
            align: 'left',
          });
          doc.text(formatJakartaHour(item.interviewTime) || '-', colX.time, y, {
            width: colWidths.time,
            align: 'left',
          });

          y += rowHeight;
        });
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

export async function generateAcceptedCandidatesPDF(
  recomData: any[],
  batch: string,
) {
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
          .text('Accepted Intern Candidates List', { align: 'center' });
        doc.moveDown(0.5);

        // === Info Section ===
        doc.font('Courier').fontSize(12);
        doc.text(`Role: ${data.role}`);
        doc.text(`Batch: ${batch}`);
        doc.moveDown(1.5);

        // === Table Layout ===
        const startX = 60; // left margin
        let y = doc.y;
        const colWidths = [40, 120, 140, 180]; // width for each column

        // Adjusted column widths
        const col1 = startX; // No
        const col2 = col1 + colWidths[0]; // Name
        const col3 = col2 + colWidths[1]; // Email
        const col4 = col3 + colWidths[2];

        const rowHeight = 25;

        // Draw header function (for reuse after page breaks)
        const drawTableHeader = () => {
          doc.font('Courier-Bold').fontSize(12);
          doc.text('No', col1, y);
          doc.text('ApplyId', col2, y);
          doc.text('Name', col3, y);
          doc.text('Email', col4, y);
          y += rowHeight;
          doc
            .moveTo(startX, y - 10)
            .lineTo(550, y - 10)
            .stroke(); // underline
        };

        drawTableHeader();

        // === Table Rows ===
        doc.font('Courier').fontSize(9);
        data.rank.forEach((item: any) => {
          // Check page overflow
          if (y > doc.page.height - 80) {
            doc.addPage();
            y = 80;
            drawTableHeader();
          }

          // Wrap text if long
          doc.text(`${item.rank}`, col1, y, {
            width: colWidths[0],
            align: 'left',
          });
          doc.text(item.applyId || '-', col2, y, {
            width: colWidths[1],
            align: 'left',
          });
          doc.text(item.candidateName || '-', col3, y, {
            width: colWidths[2],
            align: 'left',
          });
          doc.text(item.candidateEmail || '-', col4, y, {
            width: colWidths[3],
            align: 'left',
          });
          y += rowHeight;
        });
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
