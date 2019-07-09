import { Injectable } from '@angular/core';

@Injectable()

export class DecorationService {

    public placement = {
        dawn: [
            {
                name: 'Кухня-Гостинная',
                image: '/assets/img/decoration/dawn/kitchen.jpg'
            }, {
                name: 'Жилая',
                image: '/assets/img/decoration/dawn/living-room.jpg'
            }, {
                name: 'Прихожая',
                image: '/assets/img/decoration/dawn/koridor.jpg'
            }, {
                name: 'Санузел',
                image: '/assets/img/decoration/dawn/bathroom.jpg'
            }
        ],
        sunset: [
            {
                name: 'Кухня-Гостинная',
                image: '/assets/img/decoration/sunset/kitchen.jpg'
            }, {
                name: 'Жилая',
                image: '/assets/img/decoration/sunset/living-room.jpg'
            }, {
                name: 'Прихожая',
                image: '/assets/img/decoration/sunset/hallway.jpg'
            }, {
                name: 'Санузел',
                image: '/assets/img/decoration/sunset/bathroom.jpg'
            }
        ],
        places: [
            {
                name: 'Лобби вид 1',
                image: '/assets/img/decoration/places/float_1.jpg'
            }, {
                name: 'Лобби вид 2',
                image: '/assets/img/decoration/places/float_1-2.jpg'
            }, {
                name: 'Лифтовая группа вид 1',
                image: '/assets/img/decoration/places/float_3.jpg'
            }, {
                name: 'Лифтовая группа вид 2',
                image: '/assets/img/decoration/places/float_1-3.jpg'
            }, {
                name: 'Типовой этаж вид 1',
                image: '/assets/img/decoration/places/float.jpg'
            }, {
                name: 'Типовой этаж вид 2',
                image: '/assets/img/decoration/places/float-17.jpg'
            }
        ]
    };
}
