import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapaPage } from './mapa.page';
import { TranslateModule } from '@ngx-translate/core';
import { MapaPageRoutingModule } from './mapa-routing.module';
import { ModalPageModule } from './modal/modal.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MapaPageRoutingModule,
    ModalPageModule,
    ReactiveFormsModule,
    TranslateModule.forChild() ,
    SharedModule
  ],
  declarations: [MapaPage]
})
export class MapaPageModule {}
