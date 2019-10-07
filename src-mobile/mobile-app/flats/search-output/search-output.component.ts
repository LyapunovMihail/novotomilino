import { FavoritesService } from '../../commons/favorites.service';
import { IAddressItemFlat } from '../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { Component, Input } from '@angular/core';
import { WindowScrollLocker } from '../../commons/window-scroll-block';

@Component({
    selector: 'app-search-output',
    templateUrl: './search-output.component.html',
    styleUrls: ['./search-output.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})

export class SearchOutputComponent {

    @Input() public flatsList: IAddressItemFlat[] = [];
    public isCallFormOpen: boolean = false;
    public isCreditFormOpen: boolean = false;
    public isReserveFormOpen: boolean = false;
    public showBtns: string;
    public flatDataForModalForm: IAddressItemFlat;
    public showApartmentWindow = false;
    public selectedFlatIndex: number;

    public selectFlat = {
        house: '0',
        number: '0',
        space: '0',
        room: '0',
        price: 0
    };

    constructor(
        public scrollLocker: WindowScrollLocker,
        private favoritesService: FavoritesService) {}

        public setFlatData(flat) {
            this.selectFlat = {
                house: flat.house,
                number: flat.number,
                space: flat.space,
                room: (flat.room === 'Студия') ? '0' : (flat.room === 'Однокомнатная') ? '1' : (flat.room === 'Двухкомнатная') ? '2' : '3',
                price: +flat.price - +flat.discount
            };
        }

    public toFavorite(flat: IAddressItemFlat): void {
        this.favoritesService.toFavorite(flat);
    }

    public inFavorite(flat: IAddressItemFlat): boolean {
        return this.favoritesService.inFavorite(flat);
    }

    public openApartmentModal(index) {
        this.selectedFlatIndex = index;
        this.scrollLocker.block();
        this.showApartmentWindow = true;
    }
}
