import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core'
import { DataBaseService } from 'src/app/core/services/data-base.service';
import { Notes } from 'src/app/shared/models/notes';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Photos } from 'src/app/shared/models/photo';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  locale: string;
  submitted: boolean = false;
  @Input('url') url;
  @Input('valuesForm') valuesForm: Notes;
  @Input('edit') edit: boolean;
  mainForm: FormGroup;
  date: Date;
  photos: Photos[] = [];
  imageShow:string;
  showImg:boolean= false;
  deletePhoto: Photos;
  deletePhotos: Photos[];
  constructor(private modalCtrl: ModalController,
    private db: DataBaseService,
    public formBuilder: FormBuilder,
    private router: Router,
    public utils: UtilsService,
    public translate: TranslateService) { }


  ngOnInit() {
    this.locale = (this.utils.locales.filter(element => {
      return element.defaultLang == this.translate.getDefaultLang() ? element : "";
    }))[0].calendarLang;
    this.mainForm = this.formBuilder.group({
      id: new FormControl(this.valuesForm.id),
      title: new FormControl(this.valuesForm.title, [Validators.required]),
      description: new FormControl(this.valuesForm.description, [Validators.required]),
      place: new FormControl(this.valuesForm.place ? this.valuesForm.place : '', []),
      dateNote: new FormControl(this.valuesForm.dateNote, []),
      
    })
    if (this.valuesForm.photos.length!=0){
      console.log(this.valuesForm.photos, "photso")
      this.photos=this.valuesForm.photos;
      this.deletePhotos = this.valuesForm.photos;
    }     
  }

  async storeData() {
    console.log(this.photos, "phohosohshsosh")
    if (this.edit && this.deletePhotos.filter((element)=>{return element.id!=-1? element:""}).length!=0){
      console.log("entra")
      await this.db.deletePhotos(this.deletePhotos[0].userPhoto.idNotes);
      console.log("sale", this.photos)
    }
    console.log("sighiente")
    this.submitted = true;
    if (this.mainForm.valid) {
      let notes: Notes = {
        id: this.valuesForm.id ? this.valuesForm.id : this.mainForm.value.id,
        title: this.mainForm.value.title,
        description: this.mainForm.value.description,
        place: this.mainForm.value.place,
        latitude: this.valuesForm.latitude,
        longitude: this.valuesForm.longitude,
        dateNote: this.mainForm.value.dateNote,
        photos: this.photos
      };
      if (!this.edit) {
        this.db.addNotes(notes);

      } else {
        this.db.updateNotes(this.mainForm.value.id, notes)
      }
      this.exit(true);
    }
  }

  get mainFormControl() {
    return this.mainForm.controls;
  }

  exit(status: boolean) {
    this.modalCtrl.dismiss({
      status: status
    });
  }

  imageData: string = '';
  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });
    if (image) {
      this.imageData = image.base64String;
      this.insertImagePathIntoDatabase();
    }
  }
 
  insertImagePathIntoDatabase() {
    this.photos.push({
      id: -1,
      userPhoto: {
        filepath: Date.now() + '.jpeg',
        webviewPath: '',
        data: this.imageData,
      }
    })
  }

  base64toBlob(base64Data: string) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' });
  }

  showImage(photo: Photos){
    this.showImg= true;
    this.imageShow = photo.userPhoto.data;
    this.deletePhoto = photo;

  }

  hideImg(){
    this.showImg = false;
    this.deletePhoto = null;
  }

  deleteImg(){
    this.photos = this.photos.filter((element)=>{
     return  element!=this.deletePhoto ? element:"";
    })
    this.hideImg();
    this.deletePhoto = null;
  }
}




