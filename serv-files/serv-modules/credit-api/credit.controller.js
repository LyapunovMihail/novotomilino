import * as tslib_1 from "tslib";
import { responseHandler } from './../utilits/response-handler.utilits';
import { CreditModel } from './credit.model';
import * as express from 'express';
import * as multipart from 'connect-multiparty';
import { MongoConnectionService } from '../mongo-connection.service';
import { ExpressAppService } from '../express-app.service';
import { Controller } from '@nestjs/common';
var CreditController = /** @class */ (function (_super) {
    tslib_1.__extends(CreditController, _super);
    function CreditController(mongoConnectionService, expressAppService) {
        var _this = _super.call(this, mongoConnectionService.getDb().connection.db) || this;
        _this.mongoConnectionService = mongoConnectionService;
        _this.expressAppService = expressAppService;
        _this.router = express.Router();
        _this.routing();
        return _this;
    }
    CreditController.prototype.routing = function () {
        var _this = this;
        this.router.get('/credit/all', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllSnippet()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.get('/credit/active', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getActiveSnippet()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/credit/active_with_params', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getActiveSnippetWithParams(req.body.params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/credit/create', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setSnippet(req.body.banks)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/credit/delete', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.deleteSnippet(req.body.id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/credit/update', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateSnippet(req.body.id, req.body.key, req.body.value)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        var multipartMiddleware = multipart();
        this.router.post('/admin/credit/image', multipartMiddleware, responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.uploadSnippetImage(req)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        var app = this.expressAppService.getApp();
        app.use('/api', this.router);
    };
    CreditController = tslib_1.__decorate([
        Controller('/api'),
        tslib_1.__metadata("design:paramtypes", [MongoConnectionService,
            ExpressAppService])
    ], CreditController);
    return CreditController;
}(CreditModel));
export { CreditController };
//# sourceMappingURL=credit.controller.js.map