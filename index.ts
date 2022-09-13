import {
  AccountantInvoice,
  CEOInvoice,
  CustomerInvoice,
  Invoice,
  Item,
} from "./invoiceClasses";

const items: Array<Item> = [
  { name: "item1", price: 200 },
  { name: "item10", price: 1 },
  { name: "pants", price: 40 },
];

const invoice = new Invoice(items);
const accountantInvoice = new AccountantInvoice(items);
const ceoInvoice = new CEOInvoice(items, "some CEO information");
const customerInvoice = new CustomerInvoice(items);

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
