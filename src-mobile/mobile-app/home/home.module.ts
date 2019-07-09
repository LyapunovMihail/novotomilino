import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ScrollUpComponent } from './scroll-up/scroll-up.component';
import { NgModule } from '@angular/core';
import { HomeService } from './home.service';

@NgModule({
  exports : [
    HomeComponent,
    ScrollUpComponent
  ],
  declarations : [
    HomeComponent,
    ScrollUpComponent
  ],
  imports : [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent, pathMatch: 'full' }
    ])
  ],
  providers : [
      HomeService
  ]
})

export class HomeModule {

}
