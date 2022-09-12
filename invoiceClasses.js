class Invoice {
  #token;

  constructor(itemList) {
    this.itemList = itemList;
    this.#token = ~~(Math.random() * 1000);
  }

  getSum() {
    console.log(this.itemList.reduce((a, b) => a + b.price, 0));
    return this.itemList.reduce((a, b) => a + b.price);
  }

  getItem(name) {
    console.log(
      JSON.stringify(this.itemList.filter((item) => item.name === name))
    );
    return this.itemList.filter((item) => item.name === name);
  }

  pay() {
    console.log("Paying with token " + this.#token + "...");
  }
}

class AccountantInvoice extends Invoice {
  constructor(itemList, ceoInformation) {
    super(itemList);
    this.ceoInformation = ceoInformation;
  }

  informTaxOffice() {
    console.table(this.itemList);
  }
}

class CEOInvoice extends Invoice {
  constructor(itemList, ceoInformation) {
    super(itemList);
    this.ceoInformation = ceoInformation;
  }
}

class CustomerInvoice extends Invoice {
  constructor(itemList) {
    super(itemList);
  }

  report(text) {
    console.error(`[CUSTOMER REPORT]: ${text}`);
  }
}

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
