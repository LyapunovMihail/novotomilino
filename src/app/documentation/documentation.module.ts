import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GHMTextAreaModule } from './../UI/ghm-textarea/ghm-textarea.module';

import { DocumentationComponent } from './documentation.component';

@NgModule({
    exports: [],
    declarations: [ DocumentationComponent ],
    providers: [],
    imports: [
        CommonModule,
        RouterModule,
        GHMTextAreaModule,
        RouterModule.forChild([
            { path: 'documentation', component: DocumentationComponent }
        ])
    ],
})
export class DocumentationModule { }
