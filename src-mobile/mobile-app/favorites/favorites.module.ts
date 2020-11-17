import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesComponent } from './favorites.component';
import { RouterModule } from '@angular/router';
import { FlatsListModule } from './flats/flats-list/flats-list.module';
import { ModalApartamenModule } from '../flats/modal-apartament/modal-apartament.module';
import { FavoritesFlatsComponent } from './flats/favorites-flats.component';
import { FavoritesCommercialComponent } from './commercial/favorites-commercial.component';

@NgModule({
    exports: [
        FavoritesComponent,
        FavoritesFlatsComponent,
        FavoritesCommercialComponent,
    ],
    declarations: [
        FavoritesComponent,
        FavoritesFlatsComponent,
        FavoritesCommercialComponent,
    ],
    imports: [
        CommonModule,
        FlatsListModule,
        ModalApartamenModule,
        RouterModule.forChild([
            { path: 'favorites', component: FavoritesComponent,
                children: [
                    { path: '', redirectTo: 'flats', pathMatch: 'full' },
                    { path: 'flats', component: FavoritesFlatsComponent },
                    { path: 'commercial', component: FavoritesCommercialComponent }
                ]
            }
        ])
    ]
})
export class FavoritesModule {
}
