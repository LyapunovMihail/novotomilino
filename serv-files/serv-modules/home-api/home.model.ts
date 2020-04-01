import { HOME_COLLECTION_NAME, IHomeDescription } from './home.interfaces';
import * as mongodb from 'mongodb';

export class HomeModel {
    
    private collectionName = HOME_COLLECTION_NAME;

    private collection: any;

    private mainObjectId = 'header';
    
    constructor ( public db: any ) {
        this.collection = db.collection(this.collectionName);
    }
    
    async getHeaderDescription() {
        let headerDescription = await this.collection.findOne({_id: this.mainObjectId});
        return (headerDescription ? headerDescription : {
            description: ''
        });
    }

    async updateHeaderDescription(description) {
        let headerDescription = await this.collection.findOne({_id: this.mainObjectId});
        let options: IHomeDescription = {
            _id: this.mainObjectId,
            description
        };
        if (headerDescription) {
            await this.collection.updateOne({_id: this.mainObjectId}, {$set: {description}});
        } else {
            await this.collection.insert(options);
        }
        return options;
    }
}