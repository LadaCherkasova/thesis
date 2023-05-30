import { Injectable } from "@angular/core";
import { persistState, Store, StoreConfig } from "@datorama/akita";
import {LimitOrderPredicateCallData} from "@1inch/limit-order-protocol-utils/limit-order-predicate.builder";

export interface ConditionsState {
  expirationMs: number | undefined;
  currentPredicate: LimitOrderPredicateCallData[] | undefined;
}

export function createInitialState(): ConditionsState {
  return {
    expirationMs: undefined,
    currentPredicate: undefined,
  };
}

const conditionsStoreKey = 'conditions-store';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: conditionsStoreKey })
export class ConditionsStore extends Store<ConditionsState> {
  constructor() {
    super(createInitialState());
  }
}

export const conditionsPersistStorage = persistState({
  key: conditionsStoreKey,
  include: [conditionsStoreKey],
});
