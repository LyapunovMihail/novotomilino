import { responseHandler } from './../utilits/response-handler.utilits';
import { Express } from 'express-serve-static-core';
import * as express from 'express';
import { Controller } from '@nestjs/common';
import { MongoConnectionService } from '../mongo-connection.service';
import { ExpressAppService } from '../express-app.service';
import { ProjectsModel } from './projects-api.model';

@Controller('/api')
export class ProjectsController extends ProjectsModel {

    public router = express.Router();

    constructor(
      private mongoConnectionService: MongoConnectionService,
      private expressAppService: ExpressAppService
    ) {
        super(mongoConnectionService.getDb().connection.db);
        this.routing();
    }

    routing() {
        this.router.get('/about-projects/:mode', responseHandler(async(req) => {
            return await this.get3redObjects(req.params.mode);
        }));

        const app: Express = this.expressAppService.getApp();
        app.use('/api', this.router);
    }
}