import * as tslib_1 from "tslib";
import * as express from 'express';
import { responseHandler } from './../utilits/response-handler.utilits';
import { AddressesModel } from './addresses.model';
import { Controller } from '@nestjs/common';
import { MongoConnectionService } from '../mongo-connection.service';
import { ExpressAppService } from '../express-app.service';
var AddressesController = /** @class */ (function (_super) {
    tslib_1.__extends(AddressesController, _super);
    function AddressesController(expressAppService, mongoConnectionService) {
        var _this = _super.call(this, mongoConnectionService.getDb().connection.db) || this;
        _this.expressAppService = expressAppService;
        _this.mongoConnectionService = mongoConnectionService;
        _this.router = express.Router();
        _this.routing();
        return _this;
    }
    AddressesController.prototype.routing = function () {
        var _this = this;
        this.router.post('/search', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getObjects(req.body.search)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.get('/search', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getObjects(req.query)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/search/with_count', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getObjectsWithCount(req.body.search)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.get('/search-config', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSearchConfig()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/search/by_houses_and_numbers', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getObjectsByHousesAndNumbers(req.body)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        var app = this.expressAppService.getApp();
        app.use('/api', this.router);
    };
    AddressesController = tslib_1.__decorate([
        Controller('/api'),
        tslib_1.__metadata("design:paramtypes", [ExpressAppService,
            MongoConnectionService])
    ], AddressesController);
    return AddressesController;
}(AddressesModel));
export { AddressesController };
//# sourceMappingURL=addresses.controller.js.map