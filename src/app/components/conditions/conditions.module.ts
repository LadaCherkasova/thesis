import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConditionsComponent } from './conditions.component';
import { ConditionsQuery } from "../../services/conditions/conditions.query";
import { TuiLetModule } from "@taiga-ui/cdk";
import {ReactiveFormsModule} from "@angular/forms";
import {ConditionItemComponent} from "./condition-item.component/condition-item.component";

@NgModule({
  declarations: [ConditionsComponent, ConditionItemComponent],
  imports: [
    CommonModule,
    TuiLetModule,
    ReactiveFormsModule,
  ],
  exports: [ConditionsComponent, ConditionItemComponent],
  providers: [ConditionsQuery]
})
export class ConditionsModule { }
