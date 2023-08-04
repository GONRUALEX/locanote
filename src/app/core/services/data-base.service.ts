import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notes } from 'src/app/shared/models/notes';
import { Photos } from 'src/app/shared/models/photo';
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
     });
     this.storage.executeSql(`DROP TABLE photos`).then(data => {
       console.log("TABLA ELIMINADA phots")
     });*/
    let sql = 'CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT, description TEXT, place TEXT, latitude INTEGER, longitude INTEGER, datenote DATETIME)';
    this.storage.executeSql(sql, []).then(() => { console.log("Tabla notes creada!") }).catch(error => Promise.reject(error));
    sql = 'CREATE TABLE IF NOT EXISTS photos(id INTEGER PRIMARY KEY AUTOINCREMENT, filepath TEXT, idNotes INTEGER , data TEXT, FOREIGN KEY(idNotes) REFERENCES notes(id))';
    this.storage.executeSql(sql, []).then(() => { console.log("Tabla photos creada!") }).catch(error => Promise.reject(error));
    this.isDbReady.next(true);
  }

  dbState(): Observable<boolean> {
    return this.isDbReady.asObservable();
  }

  fetchNotes(): Observable<Notes[]> {
    return this.notesList.asObservable();
  }

  async getNotes() {
    const items: Notes[] = [];
    const res = await this.storage.executeSql('SELECT * FROM notes', []);

    if (res.rows.length > 0) {
      for (let inter = 0; inter < res.rows.length; inter++) {
        const photos = await this.getPhotos(res.rows.item(inter).id);

        const photosData = [];

        if (photos.rows.length > 0) {
          for (let i = 0; i < photos.rows.length; i++) {
            photosData.push({
              id: photos.rows.item(i).id,
              userPhoto: {
                filepath: photos.rows.item(i).filepath,
                idNotes: photos.rows.item(i).idNotes,
                data: photos.rows.item(i).data,
              }
            });
          }
        }

        items.push({
          id: res.rows.item(inter).id,
          title: res.rows.item(inter).title,
          description: res.rows.item(inter).description,
          latitude: res.rows.item(inter).latitude,
          longitude: res.rows.item(inter).longitude,
          place: res.rows.item(inter).place,
          dateNote: res.rows.item(inter).datenote,
          photos: photosData,
        });

      }
    }

    this.notesList.next(items);

  }

  addNotes(notes: Notes): void {
    let data = [notes.title, notes.description, notes.place, notes.latitude, notes.longitude, notes.dateNote];
    this.storage.executeSql('INSERT INTO notes (title, description, place, latitude, longitude, datenote) VALUES (?, ?, ?, ?, ?, ?)', data)
      .then(res => {
        if (notes.photos.length > 0)
        for (var i = 0; i < notes.photos.length; i++) {
          data = [notes.photos[i].userPhoto.filepath, res.insertId, [notes.photos[i].userPhoto.data]];
          this.storage.executeSql('INSERT INTO photos (filepath, idNotes, data) VALUES (?, ?, ?)', data).then((res) => {
            console.log("guardada foto");
          })
        }
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

  async getPhotos(id): Promise<any> {
    return await this.storage.executeSql('SELECT * FROM photos WHERE idNotes = ?', [id]);

  }

  updateNotes(id, notes: Notes) {
    let data = [notes.title, notes.description, notes.place, notes.latitude, notes.longitude, notes.dateNote];
    return this.storage.executeSql(`UPDATE notes SET title = ?, description = ?, place = ?, latitude = ?, longitude= ?, datenote= ? WHERE id = ${id}`, data)
      .then(data => {
        if (notes.photos.length > 0)
        for (var i = 0; i < notes.photos.length; i++) {
          data = [notes.photos[i].userPhoto.filepath, id, [notes.photos[i].userPhoto.data]];
          console.log("datos update ", data)
          this.storage.executeSql('INSERT INTO photos (filepath, idNotes, data) VALUES (?, ?, ?)', data).then((res) => {
            console.log("guardada foto");
          })
        }
        this.utils.presentToast(this.translate.instant('message.update.note'));
        this.getNotes();
      }).catch(error => Promise.reject(error));
  }

  deleteNote(id) {
    let select = id != -1 ? 'DELETE FROM notes WHERE id = ?' : 'DELETE FROM notes'
    return (id != -1 ? this.storage.executeSql(select, [id]) : this.storage.executeSql(select))
      .then(_ => {
        this.utils.presentToast(this.translate.instant('message.delete.note'));
        this.getNotes();
      }).catch(error => Promise.reject(error));
  }

  deletePhoto(id) {
    let select = 'DELETE FROM photos WHERE id = ?';
    return (this.storage.executeSql(select, [id]))
      .then(_ => {
        console.log("Delete photo id "+id)
      }).catch(error => Promise.reject(error));
  }

  async deletePhotos(id) {
    let select = 'DELETE FROM photos WHERE idNotes = ?';
    return await (this.storage.executeSql(select, [id]))
      .then(_ => {
        console.log("Deletes photos where idNotes "+id)
      }).catch(error => Promise.reject(error));
  }
}
