import { FormsRequestModule } from './../forms-request/forms-request.module';
import { SharesEditFlatsComponent } from './shares-edit/shares-edit-controls/shares-edit-flats/shares-edit-flats.component';
import { SharesEditListComponent } from './shares-edit/shares-edit-controls/shares-edit-list/shares-edit-list.component';
import { SharesEditImageComponent } from './shares-edit/shares-edit-controls/shares-edit-image/shares-edit-image.component';
import { SharesEditDescriptionComponent } from './shares-edit/shares-edit-controls/shares-edit-description/shares-edit-description.component';
import { SharesDayPipe } from './shares-day.pipe';
import { DatePickerModule } from './shares-edit/date-picker/date-picker.module';
import { SharesService } from './shares.service';
import { GHMTextAreaModule } from './../UI/ghm-textarea/ghm-textarea.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharesEditComponent } from './shares-edit/shares-edit.component';
import { SharesItemComponent } from './shares-list/shares-item/shares-item.component';
import { SharesListComponent } from './shares-list/shares-list.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharesComponent } from './shares.component';
import { NgModule } from '@angular/core';
import { SharesObserverService } from './shares-observer.service';
import { AuthorizationGuard } from '../authorization/authorization-guard.service';
import { Uploader } from 'angular2-http-file-upload';
import { BitNumberPipe } from './bit-number.pipe';

const SHARES_COMPONENTS = [
    SharesComponent,
    SharesListComponent,
    SharesItemComponent,
    SharesEditComponent,
    SharesEditDescriptionComponent,
    SharesEditImageComponent,
    SharesEditListComponent,
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
        FormsRequestModule,
        RouterModule.forChild([
            { path: 'shares', component: SharesComponent,
                children: [
                    { path: '', redirectTo: 'list/1', pathMatch: 'full' },
                    { path: 'list/:index', component: SharesListComponent, pathMatch: 'full' },
                    { path: 'list/:index/:id', component: SharesItemComponent, pathMatch: 'full' },
                    { path: 'edit/:id', component: SharesEditComponent, canActivate: [AuthorizationGuard] }
                ]
            }
        ])
    ],
    providers: [
        SharesService,
        SharesObserverService,
        Uploader,
        AuthorizationGuard]
})
export class SharesModule {}
