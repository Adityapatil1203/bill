import React, { useState } from 'react';
import './invoice.css';
import Logo from '../images/amazon-logo.png';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const resources = {
  en: {
    translation: {
      "Tax Invoice/Bill of Supply/Cash Memo": "Tax Invoice/Bill of Supply/Cash Memo",
      "Original for Recipient": "Original for Recipient",
      "Sold By": "Sold By",
      "Billing Address": "Billing Address",
      "Shipping Address": "Shipping Address",
      "Order Number": "Order Number",
      "Order Date": "Order Date",
      "Invoice Details": "Invoice Details",
      "Invoice Date": "Invoice Date",
      "TOTAL": "TOTAL",
      "Place of Supply": "Place of Supply",
      "Whether tax is payable under reverse charge": "Whether tax is payable under reverse charge",
      "Place of Delivery": "Place of Delivery",
      "Authorized Signatory": "Authorized Signatory"
    }
  },
  es: {
    translation: {
      "Tax Invoice/Bill of Supply/Cash Memo": "Factura Fiscal/Memo de Suministro/Nota de Efectivo",
      "Original for Recipient": "Original para el destinatario",
      "Sold By": "Vendido por",
      "Billing Address": "Dirección de facturación",
      "Shipping Address": "Dirección de envío",
      "Order Number": "Número de orden",
      "Order Date": "Fecha de la orden",
      "Invoice Details": "Detalles de la factura",
      "Invoice Date": "Fecha de la factura",
      "TOTAL": "TOTAL",
      "Place of Supply": "Lugar de suministro",
      "Whether tax is payable under reverse charge": "Si el impuesto se paga bajo cargo inverso",
      "Place of Delivery": "Lugar de entrega",
      "Authorized Signatory": "Firmante autorizado"
    }
  }
};

i18n.init({
  resources,
  lng: "en", // default language
  interpolation: {
    escapeValue: false
  }
});

const Invoice = ({ invoiceData }) => {
  const { t } = useTranslation();
  const [format, setFormat] = useState('pdf');

  const handleDownload = async () => {

    const invoiceElement = document.getElementById('invoice');

    if (format === 'pdf') {
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: true
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('invoice.pdf');
    } else if (format === 'image') {
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: true
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'invoice.png';
      link.click();
    }
  };

  return (
   
    <div id="invoice" className="invoice-container">
      <div className="header">
        <img src={Logo} alt="Company Logo" className="logo" />
        <div className="invoice-title">
          <h3>Tax Invoice/Bill of Supply/Cash Memo</h3>
          <p>(Original for Recipient)</p>
        </div>
      </div>

      <div className="upper-part">
        <div className="column-left">
          <h3>Sold By:</h3>
          <p>{invoiceData.sellerDetails.name}</p>
          <p>{invoiceData.sellerDetails.address}</p>
          <p>{invoiceData.sellerDetails.city}, {invoiceData.sellerDetails.state}, {invoiceData.sellerDetails.pincode}</p>
          <p><b>PAN No:</b> {invoiceData.sellerDetails.panNo}</p>
          <p><b>GST Registration No:</b> {invoiceData.sellerDetails.gstNo}</p>
          <p><b>Order Number:</b> {invoiceData.orderDetails.orderNo}</p>
          <p><b>Order Date:</b> {invoiceData.orderDetails.orderDate}</p>
        </div>

        <div className="column-right">
          <h3>Billing Address:</h3>
          <p>{invoiceData.billingDetails.name}</p>
          <p>{invoiceData.billingDetails.address}</p>
          <p>{invoiceData.billingDetails.city}, {invoiceData.billingDetails.state}, {invoiceData.billingDetails.pincode}</p>
          <p><strong>State Code: </strong> {invoiceData.billingDetails.stateCode}</p>

          <h3>Shipping Address:</h3>
          <p>{invoiceData.shippingDetails.name}</p>
          <p>{invoiceData.shippingDetails.address}</p>
          <p>{invoiceData.shippingDetails.city}, {invoiceData.shippingDetails.state}, {invoiceData.shippingDetails.pincode}</p>
          <p> <strong>State Code: </strong>{invoiceData.shippingDetails.stateCode}</p>

          <p><b>Place of Supply:</b> {invoiceData.placeOfSupply}</p>
          <p><b>Place of Delivery:</b> {invoiceData.placeOfDelivery}</p>
          <p><b>Invoice Number:</b> {invoiceData.invoiceDetails.invoiceNo}</p>
          <p><b>Invoice Details:</b> {invoiceData.invoiceDetails.invoiceDetails}</p>
          <p><b>Invoice Date:</b> {invoiceData.invoiceDetails.invoiceDate}</p>
        </div>
      </div>

  <div style={{border:"1px solid black",padding:"3px" }} >

  
      <div className="line-items">
        <table>
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>Description</th>
              <th>Unit Price</th>
              <th>Qty</th>
              <th>Net Amount</th>
              <th>Tax Rate</th>
              {/* <th>CGST</th>
              <th>SGST</th> */}
              <th>IGST</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.description}</td>
                <td>{item.unitPrice}</td>
                <td>{item.quantity}</td>
                <td>{item.netAmount}</td>
                <td>{item.taxRate}%</td>
                {/* <td>{item.taxAmount.CGST}</td>
                <td>{item.taxAmount.SGST}</td> */}
                <td>{item.taxAmount.IGST}</td>
                <td>{item.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="totals">
      <p><b>Total:</b> ₹{invoiceData?.totalAmount ? parseFloat(invoiceData.totalAmount) : 0}</p>

    <p><b>Amount in Words:</b> {invoiceData.totalAmountInWords}</p>
  </div>

    
    {/* <div className="footer-left">
      <p><b>Place of Supply:</b> {invoiceData.placeOfSupply}</p>
      <p><b>Reverse Charge:</b> {invoiceData.reverseCharge ? 'Yes' : 'No'}</p>
    </div> */}
    <div className="signature">
      <p>For {invoiceData.sellerDetails.name}</p>
       <img src={URL.createObjectURL(invoiceData?.signature)} alt="Signature" className="signature-image"/> 
      <p><b>Authorized Signatory</b></p>
    </div>
  

  </div>

  <div className="download-options">
        <label>
          Select format:
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
          </select>
        </label>

      </div>

      <button onClick={handleDownload} className="download-button">Download</button>
    </div>

  );
};

export default Invoice;
