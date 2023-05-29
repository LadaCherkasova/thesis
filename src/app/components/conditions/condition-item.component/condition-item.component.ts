import {Component, Input} from "@angular/core";
import {ConditionItem} from "../condition.types";
import {conditionIconName} from "../condition.types";

@Component({
  selector: 'condition-item',
  templateUrl: './condition-item.component.html',
  styleUrls: ['./condition-item.component.scss']
})
export class ConditionItemComponent {
  @Input()
  config: ConditionItem;

  readonly conditionIconName = conditionIconName;

  transformValue(value: string): string {
    return value.length > 8
      ? value.slice(0, 2) + '...' + value.slice(-5)
      : value;
  }
}
