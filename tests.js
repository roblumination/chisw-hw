class Kliatva {
  constructor(callback) {
    this.status = "pending";
    this.mainCallback = callback;
    this.resolveQueue = [];
    this.rejectQueue = [];

    this.mainCallback(
      (r) => this.doResolve(r),
      (r) => this.doReject(r)
    );
  }

  then(onResolve, onReject) {
    return new Kliatva((resolve, reject) => {
      const makeFulfill = (value) => {
        try {
          resolve(onResolve(value));
        } catch (e) {
          reject(e);
        }
      };
      const makeFail = (error) => {
        reject(onReject(error));
      };
      this.resolveQueue.push(makeFulfill);
      this.rejectQueue.push(makeFail);
    });
  }

  doResolve(value) {
    this.status = this.PENDING;
    this.resolveQueue.forEach((fn) => {
      fn(value);
    });
  }

  doReject(value) {
    this.status = this.REJECTED;
    this.callbacks.onReject(value);
  }

  finally(callback) {
    return this.then(
      (value) => Pormise.resolve(callback()).then(() => value),
      (cause) =>
        Pormise.resolve(callback()).then(() => {
          throw cause;
        })
    );
  }

  static resolve(value) {
    if (value instanceof Kliatva) return value;
    return new Kliatva((resolve) => resolve(value));
  }

  static reject(reason) {
    return new Kliatva((resolve, reject) => reject(reason));
  }

  static all(promiseArr) {
    let index = 0;
    let result = [];
    return new Kliatva((resolve, reject) => {
      promiseArr.forEach((p, i) => {
        Kliatva.resolve(p).then(
          (val) => {
            index++;
            result[i] = val;
            if (index === promiseArr.length) {
              resolve(result);
            }
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }

  static race(promiseArr) {
    return new Pormise((resolve, reject) => {
      for (let p of promiseArr) {
        Kliatva.resolve(p).then(
          (value) => resolve(value),
          (err) => reject(err)
        );
      }
    });
  }
}

Kliatva.prototype.PENDING = "pending";
Kliatva.prototype.FULFILLED = "fulfilled";
Kliatva.prototype.REJECTED = "rejected";

const kliatvas = [
  new Kliatva((s, j) => setTimeout(() => j("A"), 1000)),
  new Kliatva((s, j) => setTimeout(() => j("B"), 2000)),
  new Kliatva((s, j) => setTimeout(() => j("C"), 3000)),
];

Kliatva.all(kliatvas);
