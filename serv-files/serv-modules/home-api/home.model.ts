import { HOME_COLLECTION_NAME, IHomeDescription, IHomePreview, IHomeVideo } from './home.interfaces';
import * as mongodb from 'mongodb';

export class HomeModel {
    
    private collectionName = HOME_COLLECTION_NAME;

    private collection: any;

    private mainObjectId = 'header';
    private homeObjectId = 'preview';
    private VideoObjectId = 'previewVideo';
    
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

    async getHomePreview() {
        let previewObj = await this.collection.findOne({_id: this.homeObjectId});
        return (previewObj ? previewObj : {
            title: '',
            description: '',
        });
    }
    async updateHomePreview(val) {
        let headerDescription = await this.collection.findOne({_id: this.homeObjectId});
        let options: IHomePreview = {
            _id: this.homeObjectId,
            title: val.title,
            description: val.description,
        };
        if (headerDescription) {
            await this.collection.updateOne({_id: this.homeObjectId}, {$set: val} );
        } else {
            await this.collection.insert(options);
        }
        return options;
    }

    async getPreviewVideo() {
        let videoObj = await this.collection.findOne({_id: this.VideoObjectId});
        return (videoObj ? videoObj : {
            name: '',
            link: '',
            show: false,
        });
    }
    async updatePreviewVideo(val) {
        let videoObj = await this.collection.findOne({_id: this.VideoObjectId});
        let options: IHomeVideo = {
            _id: this.VideoObjectId,
            name: val.name,
            link: val.link,
            show: val.show,
        };
        if (videoObj) {
            await this.collection.updateOne({_id: this.VideoObjectId}, {$set: val} );
        } else {
            await this.collection.insert(options);
        }
        return options;
    }
}