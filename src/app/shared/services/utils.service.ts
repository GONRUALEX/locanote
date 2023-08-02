import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { tileLayer } from 'leaflet';
import { ITilerLayerOptions } from '../models/ITilerLayerOptions';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
interface Local{
  defaultLang?:string,
  calendarLang?:string
}
@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private _locales: Local[] = [{
    defaultLang:'ge_ES',
    calendarLang:'de-DE'
  },{
    defaultLang:'uc_E',
    calendarLang:'uk-UA'
  },{
    defaultLang:'ru_E',
    calendarLang:'ru-RU'
  },{
    defaultLang:'ch_ES',
    calendarLang:'zh-CN'
  },{
    defaultLang:'ar_ES',
    calendarLang:'ar'
  },{
    defaultLang:'en_GB',
    calendarLang:'en-GB'
  },,{
    defaultLang:'es_ES',
    calendarLang:'es-ES'
  },,{
    defaultLang:'ca_ES',
    calendarLang:'ca-ES'
  }
];
  loading: any;
  alert: any;
  alertAccept: BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);
  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController, public translate: TranslateService) { 

  }

  get locales(): Local[]{
    return this._locales;
  }

  alertAcceptSubs():BehaviorSubject<boolean>{
    return this.alertAccept;
  }

  async presentLoading(message:string):Promise<any>{
    this.loading = await this.loadingCtrl.create({
      message: message,
      cssClass: 'loading-class',
      translucent: true,
      animated: true,
      mode: 'ios',

    });
    return await this.loading.present();
  }

  loadingDismiss():void{
    this.loading.dismiss();
  }

  tileLayerSelect(layer:string = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  options: ITilerLayerOptions = {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }):any{
    return tileLayer(layer, options);
  }

  async presentAlert(title:string, body: string){
    this.alert = await this.alertCtrl.create({
      header:title,
      message: body,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert',
          handler: () => {
            this.alertAccept.next(false);
          },
        },
        {
          text: 'Ok',
          cssClass: 'alert',
          role: 'confirm',
          handler: () => {
            this.alertAccept.next(true);
          },
        }
      ]
    }) 

    await this.alert.present();
  }

  async presentToast(message: string){
    const toast = await this.toastCtrl.create({
      message,
      duration:2000,
      cssClass: 'toast',
      icon: 'globe',
    });
    toast.present();
  }

  
  getDayShortNames(): Array<string> {
	  return [
	          this.translate.instant('date.day.1.sort'),
	          this.translate.instant('date.day.2.sort'),
	          this.translate.instant('date.day.3.sort'),
	          this.translate.instant('date.day.4.sort'),
	          this.translate.instant('date.day.5.sort'),
	          this.translate.instant('date.day.6.sort'),
	          this.translate.instant('date.day.7.sort')
	  ];
  }

  getDayNames(): Array<string> {
	  return [
	          this.translate.instant('date.day.1.long'),
	          this.translate.instant('date.day.2.long'),
	          this.translate.instant('date.day.3.long'),
	          this.translate.instant('date.day.4.long'),
	          this.translate.instant('date.day.5.long'),
	          this.translate.instant('date.day.6.long'),
	          this.translate.instant('date.day.7.long')
	  ];
  }

  getMonthShortNames(): Array<string> {
	  return [
	          this.translate.instant('date.month.1.sort'),
	          this.translate.instant('date.month.2.sort'),
	          this.translate.instant('date.month.3.sort'),
	          this.translate.instant('date.month.4.sort'),
	          this.translate.instant('date.month.5.sort'),
	          this.translate.instant('date.month.6.sort'),
	          this.translate.instant('date.month.7.sort'),
            this.translate.instant('date.month.8.sort'),
            this.translate.instant('date.month.9.sort'),
            this.translate.instant('date.month.10.sort'),
            this.translate.instant('date.month.11.sort'),
            this.translate.instant('date.month.12.sort'),
	  ];
  }

  getMonthNames(): Array<string> {
	  return [
	          this.translate.instant('date.month.1.long'),
	          this.translate.instant('date.month.2.long'),
	          this.translate.instant('date.month.3.long'),
	          this.translate.instant('date.month.4.long'),
	          this.translate.instant('date.month.5.long'),
	          this.translate.instant('date.month.6.long'),
	          this.translate.instant('date.month.7.long'),
            this.translate.instant('date.month.8.long'),
            this.translate.instant('date.month.9.long'),
            this.translate.instant('date.month.10.long'),
            this.translate.instant('date.month.11.long'),
            this.translate.instant('date.month.12.long'),
	  ];
  }

  convertStringToBlob(blobString: string, type: string): Blob {
    const binary = atob(blobString.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: type });
  }

  urlImg(data:Blob): string{
    return URL.createObjectURL(data as Blob);
  }

}
