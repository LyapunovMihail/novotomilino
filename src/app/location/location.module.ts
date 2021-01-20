import { LocationRoutesPipe } from './location-routes/location-routes.pipe';
import { LocationInfrastructureComponent } from './location-infrastructure/location-infrastructire.component';
import { LocationRoutesComponent } from './location-routes/location-routes.component';
import { LocationComponent } from './location.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

const LocationComponents = [
    LocationComponent,
    LocationInfrastructureComponent,
    LocationRoutesComponent,
    LocationRoutesPipe
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
            { path: 'location/office', component: LocationRoutesComponent },
            { path: 'location/routes', component: LocationRoutesComponent },
            { path: 'location/infrastructure', component: LocationInfrastructureComponent }
        ])
    ]
})

export class LocationModule {}
