import {Component} from '@angular/core';
import {StateStore} from "../../services/state.store";
import {ConditionsStore, ConditionType} from "../../services/conditions.state";
import {StateQuery} from "../../services/state.query";
import {StateService} from "../../services/state.service";
import {ConditionsQuery} from "../../services/conditions.query";

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
    private state: StateStore,
    private query: StateQuery,
    private stateService: StateService,
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
