import { BitNumberPipe } from './bit-number.pipe';
import { FormsRequestService } from './forms-request.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormCreditComponent } from './form-credit/form-credit.component';
import { FormReserveComponent } from './form-reserve/form-reserve.component';
import { FormCallComponent } from './form-call/form-call.component';
import { NgModule } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';
import { FormSuccessComponent } from './form-success/form-success.component';
import { RouterModule } from '@angular/router';

let Components = [
    FormCallComponent,
    FormReserveComponent,
    FormCreditComponent,
    FormSuccessComponent,
    BitNumberPipe
];

@NgModule({
    declarations: [
        ...Components
    ],
    exports: [
        ...Components
    ],
    imports: [
        TextMaskModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule
    ],
    providers: [
        FormsRequestService
    ]
})

export class FormsRequestModule { }
