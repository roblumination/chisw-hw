"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const invoiceClasses_1 = require("./invoiceClasses");
const items = [
    { name: "item1", price: 200 },
    { name: "item10", price: 1 },
    { name: "pants", price: 40 },
];
const invoice = new invoiceClasses_1.Invoice(items);
const accountantInvoice = new invoiceClasses_1.AccountantInvoice(items);
const ceoInvoice = new invoiceClasses_1.CEOInvoice(items, "some CEO information");
const customerInvoice = new invoiceClasses_1.CustomerInvoice(items);
console.log("\x1b[33mINVOICE\x1b[0m");
invoice.getItem("pants");
invoice.getSum();
invoice.pay();
console.log("\x1b[33mACCOUNTANT INVOICE\x1b[0m");
accountantInvoice.getItem("pants");
accountantInvoice.getSum();
accountantInvoice.pay();
accountantInvoice.informTaxOffice();
console.log("\x1b[33mCEO INVOICE\x1b[0m");
ceoInvoice.getItem("pants");
ceoInvoice.getSum();
ceoInvoice.pay();
console.log("\x1b[33mCUSTOMER INVOICE\x1b[0m");
customerInvoice.getItem("pants");
customerInvoice.getSum();
customerInvoice.pay();
customerInvoice.report("Your products is suck");
