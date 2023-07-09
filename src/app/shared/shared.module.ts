import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { NumberLettersPipe } from './pipes/number-letters.pipe';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { DateLanguagesPipe } from './pipes/date-languages.pipe';


@NgModule({
  declarations: [
    NumberLettersPipe,
    DateLanguagesPipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DateLanguagesPipe,
    MatIconModule,
    NumberLettersPipe,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ]
})
export class SharedModule { }
