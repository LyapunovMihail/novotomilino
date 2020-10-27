import {
    ADDRESSES_COLLECTION_NAME,
    IAddressItemFlat,
} from '../addresses-api/addresses.config';
import * as request from 'request';
import * as cron from 'cron';
import {
    Writable,
} from 'stream';
import * as JSONStream from 'JSONStream';
import { DbJsonObject } from './db.types';
const url = 'http://incrm.ru/export-tred/ExportToSite.svc/ExportToTf/json';
const CronJob = cron.CronJob;

export class DbCronUpdate {

    public counter: number;
    public decorations: [];

    constructor(public db: any) {
        this.counter = 0;
        this.start();
    }

    public start() {
        this.requestBase();
        const task = new CronJob('0 8,13,19,23 * * *', () => {
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
                const item = this.transformFlatItem(object);
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

    public transformFlatItem(object: DbJsonObject) {
        if (('Article' in object) && !object.Article.startsWith('НТМ')) {
            return;
        }
        const {house, section, floor, flat} = this.parseArticle(object.Article);
        const type = this.parseType(object.ArticleTypeCode, object.ArticleSubTypeCode);

        const itemflat: IAddressItemFlat = {
            house,
            section,
            floor,
            rooms: object.IsEuro === '1' ? 1 : Number(object.Rooms),
            flat,
            type,
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
        };

        this.counter++;
        return itemflat;
    }

    private parseType(articleType, subArticleType) {
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
        const [house, section, floor, flat] = [houseStr, sectionStr, floorStr, flatStr].map(Number);
        return {
            house,
            section,
            floor,
            flat,
        };
    }
}
