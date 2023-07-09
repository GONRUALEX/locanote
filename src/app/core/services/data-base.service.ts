import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notes } from 'src/app/shared/models/notes';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {
  private storage: SQLiteObject;
  notesList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private utils: UtilsService,
    private translate: TranslateService,
  ) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'notasUbicacion.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.storage = db;
          this.createTables();

        }).catch(error => { console.log("erroer·", error); Promise.reject(error) });
    }).catch(error => { console.log("erroer·", error); Promise.reject(error) });;
  }

  createTables(): void {
   /*this.storage.executeSql(`DROP TABLE notes`).then(data => {
      console.log("TABLA ELIMINADA")
    });*/
    let sql = 'CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT, description TEXT, place TEXT, latitude INTEGER, longitude INTEGER, datenote DATETIME)';
    this.storage.executeSql(sql, []).then(() => { console.log("Tabla notes creada!") }).catch(error => Promise.reject(error));
    this.isDbReady.next(true);
  }

  dbState(): Observable<boolean> {
    return this.isDbReady.asObservable();
  }

  fetchNotes(): Observable<Notes[]> {
    return this.notesList.asObservable();
  }

  getNotes() {
    console.log("llamamda agetnotes")
    let items: Notes[] = [];
    return this.storage.executeSql('SELECT * FROM notes', []).then(res => {
      console.log("resultados", res)
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            title: res.rows.item(i).title,
            description: res.rows.item(i).description,
            latitude: res.rows.item(i).latitude,
            longitude: res.rows.item(i).longitude,
            place: res.rows.item(i).place,
            dateNote: res.rows.item(i).datenote
          });
        }
      }
      this.notesList.next(items);
    }).catch(error => {console.log("peta");Promise.reject(error)});
  }

  addNotes(notes: Notes): void {
    let data = [notes.title, notes.description, notes.place, notes.latitude, notes.longitude, notes.dateNote];
    this.storage.executeSql('INSERT INTO notes (title, description, place, latitude, longitude, datenote) VALUES (?, ?, ?, ?, ?, ?)', data)
      .then(res => {
        this.utils.presentToast(this.translate.instant('message.add.note'));
        this.getNotes();
      }).catch(error => Promise.reject(error));
  }

  getNote(id): Promise<Notes> {
    return this.storage.executeSql('SELECT * FROM notes WHERE id = ?', [id]).then(res => {
      return {
        id: res.rows.item(0).id,
        title: res.rows.item(0).title,
        description: res.rows.item(0).description,
        latitude: res.rows.item(0).latitude,
        longitude: res.rows.item(0).longitude,
        place: res.rows.item(0).place,
        dateNote: res.rows.item(0).datenote
      }
    }).catch(error => Promise.reject(error));
  }

  updateNotes(id, notes: Notes) {
    let data = [notes.title, notes.description, notes.place, notes.latitude, notes.longitude, notes.dateNote];
    return this.storage.executeSql(`UPDATE notes SET title = ?, description = ?, place = ?, latitude = ?, longitude= ?, datenote= ? WHERE id = ${id}`, data)
      .then(data => {
        this.utils.presentToast(this.translate.instant('message.update.note'));
        this.getNotes();
      }).catch(error => Promise.reject(error));
  }

  deleteNote(id) {
    let select = id!=-1?'DELETE FROM notes WHERE id = ?':'DELETE FROM notes'
    return (id!=-1?this.storage.executeSql(select, [id]):this.storage.executeSql(select))
      .then(_ => {
        this.utils.presentToast(this.translate.instant('message.delete.note'));
        this.getNotes();
      }).catch(error => Promise.reject(error));
  }
}
