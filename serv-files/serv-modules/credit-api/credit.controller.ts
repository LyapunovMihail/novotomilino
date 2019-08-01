import { IFileRequest } from './../utilits/image-saver.utilits';
import { responseHandler } from './../utilits/response-handler.utilits';
import { CreditModel } from './credit.model';
import * as express from 'express';
import * as multipart from 'connect-multiparty';
import { MongoConnectionService } from '../mongo-connection.service';
import { ExpressAppService } from '../express-app.service';
import { Controller } from '@nestjs/common';
import { Express } from 'express';

@Controller('/api')
export class CreditController extends CreditModel {

    public router = express.Router();

    constructor(
        private mongoConnectionService: MongoConnectionService,
        private expressAppService: ExpressAppService
    ) {
        super(mongoConnectionService.getDb().connection.db);
        this.routing();
    }

    routing() {
        this.router.get('/credit', responseHandler(async(req) => {
            return await this.getSnippet();
        }));

        this.router.post('/admin/credit/create', responseHandler(async(req) => {
            return await this.setSnippet(req.body);
        }));

        this.router.post('/admin/credit/delete', responseHandler(async(req) => {
            return await this.deleteSnippet(req.body.id);
        }));

        this.router.post('/admin/credit/update', responseHandler(async(req) => {
            return await this.updateSnippet(req.body.id, req.body.key, req.body.value);
        }));

        const multipartMiddleware = multipart();
        this.router.post('/admin/credit/image', multipartMiddleware, responseHandler(async(req: IFileRequest) => {
            return await this.uploadSnippetImage(req);
        }));

        const app: Express = this.expressAppService.getApp();
        app.use('/api', this.router);
    }
}
