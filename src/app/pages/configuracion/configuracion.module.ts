import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfiguracionPage } from './configuracion.page';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ConfiguracionPageRoutingModule } from './configuracion-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalLanguagePageModule } from './modal-language/modal-language.module';
import { translationCaEs } from 'src/app/shared/i18n/ca_ES';
import { translationEsEs } from 'src/app/shared/i18n/es_ES';
import { translationEnGb } from 'src/app/shared/i18n/en_GB';
import { translationArES } from 'src/app/shared/i18n/ar_ES';
import { translationChES } from 'src/app/shared/i18n/ch_ES';
import { translationRuES } from 'src/app/shared/i18n/ru_ES';
import { translationUcES } from 'src/app/shared/i18n/uc_ES';
import { Observable, of } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config.service';
import { HttpClient } from '@angular/common/http';
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
}

export class createTranslateLoader implements TranslateLoader{
  public getTranslation(lang:string):Observable<any>{
    return of(TRANSLATIONS[lang])
  }
}

export function translateFactory(){
  return  new createTranslateLoader();
}

export function loadConfiguration(configService: ConfigService){
  return ()=>{configService.loadConfig()}
}

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ConfiguracionPageRoutingModule,
    TranslateModule.forChild({ 
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,  
        deps: [HttpClient]
      } 
    }),
    SharedModule,
    ModalLanguagePageModule
  ],
  declarations: [ ConfiguracionPage]
})
export class ConfiguracionPageModule {}
