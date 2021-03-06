import * as express from 'express';
import { responseHandler } from './../utilits/response-handler.utilits';
import { AddressesModel } from './addresses.model';
import { Controller } from '@nestjs/common';
import { MongoConnectionService } from '../mongo-connection.service';
import { ExpressAppService } from '../express-app.service';
import { Express } from 'express';

@Controller('/api')
export class AddressesController extends AddressesModel {

    public router = express.Router();

    constructor(private expressAppService: ExpressAppService,
                private mongoConnectionService: MongoConnectionService) {
        super(MongoConnectionService.getDb().connection.db);
        this.routing();
    }

    public routing() {
        this.router.post('/search', responseHandler(async(req) => {
            return await this.getObjects(req.body.search);
        }));
        this.router.get('/search', responseHandler(async(req) => {
            return await this.getObjects(req.query);
        }));
        this.router.get('/flats/house/:house/section/:section/floor/:floor/:type/:apartment', responseHandler(async(req) => {
            return await this.getFlatByParams(req.params);
        }));
        this.router.get('/get_house_chess', responseHandler(async(req) => {
            return await this.getHouseChess();
        }));
        this.router.post('/search/with_count', responseHandler(async(req) => {
            return await this.getObjectsWithCount(req.body.search);
        }));
        this.router.post('/search/by_houses_and_numbers', responseHandler(async(req) => {
            return await this.getObjectsByHousesAndNumbers(req.body);
        }));
        this.router.get('/favorites/get', responseHandler(async(req) => {
            return await this.getFavorites(req.session);
        }));
        this.router.post('/favorites/set', responseHandler(async(req) => {
            return await this.setFavorites(req.session, req.body.flat);
        }));
        this.router.post('/favorites/refresh', responseHandler(async(req) => {
            return await this.refreshFavorites(req.session, req.body.flats);
        }));

        const app: Express = this.expressAppService.getApp();
        app.use('/api', this.router);
    }
}
