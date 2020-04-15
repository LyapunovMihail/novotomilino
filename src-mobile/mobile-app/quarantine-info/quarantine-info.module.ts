import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { QuarantineInfoComponent } from './quarantine-info.component';
import { QuarantineInfoPreviewComponent } from './quarantine-info-preview/quarantine-info-preview.component';
import { QuarantineInfoOnlineComponent } from './quarantine-info-online/quarantine-info-online.component';
import { QuarantineInfoCallComponent } from './quarantine-info-call/quarantine-info-call.component';

@NgModule({
    exports: [
        QuarantineInfoComponent,
        QuarantineInfoPreviewComponent,
        QuarantineInfoOnlineComponent,
        QuarantineInfoCallComponent,
    ],
    declarations: [
        QuarantineInfoComponent,
        QuarantineInfoPreviewComponent,
        QuarantineInfoOnlineComponent,
        QuarantineInfoCallComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        RouterModule.forChild([
            { path: 'quarantine', component: QuarantineInfoComponent }
        ])
    ],
    providers: [],
})
export class QuarantineInfoModule { }
