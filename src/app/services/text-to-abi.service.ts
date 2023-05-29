import {Injectable} from "@angular/core";
import {AbiItem} from "@1inch/limit-order-protocol-utils";

@Injectable({
  providedIn: 'root',
})
export class TextToAbiService {
  convertTextToAbi(text: string): AbiItem[] {
    return JSON.parse(text) as AbiItem[];
  }
}
