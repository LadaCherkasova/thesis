import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';

export interface Token {
  symbol: string;
  address: string,
  decimals: number,
  name: string;
  balance: bigint,
}

export interface TxState {
  walletAddress: string,
  sourceAddress: string,
  destinationAddress: string,
  sourceToken: Token | undefined;
  destinationToken: Token | undefined;
  sourceAmount: number;
  destinationAmount: number;
}

export function createInitialState(): TxState {
  return {
    walletAddress: '',
    sourceAddress: '',
    destinationAddress: '',
    sourceToken: undefined,
    destinationToken: undefined,
    sourceAmount: 0,
    destinationAmount: 0,
  };
}

const mainStoreKey = 'main-store';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: mainStoreKey })
export class TxStateStore extends Store<TxState> {
  constructor() {
    super(createInitialState());
  }
}

export const txPersistStorage = persistState({
  key: mainStoreKey,
  include: [mainStoreKey],
});
