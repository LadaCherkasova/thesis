import { ChangeDetectionStrategy, Component } from "@angular/core";
import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskInpageProvider } from "@metamask/providers";
import { TxStateStore } from "../../services/tx/tx-state.store";
import { MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject } from "rxjs";
import { TxStateQuery } from "../../services/tx/tx-state.query";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}

const METAMASK_ETHEREUM_CHAIN_ID = '0x1';

@Component({
  selector: 'wallet-connection',
  templateUrl: './wallet-connection.component.html',
  styleUrls: ['./wallet-connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletConnectionComponent {
  readonly walletAddress$ = this.txStateQuery.walletAddress$;

  readonly currentStep$ = new BehaviorSubject<number>(0);

  readonly currentErrorText$ = new BehaviorSubject<string>('');

  showCloseButton = false;

  constructor(
    private txStateStore: TxStateStore,
    private dialogRef: MatDialogRef<WalletConnectionComponent>,
    private txStateQuery: TxStateQuery,
  ) {
    //
  }

  async connectMetamask() {
    this.currentErrorText$.next('');
    this.currentStep$.next(1);

    const provider = await detectEthereumProvider();
    if (!provider) {
      this.currentErrorText$.next('Please install MetaMask');
      this.currentStep$.next(0);
      return;
    }

    this.currentStep$.next(2);
    const chainId = await window.ethereum?.request({ method: 'eth_chainId' });

    if (chainId !== METAMASK_ETHEREUM_CHAIN_ID) {
      this.currentErrorText$.next('Please choose Ethereum Mainnet in your MetaMask wallet');
      this.currentStep$.next(0);
      return;
    }

    this.currentStep$.next(3);
    const accounts = await window.ethereum?.request({ method: 'eth_requestAccounts' });

    this.txStateStore.update({
      walletAddress: accounts?.[0],
    });
    this.showCloseButton = true;
  }

  close() {
    this.dialogRef.close();
    (document.getElementsByClassName('cdk-overlay-container')[0] as HTMLElement).style.display = 'none';
  }
}
