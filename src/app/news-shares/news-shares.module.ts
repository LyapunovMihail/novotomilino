import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsSharesComponentModule } from './news-shares-component.module';
import { CreateRedactFormsModule } from './news/create-redact-forms/create-redact-forms.module';
import { RouterModule } from '@angular/router';
import { NewsSharesAllComponent } from './all/news-shares-all.component';
import { NewsModule } from './news/news.module';
import { SharesModule } from './shares/shares.module';
import { LoaderModule } from '../UI/loader/loader.module';
import { MetaRenderAdminService } from './render-meta-admin.service';

@NgModule({
    exports: [
        NewsSharesAllComponent
    ],
    declarations: [
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
        CreateRedactFormsModule,
        NewsSharesComponentModule,
        RouterModule.forChild([
            { path: 'news-shares/all', component: NewsSharesAllComponent},
            { path: 'news-shares/news', loadChildren: './news/news.module#NewsModule'},
            { path: 'news-shares/shares', loadChildren: './shares/shares.module#SharesModule'},
        ])
    ]
})

export class NewsSharesModule {
}
