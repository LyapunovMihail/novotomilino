import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-flat-favorite-snippet',
    templateUrl: 'flat-favorite-snippet.component.html',
    styleUrls: ['./flat-favorite-snippet.component.scss']
})

export class FlatFavoriteSnippetComponent implements OnInit {

    public favoriteNotice = true;
    @Input() public type: 'block-snippet' | 'output-compnt';
    @Input() public isShow: boolean;
    @Output() public close = new EventEmitter<any>();

    constructor() { }

    public get showFavoriteNotice() {
        return this.favoriteNotice;
    }

    ngOnInit() { }

    public closeFavoriteNotice() {
        this.favoriteNotice = false;
        this.close.emit();
    }
}
