import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';

@Component({
    selector: 'app-decoration',
    templateUrl: './decoration.component.html',
    styleUrls: ['./decoration.component.scss']
})

export class DecorationComponent implements OnInit, AfterViewInit {

    public preloader = false;
    public loadedImage = 0;

    constructor(
        public elRef: ElementRef,
    ) {}

    ngOnInit() { this.preloader = true; }

    ngAfterViewInit() {
        this.getImage();
    }

    getImage() {
        // Получаем все картинка на странице
        const images = this.elRef.nativeElement.querySelectorAll('img');

        images.forEach( (image, index) => {
            // Если картинка загружена, увеличиваем счетчик
            if (image.complete) { this.loadedImage++; }
            image.onload = () => {
                // Если индекс === кол-ву картинок - кол-во уже загруженных картинок (т.е мы на последней картинке и она загружена)
                if ((index + 1) >= (images.length - this.loadedImage)) {
                    // Выключаем прелоадер
                    this.preloader = false;
                }
            };
        });
    }
}
