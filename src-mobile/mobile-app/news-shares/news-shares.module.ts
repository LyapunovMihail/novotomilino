import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsSharesComponent } from './news-shares.component';
import { NewsSharesAllComponent } from './all/news-shares-all.component';
import { NewsModule } from './news/news.module';
import { SharesModule } from './shares/shares.module';
import { MyPipesModule } from '../pipes/my-pipes.module';
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
    ],
    imports: [
        NewsModule,
        SharesModule,
        MyPipesModule,
        CommonModule,
        InfoBlockModule,
        RouterModule.forChild([
            { path: 'news-shares/all', component: NewsSharesAllComponent},
            { path: 'news-shares/news', loadChildren: './news/news.module#NewsModule'},
            { path: 'news-shares/shares', loadChildren: './shares/shares.module#SharesModule'},
        ])
    ]
})

export class NewsSharesModule {
}
