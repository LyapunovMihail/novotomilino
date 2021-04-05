import { PurchaseInstallmentService } from './purchase-installment/purchase-installment.service';
import { PurchaseInstallmentNumberPipe } from './purchase-installment/purchase-installment.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GHMRangetNumberModule } from './purchase-installment/ghm-range-number/ghm-range-number.module';
import { PurchaseCreditComponent } from './purchase-credit/purchase-credit.component';
import { PurchaseInstallmentComponent } from './purchase-installment/purchase-installment.component';
import { PurchaseComponent } from './purchase.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InstallmentTypesComponent } from './purchase-installment/installment-types/installment-types.component';
import { InstallmentResultComponent } from './purchase-installment/installment-result/installment-result.component';
import { InfoBlockModule } from '../UI/info-block/info-block.module';

const PurchaseComponents = [
    PurchaseComponent,
    PurchaseCreditComponent,
    PurchaseInstallmentComponent,
    PurchaseInstallmentNumberPipe,
    InstallmentTypesComponent,
    InstallmentResultComponent
];

@NgModule({
    exports: [
        ...PurchaseComponents
    ],
    declarations: [
        ...PurchaseComponents
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        GHMRangetNumberModule,
        CommonModule,
        RouterModule,
        InfoBlockModule,
        RouterModule.forChild([
            { path: 'purchase/credit', component: PurchaseCreditComponent },
            { path: 'purchase/installment', component: PurchaseInstallmentComponent }
        ])
    ],
    providers: [
        PurchaseInstallmentService,
        PurchaseInstallmentNumberPipe
    ]
})

export class PurchaseModule { }
