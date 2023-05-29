import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TokenBlockModule } from "./components/token-block/token-block.module";
import { CommonModule } from "@angular/common";
import { TxStateService } from "./services/tx/tx-state.service";
import { ConditionsModule } from "./components/conditions/conditions.module";
import { TuiDialogModule } from "@taiga-ui/core";
import { WalletConnectionModule } from "./components/wallet-connection/wallet-connection.module";
import { MatDialogModule } from '@angular/material/dialog';
import {TuiLetModule} from "@taiga-ui/cdk";
import { HttpClientModule } from '@angular/common/http';
import {TextToAbiService} from "./services/text-to-abi.service";
import {ReactiveFormsModule} from "@angular/forms";
import {BuildPredicateService} from "./services/build-predicate.service";
import {BuildLimitOrderService} from "./services/build-limit-order.service";

@NgModule({
  declarations: [AppComponent],
  imports: [
    TuiDialogModule,
    BrowserModule,
    TokenBlockModule,
    CommonModule,
    ConditionsModule,
    WalletConnectionModule,
    MatDialogModule,
    TuiLetModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    TxStateService,
    TextToAbiService,
    BuildPredicateService,
    BuildLimitOrderService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
