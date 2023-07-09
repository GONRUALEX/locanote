import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotasPage } from './notas.page';

import { NotasPageRoutingModule } from './notas-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NotasPageRoutingModule,
    SharedModule,
    TranslateModule.forChild()  ],
  declarations: [NotasPage]
})
export class NotasPageModule {}
