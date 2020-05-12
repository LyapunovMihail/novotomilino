import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ApartmentPdfComponent } from './apartment-pdf.component';

@NgModule({
    exports: [ ApartmentPdfComponent ],
    declarations: [ ApartmentPdfComponent ],
    imports: [
        RouterModule,
        RouterModule.forChild([
            { path: 'pdf', component: ApartmentPdfComponent }
        ])
    ],
})
export class ApartmentPdfModule { }
