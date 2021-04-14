import * as express from 'express';
import { responseHandler } from './../utilits/response-handler.utilits';
import { DecorationModel } from './decoration.model';
import { Controller } from '@nestjs/common';
import { MongoConnectionService } from '../mongo-connection.service';
import { ExpressAppService } from '../express-app.service';
import { Express } from 'express';

@Controller('/api')
export class DecorationController extends DecorationModel {

    public router = express.Router();

    constructor(private expressAppService: ExpressAppService,
                private mongoConnectionService: MongoConnectionService) {
        super(MongoConnectionService.getDb().connection.db);
        this.routing();
    }

    public routing() {
        this.router.get('/decoration/slider/get', responseHandler(async(req) => {
            return await this.getDecorationSliderData();
        }));
        this.router.get('/decoration/preview/get', responseHandler(async(req) => {
            return await this.getDecorationPreviewData();
        }));
        this.router.get('/decoration/count/get', responseHandler(async(req) => {
            return await this.flatWithFurniture();
        }));

        const app: Express = this.expressAppService.getApp();
        app.use('/api', this.router);
    }
}
