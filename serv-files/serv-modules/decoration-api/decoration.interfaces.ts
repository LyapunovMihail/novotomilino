import { IFlatFurnitureItem } from '../addresses-api/addresses.interfaces';

export interface IDecorationType {
    type: string;
    vendors: IDecorationVendor[];
}

export interface IDecorationVendor {
    vendor: string;
    furniture: IDecorationFurniture[];
}

export interface IDecorationFurniture {
    rooms: number;
    price: number;
    items: IFlatFurnitureItem[];
    images: string[];
}

export interface IDecorationPreviewVendor {
    vendor: string;
    types: IDecorationPreviewType[];
}

export interface IDecorationPreviewType {
    type: string;
    furniture: IDecorationFurniture[];
}
