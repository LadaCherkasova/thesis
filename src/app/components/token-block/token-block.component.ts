import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { FormControl } from "@angular/forms";
import { BehaviorSubject, Subscription } from "rxjs";
import { ClipboardService } from 'ngx-clipboard';
import { TxStateStore } from "../../services/tx/tx-state.store";

@Component({
  selector: 'app-token-block',
  templateUrl: './token-block.component.html',
  styleUrls: ['./token-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenBlockComponent implements OnInit, OnDestroy {
  @Input()
  balance: string | null;

  @Input()
  symbol: string | undefined;

  @Input()
  isSource = true;

  @Output()
  addressChange = new EventEmitter<string>;

  @Output()
  amountChange = new EventEmitter<number>;

  readonly currentAddress$ = new BehaviorSubject<string>('');

  readonly tokenAddress = new FormControl<string>('');

  readonly tokenAmount = new FormControl<string>('');

  readonly subscription = new Subscription();

  constructor(private clipboardService: ClipboardService, private store: TxStateStore) {
    const addressChanges$ = this.tokenAddress.valueChanges.subscribe(
      (address) => {
        address = address?.trim().toLowerCase() as string;
        const regexp = new RegExp('0x[0-9a-fA-F]{40}$');

        if (!address.match(regexp)) {
          this.addressChange.emit('');
          this.currentAddress$.next('');
          this.tokenAddress.setValue('', { emitEvent: false });
          return;
        }

        this.addressChange.emit(address);
        this.currentAddress$.next(address);
        this.tokenAddress.setValue(this.transformAddress(address), { emitEvent: false });
      }
    );

    this.subscription.add(addressChanges$);

    const amountChanges$ = this.tokenAmount.valueChanges.subscribe(
      (value) => {
        const val = value || 0;
        this.amountChange.emit(+val);
      }
    )
  }

  ngOnInit(): void {
    const initialAddress = this.isSource
      ? this.store.getValue().sourceAddress
      : this.store.getValue().destinationAddress;

    this.tokenAddress.setValue(initialAddress);
  }

  transformAddress(address: string): string {
    return address.slice(0, 2) + '...' + address.slice(-5);
  }

  copyAddress(): void {
    this.clipboardService.copy(this.currentAddress$.value);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
