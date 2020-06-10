import { resolve } from 'path';
import { SERVER_CONFIGURATIONS } from '../configuration';
export var uploadsRootPath = function (path) {
    return resolve(SERVER_CONFIGURATIONS.DIST_FOLDER, path);
};
//# sourceMappingURL=uploads-root-path.js.map