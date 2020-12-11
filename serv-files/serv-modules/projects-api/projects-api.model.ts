const dataBase = require('mongodb');
const mongoose = require('mongoose').connection;

export class ProjectsModel {

    private collection: any;
    private collectionName = 'object';

    constructor( public db: any ) { }

    public async get3redObjects(mode) {
        this.collection = await mongoose.useDb( (mode === 'dev' ? '3red' : '3-red_dev') ).collection(this.collectionName);
        return await this.collection.find({ publish: true }).toArray();
    }
}
