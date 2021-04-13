import { Component, OnInit } from '@angular/core';
import { IDecorationFurniturePreview } from '../../../../serv-files/serv-modules/decoration-api/decoration.interfaces';
import { FurnitureSliderService } from './furniture-slider/furniture-slider.service';

@Component({
    selector: 'app-decoration-furniture',
    templateUrl: 'decoration-furniture.component.html',
    styleUrls: ['./decoration-furniture.component.scss'],
    providers: [FurnitureSliderService]
})

export class DecorationFurnitureComponent implements OnInit {

    public furniture: IDecorationFurniturePreview[];

    constructor(
        private furnitureSliderService: FurnitureSliderService,
    ) { }

    ngOnInit() {
        this.furnitureSliderService.getDecorationFurniturePreviewData()
            .subscribe(
                (data) => {
                    this.furniture = data;
                },
                (err) => console.error(err)
            );
    }
}
