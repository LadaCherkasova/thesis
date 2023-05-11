import {Component} from '@angular/core';
import {StateStore} from "./services/state.store";
import Web3 from 'web3'
import {StateQuery} from "./services/state.query";
import {filter, map} from "rxjs";
import {utils} from 'ethers';
import {StateService} from "./services/state.service";

export const web3 = new Web3(Web3.givenProvider);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly sourceTokenInfo$ = this.query.sourceTokenInfo$;

  readonly destinationTokenInfo$ = this.query.destinationTokenInfo$;

  readonly sourceTokenAmount$ = this.sourceTokenInfo$.pipe(
    filter(info => !!info && !!info.balance && !! info.decimals),
    map((info) => {
      const num = +utils.formatUnits(info!.balance as bigint, info!.decimals as number) as number;
      return num.toFixed(4);
    })
  );

  readonly destinationTokenAmount$ = this.destinationTokenInfo$.pipe(
    filter(info => !!info && !!info.balance && !! info.decimals),
    map((info) => {
      const num = +utils.formatUnits(info!.balance as bigint, info!.decimals as number) as number;
      return num.toFixed(4);
    })
  );


  constructor(
    private state: StateStore,
    private query: StateQuery,
    private stateService: StateService,
  ) {}

  updateSourceAddress(address: string): void {
    this.state.update({
      sourceAddress: address,
    })
  }

  updateDestinationAddress(address: string): void {
    this.state.update({
      destinationAddress: address,
    })
  }
}
