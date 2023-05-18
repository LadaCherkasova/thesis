import { Component } from '@angular/core';
import { ConditionsStore, ConditionType } from "../../services/conditions/conditions.state";
import { ConditionsQuery } from "../../services/conditions/conditions.query";

@Component({
  selector: 'conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss']
})
export class ConditionsComponent {
  readonly conditions: Array<ConditionType> =
    [ConditionType.timeExpiration, ConditionType.takeProfit, ConditionType.stopLoss];

  readonly ConditionType = ConditionType;

  constructor(
    private conditionsQuery: ConditionsQuery,
    private conditionsStore: ConditionsStore,
  ) {}

  toggleCondition(condition): void {
    const activeConditions = this.conditionsStore.getValue().selectedConditions as Set<ConditionType>;
    const initialSet = activeConditions && !!activeConditions.size ? activeConditions as Set<ConditionType> : new Set<ConditionType>();

    if (!!initialSet && initialSet.has(condition)) {
      initialSet!.delete(condition);
    } else {
      initialSet?.add(condition);
    }

    this.conditionsStore.update({
      selectedConditions: initialSet,
    });
  }

  isSelectedCondition(type: ConditionType): boolean | undefined {
    const conditions = this.conditionsStore.getValue().selectedConditions;
    return conditions && !!conditions.size && conditions.has(type);
  }
}
