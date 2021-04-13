import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderModule } from '../../../UI/loader/loader.module';
import { FlatSnippetModule } from '../../flat-snippet/flat-snippet.module';
import { SortModule } from '../search-sorting/sorting.module';
import { SearchOutputComponent } from './search-output.component';

@NgModule({
    exports: [SearchOutputComponent],
    declarations: [SearchOutputComponent],
    imports: [
        CommonModule,
        FormsModule,
        FlatSnippetModule,
        SortModule,
        LoaderModule
    ]
})
export class SearchOutputModule { }
