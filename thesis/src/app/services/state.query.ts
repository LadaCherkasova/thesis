import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { State, StateStore } from './state.store';

@Injectable({ providedIn: 'root' })
export class StateQuery extends Query<State> {
  constructor(protected defStore: StateStore) {
    super(defStore);
  }

  readonly sourceAddress$ = this.select('sourceAddress');

  readonly destinationAddress$ = this.select('destinationAddress');

  readonly sourceTokenInfo$ = this.select('sourceToken');

  readonly destinationTokenInfo$ = this.select('destinationToken');
}
