import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { HomePreviewComponent } from './preview/home-preview.component';
import { HomeDescriptionComponent } from './description/home-description.component';
import { HomePlacesComponent } from './places/home-places.component';
import { HomeNewsComponent } from './news/home-news.component';
import { HomeService } from './home.service';
import { SharesDayPipe } from './preview/shares-day.pipe';
import { LineBreakPipe } from './line-break.pipe';
import { ScrollUpComponent } from './scroll-up/scroll-up.component';
import { HomeTriggerComponent } from './trigger/home-trigger.component';
import { VideoComponent } from './video/video.component';
import { HomeIlikeComponent } from './ilike/home-ilike.component';

@NgModule({
    exports : [
        HomeComponent
    ],
    declarations : [
        HomeComponent,
        HomePreviewComponent,
        HomeTriggerComponent,
        HomeDescriptionComponent,
        HomePlacesComponent,
        HomeNewsComponent,
        SharesDayPipe,
        LineBreakPipe,
        ScrollUpComponent,
        VideoComponent,
        HomeIlikeComponent,
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
