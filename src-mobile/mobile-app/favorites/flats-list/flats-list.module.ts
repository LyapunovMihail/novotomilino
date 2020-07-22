import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalApartamenModule } from '../../flats/modal-apartament/modal-apartament.module';
import { FlatsListComponent } from './flats-list.component';
import { BitNumberPipe } from './bit-number.pipe';

@NgModule({
    exports: [
        FlatsListComponent,
        BitNumberPipe
    ],
    declarations: [
        FlatsListComponent,
        BitNumberPipe
    ],
    imports: [
        CommonModule,
        ModalApartamenModule
    ]
})
export class FlatsListModule {
}
