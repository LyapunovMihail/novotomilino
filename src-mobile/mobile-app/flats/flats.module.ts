import { SearchFormPipe } from './search-form/search-form.pipe';
import { CheckboxListComponent } from './search-form/checkbox-list/checkbox-list.component';
import { SectionsSelectComponent } from './search-form/sections-select/sections-select.component';
import { GHMRangeNumberModule } from './search-form/ghm-range-number/ghm-range-number.module';
import { SearchFormComponent } from './search-form/search-form.component';
import { FlatsComponent } from './flats.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SearchOutputModule } from './search-output/search-output.module';
import { CommercialComponents } from './commercial/commercial';
import { CommercialComponent } from './commercial/commercial.component';
import { CommercialListComponent } from './commercial/commercial-list/commercial-list.component';
import { CommercialSectionComponent } from './commercial/commercial-section/commercial-section.component';
import { CommercialSearchComponent } from './commercial/commercial-search/commercial-search.component';
import { ModalApartamentComponent } from './modal-apartament/modal-apartament.component';
import { FormsRequestModule } from '../forms-request/forms-request.module';
import { ApartmentFurnitureComponent } from './modal-apartament/apartment-furniture/apartment-furniture.component';
import { ApartamentBitNumberPipe } from './modal-apartament/apartament-bit-number.pipe';
import { FlatSnippetModule } from './flat-snippet/flat-snippet.module';
import { SearchSortingModule } from './search-sorting/search-sorting.module';

const FlatsComponents = [
    FlatsComponent,
    SearchFormComponent,
    SectionsSelectComponent,
    CheckboxListComponent,
    SearchFormPipe,
    ModalApartamentComponent,
    ApartmentFurnitureComponent,
    ApartamentBitNumberPipe,
];

@NgModule({
    exports: [
        ...FlatsComponents,
        ...CommercialComponents,
    ],
    declarations: [
        ...FlatsComponents,
        ...CommercialComponents,
    ],
    imports: [
        FormsModule,
        CommonModule,
        RouterModule,
        FlatSnippetModule,
        FormsRequestModule,
        SearchOutputModule,
        ReactiveFormsModule,
        SearchSortingModule,
        GHMRangeNumberModule,
        RouterModule.forChild([
            // { path: 'flats/search', component: FlatsComponent, pathMatch: 'full' },
            // { path: 'flats/_search', component: FlatsComponent, children: [{path: '**', component: FlatsComponent}]},
            { path: 'flats', component: FlatsComponent,
                children: [
                    { path: '', redirectTo: 'search', pathMatch: 'full' },
                    { path: 'search', component: FlatsComponent, pathMatch: 'full' },
                    { path: '_search', component: FlatsComponent, children: [{path: '**', component: FlatsComponent}]},
                ]},
            { path: 'flats/commercial', component: CommercialComponent,
                children: [
                    { path: '', redirectTo: 'list', pathMatch: 'full' },
                    { path: 'list', component: CommercialListComponent },
                    { path: 'section', component: CommercialSectionComponent },
                    { path: 'section/search', component: CommercialSearchComponent },
                ]
            },
            { path: 'flats/house/:house/section/:section/floor/:floor/:type/:apartment', component: ModalApartamentComponent }
        ])
    ]
})

export class FlatsModule {}
