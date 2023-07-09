import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalLanguagePageRoutingModule } from './modal-language-routing.module';

import { ModalLanguagePage } from './modal-language.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalLanguagePageRoutingModule,
    TranslateModule.forChild() ,
  ],
  declarations: [ModalLanguagePage]
})
export class ModalLanguagePageModule {}
