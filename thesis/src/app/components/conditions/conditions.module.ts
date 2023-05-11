import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConditionsComponent } from './conditions.component';

@NgModule({
  declarations: [ConditionsComponent],
  imports: [
    CommonModule,
  ],
  exports: [ConditionsComponent],
})
export class ConditionsModule { }
