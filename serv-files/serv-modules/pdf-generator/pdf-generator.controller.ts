import * as express from 'express';
import { Controller } from '@nestjs/common';
import { MongoConnectionService } from '../mongo-connection.service';
import { ExpressAppService } from '../express-app.service';
import { Express } from 'express';
import { PDFGeneratorModel } from './pdf-generator.model';
import { responseHandler } from '../utilits/response-handler.utilits';

@Controller('/api')
export class PDFController extends PDFGeneratorModel {

    public router = express.Router();

    constructor(
        private mongoConnectionService: MongoConnectionService,
        private expressAppService: ExpressAppService,
    ) {
        super(MongoConnectionService.getDb().connection.db);
        this.routing();
    }

    routing() {

        this.router.get('/pdf/:id/:mod', responseHandler(async (req) => {
            return await this.create(req);
        }));

        const app: Express = this.expressAppService.getApp();
        app.use('/api', this.router);
    }
}
