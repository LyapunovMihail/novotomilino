import * as tslib_1 from "tslib";
import { responseHandler } from './../utilits/response-handler.utilits';
import { GalleryModel } from './gallery.model';
import * as express from 'express';
import * as multipart from 'connect-multiparty';
import { Controller } from '@nestjs/common';
import { MongoConnectionService } from '../mongo-connection.service';
import { ExpressAppService } from '../express-app.service';
var GalleryController = /** @class */ (function (_super) {
    tslib_1.__extends(GalleryController, _super);
    function GalleryController(mongoConnectionService, expressAppService) {
        var _this = _super.call(this, mongoConnectionService.getDb().connection.db) || this;
        _this.mongoConnectionService = mongoConnectionService;
        _this.expressAppService = expressAppService;
        _this.router = express.Router();
        _this.routing();
        return _this;
    }
    GalleryController.prototype.routing = function () {
        var _this = this;
        this.router.get('/gallery', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSnippet(req.query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/gallery/delete', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.deleteSnippet(req.body.id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/gallery/update/description', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changeDescription(req.body.id, req.body.description)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/gallery/update/name', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changeName(req.body.id, req.body.name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/gallery/update/type', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.changeType(req.body.id, req.body.type)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        var multipartMiddleware = multipart();
        this.router.post('/admin/gallery/image/create', multipartMiddleware, responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setSnippet(req)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/gallery/image/update', multipartMiddleware, responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateImage(req)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        var app = this.expressAppService.getApp();
        app.use('/api', this.router);
    };
    GalleryController = tslib_1.__decorate([
        Controller('/api'),
        tslib_1.__metadata("design:paramtypes", [MongoConnectionService,
            ExpressAppService])
    ], GalleryController);
    return GalleryController;
}(GalleryModel));
export { GalleryController };
//# sourceMappingURL=gallery.controller.js.map