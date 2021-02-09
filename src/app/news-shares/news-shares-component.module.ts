import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsSharesComponent } from './news-shares.component';

@NgModule({
    exports: [NewsSharesComponent],
    declarations: [NewsSharesComponent],
    imports: [
        CommonModule
    ]
})
export class NewsSharesComponentModule {
}
