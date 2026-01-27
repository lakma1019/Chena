import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generate and download PDF invoice for an order
 * @param {Object} order - Order object with all details
 * @param {Object} customerInfo - Customer information
 */
export const generateInvoice = (order, customerInfo = {}) => {
  try {
    console.log('Generating invoice for order:', order);

    const doc = new jsPDF();

    // Colors
    const primaryColor = [34, 139, 34]; // Green for agriculture theme
    const secondaryColor = [100, 100, 100];
    const textColor = [50, 50, 50];

    // Page width
    const pageWidth = doc.internal.pageSize.width;
  
  // ============================================
  // HEADER - Company Logo & Name
  // ============================================
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Company Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('CHENA', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Agricultural Marketplace Platform', pageWidth / 2, 30, { align: 'center' });
  doc.text('Fresh from Farm to Your Table', pageWidth / 2, 38, { align: 'center' });
  
  // ============================================
  // INVOICE TITLE
  // ============================================
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth / 2, 60, { align: 'center' });
  
  // ============================================
  // ORDER DETAILS
  // ============================================
  let yPos = 75;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Left side - Order Info
  doc.setFont('helvetica', 'bold');
  doc.text('Order Number:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(order.order_number || 'N/A', 60, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Order Date:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  const orderDate = order.order_date || order.created_at || new Date();
  doc.text(new Date(orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }), 60, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Method:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(order.payment_method || 'N/A', 60, yPos);
  
  yPos += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Status:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  if (order.payment_status === 'paid') {
    doc.setTextColor(34, 139, 34);
  } else {
    doc.setTextColor(255, 140, 0);
  }
  doc.text((order.payment_status || 'pending').toUpperCase(), 60, yPos);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  
  // Right side - Delivery Info
  yPos = 70;
  doc.setFont('helvetica', 'bold');
  doc.text('Delivery Address:', 120, yPos);
  doc.setFont('helvetica', 'normal');
  
  const addressLines = doc.splitTextToSize(order.delivery_address || 'N/A', 70);
  doc.text(addressLines, 120, yPos + 5);
  
  yPos += (addressLines.length * 5) + 7;
  if (order.delivery_city) {
    doc.text(`${order.delivery_city}${order.delivery_postal_code ? ', ' + order.delivery_postal_code : ''}`, 120, yPos);
  }
  
  // ============================================
  // PRODUCTS TABLE
  // ============================================
  yPos = 115;
  
  const tableData = order.items?.map(item => [
    item.product_name || 'N/A',
    item.farmer_name || 'N/A',
    `${item.quantity || 0} ${item.weight_unit || ''}`,
    `Rs. ${parseFloat(item.unit_price || 0).toFixed(2)}`,
    `Rs. ${parseFloat(item.subtotal || 0).toFixed(2)}`
  ]) || [];
  
  autoTable(doc, {
    startY: yPos,
    head: [['Product', 'Farmer', 'Quantity', 'Unit Price', 'Subtotal']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [textColor[0], textColor[1], textColor[2]]
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 45 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30, halign: 'right' }
    },
    margin: { left: 20, right: 20 }
  });

  // ============================================
  // TOTALS
  // ============================================
  // Get the Y position after the table
  const finalY = (doc).lastAutoTable?.finalY || yPos + 50;
  yPos = finalY + 10;
  
  const totalsX = pageWidth - 70;
  
  doc.setFontSize(10);
  
  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX, yPos);
  doc.text(`Rs. ${parseFloat(order.subtotal || 0).toFixed(2)}`, totalsX + 50, yPos, { align: 'right' });
  
  yPos += 7;
  doc.text('Delivery Fee:', totalsX, yPos);
  doc.text(`Rs. ${parseFloat(order.delivery_fee || 0).toFixed(2)}`, totalsX + 50, yPos, { align: 'right' });
  
  // Total line
  yPos += 10;
  doc.setLineWidth(0.5);
  doc.line(totalsX, yPos - 3, totalsX + 50, yPos - 3);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', totalsX, yPos);
  doc.text(`Rs. ${parseFloat(order.total_amount || 0).toFixed(2)}`, totalsX + 50, yPos, { align: 'right' });
  
  // ============================================
  // FOOTER
  // ============================================
  const footerY = doc.internal.pageSize.height - 20;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Thank you for your order!', pageWidth / 2, footerY, { align: 'center' });
  doc.text('For any queries, contact us at support@chena.lk', pageWidth / 2, footerY + 5, { align: 'center' });
  
  // ============================================
  // SAVE PDF
  // ============================================
  const fileName = `Invoice_${order.order_number || 'Order'}_${new Date().getTime()}.pdf`;
  doc.save(fileName);

  console.log('Invoice generated successfully:', fileName);
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
};

