const PDFDocument = require('pdfkit');
const fs = require("fs");
const SendEmail = require("./mailController");

const HandleTicketGeneration = async (data) => {
    const { ticketCount, pricing, email, name, eventName, regId, location, when, qrCodeData, terms } = data;

    const doc = new PDFDocument({
        size: 'A4',
        margins: {
            top: 30,
            left: 30,
            right: 40,
            bottom: 20
        },
        compress: false
    });

    const buffers = [];
    doc.on('data', chunk => buffers.push(chunk));
    doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);

        const EmailData = {
            receiver: email,
            subject: `Your Ticket for ${eventName}`,
            text: `
      Hi ${name},

      Your booking has been confirmed! Please find a copy of your ticket(s) attached to this email.

      Booking ID: ${regId}
      Event Name: ${eventName}
    `,
            attachments: [
                {
                    filename: 'tickets.pdf',
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };
        SendEmail(EmailData);
    });

    function renderHeading(text) {
        doc.font('Helvetica-Bold').fontSize(18).text(text, { align: 'center', underline: true, lineGap: 10 });
    }

    function renderSubHeading(label, value) {
        doc.font('Helvetica-Bold').fontSize(10).text(label, { continued: true, lineGap: 4 });
        doc.font('Helvetica').fontSize(10).text(value, { lineGap: 4 });
    }

    function renderSectionLabel(label) {
        doc.font('Helvetica-Bold').fontSize(12).text(label, { align: 'left', lineGap: 6 });
    }

    function renderTerms(termsText) {
        doc.font('Helvetica-Bold').fontSize(12).text('Terms and Conditions', { align: 'center', lineGap: 8 });
        doc.font('Helvetica').fontSize(10).text(termsText, { align: 'left', indent: 10, lineGap: 6 });
    }

    for (const [key, value] of Object.entries(ticketCount)) {
        const price = pricing[key] || "Not Available";
        for (let i = 0; i < value; i++) {
            // Ticket Heading
            renderHeading("Ticket");

            // Calculate initial box height based on terms length
            const termsHeight = doc.heightOfString(terms, { width: doc.page.width - 80, lineGap: 6 });
            const boxHeight = 240 + termsHeight;

            // Draw Box with dynamic height
            doc.rect(20, doc.y, doc.page.width - 60, boxHeight).stroke();
            const startY = doc.y + 30; // Extra top margin for event name

            // Event Name Centered
            doc.moveDown();
            doc.fontSize(16).font('Helvetica-Bold').text(eventName, { align: 'center', lineGap: 8 }); 
            doc.moveDown(1);

            // Venue, Date, and Price (aligned in columns with more space between lines)
            doc.fontSize(10);
            renderSubHeading('VENUE: ', location);
            renderSubHeading('WHEN: ', when);
            renderSubHeading('PRICE: ', `${key} - INR ${price}`);

            // Booked By and Section (Left Aligned)
            doc.moveDown(1);
            renderSubHeading('BOOKED BY: ', name);
            renderSubHeading('SECTION: ', key);

            // QR Code on the right side within the box
            const qrCodeX = doc.page.width - 80;
            const qrCodeY = startY;
            doc.image(qrCodeData, qrCodeX, qrCodeY, { width: 80, height: 80 });

            // Terms Footer
            doc.moveDown(2);
            renderSectionLabel('USE OF THIS TICKET MEANS THAT THE ATTENDEE IS BOUND BY ALL EVENT ORGANISER TERMS AND CONDITIONS');
            doc.moveDown(3);

            // Terms and Conditions inside the box
            renderTerms(terms);

            if (i !== value - 1) {
                doc.addPage();
            }
        }
    }

    doc.end();
};

module.exports = HandleTicketGeneration;
