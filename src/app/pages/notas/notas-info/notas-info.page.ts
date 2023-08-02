import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Notes } from 'src/app/shared/models/notes';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-notas-info',
  templateUrl: './notas-info.page.html',
  styleUrls: ['./notas-info.page.scss'],
})
export class NotasInfoPage implements OnInit {
  @Input('valuesForm') valuesForm: Notes;
  @Input('url') url;
  imageShow:string;
  showImg:boolean= false;
  constructor(public utils: UtilsService, public translate: TranslateService, private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log("valores del form", this.valuesForm)
    this.valuesForm.photos.map((value)=>{
      console.log(value.userPhoto.data)
      console.log(value.userPhoto.data)
    })
  }

  exit(status: boolean) {
    this.modalCtrl.dismiss({
      status: status
    });
  }

  showImage(imgSrc: string){
    this.showImg= true;
    this.imageShow = imgSrc;
  }

  hideImg(){
    this.showImg = false;
  }
}
