import {Component} from '@angular/core';
import {ConditionsStore} from "../../services/conditions/conditions.state";
import {ConditionsQuery} from "../../services/conditions/conditions.query";
import {FormControl} from "@angular/forms";
import {combineLatest, skip, startWith, Subscription, tap, throwError} from "rxjs";
import {conditionIconName, ConditionItem, ConditionType} from "./condition.types";
import {BuildPredicateService} from "../../services/build-predicate.service";

@Component({
  selector: 'conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss']
})
export class ConditionsComponent {
  readonly expirationMs$ = this.conditionsQuery.expirationMs$;

  readonly hoursFormControl = new FormControl<number>(0);

  readonly minutesFormControl = new FormControl<number>(0);

  readonly conditions = Object.values(ConditionType);

  conditionItems: ConditionItem[] = [];

  createdCondition;

  showSelection = false;

  showErrorText = '';

  readonly conditionIconName = conditionIconName;

  readonly ConditionType = ConditionType;

  readonly contractFormControl = new FormControl<string>('');

  readonly abiFormControl = new FormControl<string>('');

  readonly methodNameFormControl = new FormControl<string>('');

  readonly parametersFormControl = new FormControl<string>('');

  readonly comparisonValueFormControl = new FormControl<string>('');

  readonly subscription = new Subscription();

  constructor(
    private conditionsQuery: ConditionsQuery,
    private conditionsStore: ConditionsStore,
    private buildPredicateService: BuildPredicateService,
  ) {
    const expirationMsUpdate$ = combineLatest([
      this.hoursFormControl.valueChanges.pipe(startWith(0)),
      this.minutesFormControl.valueChanges.pipe(startWith(0)),
    ]).pipe(
      skip(1),
      tap(([hours, minutes]) => {
        this.conditionsStore.update({
          expirationMs: [hours, minutes].includes(null) ? undefined : +(hours || 0) * 3600000 + +(minutes || 0) * 60000,
        });
      })
    ).subscribe();
    this.subscription.add(expirationMsUpdate$);
  }

  toggleTimeExpiration(): void {
    const currValue = this.conditionsStore.getValue().expirationMs;
    this.conditionsStore.update({
      expirationMs: currValue === undefined ? 0 : undefined,
    });

    if (currValue === undefined) {
      this.hoursFormControl.setValue(0, {emitEvent: false});
      this.minutesFormControl.setValue(0, {emitEvent: false});
    }
  }

  selectNewConditionType(type: ConditionType): void {
    this.createdCondition = { type };
  }

  addNewCondition(): void {
    if (!this.showSelection) {
      this.showSelection = true;
      return;
    }

    if (!this.createdCondition || !this.createdCondition.type) {
      this.showSelection = false;
      return;
    }

    this.showErrorText = '';
    this.createdCondition = undefined;
    this.resetControls();
  }

  submitCondition() {
    if ([
      !!this.abiFormControl.value,
      !!this.contractFormControl.value,
      !!this.methodNameFormControl.value,
    ].includes(false)
      || (this.createdCondition.type !== ConditionType.booleanCheck && !this.comparisonValueFormControl.value)) {
      this.showErrorText = 'Fill all required fields';
      return;
    }

    this.showErrorText = '';
    const parametersStr = (this.parametersFormControl.value || '').trim();
    const parametersArray = parametersStr.split(',');

    this.createdCondition = {
      ...this.createdCondition,
      abiSource: this.abiFormControl.value,
      contractAddress: this.contractFormControl.value,
      methodName: this.methodNameFormControl.value,
      parameters: parametersArray.length === 1 && parametersArray[0] === '' ? undefined : parametersArray,
      comparisonValue: this.comparisonValueFormControl.value,
    };

    try {
      this.buildPredicateService.addConditionInCurrentPredicate(this.createdCondition);
    } catch(e) {
      this.showErrorText = 'Check fields values correctness';
      return;
    }

    this.conditionItems.push(this.createdCondition);
    this.createdCondition = undefined;
    this.showSelection = false;

    this.resetControls();
  }

  resetControls() {
    this.abiFormControl.reset();
    this.contractFormControl.reset();
    this.methodNameFormControl.reset();
    this.comparisonValueFormControl.reset();
    this.parametersFormControl.reset();
  }
}
