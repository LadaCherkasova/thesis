import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import { TxStateStore } from "./services/tx/tx-state.store";
import Web3 from 'web3'
import { TxStateQuery } from "./services/tx/tx-state.query";
import {catchError, filter, lastValueFrom, map, of, Subscription, switchMap, tap, throwError} from "rxjs";
import { utils } from 'ethers';
import { TxStateService } from "./services/tx/tx-state.service";
import detectEthereumProvider from "@metamask/detect-provider";
import { WalletConnectionComponent } from "./components/wallet-connection/wallet-connection.component";
import { MatDialog } from "@angular/material/dialog";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import {LimitOrderDecoder, LimitOrderPredicateDecoder, Web3ProviderConnector} from "@1inch/limit-order-protocol-utils";
import {
  chainId,
  contractAddress,
  loEndpointEthereum,
  loWalletOrdersEndpoint,
  seriesContractAddress
} from "./services/constants";
import {HttpClient} from "@angular/common/http";
import {FormControl} from "@angular/forms";
import {BuildLimitOrderService} from "./services/build-limit-order.service";
import {LimitOrderProtocolFacade} from "@1inch/limit-order-protocol-utils/limit-order-protocol.facade";
import {ConditionsStore} from "./services/conditions/conditions.state";

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
    private httpClient: HttpClient,
    private buildLimitOrderService: BuildLimitOrderService,
    private conditionsStore: ConditionsStore,
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
    });
  }

  updateDestinationAddress(address: string): void {
    this.txStateStore.update({
      destinationAddress: address,
    });
  }

  updateSourceAmount(amount: number): void {
    this.txStateStore.update({
      sourceAmount: amount,
    });
  }

  updateDestinationAmount(amount: number): void {
    this.txStateStore.update({
      destinationAmount: amount,
    });
  }

  submit() {
    const sendLimitOrder$ = fromPromise(this.buildLimitOrderService.createLimitOrderConfig()).pipe(
      switchMap((config) => {
        return this.httpClient.post<null>(loEndpointEthereum, config).pipe(
          tap(() => {
            this.conditionsStore.update({
              currentPredicate: undefined,
            })
          }),
          catchError((error) => {
            return throwError(() => error);
          }),
        );
      }),
    ).subscribe();
    this.subscription.add(sendLimitOrder$);
  }

  getOrders() {
    const providerConnector = new Web3ProviderConnector(new Web3(Web3.givenProvider));
    const limitOrderProtocolFacade = new LimitOrderProtocolFacade(
      contractAddress,
      chainId,
      providerConnector,
    );

    const myOrders$ = this.httpClient.get<null>(loWalletOrdersEndpoint, {
      params: {
        address: this.txStateStore.getValue().walletAddress,
      }
    }).pipe(
      switchMap((result) => {
        if (!result) {
          return of(null);
        }
        const index = 0;

        console.log(result);

        console.log(result[index]['data']);

        const predicate = LimitOrderDecoder.unpackInteraction(result[index]['data'], 'predicate');

        const limitOrderPredicateDecoder = new LimitOrderPredicateDecoder(chainId);

        console.log('decoded ', limitOrderPredicateDecoder.decode(predicate));

        return fromPromise(limitOrderProtocolFacade.checkPredicate(result[index]['data']));
      }),
      tap((checkPredicate) => console.log('checkPredicate ', checkPredicate)),
      catchError((error) => {
        return throwError(() => error);
      }),
    ).subscribe();

    this.subscription.add(myOrders$);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
