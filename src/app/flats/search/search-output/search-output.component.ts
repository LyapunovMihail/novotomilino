import { IFlatWithDiscount } from '../../../../../serv-files/serv-modules/addresses-api/addresses.config';
import { Component, Input, OnInit } from '@angular/core';
import { FlatsDiscountService } from '../../../commons/flats-discount.service';
import { WindowScrollLocker } from '../../../commons/window-scroll-block';
import { SearchService } from '../search.service';

@Component({
    selector: 'app-search-output',
    templateUrl: './search-output.component.html',
    styleUrls: ['./search-output.component.scss'],
    providers: [
        WindowScrollLocker
    ]
})

export class SearchOutputComponent implements OnInit {

    public showApartmentWindow = false;
    public selectedFlatIndex: number;
    @Input() public parentPlan: boolean;
    @Input() public flatsList: IFlatWithDiscount[] = [];
    @Input() public count: number;

    public activeSort: string;
    public sortList: any = [
        {
            name: 'price',
            text: 'По цене',
            value: false
        },
        {
            name: 'space',
            text: 'По площади',
            value: false
        },
        {
            name: 'floor',
            text: 'По этажу',
            value: false
        },
        // {
        //     name: 'delivery',
        //     text: 'По сроку сдачи',
        //     value: false
        // }
    ];

    constructor(
        public windowScrollLocker: WindowScrollLocker,
        private flatsDiscountService: FlatsDiscountService,
        private searchService: SearchService
    ) {}

    public ngOnInit() {
        this.searchService.getOutputFlatsChanged()
            .subscribe((flats: IFlatWithDiscount[]) => {
                this.flatsList = flats;
                this.flatsList.map((flat) => {
                    flat.discount = this.getDiscount(flat);
                    return flat;
                });
            });
    }

    public flatsCount() {
        return this.count;
    }

    public getDiscount(flat): number {
        return this.flatsDiscountService.getDiscount(flat);
    }

    public openApartmentModal(index) {
        this.selectedFlatIndex = index;
        this.windowScrollLocker.block();
        this.showApartmentWindow = true;
    }

    public changeFilter(item, i) {
        this.sortList[i].value = this.activeSort === item.name ? !item.value : true;
        this.sortList.push({ activeIndex: i });
        this.activeSort = item.name;

        this.searchService.setFilterValue(item);
    }
}
