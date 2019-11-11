const src = Array(16)
  .fill(0)
  .map(() => Math.floor(Math.random() * 255));

module.exports = [
  Int8Array.from(src),
  Uint8Array.from(src),
  Uint8ClampedArray.from(src),
  Int16Array.from(src),
  Uint16Array.from(src),
];
