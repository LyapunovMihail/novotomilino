import { DynamicObjectVideoComponent } from './dynamic-object/dynamic-object-video/dynamic-object-video.component';
import { DynamicObjectSlideshowComponent } from './dynamic-object/dynamic-object-slideshow/dynamic-object-slideshow.component';
import { VideoSanitizerPipe } from './dynamic-object/video-sanitizer.pipe';
import { LineBreakPipe } from './dynamic-object/line-break.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicService } from './dynamic.service';
import { DynamicMonthSwitcherComponent } from './dynamic-month-switcher/dynamic-month-switcher.component';
import { DynamicObjectComponent } from './dynamic-object/dynamic-object.component';
import { DynamicDateComponent } from './dynamic-date/dynamic-date.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DynamicComponent } from './dynamic.component';
import { NgModule } from '@angular/core';
import { InfoBlockModule } from '../UI/info-block/info-block.module';

const DynamicComponents = [
    DynamicComponent,
    DynamicDateComponent,
    DynamicObjectComponent,
    DynamicMonthSwitcherComponent,
    LineBreakPipe,
    VideoSanitizerPipe,
    DynamicObjectSlideshowComponent,
    DynamicObjectVideoComponent
];

@NgModule({
    exports: [
        ...DynamicComponents
    ],
    declarations: [
        ...DynamicComponents
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        InfoBlockModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: 'dynamic/:year/:month', component: DynamicComponent, pathMatch: 'full' }
        ])
    ],
    providers: [
        DynamicService
    ]
})

export class DynamicModule {}
