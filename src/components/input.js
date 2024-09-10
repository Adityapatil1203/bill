
import React, { useState } from 'react';
import './input.css';
import Invoice from './invoice';

const Input = () => {
  const [showInvoice, setShowInvoice] = useState(null);

  const [sellerDetails, setSellerDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    panNo: '',
    gstNo: ''
  });

  const [billingDetails, setBillingDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    stateCode: ''
  });

  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    stateCode: ''
  });

  const [orderDetails, setOrderDetails] = useState({
    orderNo: '',
    orderDate: ''
  });

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: '',
    invoiceDetails: '',
    invoiceDate: ''
  });

  const [reverseCharge, setReverseCharge] = useState(false);

  const [items, setItems] = useState([
   
  ]);

  const [newItem, setNewItem] = useState({ description: '', unitPrice: 0, quantity: 1, discount: 0, taxRate: 18 });

  const [signature, setSignature] = useState(null);

  const [placeOfSupply, setPlaceOfSupply] = useState('');
  const [placeOfDelivery, setPlaceOfDelivery] = useState('');

  const handleInputChange = (e, section, key) => {
    const value = e.target.value;
    switch (section) {
      case 'sellerDetails':
        setSellerDetails({ ...sellerDetails, [key]: value });
        break;
      case 'billingDetails':
        setBillingDetails({ ...billingDetails, [key]: value });
        break;
      case 'shippingDetails':
        setShippingDetails({ ...shippingDetails, [key]: value });
        break;
      case 'orderDetails':
        setOrderDetails({ ...orderDetails, [key]: value });
        break;
      case 'invoiceDetails':
        setInvoiceDetails({ ...invoiceDetails, [key]: value });
        break;
      case 'placeOfSupply':
        setPlaceOfSupply(value);
        break;
      case 'placeOfDelivery':
        setPlaceOfDelivery(value);
        break;
      default:
        break;
    }
  };

  const handleAddItem = () => {
    setItems([...items, newItem]);
    setNewItem({ description: '', unitPrice: 0, quantity: 1, discount: 0, taxRate: 18 }); // Reset the new item form
  };

  const handleFileChange = (e) => {
    setSignature(e.target.files[0]);
  };

  // const numberToWords = (num) => {
  //   const a = [
  //     '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  //     'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
  //   ];
  //   const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  //   const g = ['', 'thousand', 'million', 'billion', 'trillion'];

  //   let result = '';
  //   let j = 0;
  //   const convert = (n) => {
  //     if (n < 20) return a[n];
  //     let s = b[Math.floor(n / 10)];
  //     if (n % 10) s += '-' + a[n % 10];
  //     return s;
  //   };

  //   while (num > 0) {
  //     const k = num % 1000;
  //     if (k) {
  //       result = convert(k) + (g[j] ? ' ' + g[j] : '') + ' ' + result;
  //     }
  //     j++;
  //     num = Math.floor(num / 1000);
  //   }
  //   return result.trim();
  // };

  const numberToWords = (num) => {
    const a = [
      '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
      'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
    ];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const g = ['', 'thousand', 'million', 'billion', 'trillion'];
  
    let result = '';
    let j = 0;
  
    // Helper function to convert numbers less than 1000
    const convert = (n) => {
      if (n < 20) return a[n];
      let s = b[Math.floor(n / 10)];
      if (n % 10) s += '-' + a[n % 10];
      return s;
    };
  
    // Process integer part of the number
    const processInteger = (num) => {
      let res = '';
      while (num > 0) {
        const k = num % 1000;
        if (k) {
          res = convert(k) + (g[j] ? ' ' + g[j] : '') + ' ' + res;
        }
        j++;
        num = Math.floor(num / 1000);
      }
      return res.trim();
    };
  
    // Split the number into integer and decimal parts
    const [integerPart, decimalPart] = num.toString().split('.');
  
    // Convert integer part to words
    let words = processInteger(parseInt(integerPart));
  
    // Handle the decimal part if exists
    if (decimalPart) {
      const decimalNum = parseInt(decimalPart.padEnd(2, '0')); // Ensure the decimal is 2 digits
      words += ' and ' + convert(decimalNum) + ' paise';
    }
  
    return words.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const computedItems = items.map(item => {
      const discount = item.discount ? item.discount : 0;
      const netAmount = ((item.unitPrice * item.quantity) - (item.unitPrice * item.quantity) * (discount * 0.01)).toFixed(2);
      const taxType = placeOfSupply === placeOfDelivery ? 'CGST & SGST' : 'IGST';
      const taxAmount = taxType === 'CGST & SGST'
        ? { CGST:( netAmount * 0.09).toFixed(2), SGST: (netAmount * 0.09).toFixed(2) }
        : { IGST: (netAmount * 0.18).toFixed(2) };
        const totalAmount = taxType === 'CGST & SGST'
        ? (parseFloat(netAmount) + parseFloat(taxAmount.CGST) + parseFloat(taxAmount.SGST)).toFixed(2)
        : (parseFloat(netAmount) + parseFloat(taxAmount.IGST)).toFixed(2);

      return {
        ...item,
        netAmount,
        taxType,
        taxAmount,
        totalAmount
      };
    });

    const totalAmount = computedItems.reduce((acc, item) => acc + item.totalAmount, 0);

   
    // const finalTotalAmount = parseFloat(totalAmount.toFixed(2));

    const invoice = {
      sellerDetails,
      billingDetails,
      shippingDetails,
      orderDetails,
      invoiceDetails,
      reverseCharge,
      items: computedItems,
      totalAmount,
      totalAmountInWords: numberToWords(totalAmount),
      placeOfSupply,
      placeOfDelivery,
      signature
    };

    setShowInvoice(invoice);
  };

  return (
    showInvoice == null ? (
      <form onSubmit={handleSubmit}>
               <h2>Seller Details</h2>
        <div className="form-group">
          <input type="text" placeholder="Name" value={sellerDetails.name} onChange={(e) => handleInputChange(e, 'sellerDetails', 'name')} required />
          <input type="text" placeholder="Address" value={sellerDetails.address} onChange={(e) => handleInputChange(e, 'sellerDetails', 'address')} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="City" value={sellerDetails.city} onChange={(e) => handleInputChange(e, 'sellerDetails', 'city')} required />
          <input type="text" placeholder="State" value={sellerDetails.state} onChange={(e) => handleInputChange(e, 'sellerDetails', 'state')} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Pincode" value={sellerDetails.pincode} onChange={(e) => handleInputChange(e, 'sellerDetails', 'pincode')} required />
          <input type="text" placeholder="PAN No." value={sellerDetails.panNo} onChange={(e) => handleInputChange(e, 'sellerDetails', 'panNo')} required />
          <input type="text" className="full-width" placeholder="GST No." value={sellerDetails.gstNo} onChange={(e) => handleInputChange(e, 'sellerDetails', 'gstNo')} required />
        </div>

       
        <h2>Billing Details</h2>
        <div className="form-group">
          <input type="text" placeholder="Name" value={billingDetails.name} onChange={(e) => handleInputChange(e, 'billingDetails', 'name')} required />
          <input type="text" placeholder="Address" value={billingDetails.address} onChange={(e) => handleInputChange(e, 'billingDetails', 'address')} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="City" value={billingDetails.city} onChange={(e) => handleInputChange(e, 'billingDetails', 'city')} required />
          <input type="text" placeholder="State" value={billingDetails.state} onChange={(e) => handleInputChange(e, 'billingDetails', 'state')} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Pincode" value={billingDetails.pincode} onChange={(e) => handleInputChange(e, 'billingDetails', 'pincode')} required />
          <input type="text" placeholder="State Code" value={billingDetails.stateCode} onChange={(e) => handleInputChange(e, 'billingDetails', 'stateCode')} required />
        </div>

        <h2>Shipping Details</h2>
        <div className="form-group">
          <input type="text" placeholder="Name" value={shippingDetails.name} onChange={(e) => handleInputChange(e, 'shippingDetails', 'name')} required />
          <input type="text" placeholder="Address" value={shippingDetails.address} onChange={(e) => handleInputChange(e, 'shippingDetails', 'address')} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="City" value={shippingDetails.city} onChange={(e) => handleInputChange(e, 'shippingDetails', 'city')} required />
          <input type="text" placeholder="State" value={shippingDetails.state} onChange={(e) => handleInputChange(e, 'shippingDetails', 'state')} required />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Pincode" value={shippingDetails.pincode} onChange={(e) => handleInputChange(e, 'shippingDetails', 'pincode')} required />
          <input type="text" placeholder="State Code" value={shippingDetails.stateCode} onChange={(e) => handleInputChange(e, 'shippingDetails', 'stateCode')} required />
        </div>

        <h2>Order Details</h2>
        <div className="form-group">
          <input type="text" placeholder="Order No." value={orderDetails.orderNo} onChange={(e) => handleInputChange(e, 'orderDetails', 'orderNo')} required />
          <input type="date" placeholder="Order Date" value={orderDetails.orderDate} onChange={(e) => handleInputChange(e, 'orderDetails', 'orderDate')} required />
        </div>

        <h2>Invoice Details</h2>
        <div className="form-group">
          <input type="text" placeholder="Invoice No." value={invoiceDetails.invoiceNo} onChange={(e) => handleInputChange(e, 'invoiceDetails', 'invoiceNo')} required />
          <input type="date" placeholder="Invoice Date" value={invoiceDetails.invoiceDate} onChange={(e) => handleInputChange(e, 'invoiceDetails', 'invoiceDate')} required />
          <input placeholder="Invoice Details" value={invoiceDetails.invoiceDetails} onChange={(e) => handleInputChange(e, 'invoiceDetails', 'invoiceDetails')} />
        </div>
      

        {/* Table to display items */}
        <h2>Items List</h2>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Discount</th>
              <th>Tax Rate</th>
            </tr>
          </thead>
          <tbody>
            {items.length>0 &&  items.map((item, index) => (
              <tr key={index}>
                <td data-label="Description">{item.description}</td>
                <td data-label="Unit Price">{item.unitPrice}</td>
                <td data-label="Quantity">{item.quantity}</td>
                <td data-label="Discount">{item.discount}</td>
                <td data-label="Tax Rate">{item.taxRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add new item form */}
        <h2>Add New Item</h2>
        <div className="form-group">
          <label>
            Description:
            <input
              type="text"
              placeholder="Description"
              value={newItem?.description || ' '}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              required
              
            />
          </label>
          <label>
            Unit Price:
            <input
              type="number"
              placeholder="Unit Price"
              value={newItem.unitPrice}
              onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
              min="0"
              required
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value, 10) || 1 })}
              min="1"
              required
            />
          </label>
          <label>
            Discount:
            <input
              type="number"
              placeholder="Discount"
              value={newItem.discount}
              onChange={(e) => setNewItem({ ...newItem, discount: parseFloat(e.target.value) || 0 })}
              min="0"
            />
          </label>
          <label>
            Tax Rate:
            <select value={newItem.taxRate} onChange={(e) => setNewItem({ ...newItem, taxRate: parseFloat(e.target.value) })}>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>
          </label>
        </div>

        <button type="button" onClick={handleAddItem}>Add Item</button>

        <h2>Place Details</h2>
        <div className="form-group">
          <input type="text" placeholder="Place of Supply" value={placeOfSupply} onChange={(e) => handleInputChange(e, 'placeOfSupply')} required />
          <input type="text" placeholder="Place of Delivery" value={placeOfDelivery} onChange={(e) => handleInputChange(e, 'placeOfDelivery')} required />
        </div>

        <h2>Signature</h2>
        <input type="file" onChange={handleFileChange} required />

        <div className="form-group">
          <label>
            <input type="checkbox" checked={reverseCharge} onChange={(e) => setReverseCharge(e.target.checked)} />
            Reverse Charge
          </label>
        </div>

        <button type="submit">Generate Invoice</button>
      </form>
    ) : (
      <Invoice invoiceData={showInvoice} />
    )
  );
};

export default Input;
