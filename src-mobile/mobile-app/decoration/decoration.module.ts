import { SearchOutputModule } from '../flats/search-output/search-output.module';
import { FurnitureSliderComponent } from './decoration-furniture/furniture-slider.component';
import { SearchBitNumberPipe } from './decoration-furniture/search-bit-number.pipe';
import { DecorationPlacementComponent } from './decoration-placement/decoration-placement.component';
import { DecorationComponent } from './decoration.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DecorationVariationComponent } from './decoration-variation/decoration-variation.component';
import { DecorationVariationItemComponent } from './decoration-variation/decoration-variation-item/decoration-variation-item.component';
import { DecorationSliderComponent } from './decoration-placement/decoration-slider/decoration-slider.component';
import { DecorationSliderListComponent } from './decoration-placement/decoration-slider/decoration-slider-list/decoration-slider-list.component';
import { DecorationSliderListItemComponent } from './decoration-placement/decoration-slider/decoration-slider-list/decoration-slider-list-item/decoration-slider-list-item.component';
import { DecorationSliderBtnsComponent } from './decoration-placement/decoration-slider/decoration-slider-btns/decoration-slider-btns.component';
import { InfoBlockModule } from '../UI/info-block/info-block.module';

const DecorationComponents = [
    DecorationComponent,
    DecorationVariationComponent,
    DecorationVariationItemComponent,
    DecorationPlacementComponent,
    DecorationSliderComponent,
    DecorationSliderListComponent,
    DecorationSliderListItemComponent,
    DecorationSliderBtnsComponent,
    FurnitureSliderComponent,
    SearchBitNumberPipe
];

@NgModule({
    exports: [
        ...DecorationComponents
    ],
    declarations: [
        ...DecorationComponents
    ],
    imports: [
        CommonModule,
        RouterModule,
        InfoBlockModule,
        SearchOutputModule,
        RouterModule.forChild([
            { path: 'decoration/furniture/type/:type/vendor/:vendor/room/:room', component: FurnitureSliderComponent },
            { path: 'decoration', component: DecorationVariationComponent },
            { path: 'decoration/:type', component: DecorationVariationComponent }
        ])
    ]
})

export class DecorationModule {}
