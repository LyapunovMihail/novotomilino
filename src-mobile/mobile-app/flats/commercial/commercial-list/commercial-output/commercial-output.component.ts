import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WindowScrollLocker } from '../../../../commons/window-scroll-block';
import { FavoritesService } from '../../../../favorites/favorites.service';

@Component({
    selector: 'app-commercial-output',
    templateUrl: 'commercial-output.component.html',
    styleUrls: ['./commercial-output.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})

export class CommercialOutputComponent implements OnInit {

    @Input() public flatsList = [];
    public showApartmentWindow = false;
    public selectedFlatIndex: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        public favoritesService: FavoritesService,
        public windowScrollLocker: WindowScrollLocker,
        private router: Router
    ) { }
    ngOnInit() { }

    public goToFlat(flat) {
        sessionStorage.setItem('vb2_prevRouter_in_flat_page', JSON.stringify({url: this.router.url.split('?')[0], queryParams: this.activatedRoute.snapshot.queryParams}));
        this.router.navigate([`/flats/house/${flat.house}/section/${flat.section}/floor/${flat.floor}/office/${flat.flat}`]);
    }

    public setFavorite(flat): void {
        flat.inFavorite = !flat.inFavorite;
        this.favoritesService.setFavorite(flat);
    }

    public openApartmentModal(index) {
        this.selectedFlatIndex = index;
        this.windowScrollLocker.block();
        this.showApartmentWindow = true;
    }
}
