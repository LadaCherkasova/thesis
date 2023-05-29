import {Injectable} from "@angular/core";
import {
  LimitOrderBuilder,
  LimitOrderData,
  LimitOrderDecoder, LimitOrderPredicateDecoder,
  Web3ProviderConnector
} from "@1inch/limit-order-protocol-utils";
import Web3 from "web3";
import {chainId, contractAddress} from "./constants";
import {TxStateStore} from "./tx/tx-state.store";
import {BuildPredicateService} from "./build-predicate.service";

@Injectable({
  providedIn: 'root',
})
export class BuildLimitOrderService {
  constructor(
    private txStateStore: TxStateStore,
    private buildPredicateService: BuildPredicateService,
  ) {
    //
  }

  async createLimitOrderConfig() {
    const txState = this.txStateStore.getValue();
    const walletAddress = txState.walletAddress;

    const predicate = await this.buildPredicateService.generateFinalPredicate();

    const data: LimitOrderData =  {
      makerAssetAddress: txState.sourceAddress,
      takerAssetAddress: txState.destinationAddress,
      makerAddress: walletAddress,
      makingAmount: txState.sourceAmount.toString(),
      takingAmount: txState.destinationAmount.toString(),
      predicate: predicate,
    };

    const providerConnector = new Web3ProviderConnector(new Web3(Web3.givenProvider));

    const limitOrderBuilder = new LimitOrderBuilder(
      contractAddress,
      chainId,
      providerConnector,
    );

    const limitOrder = limitOrderBuilder.buildLimitOrder(data);
    const limitOrderTypedData = limitOrderBuilder.buildLimitOrderTypedData(limitOrder);
    const limitOrderSignature = await limitOrderBuilder.buildOrderSignature(walletAddress, limitOrderTypedData);
    const limitOrderHash = limitOrderBuilder.buildLimitOrderHash(limitOrderTypedData);

    console.log('limitOrderHash', limitOrderHash);
    return {
      orderHash: limitOrderHash,
      signature: limitOrderSignature,
      data: limitOrder,
      createDateTime: new Date().toISOString(),
    };
  }
}
