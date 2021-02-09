import { FormsRequestModule } from '../../forms-request/forms-request.module';
import { NewsSharesComponentModule } from '../news-shares-component.module';
import { SharesEditFlatsComponent } from './shares-edit/shares-edit-controls/shares-edit-flats/shares-edit-flats.component';
import { SharesDayPipe } from './shares-day.pipe';
import { DatePickerModule } from './shares-edit/date-picker/date-picker.module';
import { SharesService } from './shares.service';
import { GHMTextAreaModule } from '../../UI/ghm-textarea/ghm-textarea.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharesEditComponent } from './shares-edit/shares-edit.component';
import { SharesItemComponent } from './shares-list/shares-item/shares-item.component';
import { SharesListComponent } from './shares-list/shares-list.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharesComponent } from './shares.component';
import { NgModule } from '@angular/core';
import { SharesObserverService } from './shares-observer.service';
import { AuthorizationGuard } from '../../authorization/authorization-guard.service';
import { Uploader } from 'angular2-http-file-upload';
import { BitNumberPipe } from './bit-number.pipe';
import { SharesDeleteComponent } from './shares-delete/shares-delete.component';
import { SharesItemsComponent } from './shares-list/shares-items/shares-items.component';
import { LoaderModule } from '../../UI/loader/loader.module';
import { FlatSnippetModule } from '../../flats/flat-snippet/flat-snippet.module';

const SHARES_COMPONENTS = [
    SharesComponent,
    SharesListComponent,
    SharesItemsComponent,
    SharesItemComponent,
    SharesDeleteComponent,
    SharesEditComponent,
    SharesEditFlatsComponent,
    SharesDayPipe,
    BitNumberPipe
];

@NgModule({
    declarations: [...SHARES_COMPONENTS],
    exports: [...SHARES_COMPONENTS],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        GHMTextAreaModule,
        DatePickerModule,
        FormsModule,
        LoaderModule,
        FlatSnippetModule,
        NewsSharesComponentModule,
        RouterModule.forChild([
            { path: 'list/:index', component: SharesListComponent, pathMatch: 'full' },
            { path: 'list/:index/:id', component: SharesItemComponent, pathMatch: 'full' }
        ])
    ],
    providers: [
        SharesService,
        SharesObserverService,
        Uploader,
        AuthorizationGuard]
})
export class SharesModule {}
