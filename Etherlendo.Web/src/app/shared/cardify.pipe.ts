import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardify'
})
export class CardifyPipe implements PipeTransform {

  transform(value: string): string {
    const parts = value.split('.');

    return `${parts[0]}.${parts[1]}.`;
  }

}
