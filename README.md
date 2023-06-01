# To run project:

1. yarn install
2. change some lines in node-modules folder:
- in file with path ``node_modules/@1inch/limit-order-protocol-utils/series-nonce-manager.const.d.ts`` change
```javascript
import { AbiItem } from "src/model/abi.model";
```
to
```javascript
import { AbiItem } from "./model/abi.model";
``` 

- in file with path ``node_modules/@1inch/limit-order-protocol-utils/utils/abstract-facade.d.ts``
  change
```javascript
import { ProviderConnector } from "src/connector/provider.connector";
import { AbiItem } from "src/model/abi.model";
import { ChainId } from "src/model/limit-order-protocol.model";
```
to
```javascript
import { ProviderConnector } from "../connector/provider.connector";
import { AbiItem } from "../model/abi.model";
import { ChainId } from "../model/limit-order-protocol.model";
```
3. yarn start
