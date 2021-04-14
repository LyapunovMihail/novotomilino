import { ADDRESSES_COLLECTION_NAME, IAddressItemFlat } from '../addresses-api/addresses.interfaces';
import {
    IDecorationFurniturePreview,
    IDecorationFurnitureSlider, IDecorationFurnitureSnippet, IDecorationFurnitureType,
    IDecorationFurnitureVendor
} from '../decoration-api/decoration.interfaces';

export class DecorationModel {

    private collectionName = ADDRESSES_COLLECTION_NAME;

    private collection: any;

    constructor( public db: any ) {
        this.collection = db.collection(this.collectionName);
    }

    public async getDecorationSliderData() {
        const flats: IAddressItemFlat[] = await this.collection.find({type: 'КВ', decoration: {$in: ['08', '09']}, furniture: {$ne: null}}).toArray(); // Классика, Модерн
        const decorationTypes: IDecorationFurnitureSlider[] = [];

        flats.forEach((item) => {

            let decorationType = decorationTypes.find((decoration) => decoration.type === item.decorationName);
            if (!decorationType) {
                decorationType = { type: item.decorationName, vendors: []};
                decorationTypes.push(decorationType);
            }

            const decorationVendors: IDecorationFurnitureVendor[] = decorationType.vendors;
            item.furniture.forEach((fur) => {
                let decorationVendor = decorationVendors.find((decoration) => decoration.vendor === fur.vendor);
                if (!decorationVendor) {
                    decorationVendor = { vendor: fur.vendor, furniture: [] };
                    decorationVendors.push(decorationVendor);
                }
                const decorationFurniture: IDecorationFurnitureSnippet[] = decorationVendor.furniture;
                let furniture = decorationFurniture.find((decoration) => decoration.rooms === item.rooms);
                if (furniture) {
                    if (!furniture.images.some((image) => image === fur.charMainImage)) {
                        furniture.images.push(fur.charMainImage);
                    }
                    if (furniture.price > fur.charCost) {
                        furniture.price = fur.charCost;
                    }
                    furniture.flats.push(item);
                } else {
                    furniture = {rooms: item.rooms, price: fur.charCost, items: fur.items, images: [], flats: []};
                    decorationFurniture.push(furniture);
                }

                decorationFurniture.sort((a, b) => a.rooms - b.rooms);
            });
        });

        return decorationTypes;
    }

    public async getDecorationPreviewData() {
        const flats: IAddressItemFlat[] = await this.collection.find({type: 'КВ', decoration: {$in: ['08', '09']}, furniture: {$ne: null}}).toArray(); // Классика, Модерн
        const decorationVendors: IDecorationFurniturePreview[] = [];

        flats.forEach((item) => {

            item.furniture.forEach((fur) => {
                let decorationVendor = decorationVendors.find((decoration) => decoration.vendor === fur.vendor);
                if (!decorationVendor) {
                    decorationVendor = { vendor: fur.vendor, types: []};
                    decorationVendors.push(decorationVendor);
                }

                const decorationTypes: IDecorationFurnitureType[] = decorationVendor.types;
                let decorationType = decorationTypes.find((decoration) => decoration.type === item.decorationName);
                if (decorationType) {
                    decorationType.type = item.decorationName;
                    if (decorationType.rooms < item.rooms) {
                        decorationType.image = fur.charMainImage;
                        decorationType.rooms = item.rooms;
                    }
                } else {
                    decorationType = { type: item.decorationName, image: fur.charMainImage, rooms: item.rooms };
                    decorationTypes.push(decorationType);
                }
            });
        });

        return decorationVendors;
    }

    public async flatWithFurniture() {
        return await this.collection.find({ type: 'КВ', saleChars: { $ne: null } }).count();
    }
}
