import { AboutDocumentationComponent } from './documentation/about-documentation.component';
import { AboutMembersComponent } from './members/about-members.component';
import { AboutBuilderComponent } from './builder/about-builder.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './about.component';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GHMTextAreaModule } from './../UI/ghm-textarea/ghm-textarea.module';
import { AboutGenplanComponent } from './genplan/about-genplan.component';
import { AboutProjectComponent } from './project/about-project.component';
import { AboutGalleryComponent } from './gallery/about-gallery.component';
import { AboutGalleryAdminComponent } from './gallery/gallery-admin/about-gallery-admin.component';
import { LoaderModule } from '../UI/loader/loader.module';
import { AboutNavMenuComponent } from './nav-menu/nav-menu.component';
import { BuilderListComponent } from './builder/builder-list/builder-list.component';
import { BuilderMapComponent } from './builder/builder-map/builder-map.component';

const AboutComponents = [
    AboutComponent,
    AboutGenplanComponent,
    AboutProjectComponent,
    AboutGalleryComponent,
    AboutGalleryAdminComponent,
    AboutBuilderComponent,
    AboutMembersComponent,
    AboutDocumentationComponent,
    AboutNavMenuComponent,
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
        LoaderModule,
        GHMTextAreaModule,
        BrowserAnimationsModule,
        RouterModule.forChild([
            { path: 'about', component: AboutComponent }
        ])
    ]
})

export class AboutModule {}
