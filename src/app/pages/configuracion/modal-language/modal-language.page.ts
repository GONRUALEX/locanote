import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { translationArES } from 'src/app/shared/i18n/ar_ES';
import { translationCaEs } from 'src/app/shared/i18n/ca_ES';
import { translationChES } from 'src/app/shared/i18n/ch_ES';
import { translationEnGb } from 'src/app/shared/i18n/en_GB';
import { translationEsEs } from 'src/app/shared/i18n/es_ES';
import { translationgeES } from 'src/app/shared/i18n/ge_ES';
import { translationRuES } from 'src/app/shared/i18n/ru_ES';
import { translationUcES } from 'src/app/shared/i18n/uc_ES';
type translate = {
  [key:string]:any
}

const TRANSLATIONS: translate = {
  ca_ES: translationCaEs,
  es_ES: translationEsEs,
  en_GB: translationEnGb,
  ar_ES: translationArES,
  ch_ES: translationChES,
  ru_ES: translationRuES,
  uc_ES: translationUcES,
  ge_ES: translationgeES
}
@Component({
  selector: 'app-modal-language',
  templateUrl: './modal-language.page.html',
  styleUrls: ['./modal-language.page.scss'],
})
export class ModalLanguagePage implements OnInit {
  language: string;
  languages: {'name':string, 'code':string}[] = [
    {'name':this.translate.instant('config.catalan'), 'code':'ca_ES'},
    {'name':this.translate.instant('config.english'), 'code':'en_GB'},
    {'name':this.translate.instant('config.spanish'), 'code': 'es_ES'},
    {'name':this.translate.instant('config.ruso'), 'code': 'ru_ES'},
    {'name':this.translate.instant('config.arabe'), 'code': 'ar_ES'},
    {'name':this.translate.instant('config.ucraniano'), 'code': 'uc_ES'},
    {'name':this.translate.instant('config.chino'), 'code': 'ch_ES'},
    {'name':this.translate.instant('config.german'), 'code': 'ge_ES'},
  ]
  constructor(public translate: TranslateService, public modalCtrl: ModalController) { }
  ngOnInit() {
   this.language = this.translate.getDefaultLang();
  }

  exit(status: boolean) {
    this.modalCtrl.dismiss({
      //status: status
    });
  }

  change(event){
    this.translate.use(event.detail.value).subscribe((element)=>{
    })
    this.translate.setDefaultLang(event.detail.value);
  }
}
