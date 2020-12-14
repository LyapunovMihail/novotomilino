import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
        CommonModule
    ]
})
export class FlatsListModule {
}
