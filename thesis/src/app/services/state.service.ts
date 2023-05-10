import {Injectable} from "@angular/core";
import {combineLatest, filter, of, Subscription, switchMap, tap} from "rxjs";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {getABI} from "../abi/abi-service";
import {web3} from "../app.component";
import {StateQuery} from "./state.query";
import {StateStore, Token} from "./state.store";

@Injectable({
  providedIn: 'root',
})
export class StateService {
  subscription = new Subscription();

  constructor(private query: StateQuery, private state: StateStore) {
    const sourceTokenInfo$ = this.query.sourceAddress$.pipe(
      filter(address => {
        if (!address) {
          this.state.update({
            sourceToken: undefined,
          })
        }
        return !!address;
      }),
      switchMap((address) => {
        return combineLatest(
          of(address),
          fromPromise(
            getABI('tokenContractABI')
          )
        );
      }),
      switchMap(([address, abi]) => {
        const contract = new web3.eth.Contract(abi, address)
        return combineLatest([
          fromPromise(contract.methods.decimals().call()),
          fromPromise(contract.methods.name().call()),
          fromPromise(contract.methods.symbol().call()),
          fromPromise(contract.methods.balanceOf('0x6e359D196494F7C172CA91c7B9eBBBed62a5F10A').call()),
          of(address),
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

    const destinationTokenInfo$ = this.query.destinationAddress$.pipe(
      filter(address => {
        if (!address) {
          this.state.update({
            destinationToken: undefined,
          })
        }
        return !!address;
      }),
      switchMap((address) => {
        return combineLatest(
          of(address),
          fromPromise(
            getABI('tokenContractABI')
          )
        );
      }),
      switchMap(([address, abi]) => {
        const contract = new web3.eth.Contract(abi, address)
        return combineLatest([
          fromPromise(contract.methods.decimals().call()),
          fromPromise(contract.methods.name().call()),
          fromPromise(contract.methods.symbol().call()),
          fromPromise(contract.methods.balanceOf('0x6e359D196494F7C172CA91c7B9eBBBed62a5F10A').call()),
          of(address),
        ]);
      }),
      tap(([decimals, name, symbol, balance, address]) => {
        const tokenInfo = {decimals, name, symbol, balance, address} as Token;
        this.state.update({
          destinationToken: tokenInfo,
        })
      })
    ).subscribe();

    this.subscription.add(destinationTokenInfo$);
  }
}
