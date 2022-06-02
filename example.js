import { Varint } from "./Varint.js";

const bytes = Varint.encode(300) // === [172, 2]
console.log(bytes);
const n = Varint.decode(bytes);
console.log(n); // 300
console.log(Varint.encodingLength(n)); // 2
