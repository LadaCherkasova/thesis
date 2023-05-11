import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {TokenBlockModule} from "./components/token-block/token-block.module";
import {CommonModule} from "@angular/common";
import {StateService} from "./services/state.service";
import {ConditionsModule} from "./components/conditions/conditions.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    TokenBlockModule,
    CommonModule,
    ConditionsModule,
  ],
  providers: [StateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
