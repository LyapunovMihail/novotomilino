import * as moment from 'moment';
import _date = moment.unitOfTime._date;

export const ADDRESSES_COLLECTION_NAME = 'addresses';
export const ADDRESSES_FURNITURE_COLLECTION_NAME = 'furniture';

/**
 * коды отделки
 * 00 << без отделки;
 * 01 << черновая;
 * 02 << ч/о без перегородок;
 * 03 << чистовая;
 * 04 << чистовая (светлая);
 * 05 << чистовая (темная);
 * 06 << ЯЛТА;
 * 07 << СОЧИ;
 * 08 << Классика;
 * 09 << Модерн;
 * 10 << Финишная отделка;
 */

/**
 *   ОБ   -   КВ   -   05  -  12  -  05  -  1010
 *   жк   тип кв/ап  секция  этаж  отделка  номер
 */

/* export interface IAddressItemFlat {
    _id?: string;
    article: string; // ОБ-КВ-05-12-05-1010
    type: string; // 'АП' - апартаменты, 'КВ' - квартира
    section: string;
    floor: number;
    flat: string;
    status: string;
    statusName: string;
    decoration: string;
    decorationName: string;
    rooms: string;
    space: number;
    price: number;
} */

export interface IAddressItemFlat {
    type?: string;
    house: number;
    section: number;
    floor: number;
    flat: number;
    status: string;
    statusName: string;
    decoration: string;
    decorationName: string;
    rooms: number;
    separateentrance: boolean;
    terrasescount: boolean;
    roofexit: boolean;
    twolevel: boolean;
    space: number;
    price: number;
    deliveryDate: string;
    article: string;
    articleId: string;
    inFavorite?: boolean;
    floorsInSection: number;
    flatsInFloor: number;
    isEuro: string;
    furniture?: any[];
    _id?: any;
}

export interface IFlatWithDiscount extends IAddressItemFlat {
    discount: number;
}
export interface IFlatFurniture {
    id: string;
    saleCharName: string;
    vendor: string;
    charCost: string;
    charMainImage: string[];
    items: IFlatFurnitureItem[];
}
/*{
    id: 'a34d17fc-e612-eb11-80fd-001dd8bb025e',
    itemId: 'Лазурит-12_01',
    itemName: '[дДС01] Диван 3-х местный механизм Книжка Дастин Twist pebble',
    itemsDefaultCount: 1,
    itemPrice: 38760.00,
    chSalesId: 'eaac5462-15f1-ea11-80fd-001dd8bb025e'
}*/
export interface IFlatFurnitureItem {
    id: string;
    itemId: string;
    itemName: string;
    itemPrice: number;
    itemsDefaultCount: number;
    chSalesId: string;
}

export interface IFlatResponse {
    count: number;
    flats: IAddressItemFlat[];
}
