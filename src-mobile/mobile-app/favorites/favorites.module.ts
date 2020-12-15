import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesComponent } from './favorites.component';
import { RouterModule } from '@angular/router';
import { FavoritesFlatsComponent } from './flats/favorites-flats.component';
import { FavoritesCommercialComponent } from './commercial/favorites-commercial.component';
import { SearchSortingModule } from '../flats/search-sorting/search-sorting.module';
import { FormsModule } from '@angular/forms';
import { FlatSnippetModule } from '../flats/flat-snippet/flat-snippet.module';

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
        FormsModule,
        CommonModule,
        FlatSnippetModule,
        SearchSortingModule,
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
