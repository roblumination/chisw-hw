class Kliatva {
  constructor(callback) {
    this.status = "pending";
    this.mainCallback = callback;
    this.resolveQueue = [];
    this.rejectQueue = [];

    console.log("created new Kliatva!");

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
    const runResolve = () => {
      if (this.status !== this.PENDING) return;
      this.status = this.FULFILLED;
      this.resolveQueue.forEach((fn) => {
        fn(value);
      });
    };
    setTimeout(() => {
      console.log("delayed");
      runResolve();
    });
  }

  doReject(value) {
    this.status = this.REJECTED;
    this.callbacks.onReject(value);
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
    // console.log("Trying to resolve " + value);
    // if (value instanceof Promise) return value;
    return new Kliatva((rs, rj) => {
      // console.log("inside kliatva!");
      rs(value);
    });
  }

  // static reject(reason) {
  //   return new Kliatva((resolve, reject) => reject(reason));
  // }

  static all(promiseArr) {
    let index = 0;
    let result = [];
    return new Kliatva((resolve, reject) => {
      promiseArr.forEach((p, i) => {
        Pormise.resolve(p).then(
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

  // static race(promiseArr) {
  //   return new Pormise((resolve, reject) => {
  //     for (let p of promiseArr) {
  //       Kliatva.resolve(p).then(
  //         (value) => resolve(value),
  //         (err) => reject(err)
  //       );
  //     }
  //   });
  // }
}

Kliatva.prototype.PENDING = "pending";
Kliatva.prototype.FULFILLED = "fulfilled";
Kliatva.prototype.REJECTED = "rejected";

//----

// const test1 = new Promise((s, j) => setTimeout(() => s("Promise!"), 2000));
// const test2 = new Kliatva((s, j) => setTimeout(() => s("Kliatva!"), 1000));
// const test1 = Promise.resolve("Resolved Promise!");
const test2 = Kliatva.resolve("Resolved Kliatva!");
// const test3 = new Kliatva((rs, rj) => rs("Hand resolved"));
// Kliatva.something("test text");

// test1
//   .then((resp) => {
//     console.log(resp);
//     return "After Promise!";
//   })
//   .then((r) => console.log(r));
test2
  .then((resp) => {
    console.log(resp);
    return "After Kliatva";
  })
  .then((r) => console.log(r));
// test3
//   .then((resp) => {
//     console.log(resp);
//     return "After Kliatva(2)";
//   })
//   .then((r) => console.log(r));
