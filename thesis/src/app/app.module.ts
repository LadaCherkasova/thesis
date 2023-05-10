import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {TokenBlockModule} from "./components/token-block/token-block.module";
import {CommonModule} from "@angular/common";
import {StateService} from "./services/state.service";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    TokenBlockModule,
    CommonModule,
  ],
  providers: [StateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
