function Invoice(itemList) {
  this.itemList = itemList;
  this.token = ~~(Math.random() * 1000);
}

Invoice.prototype.getSum = function () {
  console.log(this.itemList.reduce((a, b) => a + b.price, 0));
  return this.itemList.reduce((a, b) => a + b.price);
};
Invoice.prototype.getItem = function (name) {
  console.log(
    JSON.stringify(this.itemList.filter((item) => item.name === name))
  );
  return this.itemList.filter((item) => item.name === name);
};
Invoice.prototype.pay = function () {
  console.log("Paying with token " + this.token + "...");
  // console.log("Paying with token " + 0 + "...");
};

// --- --- --- --- ---

function AccountantInvoice(itemList) {
  Invoice.call(this, itemList);
}
AccountantInvoice.prototype = Object.create(Invoice.prototype);
AccountantInvoice.prototype.constructor = AccountantInvoice;
AccountantInvoice.prototype.informTaxOffice = function () {
  console.table(this.itemList);
};

// --- --- --- --- ---

function CEOInvoice(itemList, ceoInformation) {
  Invoice.call(this, itemList);
  this.ceoInformation = ceoInformation;
}
CEOInvoice.prototype = Object.create(Invoice.prototype);
CEOInvoice.prototype.constructor = AccountantInvoice;

// --- --- --- --- ---

function CustomerInvoice(itemList) {
  Invoice.call(this, itemList);
}
CustomerInvoice.prototype = Object.create(Invoice.prototype);
CustomerInvoice.prototype.constructor = AccountantInvoice;
CustomerInvoice.prototype.report = function (text) {
  console.error(`[CUSTOMER REPORT]: ${text}`);
};

const items = [
  { name: "item1", price: 200 },
  { name: "item10", price: 1 },
  { name: "pants", price: 40 },
];

const invoice = new Invoice(items);
const accountantInvoice = new AccountantInvoice(items);
const ceoInvoice = new CEOInvoice(items, "some CEO information");
const customerInvoice = new CustomerInvoice(items);

console.log("\x1b[33mINVOICE\x1b[0m");
console.log(invoice);
invoice.getItem("pants");
invoice.getSum();
invoice.pay();

console.log("\x1b[33mACCOUNTANT INVOICE\x1b[0m");
console.log(accountantInvoice);
accountantInvoice.getItem("pants");
accountantInvoice.getSum();
accountantInvoice.pay();
accountantInvoice.informTaxOffice();
console.log(accountantInvoice instanceof AccountantInvoice);

console.log("\x1b[33mCEO INVOICE\x1b[0m");
console.log(ceoInvoice);
ceoInvoice.getItem("pants");
ceoInvoice.getSum();
ceoInvoice.pay();

console.log("\x1b[33mCUSTOMER INVOICE\x1b[0m");
console.log(customerInvoice);
customerInvoice.getItem("pants");
customerInvoice.getSum();
customerInvoice.pay();
customerInvoice.report("Your products is suck");
