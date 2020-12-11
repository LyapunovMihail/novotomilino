import { ApartmentModule } from './apartment/apartment.module';
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

const FlatsComponents = [
    FlatsComponent,
    PopularComponent,

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
        FormsModule,
        LoaderModule,
        ApartmentModule,
        FlatSnippetModule,
        ReactiveFormsModule,
        GHMRangeNumberModule,

        CommonModule,
        RouterModule,
        RouterModule.forChild([
            { path: 'flats', component: FlatsComponent,
                children: [
                    { path: '', redirectTo: 'plan', pathMatch: 'full' },
                    { path: 'plan', component: PlanComponent },
                    { path: 'commercial', component: CommercialComponent,
                        children: [
                            { path: '', redirectTo: 'list', pathMatch: 'full' },
                            { path: 'list', component: CommercialListComponent },
                            { path: 'plan', component: CommercialPlanComponent },
                            { path: 'house/:houses/section/:sections/floor/:floor', component: CommercialFloorComponent },
                        ]
                    },
                    { path: '_search', component: PlanComponent, children: [{path: '**', component: PlanComponent}]},
                    { path: 'house', component: HouseComponent },
                    { path: 'house/:house/section/:section/floor/:floor', component: FloorComponent },
                    { path: 'house/:house/section/:section/floor/:floor/apartment/:apartment', component: ApartmentComponent }
                ]
            }
        ])
    ]
})

export class FlatsModule {}
