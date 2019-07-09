import { Component } from '@angular/core';

interface IVariationList {
    name: string;
    mod: string;
    url: string;
    image: string;
}

@Component({
    selector: 'decoration-variation',
    templateUrl: './decoration-variation.component.html',
    styleUrls: ['./decoration-variation.component.scss']
})

export class DecorationVariationComponent {

    public variationList: IVariationList[] = [
        {
            name: 'Отделка квартир',
            mod: 'flats',
            url: '/decoration/dawn',
            image: '/assets/img/decoration/flats.jpg'
        }, {
            name: 'Отделка общедомовых пространств',
            mod: 'places',
            url: '/decoration/places',
            image: '/assets/img/decoration/places.jpg'
        }
    ];
}
