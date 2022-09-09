export function convertHPaToMmHg(valueInHPa: number): number {
  return ~~(valueInHPa / 1.3332239);
}

export function convertDegToRad(valueInDeg: number): number {
  return (valueInDeg * Math.PI) / 180;
}

export function roundToSpaces(value: number, spaces: number): number {
  return Math.round(value * 10 ** spaces) / 10 ** spaces;
}

export function getXYFromDeg(deg: number): Array<number> {
  return [Math.sin(convertDegToRad(deg)), Math.cos(convertDegToRad(deg))];
}
