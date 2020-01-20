import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DocumentationComponent } from './documentation.component';

@NgModule({
    exports: [],
    declarations: [DocumentationComponent],
    providers: [],
    imports: [
        CommonModule,
        RouterModule,
        RouterModule.forChild([
            { path: 'documentation', component: DocumentationComponent }
        ])
    ],
})
export class DocumentationModule { }
