"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerInvoice = exports.CEOInvoice = exports.AccountantInvoice = exports.Invoice = void 0;
class Invoice {
    constructor(itemList) {
        this.itemList = itemList;
        this.token = ~~(Math.random() * 1000);
    }
    getSum() {
        return this.itemList.reduce((a, b) => a + b.price, 0);
    }
    getItem(name) {
        return this.itemList.filter((item) => item.name === name);
    }
    pay() {
        console.log("Paying with token " + this.token + "...");
    }
}
exports.Invoice = Invoice;
class AccountantInvoice extends Invoice {
    constructor(itemList) {
        super(itemList);
    }
    informTaxOffice() {
        console.table(this.itemList);
    }
}
exports.AccountantInvoice = AccountantInvoice;
class CEOInvoice extends Invoice {
    constructor(itemList, ceoInformation) {
        super(itemList);
        this.ceoInformation = ceoInformation;
    }
}
exports.CEOInvoice = CEOInvoice;
class CustomerInvoice extends Invoice {
    constructor(itemList) {
        super(itemList);
    }
    report(text) {
        console.error(`[CUSTOMER REPORT]: ${text}`);
    }
}
exports.CustomerInvoice = CustomerInvoice;
