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
        private activatedRouter: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() { }

    public setFavorite(flat): void {
        flat.inFavorite = !flat.inFavorite;
        this.favoritesService.setFavorite(flat);
    }

    public openApartmentModal(flat) {
        sessionStorage.setItem('ntm-prev-route', JSON.stringify({ route: this.router.url.split('?')[0], params: this.activatedRouter.snapshot.queryParams }));
        this.router.navigate([`/flats/house/${flat.house}/section/${flat.section}/floor/${flat.floor}/office/${flat.flat}`]);
    }
}
