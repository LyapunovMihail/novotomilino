import { SearchOutputPipe } from './search-output/search-output.pipe';
import { CheckboxListComponent } from './search-form/checkbox-list/checkbox-list.component';
import { SectionsSelectComponent } from './search-form/sections-select/sections-select.component';
import { GHMRangeNumberModule } from './search-form/ghm-range-number/ghm-range-number.module';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchOutputComponent } from './search-output/search-output.component';
import { FlatsComponent } from './flats.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SearchBitNumberPipe } from './search-output/search-bit-number.pipe';
import { FormsRequestModule } from '../forms-request/forms-request.module';

const FlatsComponents = [
    FlatsComponent,
    SearchFormComponent,
    SearchOutputComponent,
    SectionsSelectComponent,
    CheckboxListComponent,
    SearchBitNumberPipe,
    SearchOutputPipe
];

@NgModule({
    exports: [
        ...FlatsComponents
    ],
    declarations: [
        ...FlatsComponents
    ],
    imports: [
        FormsRequestModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        GHMRangeNumberModule,
        RouterModule.forChild([
            { path: 'flats', redirectTo: '/flats/search', pathMatch: 'full' },
            { path: 'flats/search', component: FlatsComponent, pathMatch: 'full' }
        ])
    ]
})

export class FlatsModule {}
