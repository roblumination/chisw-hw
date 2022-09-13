function* myGenerator() {
  yield fetch("https://baconipsum.com/api/?type=meat-and-filler");
  yield fetch("https://api.goprogram.ai/inspiration");
  yield fetch("https://random-data-api.com/api/v2/users?size=1&is_xml=true");
  yield fetch("https://www.uuidtools.com/api/generate/v1");
}

function doAsyncThings() {
  const fetchGenerator: Generator<Promise<Response>> = myGenerator();
  const result: Array<Object> = [];
  const step = () => {
    const promise: IteratorResult<Promise<Response>> = fetchGenerator.next();
    if (promise.done) {
      console.log(result);
      return;
    }
    promise.value
      .then((r: Response) => r.json())
      .then((r: any) => {
        result.push(r);
        step();
      });
  };

  return step();
}

doAsyncThings();
