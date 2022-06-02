const MSB = 0x80;
const REST = 0x7F
const MSBALL = ~REST;
const INT = Math.pow(2, 31);

const N1 = Math.pow(2,  7)
const N2 = Math.pow(2, 14)
const N3 = Math.pow(2, 21)
const N4 = Math.pow(2, 28)
const N5 = Math.pow(2, 35)
const N6 = Math.pow(2, 42)
const N7 = Math.pow(2, 49)
const N8 = Math.pow(2, 56)
const N9 = Math.pow(2, 63)

export class Varint {
  static encode(num, out = [], offset = 0) {
    let bytes = 0;
    if (Number.MAX_SAFE_INTEGER && num > Number.MAX_SAFE_INTEGER) {
      //encode.bytes = 0
      bytes = 0;
      throw new RangeError('Could not encode Varint')
    }
    const oldOffset = offset;
    while (num >= INT) {
      out[offset++] = (num & 0xFF) | MSB;
      num /= 128;
    }
    while (num & MSBALL) {
      out[offset++] = (num & 0xFF) | MSB;
      num >>>= 7;
    }
    out[offset] = num | 0;
    
    //encode.bytes = offset - oldOffset + 1
    bytes = offset - oldOffset + 1;
    
    if (Array.isArray(out)) {
      return new Uint8Array(out);
    }
    return out;
  }
  static decode(buf, offset = 0) {
    let res = 0;
    let shift = 0;
    let counter = offset;
    let b;
    let l = buf.length;
    let bytes = 0;
    do {
      if (counter >= l || shift > 49) {
        //read.bytes = 0
        bytes = 0;
        throw new RangeError('Could not decode Varint')
      }
      b = buf[counter++]
      res += shift < 28
        ? (b & REST) << shift
        : (b & REST) * Math.pow(2, shift)
      shift += 7
    } while (b >= MSB)
  
    //read.bytes = counter - offset
    bytes = counter - offset;
  
    return res
  }
  static encodingLength(value) {
    return value < N1 ? 1
      : value < N2 ? 2
      : value < N3 ? 3
      : value < N4 ? 4
      : value < N5 ? 5
      : value < N6 ? 6
      : value < N7 ? 7
      : value < N8 ? 8
      : value < N9 ? 9
      :              10;
  }
};
