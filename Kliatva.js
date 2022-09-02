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
    if (typeof onResolve !== "function") onResolve = (value) => value;
    if (typeof onReject !== "function") onReject = (value) => value;

    return new Kliatva((resolve, reject) => {
      const makeFulfill = (value) => {
        try {
          resolve(onResolve(value));
        } catch (e) {
          reject(e);
        }
      };
      const makeFail = (error) => {
        try {
          reject(onReject(error));
        } catch (e) {
          reject(e);
        }
      };
      this.resolveQueue.push(makeFulfill);
      this.rejectQueue.push(makeFail);
    });
  }

  catch(onReject) {
    this.then(undefined, onReject);
  }

  doResolve(value) {
    const runResolve = () => {
      if (this.status !== this.PENDING) return;
      this.status = this.FULFILLED;
      this.resolveQueue.forEach((fn) => {
        fn(value);
      });
    };
    setTimeout(runResolve);
  }

  doReject(value) {
    const doReject = () => {
      this.status = this.REJECTED;
      this.rejectQueue.forEach((fn) => fn(value));
    };
    setTimeout(doReject);
  }

  finally(callback) {
    return this.then(
      (value) => Kliatva.resolve(callback()).then(() => value),
      (cause) =>
        Kliatva.resolve(callback()).then(() => {
          throw cause;
        })
    );
  }

  static resolve(value) {
    return value instanceof Kliatva
      ? value
      : new Kliatva((resolve) => resolve(value));
  }

  static reject(reason) {
    return new Kliatva((resolve, reject) => reject(reason));
  }

  static all(kliatvasArray) {
    let kliatvasAlreadyResolved = 0;
    const result = [];
    const klitvasToResolve = kliatvasArray.length;

    return new Kliatva((resolve, reject) => {
      kliatvasArray.forEach((kliatva, index) => {
        Kliatva.resolve(kliatva).then(
          (val) => {
            kliatvasAlreadyResolved++;
            result[index] = val;
            if (kliatvasAlreadyResolved === klitvasToResolve) resolve(result);
          },
          (err) => {
            reject(err);
          }
        );
      });
    });
  }

  static race(kliatvasArray) {
    let weHaveWinner = false;
    return new Kliatva((resolveFirst, rejectFirst) => {
      for (let p of kliatvasArray) {
        Kliatva.resolve(p).then(
          (value) => {
            if (!weHaveWinner) resolveFirst(value);
            weHaveWinner = true;
          },
          (err) => {
            if (!weHaveWinner) rejectFirst(err);
            weHaveWinner = true;
          }
        );
      }
    });
  }
}

Kliatva.prototype.PENDING = "pending";
Kliatva.prototype.FULFILLED = "fulfilled";
Kliatva.prototype.REJECTED = "rejected";

//----

const prom = [
  new Promise((rs, rj) => setTimeout(() => rs("P1"), 500)),
  new Promise((rs, rj) => setTimeout(() => rs("P2"), 1000)),
  new Promise((rs, rj) => setTimeout(() => rj("P3 e"), 1500)),
];

const klia = [
  new Kliatva((rs, rj) => setTimeout(() => rs("K1"), 2000)),
  new Kliatva((rs, rj) => setTimeout(() => rs("K2"), 2500)),
  new Kliatva((rs, rj) => setTimeout(() => rj("K3 e"), 3000)),
];

Promise.race(prom)
  .then((r) => console.log(r))
  .catch((e) => console.log(e));
Kliatva.race(klia)
  .then((r) => console.log(r))
  .catch((e) => console.log(e));
