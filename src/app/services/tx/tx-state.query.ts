import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { TxState, TxStateStore } from './tx-state.store';

@Injectable({ providedIn: 'root' })
export class TxStateQuery extends Query<TxState> {
  constructor(protected defStore: TxStateStore) {
    super(defStore);
  }

  readonly sourceAddress$ = this.select('sourceAddress');

  readonly destinationAddress$ = this.select('destinationAddress');

  readonly sourceTokenInfo$ = this.select('sourceToken');

  readonly destinationTokenInfo$ = this.select('destinationToken');

  readonly walletAddress$ = this.select('walletAddress');
}
