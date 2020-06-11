import * as tslib_1 from "tslib";
import * as express from 'express';
import { responseHandler } from './../utilits/response-handler.utilits';
import { Controller } from '@nestjs/common';
import { MongoConnectionService } from '../mongo-connection.service';
import { ExpressAppService } from '../express-app.service';
import { EmailerModel } from './emailer.model';
var EmailerController = /** @class */ (function (_super) {
    tslib_1.__extends(EmailerController, _super);
    function EmailerController(expressAppService, mongoConnectionService) {
        var _this = _super.call(this, mongoConnectionService.getDb().connection.db) || this;
        _this.expressAppService = expressAppService;
        _this.mongoConnectionService = mongoConnectionService;
        _this.router = express.Router();
        _this.routing();
        return _this;
    }
    EmailerController.prototype.routing = function () {
        var _this = this;
        this.router.post('/request_form/call', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.callRequest(req.body)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/request_form/credit', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.creditRequest(req.body)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/request_form/reserve', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reserveRequest(req.body)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        var app = this.expressAppService.getApp();
        app.use('/api', this.router);
    };
    EmailerController = tslib_1.__decorate([
        Controller('/api'),
        tslib_1.__metadata("design:paramtypes", [ExpressAppService,
            MongoConnectionService])
    ], EmailerController);
    return EmailerController;
}(EmailerModel));
export { EmailerController };
//# sourceMappingURL=emailer.controller.js.map