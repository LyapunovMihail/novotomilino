import 'zone.js/dist/zone-node';
import * as express from 'express';
import { join } from 'path';
const domino = require('domino');
const fs = require('fs');
import 'localstorage-polyfill';
import { bootstrap } from './serv-files/serv-modules/main-server';
// Faster server renders w/ Prod mode (dev mode never needed)

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist', 'desktop');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP, ngExpressEngine, provideModuleMap} = require('./dist/server/main');

const templateA = fs.readFileSync(join(DIST_FOLDER, 'index.html')).toString();
const win = domino.createWindow(templateA);
win.Object = Object;
win.Math = Math;
const glob1 = global as any;
glob1.window = win;
glob1.document = win.document;
glob1.branch = null;
glob1.object = win.object;
glob1.HTMLElement = win.HTMLElement;
glob1.navigator = win.navigator;
glob1.localStorage = localStorage;
glob1.sessionStorage = localStorage;

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP)
    ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);


bootstrap(app).then((serv) => {
    serv.listen(PORT);
});
