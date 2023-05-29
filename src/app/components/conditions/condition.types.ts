import {LimitOrderPredicateBuilder} from "@1inch/limit-order-protocol-utils";

export enum ConditionType {
  booleanCheck = 'booleanCheck',
  greaterComparison = 'greaterComparison',
  lessComparison = 'lessComparison',
  equalityCheck = 'equalityCheck',
}

export interface ConditionItem {
  type: ConditionType,
  abiSource: string,
  contractAddress: string,
  methodName: string,
  parameters?: string[],
  comparisonValue?: any,
}

export const predicateBuilderMethod: { [key in Partial<ConditionType>]: any } = {
  [ConditionType.equalityCheck]: (predicateBuilder: LimitOrderPredicateBuilder) => {
    return predicateBuilder.eq;
  },
  [ConditionType.lessComparison]: (predicateBuilder: LimitOrderPredicateBuilder) => {
    return predicateBuilder.lt;
  },
  [ConditionType.greaterComparison]: (predicateBuilder: LimitOrderPredicateBuilder) => {
    return predicateBuilder.gt;
  },
  [ConditionType.booleanCheck]: () => undefined,
}

export const conditionIconName: { [key in Partial<ConditionType>]: any } = {
  [ConditionType.equalityCheck]: 'equal',
  [ConditionType.lessComparison]: 'less',
  [ConditionType.greaterComparison]: 'greater',
  [ConditionType.booleanCheck]: 'question',
}
