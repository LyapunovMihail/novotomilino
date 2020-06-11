import * as tslib_1 from "tslib";
import { responseHandler } from './../utilits/response-handler.utilits';
import { HomeModel } from './home.model';
import * as express from 'express';
import { MongoConnectionService } from '../mongo-connection.service';
import { ExpressAppService } from '../express-app.service';
import { Controller } from '@nestjs/common';
var HomeController = /** @class */ (function (_super) {
    tslib_1.__extends(HomeController, _super);
    function HomeController(mongoConnectionService, expressAppService) {
        var _this = _super.call(this, mongoConnectionService.getDb().connection.db) || this;
        _this.mongoConnectionService = mongoConnectionService;
        _this.expressAppService = expressAppService;
        _this.router = express.Router();
        _this.routing();
        return _this;
    }
    HomeController.prototype.routing = function () {
        var _this = this;
        this.router.get('/home/header', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getHeaderDescription()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/home/header/update', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateHeaderDescription(req.body.description)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.get('/home/preview', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getHomePreview()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/home/preview/update', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateHomePreview(req.body.object)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.get('/home/video', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPreviewVideo()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/home/video/update', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updatePreviewVideo(req.body.object)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        var app = this.expressAppService.getApp();
        app.use('/api', this.router);
    };
    HomeController = tslib_1.__decorate([
        Controller('/api'),
        tslib_1.__metadata("design:paramtypes", [MongoConnectionService,
            ExpressAppService])
    ], HomeController);
    return HomeController;
}(HomeModel));
export { HomeController };
//# sourceMappingURL=home.controller.js.map