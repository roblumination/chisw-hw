"use strict";
function* myGenerator() {
    yield fetch("https://baconipsum.com/api/?type=meat-and-filler");
    yield fetch("https://api.goprogram.ai/inspiration");
    yield fetch("https://random-data-api.com/api/v2/users?size=1&is_xml=true");
    yield fetch("https://www.uuidtools.com/api/generate/v1");
}
function doAsyncThings() {
    const fetchGenerator = myGenerator();
    const step = () => {
        const promise = fetchGenerator.next();
        if (promise.done)
            return;
        promise.value
            .then((r) => r.json())
            .then((r) => {
            console.log(r);
            step();
        });
    };
    return step();
}
doAsyncThings();
