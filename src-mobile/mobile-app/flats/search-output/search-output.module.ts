import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchOutputComponent } from './search-output.component';
import { SearchOutputPipe } from './search-output.pipe';
import { SearchBitNumberPipe } from './search-bit-number.pipe';
import { FlatSnippetModule } from '../flat-snippet/flat-snippet.module';

@NgModule({
    exports: [
        SearchBitNumberPipe,
        SearchOutputPipe,
        SearchOutputComponent
    ],
    declarations: [
        SearchOutputComponent,
        SearchBitNumberPipe,
        SearchOutputPipe
    ],
    providers: [],
    imports: [
        CommonModule,
        FlatSnippetModule,
    ],
})
export class SearchOutputModule { }
