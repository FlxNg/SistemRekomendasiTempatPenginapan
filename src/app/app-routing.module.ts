import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SistemRekomendasiComponent } from './sistem-rekomendasi/sistem-rekomendasi.component';

const routes: Routes = [
  {
    path: '', 
    redirectTo: '', // SistemRekomendasiTempatPenginapan
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: '',
        component: SistemRekomendasiComponent,
        data: {
          title: 'Main Menu'
        }
      },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
