import * as tslib_1 from "tslib";
import { Injectable } from '@nestjs/common';
var ExpressAppService = /** @class */ (function () {
    function ExpressAppService() {
    }
    ExpressAppService_1 = ExpressAppService;
    ExpressAppService.prototype.getApp = function () {
        return ExpressAppService_1.app;
    };
    var ExpressAppService_1;
    ExpressAppService = ExpressAppService_1 = tslib_1.__decorate([
        Injectable()
    ], ExpressAppService);
    return ExpressAppService;
}());
export { ExpressAppService };
//# sourceMappingURL=express-app.service.js.map