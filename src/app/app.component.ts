import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
//translate
import { TranslateService } from '@ngx-translate/core';
//geolocation
import { GeolocationService } from './shared/services/geolocation.service';
//permission
//import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor( private translate: TranslateService, private platform: Platform, public geolocationService: GeolocationService) {
    this.initializeApp();
    this.platform.ready().then(async ()=>{
    });
  }

  initializeApp() {
    this.translate.addLangs(['en_GB', 'ar_ES', 'ca_ES', 'ch_ES', 'es_ES', 'ru_ES', 'uc_ES']);
    this.translate.setDefaultLang('es_ES')
    this.translate.use('es_ES');
    console.log(this.translate) 
   // translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
    //this.translate.use(this.translate.getBrowserLang() || 'es_ES');
  }

  //con esta variable sabremos cuando tenemos la geolocalización del usuario
  get isUserReady(){
    console.log(this.geolocationService.useLocation)
    return this.geolocationService.isUserLocationReady;
  }

  

}
