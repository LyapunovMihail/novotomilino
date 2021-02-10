// import { ApartmentModule } from './apartment/apartment.module';
import { HouseComponent } from './house/house.component';
import { FloorComponent } from './floor/floor.component';
import { ApartmentComponent } from './apartment/apartment.component';
import { GHMRangeNumberModule } from './search/search-form/ghm-range-number/ghm-range-number.module';
import { FlatsComponent } from './flats.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HouseComponents } from './house/house';
import { FloorComponents } from './floor/floor';
import { SearchComponents } from './search/search';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PlanComponent } from './plan/plan.component';
import { PlanComponents } from './plan/plan';
import { PopularComponent } from './popular/popular.component';
import { LoaderModule } from '../UI/loader/loader.module';
import { CommercialComponents } from './commercial/commercial';
import { CommercialComponent } from './commercial/commercial.component';
import { CommercialListComponent } from './commercial/list/commercial-list.component';
import { CommercialPlanComponent } from './commercial/plan/commercial-plan.component';
import { CommercialFloorComponent } from './commercial/floor/commercial-floor.component';
import { FlatSnippetModule } from './flat-snippet/flat-snippet.module';
import { FormsRequestModule } from '../forms-request/forms-request.module';
import { ApartmentFurnitureComponent } from './apartment/apartment-furniture/apartment-furniture.component';
import { SortModule } from './search/search-sorting/sorting.module';
import { InfoBlockModule } from '../UI/info-block/info-block.module';

const FlatsComponents = [
    FlatsComponent,
    PopularComponent,
    ApartmentComponent,
    ApartmentFurnitureComponent,

    ...CommercialComponents,

    ...HouseComponents,

    ...FloorComponents,

    ...SearchComponents,

    ...PlanComponents
];

@NgModule({
    exports: [
        ...FlatsComponents
    ],
    declarations: [
        ...FlatsComponents
    ],
    imports: [
        SortModule,
        FormsModule,
        LoaderModule,
        InfoBlockModule,
        FlatSnippetModule,
        FormsRequestModule,
        ReactiveFormsModule,
        GHMRangeNumberModule,
        GHMRangeNumberModule,

        CommonModule,
        RouterModule,
        RouterModule.forChild([
            { path: 'flats/plan', component: PlanComponent },
            { path: 'flats/commercial/list', component: CommercialListComponent },
            { path: 'flats/commercial/plan', component: CommercialPlanComponent },
            { path: 'flats/commercial/house/:houses/section/:sections/floor/:floor', component: CommercialFloorComponent },

            { path: 'flats/_search', component: PlanComponent, children: [{path: '**', component: PlanComponent}]},
            { path: 'flats/house', component: HouseComponent },
            { path: 'flats/house/:house/section/:section/floor/:floor', component: FloorComponent },
            { path: 'flats/house/:house/section/:section/floor/:floor/:type/:apartment', component: ApartmentComponent }
        ])
    ]
})

export class FlatsModule {}
