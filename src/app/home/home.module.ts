import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { HomePreviewComponent } from './preview/home-preview.component';
import { HomeDescriptionComponent } from './description/home-description.component';
import { HomePlacesComponent } from './places/home-places.component';
import { HomeGalleryAdminComponent } from './gallery-admin/home-gallery-admin.component';
import { HomeNewsComponent } from './news/home-news.component';
import { HomeService } from './home.service';
import { SharesDayPipe } from './preview/shares-day.pipe';
import { LineBreakPipe } from './line-break.pipe';
import { HomeTriggerComponent } from './trigger/home-trigger.component';
import { GHMTextAreaModule } from '../UI/ghm-textarea/ghm-textarea.module';
import { VideoComponent } from './video/video.component';
import { VideoAdminComponent } from './video/video-admin/video-admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeIlikeComponent } from './ilike/home-ilike.component';

@NgModule({
    exports: [
        HomeComponent,
        VideoComponent,
        VideoAdminComponent
    ],
    declarations: [
        HomeComponent,
        HomePreviewComponent,
        HomeTriggerComponent,
        HomeDescriptionComponent,
        HomePlacesComponent,
        HomeGalleryAdminComponent,
        HomeNewsComponent,
        SharesDayPipe,
        LineBreakPipe,
        VideoComponent,
        VideoAdminComponent,
        HomeIlikeComponent,
    ],
    imports: [
        CommonModule,
        GHMTextAreaModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {path: '', component: HomeComponent, pathMatch: 'full'}
        ])
    ],
    providers: [
        HomeService
    ]
})

export class HomeModule {

}
