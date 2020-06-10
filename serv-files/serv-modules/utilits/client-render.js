import { join, } from 'path';
import * as mobileDetect from 'mobile-detect';
import { SERVER_CONFIGURATIONS } from '../configuration';
export function ShouldSendMobileVersion(req, session) {
    return !(session && session.onlyDesktop) && (new mobileDetect(req.headers['user-agent'])).mobile();
}
export function clientRender(req, res, status, session) {
    if (!SERVER_CONFIGURATIONS.IS_DEVELOPMENT_MODE) {
        if (ShouldSendMobileVersion(req, session)) {
            res.status(status).sendFile(join(SERVER_CONFIGURATIONS.DIST_FOLDER, '../', 'dist', 'mobile', 'index-mobile.html'));
        }
        else {
            res.render(join(SERVER_CONFIGURATIONS.DIST_FOLDER, '../', 'dist', 'desktop', 'browser', 'index.html'), {
                req: req,
                res: res,
                async: true,
                preboot: true,
                providers: [{
                        provide: 'serverUrl',
                        useValue: req.protocol + "://" + req.get('host')
                    }]
            });
        }
    }
    else {
        res.sendStatus(404);
    }
}
//# sourceMappingURL=client-render.js.map