import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberLetters'
})
export class NumberLettersPipe implements PipeTransform {

  transform(value: string, numLetter: number): string {
    return value.substring(0, numLetter);
  }

}
