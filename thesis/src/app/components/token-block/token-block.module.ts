import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenBlockComponent } from './token-block.component';
import {ReactiveFormsModule} from "@angular/forms";
import { TuiLetModule } from '@taiga-ui/cdk';

@NgModule({
  declarations: [TokenBlockComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiLetModule,
  ],
  exports: [TokenBlockComponent],
})
export class TokenBlockModule { }
