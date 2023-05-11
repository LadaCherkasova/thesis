import {Injectable} from "@angular/core";
import {persistState, Store, StoreConfig} from "@datorama/akita";

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

const newConditionsStoreKey = 'new-conditions-store';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: newConditionsStoreKey })
export class ConditionsStore extends Store<ConditionsState> {
  constructor() {
    super(createInitialState());
  }
}

export const persistStorage = persistState({include: [newConditionsStoreKey]});
