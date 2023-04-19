const fs = require('fs');
const PdfDocument= require('pdfkit');
const path = require('path');
const outputDir = require('../../utils/outputDir');

const generate = (order, response = null) => {
  const pdfInvoice = new PdfDocument();

  pdfInvoice.fontSize(26).text('Invoice', {underline: true});
  pdfInvoice.text('--------------------------');

  let totalPrice = 0;
  pdfInvoice.fontSize(14);
  order.items.forEach(item => {
    totalPrice += item.quantity * item.product.price;
    pdfInvoice.text(item.product.title + ' - ' + item.quantity + ' x $' + item.product.price);
  });

  pdfInvoice.text('--------------------------');
  pdfInvoice.fontSize(26).text('Total Price: $' + totalPrice);

  const invoicePath = path.join(outputDir, 'invoices', generateName(order._id.toString()));
  pdfInvoice.pipe(fs.createWriteStream(invoicePath));

  if (response) {
    pdfInvoice.pipe(response);
  }

  pdfInvoice.end();
}

const generateName = (orderId) => {
  return 'invoice-' + orderId + '.pdf';
}

module.exports.generate = generate;
module.exports.generateName = generateName;
