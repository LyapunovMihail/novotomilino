import { DecorationFurnitureComponent } from './decoration-furniture/decoration-furniture.component';
import { BitNumberPipe } from './decoration-furniture/furniture-slider/bit-number.pipe';
import { FurnitureSliderComponent } from './decoration-furniture/furniture-slider/furniture-slider.component';
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
import { LoaderModule } from '../UI/loader/loader.module';

const DecorationComponents = [
    DecorationComponent,
    DecorationVariationComponent,
    DecorationVariationItemComponent,
    DecorationPlacementComponent,
    DecorationSliderComponent,
    DecorationSliderListComponent,
    DecorationSliderListItemComponent,
    DecorationSliderBtnsComponent,
    DecorationFurnitureComponent,
    FurnitureSliderComponent,
    BitNumberPipe
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
        LoaderModule,
        RouterModule.forChild([
            { path: 'decoration/furniture', component: DecorationFurnitureComponent },
            { path: 'decoration/furniture/type/:type/vendor/:vendor/room/:room', component: FurnitureSliderComponent },
            { path: 'decoration', component: DecorationVariationComponent },
            { path: 'decoration/:type', component: DecorationSliderComponent },
        ])
    ]
})

export class DecorationModule {}
