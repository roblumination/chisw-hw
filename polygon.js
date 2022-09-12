function Test(value1) {
  this.value1 = value1;
}

Object.assign(Test.prototype, {
  a: 100,
});

const test = new Test(1);

console.log(test.a);
