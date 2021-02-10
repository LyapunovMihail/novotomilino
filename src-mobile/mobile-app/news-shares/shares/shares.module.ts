import { BitNumberPipe } from './bit-number.pipe';
import { SharesService } from './shares.service';
import { SharesDayPipe } from './shares-day.pipe';
import { SharesItemComponent } from './shares-list/shares-item/shares-item.component';
import { SharesListComponent } from './shares-list/shares-list.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharesComponent } from './shares.component';
import { NgModule } from '@angular/core';
import { FlatSnippetModule } from '../../flats/flat-snippet/flat-snippet.module';
import { InfoBlockModule } from '../../UI/info-block/info-block.module';

const SHARES_COMPONENTS = [
    SharesComponent,
    SharesListComponent,
    SharesItemComponent,
    SharesDayPipe,
    BitNumberPipe
];

@NgModule({
    declarations: [...SHARES_COMPONENTS],
    exports: [...SHARES_COMPONENTS],
    imports: [
        CommonModule,
        InfoBlockModule,
        FlatSnippetModule,
        RouterModule.forChild([
            // {
            //     path: '', component: SharesComponent,
            //     children: [
            //         { path: '', redirectTo: 'list/1', pathMatch: 'full' },
            //         { path: 'list/:index', component: SharesListComponent, pathMatch: 'full' },
            //         { path: 'list/:index/:id', component: SharesItemComponent, pathMatch: 'full' }
            //     ]
            // }
          {
            path: 'list/:index', component: SharesListComponent,
            // children: [
            //     { path: '', redirectTo: 'list/1', pathMatch: 'full' },
            //     { path: 'list/:index', component: SharesListComponent, pathMatch: 'full' },
            //     { path: 'list/:index/:id', component: SharesItemComponent, pathMatch: 'full' }
            // ]
          },
          { path: 'list/:index/:id', component: SharesItemComponent }
        ])
    ],
    providers: [SharesService]
})
export class SharesModule {}
