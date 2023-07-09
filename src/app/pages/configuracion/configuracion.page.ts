import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalLanguagePage } from './modal-language/modal-language.page';

@Component({
  selector: 'app-configuracion',
  templateUrl: 'configuracion.page.html',
  styleUrls: ['configuracion.page.scss']
})
export class  ConfiguracionPage {

  constructor(private modalCtrl: ModalController) {}

  async openModal(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const modal = await this.modalCtrl.create({
        component: ModalLanguagePage,
        componentProps: {
         
        }
      });
      await modal.present();
      modal.onDidDismiss(
      ).then((data: any) => {
       
      });
    });
  }
}
