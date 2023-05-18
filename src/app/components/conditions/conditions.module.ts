import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConditionsComponent } from './conditions.component';
import { ConditionsQuery } from "../../services/conditions/conditions.query";

@NgModule({
  declarations: [ConditionsComponent],
  imports: [
    CommonModule,
  ],
  exports: [ConditionsComponent],
  providers: [ConditionsQuery]
})
export class ConditionsModule { }
