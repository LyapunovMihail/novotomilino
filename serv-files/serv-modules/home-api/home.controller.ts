import { Express } from 'express-serve-static-core';
import { responseHandler } from './../utilits/response-handler.utilits';
import { HomeModel } from './home.model';
import * as express from 'express';
import { MongoConnectionService } from '../mongo-connection.service';
import { ExpressAppService } from '../express-app.service';
import { Controller } from '@nestjs/common';

@Controller('/api')
export class HomeController extends HomeModel {

    public router = express.Router();

    constructor(
        private mongoConnectionService: MongoConnectionService,
        private expressAppService: ExpressAppService
      ) {
          super(mongoConnectionService.getDb().connection.db);
          this.routing();
      }

    routing() {
        this.router.get('/home/header', responseHandler(async(req) => {
            return await this.getHeaderDescription();
        }));

        this.router.post('/admin/home/header/update', responseHandler(async(req) => {
            return await this.updateHeaderDescription(req.body.description);
        }));

        this.router.get('/home/preview', responseHandler(async(req) => {
            return await this.getHomePreview();
        }));
        this.router.post('/admin/home/preview/update', responseHandler(async(req) => {
            return await this.updateHomePreview(req.body.object);
        }));

        const app: Express = this.expressAppService.getApp();
        app.use('/api', this.router);
    }
}