import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GHMTextAreaModule } from './../UI/ghm-textarea/ghm-textarea.module';
import { AboutComponent } from './about.component';
import { AboutGalleryComponent } from './gallery/about-gallery.component';
import { AboutGenplanComponent } from './genplan/about-genplan.component';
import { AboutProjectComponent } from './project/about-project.component';
import { AboutBuilderComponent } from './builder/about-builder.component';
import { AboutDocumentationComponent } from './documentation/about-documentation.component';
import { AboutMembersComponent } from './members/about-members.component';
import { BuilderListComponent } from './builder/builder-list/builder-list.component';
import { BuilderMapComponent } from './builder/builder-map/builder-map.component';
import { InfoBlockModule } from '../UI/info-block/info-block.module';

const AboutComponents = [
    AboutComponent,
    AboutGenplanComponent,
    AboutProjectComponent,
    AboutBuilderComponent,
    AboutMembersComponent,
    AboutDocumentationComponent,
    AboutGalleryComponent,
    BuilderListComponent,
    BuilderMapComponent,
];

@NgModule({
    exports: [
        ...AboutComponents
    ],
    declarations: [
        ...AboutComponents
    ],
    imports: [
        RouterModule,
        CommonModule,
        InfoBlockModule,
        GHMTextAreaModule,
        BrowserAnimationsModule,
        RouterModule.forChild([
            { path: 'about', component: AboutComponent }
        ])
    ]
})

export class AboutModule {}
