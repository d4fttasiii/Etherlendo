import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ether'
})
export class EtherPipe implements PipeTransform {

  private readonly wei: number = 1e+18;
  private readonly szabo: number = 1e+8;
  private readonly finney: number = 1e+4;

  transform(value: number, unit: string): string {
    switch (unit) {
      case 'wei':
        return `${value / this.wei} ETH`;
      case 'szabo':
        return `${value / this.szabo} ETH`;
      case 'finney':
        return `${value / this.finney} ETH`;
      default:
        throw new Error(`Unsupported unit: ${unit}. Try: wei, szabo or finney`);
    }
  }

}
