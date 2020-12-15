import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SearchSortingComponent } from './sorting.component';

@NgModule({
    exports: [ SearchSortingComponent ],
    declarations: [ SearchSortingComponent ],
    imports: [
        FormsModule,
        CommonModule,
    ],
    providers: [],
})
export class SortModule { }
