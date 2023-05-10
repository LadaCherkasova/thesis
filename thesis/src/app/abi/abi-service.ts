import { AbiItem } from 'web3-utils';

export function getABI(fileName: string): Promise<AbiItem[]> {
  return import(`../abi/${fileName}.json`).then(m => m.default);
}
