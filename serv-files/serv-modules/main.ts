import { NestFactory } from '@nestjs/core';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { AppModule } from './app.module';
import { MongoConnectionService } from './mongo-connection.service';
import * as express from 'express';
import { Express } from 'express';
import { ExpressAppService } from './express-app.service';
import { SERVER_CONFIGURATIONS } from './configuration';
import { join } from 'path';
import * as bodyParser from 'body-parser';
import { ROUTES } from './rendering.routes';
import { clientRender } from './utilits/client-render';
import { DbCronUpdate } from './utilits/db-cron-update.utils';
import * as session from 'express-session';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { ServerAppModuleNgFactory, LAZY_MODULE_MAP } from '../../dist/desktop/server/main';

async function bootstrap() {
    const appExpress: Express = express();
    appExpress.use(bodyParser.json());
    appExpress.use(session({
        secret: 'novotomilino',
        resave: false,
        saveUninitialized: true
    }));
    ExpressAppService.app = appExpress;
    const db = await MongoConnectionService.connect();
    const app = await NestFactory.create(AppModule, appExpress);

    app.engine('html', ngExpressEngine({
        bootstrap: ServerAppModuleNgFactory,
        providers: [
            provideModuleMap(LAZY_MODULE_MAP)
        ]
    }));
    app.set('view engine', 'html');
    app.set('views', join(SERVER_CONFIGURATIONS.DIST_FOLDER, '../', 'dist', 'desktop', 'browser'));
    // app.set('views', join(SERVER_CONFIGURATIONS.DIST_FOLDER, '../', 'dist', 'mobile', 'browser'));

    app.useStaticAssets(join(SERVER_CONFIGURATIONS.DIST_FOLDER, '../', 'dist', 'mobile', 'browser'), { index: false });
    app.useStaticAssets(join(SERVER_CONFIGURATIONS.DIST_FOLDER, '../', 'dist', 'desktop', 'browser'), { index: false });

    ROUTES.forEach((route: any) => {
        if (route.handle) {
            appExpress.get(route.url, route.handle);
        }
        appExpress.get(route.url || route, (req: any, res) => {
            clientRender(req, res, 200, req.session);
        });
    });

    setTimeout(() => {
        new DbCronUpdate(db.connection);
    });
    await app.listen(SERVER_CONFIGURATIONS.PORT);
}
bootstrap();
