import * as tslib_1 from "tslib";
import { NestFactory } from '@nestjs/core';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { AppModule } from './app.module';
import { MongoConnectionService } from './mongo-connection.service';
import * as express from 'express';
import { ExpressAppService } from './express-app.service';
import { SERVER_CONFIGURATIONS } from './configuration';
import { join } from 'path';
import * as bodyParser from 'body-parser';
import { DbCronUpdate } from './utilits/db-cron-update.utils';
import * as session from 'express-session';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { ServerAppModuleNgFactory, LAZY_MODULE_MAP } from '../../dist/desktop/server/main';
function bootstrap() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var appExpress, db, app;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    appExpress = express();
                    appExpress.use(bodyParser.json());
                    ExpressAppService.app = appExpress;
                    return [4 /*yield*/, MongoConnectionService.connect()];
                case 1:
                    db = _a.sent();
                    return [4 /*yield*/, NestFactory.create(AppModule, appExpress)];
                case 2:
                    app = _a.sent();
                    app.use(session({
                        secret: 'novotomilino',
                        resave: false,
                        saveUninitialized: true
                    }));
                    // const { ServerAppModuleNgFactory, LAZY_MODULE_MAP } = require('../../dist/desktop/server/main');
                    app.engine('html', ngExpressEngine({
                        bootstrap: ServerAppModuleNgFactory,
                        providers: [
                            provideModuleMap(LAZY_MODULE_MAP)
                        ]
                    }));
                    app.set('view engine', 'html');
                    app.set('views', join(SERVER_CONFIGURATIONS.DIST_FOLDER, '../', 'dist', 'desktop', 'browser'));
                    app.useStaticAssets(join(SERVER_CONFIGURATIONS.DIST_FOLDER, '../', 'dist', 'mobile'), { index: false });
                    app.useStaticAssets(join(SERVER_CONFIGURATIONS.DIST_FOLDER, '../', 'dist', 'desktop', 'browser'), { index: false });
                    setTimeout(function () {
                        new DbCronUpdate(db.connection);
                    });
                    return [4 /*yield*/, app.listen(SERVER_CONFIGURATIONS.PORT)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap();
//# sourceMappingURL=main.js.map