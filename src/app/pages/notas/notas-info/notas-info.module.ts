import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotasInfoPageRoutingModule } from './notas-info-routing.module';

import { NotasInfoPage } from './notas-info.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotasInfoPageRoutingModule,
    TranslateModule.forChild() ,
    SharedModule
  ],
  declarations: [NotasInfoPage]
})
export class NotasInfoPageModule {}
