import { AboutDocumentationComponent } from './documentation/about-documentation.component';
import { AboutMembersComponent } from './members/about-members.component';
import { AboutBuilderComponent } from './builder/about-builder.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './about.component';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GHMTextAreaModule } from './../UI/ghm-textarea/ghm-textarea.module';

const AboutComponents = [
    AboutComponent,
    AboutBuilderComponent,
    AboutMembersComponent,
    AboutDocumentationComponent
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
        GHMTextAreaModule,
        BrowserAnimationsModule,
        RouterModule.forChild([
            { path: 'about', component: AboutComponent }
        ])
    ]
})

export class AboutModule {}
