import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FlatNumberPipe } from './bit-number.pipe';
import { FlatSnippetComponent } from './flat-snippet.component';
import { FlatSnippetInlineComponent } from './flat-snippet-inline/flat-snippet-inline.component';
import { FlatSnippetBlockComponent } from './flat-snippet-block/flat-snippet-block.component';
import { ApartmentModule } from '../apartment/apartment.module';

const components = [
    FlatNumberPipe,
    FlatSnippetComponent,
    FlatSnippetBlockComponent,
    FlatSnippetInlineComponent,
];

@NgModule({
    exports: [ ...components ],
    declarations: [ ...components ],
    imports: [
        RouterModule,
        CommonModule,
        ApartmentModule,
    ],
    providers: [],
})
export class FlatSnippetModule { }
