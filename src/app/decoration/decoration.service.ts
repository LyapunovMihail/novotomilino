import { Injectable } from '@angular/core';

export interface IDecorationList {
    name: string;
    mod: string;
    url: string;
    preview: string;
    images: string[];
}

@Injectable()

export class DecorationService {

    public decorationItems: IDecorationList[] = [
        {
            name: 'Жилые комнаты',
            mod: 'living-rooms',
            url: '/decoration/living-rooms',
            preview: '/assets/img/decoration/living-room/bedroom_classic.jpg',
            images: [
                '/assets/img/decoration/living-room/bedroom_classic.jpg',
                '/assets/img/decoration/living-room/var_2_bedroom_classic.jpg',
                '/assets/img/decoration/living-room/bedroom_modern.jpg',
                '/assets/img/decoration/living-room/var_2_bedroom_modern.jpg',
            ]
        }, {
            name: 'Кухня',
            mod: 'kitchen',
            url: '/decoration/kitchen',
            preview: '/assets/img/decoration/kitchen/kitchen_classic.jpg',
            images: [
                '/assets/img/decoration/kitchen/kitchen_classic.jpg',
                '/assets/img/decoration/kitchen/var_2_kitchen_classic.jpg',
                '/assets/img/decoration/kitchen/kitchen_modern.jpg',
                '/assets/img/decoration/kitchen/var_2_kitchen_modern.jpg',
            ]
        }, {
            name: 'Санузел',
            mod: 'bathroom',
            url: '/decoration/bathroom',
            preview: '/assets/img/decoration/bathroom/san_classic_var-1.jpeg',
            images: [
                '/assets/img/decoration/bathroom/san_classic_var-1.jpeg',
                '/assets/img/decoration/bathroom/san_classic_var-2.jpeg',
                '/assets/img/decoration/bathroom/san_modern_var1.jpg',
                '/assets/img/decoration/bathroom/san_modern_var2.jpg',
            ]
        }, {
            name: 'Прихожая',
            mod: 'hallway',
            url: '/decoration/hallway',
            preview: '/assets/img/decoration/hallway/hall_modern.jpg',
            images: [
                '/assets/img/decoration/hallway/hall_modern.jpg',
                '/assets/img/decoration/hallway/hall_classic.jpg',
            ]
        }
        // {
        //     name: 'Общедомовые пространства',
        //     mod: 'places',
        //     url: '/decoration/places',
        //     preview: '/assets/img/decoration/places.jpg',
        //     images: [
        //         '/assets/img/decoration/places/float_1.jpg',
        //         '/assets/img/decoration/places/float_1-2.jpg',
        //         '/assets/img/decoration/places/float_3.jpg',
        //         '/assets/img/decoration/places/float_1-3.jpg',
        //         '/assets/img/decoration/places/float.jpg',
        //         '/assets/img/decoration/places/float-17.jpg'
        //     ]
        // }
    ];

    public getDecorationItems() {
        return this.decorationItems;
    }

}
