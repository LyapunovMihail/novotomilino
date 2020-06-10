import * as tslib_1 from "tslib";
import { responseHandler } from './../utilits/response-handler.utilits';
import * as express from 'express';
import * as multipart from 'connect-multiparty';
import { NewsModel } from './news.model';
import { Controller } from '@nestjs/common';
import { MongoConnectionService } from '../mongo-connection.service';
import { ExpressAppService } from '../express-app.service';
var NewsController = /** @class */ (function (_super) {
    tslib_1.__extends(NewsController, _super);
    function NewsController(mongoConnectionService, expressAppService) {
        var _this = _super.call(this, mongoConnectionService.getDb().connection.db) || this;
        _this.mongoConnectionService = mongoConnectionService;
        _this.expressAppService = expressAppService;
        _this.router = express.Router();
        _this.routing();
        return _this;
    }
    NewsController.prototype.routing = function () {
        var _this = this;
        this.router.get('/news/all', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSnippet()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.get('/news/id/:id', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSnippet(req.params.id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.get('/news/main', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMainSnippet()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/news/create', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setSnippet(req.body.form)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/news/update', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateSnippet(req.body.id, req.body.form)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/news/delete', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.deleteSnippet(req.body.id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        var multipartMiddleware = multipart();
        this.router.post('/admin/news/image', multipartMiddleware, responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
    NewsController = tslib_1.__decorate([
        Controller('/api'),
        tslib_1.__metadata("design:paramtypes", [MongoConnectionService,
            ExpressAppService])
    ], NewsController);
    return NewsController;
}(NewsModel));
export { NewsController };
//# sourceMappingURL=news.controller.js.map