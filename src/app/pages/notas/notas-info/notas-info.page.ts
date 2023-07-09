import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Notes } from 'src/app/shared/models/notes';

@Component({
  selector: 'app-notas-info',
  templateUrl: './notas-info.page.html',
  styleUrls: ['./notas-info.page.scss'],
})
export class NotasInfoPage implements OnInit {
  @Input('valuesForm') valuesForm: Notes;
  @Input('url') url;
  constructor(public translate: TranslateService, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  exit(status: boolean) {
    this.modalCtrl.dismiss({
      status: status
    });
  }
}
