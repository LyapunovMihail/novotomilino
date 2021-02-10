import {
    join,
} from 'path';
import * as mobileDetect from 'mobile-detect';
import { SERVER_CONFIGURATIONS } from '../configuration';
import {
    Request,
    Response,
} from 'express';

export function ShouldSendMobileVersion(req, session) {
    return !(session && session.onlyDesktop) && (new mobileDetect(req.headers['user-agent'])).mobile();
}

export function clientRender(req: Request, res: Response, status: number, session) {
    if (!SERVER_CONFIGURATIONS.IS_DEVELOPMENT_MODE) {
        if (ShouldSendMobileVersion(req, session)) {
            res.render(
                join(SERVER_CONFIGURATIONS.DIST_FOLDER, 'dist', 'mobile', 'index-mobile.html'),{
                    req,
                    res,
                    async: true,
                    preboot: true,
                    providers: [{
                        provide: 'serverUrl',
                        useValue: `${req.protocol}://${req.get('host')}`
                    }]
                },
            );
        } else {
            res.render(
                'index', {
                    req,
                    res,
                    async: true,
                    preboot: true,
                    providers: [{
                        provide: 'serverUrl',
                        useValue: `${req.protocol}://${req.get('host')}`
                    }]
                },
            );
        }
    } else {
        res.sendStatus(404);
    }
}
