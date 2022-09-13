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
    let kliatvasAlreadyRejected = 0;
    const result = [];
    const klitvasToResolve = kliatvasArray.length;

    return new Kliatva((resolve, reject) => {
      kliatvasArray.forEach((kliatva, index) => {
        Kliatva.resolve(kliatva).then(
          (val) => {
            kliatvasAlreadyResolved++;
            result[index] = val;
            if (
              kliatvasAlreadyResolved === klitvasToResolve &&
              !kliatvasAlreadyRejected
            )
              resolve(result);
          },
          (err) => {
            reject(err);
            kliatvasAlreadyRejected++;
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

  static allSettled(kliatvasArray) {
    let kliatvasAlreadyDone = 0;
    const result = [];
    const klitvasToWork = kliatvasArray.length;

    const addValue = (val, index) =>
      (result[index] = { status: "fulfilled", value: val });
    const addReason = (res, index) =>
      (result[index] = { status: "rejected", reason: res });

    return new Kliatva((resolve, reject) => {
      kliatvasArray.forEach((kliatva, index) => {
        Kliatva.resolve(kliatva).then(
          (val) => {
            kliatvasAlreadyDone++;
            addValue(val, index);
            if (kliatvasAlreadyDone === klitvasToWork) resolve(result);
          },
          (err) => {
            kliatvasAlreadyDone++;
            addReason(err, index);
            if (kliatvasAlreadyDone === klitvasToWork) resolve(result);
          }
        );
      });
    });
  }
}
