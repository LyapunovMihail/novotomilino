import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-flat-favorite-snippet',
    templateUrl: 'flat-favorite-snippet.component.html',
    styleUrls: ['./flat-favorite-snippet.component.scss']
})

export class FlatFavoriteSnippetComponent implements OnInit {

    public favoriteNotice: boolean;
    @Input() public type: 'block-snippet' | 'output-compnt';
    @Input() public isShow: boolean;
    @Output() public close = new EventEmitter<any>();

    constructor() { }

    public get showFavoriteNotice() {
        return this.favoriteNotice && this.isShow;
    }

    ngOnInit() {
        this.favoriteNotice = sessionStorage.getItem('ntm-favorite-notice')
            ? JSON.parse(sessionStorage.getItem('ntm-favorite-notice')).show
            : true;
    }

    public closeFavoriteNotice() {
        this.favoriteNotice = false;
        // добавляем информацию о скрытии подсказки избранного
        sessionStorage.setItem('ntm-favorite-notice', JSON.stringify({ show: false }));
        this.close.emit();
    }
}
