import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoBlockModule } from '../UI/info-block/info-block.module';
import { NewsSharesComponent } from './news-shares.component';

@NgModule({
    exports: [NewsSharesComponent],
    declarations: [NewsSharesComponent],
    imports: [
        CommonModule,
        InfoBlockModule,
    ]
})
export class NewsSharesComponentModule {
}
