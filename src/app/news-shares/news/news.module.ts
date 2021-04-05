import { NewsSharesComponentModule } from '../news-shares-component.module';
import { NewsMainComponent } from './news-preview/news-main/news-main.component';
import { LineBreakPipe } from './line-break.pipe';
import { NewsService } from './news.service';
import { NewsPreviewComponent } from './news-preview/news-preview.component';
import { NewsListComponent } from './news-preview/news-list/news-list.component';
import { CreateRedactFormsModule } from './create-redact-forms/create-redact-forms.module';
import { NewsViewComponent } from './news-view/news-view.component';
import { NewsComponent } from './news.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoaderModule } from '../../UI/loader/loader.module';
import { InfoBlockModule } from '../../UI/info-block/info-block.module';

const NewsComponents = [
    NewsComponent,
    LineBreakPipe,
    NewsMainComponent,
    NewsViewComponent,
    NewsListComponent,
    NewsPreviewComponent
];

@NgModule({
    exports: [
        ...NewsComponents
    ],
    declarations: [
        ...NewsComponents
    ],
    providers: [
        NewsService
    ],
    imports: [
        CommonModule,
        LoaderModule,
        InfoBlockModule,
        CreateRedactFormsModule,
        NewsSharesComponentModule,
        RouterModule.forChild([
            { path: 'list', component: NewsPreviewComponent },
            { path: 'list/:id', component: NewsViewComponent }
        ])
    ]
})

export class NewsModule { }
