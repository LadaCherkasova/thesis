import {Injectable} from "@angular/core";
import {
  LimitOrderPredicateBuilder,
  LimitOrderPredicateDecoder,
  LimitOrderProtocolFacade,
  NonceSeriesV2,
  PredicateTimestamp,
  SeriesNonceManagerFacade,
  SeriesNonceManagerPredicateBuilder,
  Web3ProviderConnector
} from "@1inch/limit-order-protocol-utils";
import {ConditionItem, ConditionType, predicateBuilderMethod} from "../components/conditions/condition.types";
import {ConditionsStore} from "./conditions/conditions.state";
import Web3 from "web3";
import {chainId, contractAddress, seriesContractAddress} from "./constants";
import {LimitOrderPredicateCallData} from "@1inch/limit-order-protocol-utils/limit-order-predicate.builder";
import {TextToAbiService} from "./text-to-abi.service";
import {TxStateStore} from "./tx/tx-state.store";


@Injectable({
  providedIn: 'root',
})
export class BuildPredicateService {
  constructor(
    private conditionsStore: ConditionsStore,
    private textToAbiService: TextToAbiService,
    private txStateStore: TxStateStore,
  ) {
    //
  }

  async generateFinalPredicate(): Promise<LimitOrderPredicateCallData> {
    const nonceRelatedPredicate = await this.generateNonceRelatedPredicate();
    const additionalPredicate = this.conditionsStore.getValue().currentPredicate;

    const providerConnector = new Web3ProviderConnector(new Web3(Web3.givenProvider));
    const limitOrderProtocolFacade = new LimitOrderProtocolFacade(
      contractAddress,
      chainId,
      providerConnector,
    );
    const limitOrderPredicateBuilder = new LimitOrderPredicateBuilder(limitOrderProtocolFacade);

    const { and } = limitOrderPredicateBuilder;

    return !!additionalPredicate
      ? and(nonceRelatedPredicate, additionalPredicate)
      : nonceRelatedPredicate;
  }

  async generateNonceRelatedPredicate(): Promise<LimitOrderPredicateCallData> {
    const providerConnector = new Web3ProviderConnector(new Web3(Web3.givenProvider));
    const limitOrderProtocolFacade = new LimitOrderProtocolFacade(
      contractAddress,
      chainId,
      providerConnector,
    );

    const limitOrderPredicateBuilder = new LimitOrderPredicateBuilder(limitOrderProtocolFacade);
    const seriesNonceManagerFacade = new SeriesNonceManagerFacade(
      seriesContractAddress,
      chainId,
      providerConnector,
    );
    const seriesNonceManagerPredicateBuilder = new SeriesNonceManagerPredicateBuilder(
      seriesNonceManagerFacade,
    );

    const expiration = this.conditionsStore.getValue().expirationMs;
    const nonce = await this.getNonce();

    const { arbitraryStaticCall } = limitOrderPredicateBuilder;
    const { timestampBelowAndNonceEquals, nonceEquals } = seriesNonceManagerPredicateBuilder;

    if (!!expiration) {
      const threshold = Math.floor((Date.now() + expiration) / 1000) as PredicateTimestamp;

      return arbitraryStaticCall(
        seriesNonceManagerFacade,
        timestampBelowAndNonceEquals(
          NonceSeriesV2.LimitOrderV3,
          threshold,
          nonce,
          this.txStateStore.getValue().walletAddress,
        ),
      );
    }

    return arbitraryStaticCall(
      seriesNonceManagerFacade,
      nonceEquals(
        NonceSeriesV2.LimitOrderV3,
        this.txStateStore.getValue().walletAddress,
        nonce,
      )
    );
  }

  async getNonce(): Promise<bigint> {
    const providerConnector = new Web3ProviderConnector(new Web3(Web3.givenProvider));
    const seriesNonceManagerFacade = new SeriesNonceManagerFacade(
      seriesContractAddress,
      chainId,
      providerConnector,
    );

    const nonceSeries = NonceSeriesV2.LimitOrderV3;
    const walletAddress = this.txStateStore.getValue().walletAddress;

    return seriesNonceManagerFacade.getNonce(nonceSeries, walletAddress);
  }

  addConditionInCurrentPredicate(condition: ConditionItem): void {
    const providerConnector = new Web3ProviderConnector(new Web3(Web3.givenProvider));
    const limitOrderProtocolFacade = new LimitOrderProtocolFacade(
      contractAddress,
      chainId,
      providerConnector,
    );
    const limitOrderPredicateBuilder = new LimitOrderPredicateBuilder(limitOrderProtocolFacade);

    const currentPredicate = this.conditionsStore.getValue().currentPredicate;
    const { and, arbitraryStaticCall } = limitOrderPredicateBuilder;

    const source = condition.contractAddress;
    const callData = this.getCallData(condition);

    const staticCallPredicate = arbitraryStaticCall(source, callData);

    const addedPredicate = condition.type === ConditionType.booleanCheck
      ? staticCallPredicate
      : this.getComparisonRelatedPredicate(condition, staticCallPredicate);

    const updatedPredicate = currentPredicate
      ? and(
        currentPredicate,
        addedPredicate
      )
      : addedPredicate;

    this.conditionsStore.update({
      currentPredicate: updatedPredicate,
    });
  }

  getCallData(condition: ConditionItem): LimitOrderPredicateCallData {
    const providerConnector = new Web3ProviderConnector(new Web3(Web3.givenProvider));

    return providerConnector.contractEncodeABI(
      this.textToAbiService.convertTextToAbi(condition.abiSource),
      condition.contractAddress,
      condition.methodName,
      condition.parameters
    );
  }

  getComparisonRelatedPredicate(condition: ConditionItem, callData: LimitOrderPredicateCallData): LimitOrderPredicateCallData {
    const providerConnector = new Web3ProviderConnector(new Web3(Web3.givenProvider));
    const limitOrderProtocolFacade = new LimitOrderProtocolFacade(
      contractAddress,
      chainId,
      providerConnector,
    );
    const limitOrderPredicateBuilder = new LimitOrderPredicateBuilder(limitOrderProtocolFacade);
    const { eq, lt, gt } = limitOrderPredicateBuilder;

    if (condition.type === ConditionType.equalityCheck) {
      return eq(
        condition.comparisonValue,
        callData,
      );
    }

    if (condition.type === ConditionType.greaterComparison) {
      return gt(
        condition.comparisonValue,
        callData,
      );
    }

    return lt(
      condition.comparisonValue,
      callData,
    );
  }
}
