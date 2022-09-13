export interface Item {
  name: string;
  price: number;
}

export class Invoice {
  private token: number;
  itemList: Array<Item>;

  constructor(itemList: Array<Item>) {
    this.itemList = itemList;
    this.token = ~~(Math.random() * 1000);
  }

  getSum() {
    return this.itemList.reduce((sum, item) => sum + item.price, 0);
  }

  getItem(name: string) {
    return this.itemList.filter((item) => item.name === name);
  }

  pay() {
    console.log("Paying with token " + this.token + "...");
  }
}

export class AccountantInvoice extends Invoice {
  constructor(itemList: Array<Item>) {
    super(itemList);
  }

  informTaxOffice() {
    console.table(this.itemList);
  }
}

export class CEOInvoice extends Invoice {
  ceoInformation: string;
  constructor(itemList: Array<Item>, ceoInformation: string) {
    super(itemList);
    this.ceoInformation = ceoInformation;
  }
}

export class CustomerInvoice extends Invoice {
  constructor(itemList: Array<Item>) {
    super(itemList);
  }

  report(text: string) {
    console.error(`[CUSTOMER REPORT]: ${text}`);
  }
}
