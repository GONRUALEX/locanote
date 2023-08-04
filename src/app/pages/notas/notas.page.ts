import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonList, ModalController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core'
import { DataBaseService } from 'src/app/core/services/data-base.service';
import { Notes } from 'src/app/shared/models/notes';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ModalPage } from '../mapa/modal/modal.page';
import { BackgroundTaskService } from 'src/app/core/services/background-task.service';
import { NotasInfoPage } from './notas-info/notas-info.page';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Photos } from 'src/app/shared/models/photo';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-notas',
  templateUrl: 'notas.page.html',
  styleUrls: ['notas.page.scss'],
  animations: [
    // KeyFrames
    trigger("activeTrigger", [
      // Estado inactivo
      state(
        "active",
        style({
          opacity: 1,
          transform: "scale(1)"
        })
      ),
      // Estado activo
      state(
        "inactive",
        style({
          opacity: 0,
          transform: "scale(0.5)"
        })
      ),
      // Transiciones
      transition("inactive => active", [
        animate(
          "0.5s",
        )
      ]), // ms, scale
      transition(
        "active => inactive",
        animate(
          "0.5s"
        )
      )
    ]),]
})
export class NotasPage implements OnInit {
  public photos: Photos[] = [];
  private PHOTO_STORAGE: string = 'photos';
  @ViewChild('list') list: IonList;
  @ViewChild('popover') popover;
  findButton:boolean = false;
  dateForm: FormGroup;
          keyFrameState: string = "inactive";
  findTitle: string = '';
  findDate: Date;
  dataInitial: Notes[] = [];
  data: Notes[] = []
  locale: string;
  photoss:any[]=[];
  constructor(
    private db: DataBaseService,
    public formBuilder: FormBuilder,
    private router: Router,
    private utils: UtilsService,
    public translate: TranslateService,
    private modalCtrl: ModalController,
    private backgroundTaskService: BackgroundTaskService,
    public platform: Platform,
    private sanitizer: DomSanitizer) { }

  async ngOnInit() {

    this.utils.presentLoading(this.translate.instant('notas.loading'));
    this.locale = (this.utils.locales.filter(element => {
      return element.defaultLang == this.translate.getDefaultLang() ? element : "";
    }))[0].calendarLang;

    this.dateForm = this.formBuilder.group({
      dateNote: new FormControl('', [])
    })
    this.utils.alertAcceptSubs().subscribe((value) => {
      if (value) {
        this.deleteNote(-1);
      }
    })
    this.db.dbState().subscribe((res) => {
      if (res) {
        this.db.fetchNotes().subscribe(item => {
          this.dataInitial = item;
          this.find();
          this.utils.loadingDismiss();
        })
      }
    });
    setTimeout(()=>{this.db.getNotes()},2000);
  }

  ionViewWillEnter(){
    console.log("ionviewvillenter")
    //this.db.getNotes();
  }

  clearAll() {
    this.utils.presentAlert(this.translate.instant('alert.title.delete.all'), this.translate.instant('alert.body.delete.all'))
  }

  deleteNote(id) {
    this.db.deleteNote(id).then(async (res) => {
      //delete
    })
    this.db.deletePhotos(id).then(async (res) => {
      //delete
    })
    this.db.getNotes();
    this.list.closeSlidingItems();
  }

  editNote(notes: Notes) {
    this.openModal(notes, true);
    this.list.closeSlidingItems();
  }


  doRefresh(event: any): void {
    this.utils.presentLoading(this.translate.instant('notas.loading'));
      this.db.getNotes();
      event.target.complete();
  }

  async openModal(notes: Notes = {
    "id": 0,
    "title": '',
    "description": '',
    "place": '',
    "longitude": '',
    "latitude": '',
    "dateNote": null,
  }, edit = false) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: {
        edit: edit,
        url: '/tabs/notas',
        valuesForm: notes
      }
    });
    await modal.present();
  }

  async notificacion() {
    this.backgroundTaskService.notification(undefined, "Notificación desde fuera", "empezamos");
  }

  async openModalInfo(notes: Notes) {
    const modal = await this.modalCtrl.create({
      component: NotasInfoPage,
      componentProps: {
        valuesForm: notes,
        url: '/tabs/notas',
      }
    });
    await modal.present();
  }

  byTitle() {
    if (this.findTitle != '') {
      this.data = this.findTitle != '' ? this.dataInitial.filter((element) => {
        return element.title.toLowerCase().includes(this.findTitle) ? element : "";
      }) as Notes[] : this.dataInitial as Notes[];
    } else {
      this.data = this.dataInitial;
    }
  }

  byDate() {
    let dateNote = new Date(this.findDate);
    this.findDate != null ? this.data = this.data.filter((element) => {
      return element.dateNote != null && new Date(element.dateNote).getDate() == dateNote.getDate() && new Date(element.dateNote).getFullYear() == dateNote.getFullYear() && new Date(element.dateNote).getMonth() == dateNote.getMonth() ? element : "";
    }) as Notes[] : "";

  }

  find() {
          this.keyFrameState = 'inactive';

    this.byTitle();
    this.byDate();
           setTimeout(() => { this.keyFrameState = 'active'; }, 500);

  }

  findByTitle(event) {
    this.findTitle = event.detail.value.toLowerCase();
    this.find();
  }

  findByDate(event) {
    this.findDate = event.detail.value;
    this.find();
  }

  clearDate() {
    this.dateForm.get('dateNote').reset();
    this.findDate = null;
    this.find();
  }

 
}
