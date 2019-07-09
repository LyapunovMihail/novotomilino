import { LocationRoutesComponent } from './location-routes/location-routes.component';
import { LocationComponent } from './location.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

const LocationComponents = [
    LocationComponent,
    LocationRoutesComponent
];

@NgModule ({
    exports: [
        ...LocationComponents
    ],
    declarations: [
        ...LocationComponents
    ],
    imports: [
        CommonModule,
        RouterModule,
        RouterModule.forChild([
            { path: 'location', component: LocationComponent,
                children: [
                    { path: '', redirectTo: 'routes', pathMatch: 'full' },
                    { path: 'routes', component: LocationRoutesComponent }
                ]}
        ])
    ]
})

export class LocationModule {}
