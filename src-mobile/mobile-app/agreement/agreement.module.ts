import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgreementComponent } from './agreement.component';

const AgreementComponents = [ AgreementComponent ];

@NgModule({
    exports: [
        ...AgreementComponents
    ],
    declarations: [
        ...AgreementComponents
    ],
    imports: [
        RouterModule,
        CommonModule,
        BrowserAnimationsModule,
        RouterModule.forChild([
            { path: 'agreement', component: AgreementComponent }
        ])
    ]
})

export class AgreementModule {}
