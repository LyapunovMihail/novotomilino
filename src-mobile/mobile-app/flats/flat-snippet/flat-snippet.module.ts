import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FlatNumberPipe } from './bit-number.pipe';
import { FlatSnippetComponent } from './flat-snippet.component';
import { FlatSnippetBlockComponent } from './flat-snippet-block/flat-snippet-block.component';
import { FlatSnippetInlineComponent } from './flat-snippet-inline/flat-snippet-inline.component';
import { FlatFavoriteSnippetComponent } from './flat-favorite-snippet/flat-favorite-snippet.component';

const components = [
    FlatNumberPipe,
    FlatSnippetComponent,
    FlatSnippetBlockComponent,
    FlatSnippetInlineComponent,
    FlatFavoriteSnippetComponent,
];

@NgModule({
    exports: [ ...components ],
    declarations: [ ...components ],
    imports: [
        RouterModule,
        CommonModule,
    ],
    providers: [],
})
export class FlatSnippetModule { }
