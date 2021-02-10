import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRedactFormsModule } from './news/create-redact-forms/create-redact-forms.module';
import { RouterModule } from '@angular/router';
import { NewsSharesComponent } from './news-shares.component';
import { NewsSharesAllComponent } from './all/news-shares-all.component';
import { NewsModule } from './news/news.module';
import { SharesModule } from './shares/shares.module';
import { LoaderModule } from '../UI/loader/loader.module';
import { MetaRenderAdminService } from './render-meta-admin.service';
import { InfoBlockModule } from '../UI/info-block/info-block.module';

@NgModule({
    exports: [
        NewsSharesComponent,
        NewsSharesAllComponent
    ],
    declarations: [
        NewsSharesComponent,
        NewsSharesAllComponent
    ],
    providers: [
        MetaRenderAdminService
    ],
    imports: [
        NewsModule,
        SharesModule,
        CommonModule,
        LoaderModule,
        InfoBlockModule,
        CreateRedactFormsModule,
        RouterModule.forChild([
            { path: 'news-shares', component: NewsSharesComponent
                , children : [
                    { path: '', redirectTo: 'all', pathMatch: 'full'},
                    { path: 'all', component: NewsSharesAllComponent},
                    { path: 'news', loadChildren: './news/news.module#NewsModule'},
                    { path: 'shares', loadChildren: './shares/shares.module#SharesModule'},
                ]
            }
        ])
    ]
})

export class NewsSharesModule {
}
