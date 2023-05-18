import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import { TxStateStore } from "./services/tx/tx-state.store";
import Web3 from 'web3'
import { TxStateQuery } from "./services/tx/tx-state.query";
import { filter, map, Subscription, tap } from "rxjs";
import { utils } from 'ethers';
import { TxStateService } from "./services/tx/tx-state.service";
import detectEthereumProvider from "@metamask/detect-provider";
import { WalletConnectionComponent } from "./components/wallet-connection/wallet-connection.component";
import { MatDialog } from "@angular/material/dialog";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

export const web3 = new Web3(Web3.givenProvider);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy {
  readonly sourceTokenInfo$ = this.txStateQuery.sourceTokenInfo$;

  readonly destinationTokenInfo$ = this.txStateQuery.destinationTokenInfo$;

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

  readonly transformedWalletAddress$ = this.txStateQuery.walletAddress$.pipe(
    map(address => address ? address.slice(0, 4) + '...' + address.slice(-6) : undefined),
  );

  readonly subscription = new Subscription();

  constructor(
    private txStateStore: TxStateStore,
    private txStateQuery: TxStateQuery,
    private txStateService: TxStateService,
    private matDialog: MatDialog,
  ) {
    this.txStateStore.update({
      walletAddress: undefined,
    });
    this.matDialog.open(WalletConnectionComponent);

    const chainChanged$ = fromPromise(detectEthereumProvider()).pipe(
      tap((provider) => {
        return provider?.on('chainChanged', () => window.location.reload())
      }),
    ).subscribe();
    this.subscription.add(chainChanged$);

    const accountChanged$ = fromPromise(detectEthereumProvider()).pipe(
      tap((provider) => {
        return provider?.on('accountsChanged', () => window.location.reload())
      }),
    ).subscribe();
    this.subscription.add(accountChanged$);
  }

  updateSourceAddress(address: string): void {
    this.txStateStore.update({
      sourceAddress: address,
    })
  }

  updateDestinationAddress(address: string): void {
    this.txStateStore.update({
      destinationAddress: address,
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
