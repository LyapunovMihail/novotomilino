import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoutesComponent } from './routes.component';
import { NgModule } from '@angular/core';

@NgModule({
    exports: [
        RoutesComponent
    ],
    declarations: [
        RoutesComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        RouterModule.forChild([
            { path: 'location/routes', component: RoutesComponent, pathMatch: 'full' }
        ])
    ]
})

export class RoutesModule {}
