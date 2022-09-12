enum kliatvaStatus {
  pending = "pending",
  fulfilled = "fulfilled",
  rejected = "rejected",
}

type mainKliatvaCallback<T> = (
  resolve: (value: T) => void,
  reject: (value: string) => void
) => void;

interface settledResponse<T> {
  status: kliatvaStatus;
  value?: T;
  reason?: string;
}

class Kliatva<T> {
  status: kliatvaStatus;
  mainCallback: mainKliatvaCallback<T>;
  resolveQueue: Array<Function>;
  rejectQueue: Array<Function>;

  constructor(callback: mainKliatvaCallback<T>) {
    this.status = kliatvaStatus.pending;
    this.mainCallback = callback;
    this.resolveQueue = [];
    this.rejectQueue = [];

    this.mainCallback(
      (r: T) => this.doResolve(r),
      (r: string) => this.doReject(r)
    );
  }

  then(onResolve: Function = () => {}, onReject: Function = () => {}) {
    if (typeof onResolve !== "function") onResolve = (value: T) => value;
    if (typeof onReject !== "function") onReject = (value: T) => value;

    return new Kliatva((resolve, reject) => {
      const makeFulfill = (value: T) => {
        try {
          resolve(onResolve(value));
        } catch (e: any) {
          if (e instanceof Error) {
            reject(e.message);
          } else {
            reject(e);
          }
        }
      };
      const makeFail = (error: string) => {
        try {
          reject(onReject(error));
        } catch (e: any) {
          reject(e);
        }
      };
      this.resolveQueue.push(makeFulfill);
      this.rejectQueue.push(makeFail);
    });
  }

  catch(onReject: Function) {
    this.then(() => {}, onReject);
  }

  doResolve(value: T) {
    const runResolve = () => {
      if (this.status !== kliatvaStatus.pending) return;
      this.status = kliatvaStatus.fulfilled;
      this.resolveQueue.forEach((fn) => {
        fn(value);
      });
    };
    setTimeout(runResolve);
  }

  doReject(value: string) {
    const doReject = () => {
      this.status = kliatvaStatus.rejected;
      this.rejectQueue.forEach((fn) => fn(value));
    };
    setTimeout(doReject);
  }

  finally(callback: Function) {
    return this.then(
      (value: T) =>
        Kliatva.resolve(callback()).then(
          () => value,
          () => {}
        ),
      (cause: string) =>
        Kliatva.resolve(callback()).then(
          () => {
            throw cause;
          },
          () => {}
        )
    );
  }

  static resolve<U>(value: U) {
    return value instanceof Kliatva
      ? value
      : new Kliatva<U>((resolve) => resolve(value));
  }

  static reject<U>(reason: string) {
    return new Kliatva<U>((resolve, reject) => reject(reason));
  }

  static all<U>(kliatvasArray: Array<Kliatva<U>>) {
    let kliatvasAlreadyResolved = 0;
    let kliatvasAlreadyRejected = 0;
    const result: Array<U> = [];
    const klitvasToResolve = kliatvasArray.length;

    return new Kliatva<Array<U>>((resolve, reject) => {
      kliatvasArray.forEach((kliatva, index) => {
        Kliatva.resolve(kliatva).then(
          (val: U) => {
            kliatvasAlreadyResolved++;
            result[index] = val;
            if (
              kliatvasAlreadyResolved === klitvasToResolve &&
              !kliatvasAlreadyRejected
            )
              resolve(result);
          },
          (err: string) => {
            reject(err);
            kliatvasAlreadyRejected++;
          }
        );
      });
    });
  }

  static race<U>(kliatvasArray: Array<Kliatva<U>>) {
    let weHaveWinner = false;
    return new Kliatva((resolveFirst: Function, rejectFirst: Function) => {
      for (let p of kliatvasArray) {
        Kliatva.resolve(p).then(
          (value: U) => {
            if (!weHaveWinner) resolveFirst(value);
            weHaveWinner = true;
          },
          (err: string) => {
            if (!weHaveWinner) rejectFirst(err);
            weHaveWinner = true;
          }
        );
      }
    });
  }

  static allSettled<U>(kliatvasArray: Array<Kliatva<U>>) {
    let kliatvasAlreadyDone = 0;
    const result: Array<settledResponse<U>> = [];
    const klitvasToWork = kliatvasArray.length;

    const addValue = (val: U, index: number) =>
      (result[index] = { status: kliatvaStatus.fulfilled, value: val });
    const addReason = (res: string, index: number) =>
      (result[index] = { status: kliatvaStatus.rejected, reason: res });

    return new Kliatva((resolve: Function, reject: Function) => {
      kliatvasArray.forEach((kliatva, index) => {
        Kliatva.resolve(kliatva).then(
          (val: U) => {
            kliatvasAlreadyDone++;
            addValue(val, index);
            if (kliatvasAlreadyDone === klitvasToWork) resolve(result);
          },
          (err: string) => {
            kliatvasAlreadyDone++;
            addReason(err, index);
            if (kliatvasAlreadyDone === klitvasToWork) resolve(result);
          }
        );
      });
    });
  }
}

const kliatvas = [
  new Kliatva<string>((resolve, reject) =>
    setTimeout(() => resolve("Kliatva!"), 1000)
  ),
  new Kliatva<string>((resolve, reject) =>
    setTimeout(() => resolve("Kliatva2!"), 2000)
  ),
];

Kliatva.all<string>(kliatvas).then((r: any) => console.log(r));
