import { Injectable } from "@angular/core";
import { combineLatest, filter, of, Subscription, switchMap, tap } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { getABI } from "../../abi/abi-service";
import { web3 } from "../../app.component";
import { TxStateQuery } from "./tx-state.query";
import { TxStateStore, Token } from "./tx-state.store";

@Injectable({
  providedIn: 'root',
})
export class TxStateService {
  subscription = new Subscription();

  constructor(private query: TxStateQuery, private state: TxStateStore) {
    const sourceTokenInfo$ = combineLatest([
      this.query.sourceAddress$,
      this.query.walletAddress$,
    ]).pipe(
      filter(([tokenAddress, walletAddress]) => {
        if (!tokenAddress) {
          this.state.update({
            sourceToken: undefined,
          })
        }
        return !!tokenAddress && !!walletAddress;
      }),
      switchMap(([tokenAddress, walletAddress]) => {
        return combineLatest(
          of(tokenAddress),
          fromPromise(getABI('tokenContractABI')),
          of(walletAddress),
        );
      }),
      switchMap(([tokenAddress, abi, walletAddress]) => {
        const contract = new web3.eth.Contract(abi, tokenAddress)
        return combineLatest([
          fromPromise(contract.methods.decimals().call()),
          fromPromise(contract.methods.name().call()),
          fromPromise(contract.methods.symbol().call()),
          fromPromise(contract.methods.balanceOf(walletAddress).call()),
          of(tokenAddress),
        ]);
      }),
      tap(([decimals, name, symbol, balance, address]) => {
        const tokenInfo = {decimals, name, symbol, balance, address} as Token;
        this.state.update({
          sourceToken: tokenInfo,
        })
      }),
    ).subscribe();

    this.subscription.add(sourceTokenInfo$);

    const destinationTokenInfo$ = combineLatest([
      this.query.destinationAddress$,
      this.query.walletAddress$,
    ]).pipe(
      filter(([tokenAddress, walletAddress]) => {
        if (!tokenAddress) {
          this.state.update({
            destinationToken: undefined,
          })
        }
        return !!tokenAddress && !!walletAddress;
      }),
      switchMap(([tokenAddress, walletAddress]) => {
        return combineLatest(
          of(tokenAddress),
          fromPromise(getABI('tokenContractABI')),
          of(walletAddress),
        );
      }),
      switchMap(([tokenAddress, abi, walletAddress]) => {
        const contract = new web3.eth.Contract(abi, tokenAddress)
        return combineLatest([
          fromPromise(contract.methods.decimals().call()),
          fromPromise(contract.methods.name().call()),
          fromPromise(contract.methods.symbol().call()),
          fromPromise(contract.methods.balanceOf(walletAddress).call()),
          of(tokenAddress),
        ]);
      }),
      tap(([decimals, name, symbol, balance, address]) => {
        const tokenInfo = {decimals, name, symbol, balance, address} as Token;
        this.state.update({
          destinationToken: tokenInfo,
        })
      }),
    ).subscribe();

    this.subscription.add(destinationTokenInfo$);
  }
}
