interface Item {
  name: string;
  price: number;
}

export class Invoice {
  private token: number;
  itemList: Array<Item>;

  constructor(itemList) {
    this.itemList = itemList;
    this.token = ~~(Math.random() * 1000);
  }

  getSum() {
    console.log(this.itemList.reduce((a, b) => a + b.price, 0));
    return this.itemList.reduce((a, b) => a + b.price, 0);
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

export class AccountantInvoice extends Invoice {
  constructor(itemList, ceoInformation) {
    super(itemList);
    this.ceoInformation = ceoInformation;
  }

  informTaxOffice() {
    console.table(this.itemList);
  }
}

export class CEOInvoice extends Invoice {
  constructor(itemList, ceoInformation) {
    super(itemList);
    this.ceoInformation = ceoInformation;
  }
}

export class CustomerInvoice extends Invoice {
  constructor(itemList) {
    super(itemList);
  }

  report(text) {
    console.error(`[CUSTOMER REPORT]: ${text}`);
  }
}
