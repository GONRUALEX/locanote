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
  }

  storeData() {
    this.submitted = true;
    console.log("storedata", this.photos)
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
      console.log(notes, "eestas son las notas")
      if (!this.edit) {
        console.log("añadida nota")
        this.db.addNotes(notes);

      } else {
        console.log("editada nota")
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
    //this.photos.unshift(savedImageFile);
  }
 
  insertImagePathIntoDatabase() {
    console.log("datos de la imagen", this.imageData)
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

}




