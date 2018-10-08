import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardify'
})
export class CardifyPipe implements PipeTransform {

  transform(value: string, length: number = 120): string {   
    
    return `${value.substring(0, length)}...`;
  }

}
