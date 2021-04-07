import {
    ADDRESSES_COLLECTION_NAME, ADDRESSES_FURNITURE_COLLECTION_NAME,
    IAddressItemFlat, IFlatFurniture, IFlatFurnitureItem
} from '../addresses-api/addresses.interfaces';
import * as request from 'request';
import * as cron from 'cron';
import {
    Writable,
} from 'stream';
import * as JSONStream from 'JSONStream';
import { DbFurnitureItemsObject, DbJsonObject } from './db.types';
const url = 'http://incrm.ru/export-tred/ExportToSite.svc/ExportToTf/json';
const urlFurniture = 'http://incrm.ru/Export-TRED/ExportToSite.svc/ExportToSaleCharItems';
const CronJob = cron.CronJob;

export class DbCronUpdate {

    public counter: number;
    public decorations: [];

    constructor(public db: any) {
        this.counter = 0;
        this.start();
    }

    public start() {
        this.requestFurnitureItems();
        this.requestBase();
        // const task = new CronJob('0 8,13,19,23 * * *', () => {
        const task = new CronJob('0 * * * *', async () => {
            this.requestFurnitureItems();
            this.requestBase();
        }, false);
        task.start();
    }

    public async requestBase() {

        this.counter = 0;

        const collectionAddresses = this.db.collection(ADDRESSES_COLLECTION_NAME);

        // Create request, parse, process streams
        const requestStream = request.get({url, json: true});
        const parserStream = JSONStream.parse('*');
        const processingStream = new Writable({
            write: async (object, encoding, callback) => {
                const item = await this.transformFlatItem(object as any as DbJsonObject);
                if (item != null) {
                    await collectionAddresses.insert(item);
                }
                callback();
            },
            objectMode: true,
        });

        const errorHandler = (err, name) => {
            const errorText = `${name} error. ${(new Date())} DB UPDATE FAILED WITH ERROR: ${err};`;
            console.log(errorText, err);
        };

        requestStream
            .on('error', (err) => errorHandler(err, 'requestStream'))
            .on('response', async (res) => {
                console.log(`DB update request ${(new Date())}, response status code ${res.statusCode};`);
                if (res.statusCode === 200) {
                    await collectionAddresses.remove({});
                }
            })
            .on('end', () => console.log(`requestStream is ended ${(new Date())};`))
            .pipe(parserStream)
            .on('error', (err) => errorHandler(err, 'parserStream'))
            .pipe(processingStream)
            .on('error', (err) => errorHandler(err, 'processingStream'));

        processingStream.on('finish', async () => {
            try {
                console.log(`processingStream is finished ${(new Date())}; DB HAS BEEN UPDATED; flats count: ${this.counter}`);
            } catch (err) {
                errorHandler(err, 'test base rename');
            }
        });
    }

    public async transformFlatItem(object: DbJsonObject) {
        if (('Article' in object) && !object.Article.startsWith('НТМ')) {
            return;
        }
        const {house, section, floor, flat} = this.parseArticle(object.Article);
        const type = this.parseType(object.ArticleTypeCode, object.articleSubTypeCode);

        const itemflat: IAddressItemFlat = {
            house,
            section,
            floor,
            rooms: Number(object.Rooms),
            flat,
            type,
            isEuro: object.IsEuro,
            status: object.StatusCode,
            statusName: object.StatusCodeName,
            decoration: object.Finishing,
            decorationName: object.Decoration,
            separateentrance: (object.SeparateEntrance === '1'),
            terrasescount: (Number(object.TerrasesCount) > 0),
            roofexit: (object.RoofExit === '1'),
            twolevel: (object['2level'] === '1'),
            space: Number(object.Quantity),
            price: Number(object.Sum),
            deliveryDate: object.DeliveryPeriodDate,
            article: object.Article,
            articleId: object.ArticleID,
            floorsInSection: Number(object.planid.split('/')[0]),
            flatsInFloor: Number(object.planid.split('/')[1]),
            furniture: ('SaleChars' in object) ? await this.parseSaleChars(object.SaleChars) : null,
        };

        this.counter++;
        return itemflat;
    }

    private parseType(articleType, subArticleType) {

        subArticleType = subArticleType ? subArticleType.toString() : null;

        switch (articleType) {
            case '2':
                return 'КВ';
            case '4':
                return 'ММ';
            case '8':
                switch (subArticleType) {
                    case '2':
                        return 'АП';
                    case '4':
                        return 'КЛ';
                    case '8':
                        return 'ММ';
                    case '16':
                        return 'КН';
                }
        }
    }

    private parseArticle(article: string) {
        // НТМ-03-01-04-02-018
        const [, houseStr, sectionStr, floorStr, , flatStr] = article.split('-');
        const [house, section, floor, flat] = [houseStr, sectionStr, floorStr, flatStr].map(el => Number(el.replace(/[^0-9]/g, '')));
        return {
            house,
            section,
            floor,
            flat,
        };
    }

    private async parseSaleChars(saleChars): Promise<IFlatFurniture[]> {
        const newSaleChars: IFlatFurniture[] = [];
        // await Promise.all(saleChars.map(async el => {
        for (const el of saleChars) {
            const { items, images } = await this.getFurnitureItems(el.Id);
            const newCtrl: IFlatFurniture = {
                id: el.Id,
                saleCharName: el.SaleCharName,
                vendor: el.Vendor,
                charCost: Math.abs(el.CharCost),
                charMainImage: el.CharMainImage,
                items,
                charImages: images
            };
            newSaleChars.push(newCtrl);
        }
            // const newCtrl: IFlatFurniture = {
            //     id: el.Id,
            //     saleCharName: el.SaleCharName,
            //     vendor: el.Vendor,
            //     charCost: Math.abs(el.CharCost),
            //     charMainImage: el.CharMainImage,
            //     items,
            //     charImages: images
            // };
            // return newCtrl;
        // }));
        return newSaleChars;
    }
    private myCase(ctrl) {
        return `${ctrl[0].toLowerCase()}${ctrl.slice(1)}`;
    }
    private async getFurnitureItems(id): Promise<{items: IFlatFurnitureItem[], images: {url: string}[]}> {
        const collectionFurniture = await this.db.collection(ADDRESSES_FURNITURE_COLLECTION_NAME);
        const furniture = await collectionFurniture.findOne({id}) as IFlatFurniture;
        return { items: furniture.items, images: furniture.charImages};
    }

    public async requestFurnitureItems() {

        const collectionFurniture = this.db.collection(ADDRESSES_FURNITURE_COLLECTION_NAME);

        request.get({url: urlFurniture, json: true}, async (err, res, body) => {
            if (err) {
                errorHandler(err, 'requestStream');
            }
            this.counter = body.saleCharItems.length;
            for (const item of body.saleCharItems) {
                await collectionFurniture.insertOne(item);
            }
            console.log(`furniture processingStream is finished ${(new Date())}; DB HAS BEEN UPDATED; furniture count: ${this.counter}`);
        });

        const errorHandler = (err, name) => {
            const errorText = `${name} error. ${(new Date())} DB UPDATE FAILED WITH ERROR: ${err};`;
            console.log(errorText, err);
        };
    }
}
