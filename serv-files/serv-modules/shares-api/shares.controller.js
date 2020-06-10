import * as tslib_1 from "tslib";
import { responseHandler } from './../utilits/response-handler.utilits';
import * as express from 'express';
import * as multipart from 'connect-multiparty';
import { SharesModel } from './shares.model';
import { ExpressAppService } from '../express-app.service';
import { MongoConnectionService } from '../mongo-connection.service';
import { Controller } from '@nestjs/common';
var SharesController = /** @class */ (function (_super) {
    tslib_1.__extends(SharesController, _super);
    function SharesController(expressAppService, mongoConnectionService) {
        var _this = _super.call(this, mongoConnectionService.getDb().connection.db) || this;
        _this.expressAppService = expressAppService;
        _this.mongoConnectionService = mongoConnectionService;
        _this.router = express.Router();
        _this.routing();
        return _this;
    }
    SharesController.prototype.routing = function () {
        var _this = this;
        this.router.post('/admin/shares/create', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createShare(req.body)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.get('/shares/list', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getShares(Number(req.query.limit), Number(req.query.skip))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.get('/shares/id/:id', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getShareById(req.params.id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/shares/update', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(req.body.id);
                        return [4 /*yield*/, this.updateShare(req.body.id, req.body.obj)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/shares/delete', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.deleteShare(req.body.id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        var multipartMiddleware = multipart();
        this.router.post('/admin/shares/image', multipartMiddleware, responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.uploadImage(req)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        var app = this.expressAppService.getApp();
        app.use('/api', this.router);
    };
    SharesController = tslib_1.__decorate([
        Controller('/api'),
        tslib_1.__metadata("design:paramtypes", [ExpressAppService,
            MongoConnectionService])
    ], SharesController);
    return SharesController;
}(SharesModel));
export { SharesController };
//# sourceMappingURL=shares.controller.js.map