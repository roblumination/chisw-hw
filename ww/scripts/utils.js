export function convertHPaToMmHg(valueInHPa) {
    return ~~(valueInHPa / 1.3332239);
}
export function convertDegToRad(valueInDeg) {
    return (valueInDeg * Math.PI) / 180;
}
export function roundToSpaces(value, spaces) {
    return Math.round(value * Math.pow(10, spaces)) / Math.pow(10, spaces);
}
export function getXYFromDeg(deg) {
    return [Math.sin(convertDegToRad(deg)), Math.cos(convertDegToRad(deg))];
}
