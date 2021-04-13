import { IAddressItemFlat, IFlatFurnitureItem } from '../addresses-api/addresses.interfaces';

export interface IDecorationFurnitureSlider {
    type: string;
    vendors: IDecorationFurnitureVendor[];
}

export interface IDecorationFurnitureVendor {
    vendor: string;
    furniture: IDecorationFurnitureSnippet[];
}

export interface IDecorationFurnitureSnippet {
    rooms: number;
    price: number;
    items: IFlatFurnitureItem[];
    images: string[];
    flats?: IAddressItemFlat[];
}

export interface IDecorationFurniturePreview {
    vendor: string;
    types: IDecorationFurnitureType[];
}

export interface IDecorationFurnitureType {
    type: string;
    image: string;
    rooms: number;
}
