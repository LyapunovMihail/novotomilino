import { Component, OnInit } from '@angular/core';
import { IDecorationPreviewVendor } from '../../../../serv-files/serv-modules/decoration-api/decoration.interfaces';
import { furnitureConf } from './config';
import { FurnitureSliderService } from './furniture-slider/furniture-slider.service';

@Component({
    selector: 'app-decoration-furniture',
    templateUrl: 'decoration-furniture.component.html',
    styleUrls: ['./decoration-furniture.component.scss'],
    providers: [FurnitureSliderService]
})

export class DecorationFurnitureComponent implements OnInit {

    public furniture: IDecorationPreviewVendor[];
    constructor(
        private furnitureSliderService: FurnitureSliderService,
    ) { }

    ngOnInit() {
        this.furnitureSliderService.getDecorationFurniturePreview()
            .subscribe(
                (data) => {
                    this.furniture = data;
                },
                (err) => console.error(err)
            );
    }
}
