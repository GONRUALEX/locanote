import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataBaseService } from './services/data-base.service';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers:[ SQLite,
    { 
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    },
    DataBaseService
  ]
})
export class CoreModule { }
