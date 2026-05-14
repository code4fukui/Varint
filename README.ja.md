# Varint

整数を[protobufスタイルのVarintバイト](https://developers.google.com/protocol-buffers/docs/encoding#Varints)の配列にエンコードし、またデコードします。

## デモ

```javascript
import { Varint } from "https://code4fukui.github.io/Varint/Varint.js";

const bytes = Varint.encode(300) // === [172, 2]
console.log(bytes);
const n = Varint.decode(bytes);
console.log(n); // 300
console.log(Varint.encodingLength(n)); // 2
```

## 機能

- 整数をVarintバイト配列にエンコードします。
- Varintバイト配列を整数にデコードします。
- 値がエンコードされた際のバイト数を取得できる `encodingLength` を提供します。

## 使い方

### Varint.encode(num[, buffer=[], offset=0]) -> Uint8Array

`offset` の位置から `buffer` に `num` をエンコードします。エンコードされたVarintが書き込まれた `buffer` を返します。`buffer` が指定されていない場合は、デフォルトで新しい配列が使用されます。

`Varint.encode.bytes` には、変更されたバイト数が設定されます。

### Varint.decode(data[, offset=0]) -> number

バッファまたは整数の配列である `data` を、`offset` の位置（デフォルトは0）からデコードし、デコードされた元の整数を返します。

`data` が有効なエンコードを表していない場合、`RangeError` をスローします。

### Varint.encodingLength(num)

この数値がエンコードされた際のバイト数を返します（最大8バイト）。

## 使用上の注意

Varintに有効な終了バイトを含まないバッファが渡された場合、`decode` は `RangeError` をスローし、`decode.bytes` は0に設定されます。ストリーミングソースから読み取りを行っている場合、不完全なバッファを `decode` に渡し、このケースを検出した上で、次のバッファを連結しても問題ありません。

## ライセンス

MIT License — [LICENSE](LICENSE) を参照してください。
