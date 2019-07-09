import { imageSaver } from './../utilits/image-saver.utilits';
import { ICreditSnippet, SnippetCategoryEnum, CREDIT_UPLOADS_PATH, CREDIT_COLLECTION_NAME } from './credit.interfaces';
import * as dateFormat from 'dateformat';
const ObjectId = require('mongodb').ObjectID;

export class CreditModel {

    collectionName = CREDIT_COLLECTION_NAME;

    collection: any;

    constructor (public db: any) {
        this.collection = db.collection(this.collectionName);
    }

    async getSnippet() {
        return await this.collection.find({}).sort({created_at: -1}).toArray();
    }

    async setSnippet() {
        let date = new Date();
        let created_at = dateFormat(date, 'yyyy-mm-ddTHH:MM:ssZ');
        let snippet: ICreditSnippet = {
            image: '',
            percent: '',
            initial: '',
            category: SnippetCategoryEnum.BASE,
            created_at
        };
        await this.collection.insertOne(snippet);
        return await this.getSnippet();
    }

    async deleteSnippet(id) {
        if ( id &&  ObjectId.isValid(id) ) {
            await this.collection.deleteOne({ _id : ObjectId(id) });
            return await this.getSnippet();
        } else {
            throw new Error('Не корректный id.');
        }
    }

    async updateSnippet(id, key, value) {
        // key может быть percent/initial/category
        switch (key) {
            case 'percent':
            case 'initial':
            case 'category':

                // если key - правильный но нет его значения, отдается ошибка
                if ( value === undefined ) { throw new Error(`Не передано значение ${key}`); }

                // если id валиден обновляем базу
                if ( ObjectId.isValid(id) ) {

                    let options = {};
                    if ( key === 'category' ) {
                        options[key] = (value === SnippetCategoryEnum.MILITARY)
                            ? SnippetCategoryEnum.MILITARY
                            : SnippetCategoryEnum.BASE;
                    } else {
                        options[key] = value;
                    }
                    await this.collection.update({ _id : ObjectId(id) }, {$set: options });
                    return await this.getSnippet();

                } else {
                // если id не валиден, отдается ошибка
                    throw new Error('Не корректный id.');
                }

            // если key не подходит не по одному из трех допустимых значений
            default:
                throw new Error('Изменяемый параметр указан не корректно, или такого параметра не может быть.');
        }
    }

    async uploadSnippetImage (req) {
        let path = CREDIT_UPLOADS_PATH;
        let image = await imageSaver(req, path, 50);
        await this.collection.update({_id: ObjectId(req.headers.id)}, {$set: { image }});
        return await this.getSnippet();
    }
}
