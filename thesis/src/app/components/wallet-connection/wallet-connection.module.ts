import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletConnectionComponent } from "./wallet-connection.component";
import { TuiLetModule } from "@taiga-ui/cdk";

@NgModule({
  declarations: [WalletConnectionComponent],
  imports: [
    CommonModule,
    TuiLetModule,
  ],
  exports: [WalletConnectionComponent],
})
export class WalletConnectionModule { }
