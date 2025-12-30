
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PollutionListComponent } from '../pollution-list/pollution-list.component';
import { PollutionDetailsComponent } from '../pollution-details/pollution-details.component';
import { PollutionCreateFormComponent } from '../pollution-create-form/pollution-create-form.component';
import { PollutionUpdateFormComponent } from '../pollution-update-form/pollution-update-form.component';

const routes: Routes = [
  {
    path: '',
    component: PollutionListComponent
  },
  {
    path: 'create',
    component: PollutionCreateFormComponent
  },
  {
    path: 'edit/:id',
    component: PollutionUpdateFormComponent
  },
  {
    path: 'details/:id',
    component: PollutionDetailsComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  PollutionListComponent,
  PollutionDetailsComponent,
  PollutionCreateFormComponent
  ]
})
export class PollutionsModule { }
