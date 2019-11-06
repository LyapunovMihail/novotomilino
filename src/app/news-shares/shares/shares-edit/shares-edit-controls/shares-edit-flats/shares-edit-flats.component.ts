import { IAddressItemFlat } from '../../../../../../../serv-files/serv-modules/addresses-api/addresses.interfaces';
import { SharesService } from '../../../shares.service';
import {
    ShareFlat,
    ShareFlatRoomEnum,
    ShareFlatDecorationEnum,
    ShareFlatDiscountType,
    SHARES_UPLOADS_PATH
} from '../../../../../../../serv-files/serv-modules/shares-api/shares.interfaces';
import { Component, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-shares-edit-flats',
    templateUrl: './shares-edit-flats.component.html',
    styleUrls: [
        './shares-edit-flats.component.scss',
        './../../shares-edit.component.scss'
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SharesEditFlatsComponent),
            multi: true
        }
    ]
})
export class SharesEditFlatsComponent implements ControlValueAccessor {

    @Output() public remove: EventEmitter<any> = new EventEmitter();

    public sectionsOptions = ['1', '2', '3', '4'];

    public housesOptions = ['1', '2', '3', '9'];

    public flats = [];

    public flatsOptions = [];

    public shareFlatDiscountType = ShareFlatDiscountType;

    public shareFlat: ShareFlat;

    uploadsPath: string = `/${SHARES_UPLOADS_PATH}`;

    constructor(
        private sharesService: SharesService
    ) {}

    writeValue(value: any) {
        this.shareFlat = JSON.parse(JSON.stringify(value));
        if (this.shareFlat) {
            this.changeSectionAndHouse({section: this.shareFlat.section, house: this.shareFlat.house});
        }
    }

    propagateChange = (_: any) => {};

    registerOnChange(fn) {
      this.propagateChange = fn;
    }

    registerOnTouched() {}

    changeText() {
        this.propagateChange(this.shareFlat);
    }

    public removeItem() {
        this.remove.next();
    }

    addFlat() {
        const flat = {
            house: null,
            number: null,
            section: null,
            floor: null,
            space: null,
            room: null,
            decoration: null,
            scheme: null,
            price: null,
            discount: null,
            discountType: ShareFlatDiscountType.SUM
        };
       // this.shareFlats.push(flat);
    }

    changeSectionAndHouse(params) {
        this.sharesService.getFlatsBySectionAndHouse(params)
            .subscribe((data: IAddressItemFlat[]) => {
                this.flats = data;
                this.initFlatsOptions();
            });
    }

    changeFlat(e) {
        const flat = this.flats.find((flatItem) => flatItem.flat === Number(e));
        if (flat == null) {
            return;
        }
        this.shareFlat.house = flat.house;
        this.shareFlat.section = flat.section;
        this.shareFlat.floor = flat.floor;
        this.shareFlat.space = flat.space;
        switch (flat.rooms) {
            case 0:
                this.shareFlat.room = ShareFlatRoomEnum.STUDIO;
                break;
            case 1:
                this.shareFlat.room = ShareFlatRoomEnum.ONE_ROOM;
                break;
            case 2:
                this.shareFlat.room = ShareFlatRoomEnum.TWO_ROOM;
                break;
            case 3:
                this.shareFlat.room = ShareFlatRoomEnum.THREE_ROOM;
                break;
            default:
                this.shareFlat.room = null;
        }
        switch (flat.decoration) {
            case '00':
                this.shareFlat.decoration = ShareFlatDecorationEnum.WITHOUT;
                break;
            case '01':
                this.shareFlat.decoration = ShareFlatDecorationEnum.ROUGHING;
                break;
            case '02':
                this.shareFlat.decoration = ShareFlatDecorationEnum.WITHOUT_WITH_WALLS;
                break;
            case '03':
                this.shareFlat.decoration = ShareFlatDecorationEnum.CLEAN;
                break;
            case '04':
                this.shareFlat.decoration = ShareFlatDecorationEnum.LIGHT;
                break;
            case '05':
                this.shareFlat.decoration = ShareFlatDecorationEnum.DARK;
                break;
            default:
                this.shareFlat.decoration = null;
        }
        this.shareFlat.scheme = `/assets/floor-plans/section_${flat.section}/floor_${flat.floor}/${flat.floor}floor_${flat.flat}flat.svg`;
        this.shareFlat.price = flat.price;
    }

    initFlatsOptions() {
        console.log('flats: ', this.flats);
        if (this.flats.length === 0) {
            return;
        }

        console.log('flats: ', this.flats);
        this.flatsOptions = this.flats.map((flat) => {
            return flat.flat;
        });
    }

    getDiscount(): number {
        if (this.shareFlat.discountType === ShareFlatDiscountType.PERCENT) {
            const discount = +this.shareFlat.price * (+this.shareFlat.discount / 100);
            return +discount.toFixed(2);
        }
        return +this.shareFlat.discount;
    }
}
