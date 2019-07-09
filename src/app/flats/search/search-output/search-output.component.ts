import { IAddressItemFlat } from '../../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-search-output',
    templateUrl: './search-output.component.html',
    styleUrls: ['./search-output.component.scss']
})

export class SearchOutputComponent {

    @Input() public flatsList: IAddressItemFlat[] = [];

    constructor() {}

    public flatsCount() {
        return this.flatsList.length;
    }
}
