import { Varint } from "./Varint.js";
import * as t from "https://deno.land/std/testing/asserts.ts";

const randint = (n) => {
  return Math.floor(Math.random() * n);
};

Deno.test('fuzz test', () => {
  for (let i = 0, len = 100; i < len; i++) {
    const expect = randint(0x7FFFFFFF);
    const encoded = Varint.encode(expect);
    const data = Varint.decode(encoded);
    t.assertEquals(expect, data, 'fuzz test: ' + expect.toString());
    t.assertEquals(Varint.length(expect), encoded.length);
  }
});
Deno.test('test single byte works as expected', () => {
  const buf = new Uint8Array(2)
  buf[0] = 172
  buf[1] = 2
  const data = Varint.decode(buf)
  t.assertEquals(data, 300, 'should equal 300')
  t.assertEquals(Varint.length(data), 2)
});

Deno.test('test encode works as expected', () => {
  t.assertEquals(Varint.encode(300), new Uint8Array([0xAC, 0x02]))
});
Deno.test('test decode single bytes', () =>  {
  const expected = randint(parseInt('1111111', '2'))
  const buf = new Uint8Array(1)
  buf[0] = expected
  const data = Varint.decode(buf)
  t.assertEquals(data, expected)
  t.assertEquals(Varint.length(data), 1)
});
Deno.test('test decode multiple bytes with zero', () =>  {
  const expected = randint(parseInt('1111111', '2'))
  const buf = new Uint8Array(2)
  buf[0] = 128
  buf[1] = expected
  const data = Varint.decode(buf)
  t.assertEquals(data, expected << 7)
  t.assertEquals(Varint.length(data), 2)
})

Deno.test('encode single byte', () =>  {
  const expected = randint(parseInt('1111111', '2'))
  t.assertEquals(Varint.encode(expected), new Uint8Array([expected]))
  t.assertEquals(Varint.length(expected), 1)
})

Deno.test('encode multiple byte with zero first byte', () =>  {
  const expected = 0x0F00
  t.assertEquals(Varint.encode(expected), new Uint8Array([0x80, 0x1E]))
  t.assertEquals(Varint.length(expected), 2)
})

Deno.test('big integers', () =>  {
  const bigs = []
  for (let i = 32; i <= 53; i++) (function (i) {
    bigs.push(Math.pow(2, i) - 1)
  })(i)

  bigs.forEach(function (n) {
    const data = Varint.encode(n);
    //console.error(n, '->', data);
    t.assertEquals(Varint.decode(data), n)
    t.assert(Varint.decode(data) != n - 1);
  })
});

Deno.test('fuzz test - big', () =>  {
  const MAX_INTD = Number.MAX_SAFE_INTEGER
  const MAX_INT = Math.pow(2, 31)

  for (let i = 0, len = 100; i < len; ++i) {
    const expect = randint(MAX_INTD - MAX_INT) + MAX_INT
    const encoded = Varint.encode(expect)
    const data = Varint.decode(encoded)
    t.assertEquals(expect, data, 'fuzz test: ' + expect.toString())
    t.assertEquals(Varint.length(expect), encoded.length)
  }
})

Deno.test('encodingLength', () =>  {
  for (let i = 0; i <= 53; i++) {
    const n = Math.pow(2, i) - 1
    t.assertEquals(Varint.encode(n).length, Varint.length(n))
  }
})

Deno.test('buffer too short', () =>  {
  const value = Varint.encode(9812938912312)
  const buffer = Varint.encode(value)

  let l = buffer.length
  while (l--) {
    try {
      const val = Varint.decode(buffer.slice(0, l))
    } catch (err) {
      t.assertEquals(err.constructor, RangeError)
      //t.assertEquals(decode.bytes, 0)
    }
  }
})
Deno.test('buffer too long', () => {
  const buffer = Uint8Array.from(
    Array.from({length: 150}, function () { return 0xff })
      .concat(Array.from({length: 1}, function () { return 0x1 }))
  )

  try {
    const val = Varint.decode(buffer)
    Varint.encode(val)
    assert.fail('expected an error received value instead: ' + val)
  } catch (err) {
    t.assertEquals(err.constructor, RangeError)
    //t.assertEquals(decode.bytes, 0)
  }
});
