import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-apartment-furniture-slideshow',
    templateUrl: './apartment-furniture-slideshow.component.html',
    styleUrls: ['./apartment-furniture-slideshow.component.scss']
})

export class ApartmentFurnitureSlideshowComponent {

    public slideIndex = 0;

    @Input() slides: {url: string}[] = [];
    @Input() isSlideShow = false;

    @Output() close: EventEmitter<boolean> = new EventEmitter();

    public dynamicSlider;
    public visibleSlider = false;

    prev() {
        if (this.slideIndex > 0) {
            this.slideIndex--;
        } else {
            this.slideIndex = this.slides.length - 1 ;
        }
    }

    next() {
        if (this.slideIndex < this.slides.length - 1) {
            this.slideIndex++;
        } else {
            this.slideIndex = 0 ;
        }
    }

}
