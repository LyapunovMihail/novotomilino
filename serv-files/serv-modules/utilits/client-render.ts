import {
    join,
} from 'path';
import * as mobileDetect from 'mobile-detect';
import { SERVER_CONFIGURATIONS } from '../configuration';
import {
    Request,
    Response,
} from 'express';

interface RequestWithSession extends Request {
    session: any;
}

export function ShouldSendMobileVersion(req: RequestWithSession) {
    return !(req.session && req.session.onlyDesktop) && (new mobileDetect(req.headers['user-agent'])).mobile();
}

export function clientRender(req: RequestWithSession, res: Response, status: number) {
    if (!SERVER_CONFIGURATIONS.IS_DEVELOPMENT_MODE) {
        if (ShouldSendMobileVersion(req)) {
            res.status(status).sendFile(
              join(SERVER_CONFIGURATIONS.DIST_FOLDER, '../', 'dist', 'mobile', 'index-mobile.html'),
            );
        } else {
            res.status(status).sendFile(
              join(SERVER_CONFIGURATIONS.DIST_FOLDER, '../', 'dist', 'desktop', 'index.html'), {
                  req,
                  res,
                  async: true,
                  preboot: true,
              },
            );
        }
    } else {
        res.sendStatus(404);
    }
}
