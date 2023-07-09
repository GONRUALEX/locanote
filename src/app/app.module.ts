import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { translationCaEs } from './shared/i18n/ca_ES';
import { translationEnGb } from './shared/i18n/en_GB';
import { translationEsEs } from './shared/i18n/es_ES';

import { Observable, of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import  es  from '@angular/common/locales/es';
import { CoreModule } from './core/core.module';

//geolocation
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { ConfigService } from './core/services/config.service';
import { translationArES } from './shared/i18n/ar_ES';
import { translationChES } from './shared/i18n/ch_ES';
import { translationRuES } from './shared/i18n/ru_ES';
import { translationUcES } from './shared/i18n/uc_ES';
import { translationgeES } from './shared/i18n/ge_ES';

//permission

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
  ge_ES: translationgeES,
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,    HttpClientModule, CoreModule, SharedModule,
  TranslateModule.forRoot({ 
    loader: {
      provide: TranslateLoader,
      useFactory: translateFactory,  
      deps: [HttpClient]
    } 
  }),
  BrowserAnimationsModule
  ],
   
  providers: [
    ConfigService,
    {
    provide:  APP_INITIALIZER,
    useFactory: loadConfiguration,
    deps: [ ConfigService ],
    multi: true
  },{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, Geolocation],
  bootstrap: [AppComponent],
})
export class AppModule { }
