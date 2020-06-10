import * as tslib_1 from "tslib";
import { Controller } from '@nestjs/common';
import { ExpressAppService } from '../express-app.service';
import { MongoConnectionService } from '../mongo-connection.service';
import { responseHandler } from './../utilits/response-handler.utilits';
import * as express from 'express';
import { SeoModel } from './seo.model';
var SeoController = /** @class */ (function (_super) {
    tslib_1.__extends(SeoController, _super);
    function SeoController(expressAppService, mongoConnectionService) {
        var _this = _super.call(this, mongoConnectionService.getDb().connection.db) || this;
        _this.expressAppService = expressAppService;
        _this.mongoConnectionService = mongoConnectionService;
        _this.router = express.Router();
        _this.routing();
        return _this;
    }
    SeoController.prototype.routing = function () {
        var _this = this;
        // get metas common
        this.router.get('/meta_get_common', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTagsCommon({ url: req.query.url })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        // get tags admin
        this.router.post('/admin/meta_get', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTags({})];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        // create empty tag
        this.router.post('/admin/meta_set', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setTag()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        // create tag with data
        this.router.post('/admin/meta_create', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createTag(req.body)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        // delete tags
        this.router.post('/admin/meta_delete', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.deleteTag(req)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        // update tag
        this.router.post('/admin/meta_update', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateTag(req.body)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        // push meta tag
        this.router.post('/admin/meta_push', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pushTag(req.body)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        // pull meta tag
        this.router.post('/admin/meta_pop', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.popTag(req.body)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.get('/meta_get_flats-search-tag', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFlatsSearchTag()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        var app = this.expressAppService.getApp();
        app.use('/api', this.router);
    };
    SeoController = tslib_1.__decorate([
        Controller('/api'),
        tslib_1.__metadata("design:paramtypes", [ExpressAppService,
            MongoConnectionService])
    ], SeoController);
    return SeoController;
}(SeoModel));
export { SeoController };
//# sourceMappingURL=seo.controller.js.map