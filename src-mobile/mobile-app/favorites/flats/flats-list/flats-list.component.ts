import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { WindowScrollLocker } from '../../../commons/window-scroll-block';
import { IFlatWithDiscount } from '../../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-flats-list',
    templateUrl: './flats-list.component.html',
    styleUrls: ['./flats-list.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})
export class FlatsListComponent implements OnInit, OnChanges {

    @Input() public flatsList: IFlatWithDiscount[] = [];
    @Input() public sortParams: any;

    public showApartmentWindow = false;
    public selectedFlatIndex: number;

    constructor(
        public windowScrollLocker: WindowScrollLocker,
        private router: Router,
    ) { }

    ngOnInit() { }

    public openApartmentModal(flat) {
        sessionStorage.setItem('ntm-prev-route', JSON.stringify({ route: this.router.url.split('?')[0] }));
        this.router.navigate([`/flats/house/${flat.house}/section/${flat.section}/floor/${flat.floor}/flat/${flat.flat}`]);
    }

    ngOnChanges(obj: SimpleChanges) {
        this.sortFlats();
    }

    public sortFlats() {
        if (!this.sortParams) { return; }
        const params = this.sortParams.split('_');

        this.flatsList.sort( (a, b) => {
            return (params[1] === '1' ? a[params[0]] - b[params[0]] : b[params[0]] - a[params[0]]);
        });
    }
}
