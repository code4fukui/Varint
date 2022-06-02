# Varint

encode whole numbers to an array of [protobuf-style Varint bytes](https://developers.google.com/protocol-buffers/docs/encoding#Varints) and also decode them.

```javascript
import { Varint } from "https://code4fukui.github.io/Varint/Varint.js";

const bytes = Varint.encode(300) // === [172, 2]
console.log(bytes);
const n = Varint.decode(bytes);
console.log(n); // 300
console.log(Varint.length(n)); // 2
```

## api

### Varint.encode(num[, buffer=[], offset=0]) -> Uint8Array

Encodes `num` into `buffer` starting at `offset`. returns `buffer`, with the encoded Varint written into it. If `buffer` is not provided, it will default to a new array.

`Varint.encode.bytes` will now be set to the number of bytes
modified.

### Varint.decode(data[, offset=0]) -> number

decodes `data`, which can be either a buffer or array of integers, from position `offset` or default 0 and returns the decoded original integer.

Throws a `RangeError` when `data` does not represent a valid encoding.

### Varint.encodingLength(num)

returns the number of bytes this number will be encoded as, up to a maximum of 8.

## usage notes

If Varint is passed a buffer that does not contain a valid end
byte, then `decode` will throw `RangeError`, and `decode.bytes` 
will be set to 0. If you are reading from a streaming source,
it's okay to pass an incomplete buffer into `decode`, detect this
case, and then concatenate the next buffer.

# License

MIT
