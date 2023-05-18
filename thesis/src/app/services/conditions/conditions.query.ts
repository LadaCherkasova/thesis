import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { ConditionsState, ConditionsStore } from "./conditions.state";

@Injectable({ providedIn: 'root' })
export class ConditionsQuery extends Query<ConditionsState> {
  constructor(protected defStore: ConditionsStore) {
    super(defStore);
  }

  readonly selectedConditions$ = this.select('selectedConditions');
}
