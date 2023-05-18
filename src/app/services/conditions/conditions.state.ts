import { Injectable } from "@angular/core";
import { persistState, Store, StoreConfig } from "@datorama/akita";

export enum ConditionType {
  timeExpiration = 'timeExpiration',
  takeProfit = 'takeProfit',
  stopLoss = 'stopLoss',
}

export interface ConditionsState {
  selectedConditions: Set<ConditionType> | undefined;
}

export function createInitialState(): ConditionsState {
  return {
    selectedConditions: undefined,
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
