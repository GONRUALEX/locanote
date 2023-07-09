import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotasPage } from './notas.page';

const routes: Routes = [
  {
    path: '',
    component: NotasPage,
  },
  {
    path: 'notas-info',
    loadChildren: () => import('./notas-info/notas-info.module').then( m => m.NotasInfoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotasPageRoutingModule {}
