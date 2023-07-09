import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Pipe({
  name: 'dateLanguages'
})
export class DateLanguagesPipe implements PipeTransform {

  constructor(private utils: UtilsService){}

  transform(value: Date, whithoutHour:boolean): string {
    if (value==null) return "";
    if (value.toString()=="") return "";
    if (whithoutHour)
      return `${this.utils.getDayNames()[(new Date(value)).getDay()]}, ${(new Date(value)).getDate()} ${this.utils.getMonthNames()[(new Date(value)).getMonth()]} ${(new Date(value)).getFullYear()}`;
   return `${this.utils.getDayNames()[(new Date(value)).getDay()]}, ${(new Date(value)).getDate()} ${this.utils.getMonthNames()[(new Date(value)).getMonth()]} ${(new Date(value)).getFullYear()} ${(new Date(value)).getHours()<10?'0':''}${(new Date(value)).getHours()}:${(new Date(value)).getMinutes()<10?'0':''}${(new Date(value)).getMinutes()}`;
  }

}
