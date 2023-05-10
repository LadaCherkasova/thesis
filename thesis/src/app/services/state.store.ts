import { Injectable } from '@angular/core';
import { persistState, Store, StoreConfig } from '@datorama/akita';

export interface Token {
  symbol: string;
  address: string,
  decimals: number,
  name: string;
  balance: bigint,
}

export interface State {
  walletAddress: string,
  sourceAddress: string,
  destinationAddress: string,
  sourceToken: Token | undefined;
  destinationToken: Token | undefined;
}

export function createInitialState(): State {
  return {
    walletAddress: '',
    sourceAddress: '',
    destinationAddress: '',
    sourceToken: undefined,
    destinationToken: undefined,
  };
}

const mainStoreKey = 'main-store';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: mainStoreKey })
export class StateStore extends Store<State> {
  constructor() {
    super(createInitialState());
  }
}

export const persistStorage = persistState({include: [mainStoreKey]});
