const express = require('express');
const router = express.Router();
const pdfkit = require('pdfkit');
const db = require('../db');
const requireLogin = require('../middleware/auth');


router.get('/export_purchases_pdf', requireLogin, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM bought_books');

        const doc = new pdfkit();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="purchases.pdf"');
        doc.pipe(res);

        doc.fontSize(20).text('Purchase History', { align: 'center' });
        doc.moveDown();

        rows.forEach((row, index) => {
            const date = new Date(row.purchased_time).toLocaleString();

            doc.fontSize(13).font('Helvetica-Bold').text(`#${index + 1}`);

            doc.font('Helvetica-Bold').text('Title: ', { continued: true });
            doc.font('Helvetica').text(row.book_title);

            doc.font('Helvetica-Bold').text('Author: ', { continued: true });
            doc.font('Helvetica').text(row.author_name);

            doc.font('Helvetica-Bold').text('Price: ', { continued: true });
            doc.font('Helvetica').text(`$${row.price}`);

            doc.font('Helvetica-Bold').text('Condition: ', { continued: true });
            doc.font('Helvetica').text(row.book_condition);

            doc.font('Helvetica-Bold').text('Purchased On: ', { continued: true });
            doc.font('Helvetica').text(date);

            doc.moveDown();
        });


        doc.end();
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

module.exports = router;
