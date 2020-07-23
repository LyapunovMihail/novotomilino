import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { WindowScrollLocker } from '../../commons/window-scroll-block';
import { IFlatWithDiscount } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';

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
        public windowScrollLocker: WindowScrollLocker
    ) {
    }

    ngOnInit() {
    }

    public openApartmentModal(index) {
        this.selectedFlatIndex = index;
        this.windowScrollLocker.block();
        this.showApartmentWindow = true;
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
