import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModalController, ViewDidEnter } from '@ionic/angular';
import { ModalPage } from './modal/modal.page';
import { Notes } from 'src/app/shared/models/notes';
import * as L from "leaflet";
import { GeolocationService } from 'src/app/shared/services/geolocation.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { DataBaseService } from 'src/app/core/services/data-base.service';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-mapa',
  templateUrl: 'mapa.page.html',
  styleUrls: ['mapa.page.scss'],
  /*animations: [
    // KeyFrames
   /* trigger("activeTrigger", [
      // Estado inactivo
      state(
        "active",
        style({
          top: "60px",
          opacity: 1,
          transform: "scale(1)",
        })
      ),
      // Estado activo
      state(
        "inactive",
        style({
          transform: "scale(0)",
          top: "-40px",
        })
      ),
      // Transiciones
      transition("inactive => active", [
        animate(
          "1s",
        )
      ]), // ms, scale
      transition(
        "active => inactive",
        animate(
          "0.5s"
        )
      )
    ]),]*/
})
export class MapaPage implements OnInit, AfterViewInit, ViewDidEnter {
  locale: string;
  dateForm: FormGroup;
  lastPointLon: string;
  lastPointLat: string;
  findTitle: string = '';
  findDate: Date;
  dataInitial: Notes[] = [];
  findButton: boolean = false;
 // keyFrameState: string = "inactive";
  useLocation?: [number, number];
  url: string = "/tabs/mapa";
  notes: Notes;
  data: Notes[];
  startime: any;
  edit: boolean = false;
  constructor(public translate: TranslateService, public formBuilder: FormBuilder, private modalCtrl: ModalController, private geolocationService: GeolocationService, private utilService: UtilsService,
    private db: DataBaseService) { }
  map;
  markers: any[] = [];
  ngOnInit(): void {
    this.locale = (this.utilService.locales.filter(element => {
      return element.defaultLang == this.translate.getDefaultLang() ? element : "";
    }))[0].calendarLang;
    this.createMap();
    this.dateForm = this.formBuilder.group({
      dateNote: new FormControl('', [])
    })
    this.db.dbState().subscribe((res) => {
      if (res) {
        this.db.fetchNotes().subscribe(item => {
          console.log("datos recuperados del note", item)
          this.dataInitial = item;
          this.find();
        })
      }
    });
    setTimeout(() => {
      this.map.on("click", (e) => {
        this.notes = {
          "id": 0,
          "title": '',
          "description": '',
          "place": '',
          "longitude": e.latlng.lng.toString(),
          "latitude": e.latlng.lat.toString(),
        }
        this.edit = false;
        this.openModal(this.notes).then((statusMarker) => {

        });
      });
    }, 2000);
    setTimeout(()=>{this.refreshMap()},3000);
  }
  ionViewWillEnter(){
    console.log("ionviewvillenter")
    this.refreshMap();
  }
  ionViewDidEnter() {
    //this.showMarkers();
  }

  clearMarkers() {
    this.markers.map((marker) => { this.map.removeLayer(marker) });
    this.markers = [];
  }

  refreshMap(){
  this.clearMarkers();
  this.db.getNotes();
}
  showMarkers() {
    //this.data = [{ latitude: "41.5044991", longitude: "2.3951893", description: "Esto es la descripción del la nota que hemos dicho", title: "Titulo de la nota que hemos mencionado", place: "Y este sería le lugar" },]
    this.data.map((point: any) => {
      console.log("point ", point)
      this.markers.push(L.marker([Number(point.latitude), Number(point.longitude)], { draggable: true }).addTo(this.map).on('dblclick', (e) => {
        this.editNote(point);
      }).on('dragend', (e) => {
       //this.keyFrameState = 'inactive'
        let newPoint = point;
        console.log(e, "putnoooooooo")
        newPoint.latitude = e.target._latlng.lat;
        newPoint.longitude = e.target._latlng.lng;
        this.editNote(point).then((markersEdit: boolean) => {
          console.log(markersEdit, "markers edit ")
         this.refreshMap();
        });
      }).on('dragstart', (e) => {
       // this.keyFrameState = 'active'
      }).
        bindPopup(`
      <html>
       <head>
         <style> 
           .leaflet-popup-content-wrapper{--ion-item-background: none;   
            border: 1px solid #92032E;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(92, 1, 32, 0.8);
            margin: 5px;
            opacity:0.8;
            color:#00A1A6;
          } 
            .leaflet-popup-tip{
              background-color:#92032E;
              color:#00A1A6;
            } 
           .leaflet-container a.leaflet-popup-close-button {
            color:white;
            color:#00A1A6;
          }
         </style>
       </head>
       <body>
         <div class='item-background-color'>
          <h2>${point.title}</h2>
          <p> ${point.description} </p>
          <span> ${point.place}</p>
         </div>
       </body>
     </html>
      `))
    })
  }

  createMap(){
    setTimeout(() => {
      this.map = L.map("map").setView(this.geolocationService.useLocation, 13);
      this.utilService.tileLayerSelect().addTo(this.map);
      L.circle(this.geolocationService.useLocation, { radius: 5, color: "#92032E" }).addTo(this.map).bindPopup(`
      <html>
       <head>
         <style> 
           .leaflet-popup-content-wrapper{--ion-item-background: none;    
            border: 1px solid #92032E;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(92, 1, 32, 0.8);
            margin: 5px;
            opacity:0.8;} .leaflet-popup-tip{background-color:#92032E;
              color:#00A1A6;
            } 
           .leaflet-container a.leaflet-popup-close-button {
            color:white;
            color:#00A1A6;
          }
         </style>
       </head>
       <body>
         <div class='item-background-color'>Tú estás aquí</div>
       </body>
     </html>
      `).openPopup();
      L.circleMarker(this.geolocationService.useLocation, { radius: 10, color: "#00ace0" }).addTo(this.map);
    }, 1000)
  }

  ngAfterViewInit(): void {
   
  }

  async openModal(notes: Notes = {
    "id": 0,
    "title": '',
    "description": '',
    "place": '',
    "longitude": '',
    "latitude": '',
  }): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const modal = await this.modalCtrl.create({
        component: ModalPage,
        componentProps: {
          edit: this.edit,
          url: this.url,
          valuesForm: notes
        }
      });
      await modal.present();
      modal.onDidDismiss(
      ).then((data: any) => {
        if (data.data.status) {
          this.refreshMap();
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  editNote(notes: Notes): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.edit = true;
      this.openModal(notes).then((statusMarker) => {
        if (statusMarker) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
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
    //this.keyFrameState = 'inactive';
    this.byTitle();
    this.byDate();
    this.showMarkers();
   // setTimeout(() => { this.keyFrameState = 'active'; }, 500);

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
