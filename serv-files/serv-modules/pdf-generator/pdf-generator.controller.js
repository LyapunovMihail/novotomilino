import * as tslib_1 from "tslib";
import * as express from 'express';
import { Controller } from '@nestjs/common';
import { MongoConnectionService } from '../mongo-connection.service';
import { ExpressAppService } from '../express-app.service';
import { PDFGeneratorModel } from './pdf-generator.model';
import { responseHandler } from '../utilits/response-handler.utilits';
var PDFController = /** @class */ (function (_super) {
    tslib_1.__extends(PDFController, _super);
    function PDFController(mongoConnectionService, expressAppService) {
        var _this = _super.call(this, mongoConnectionService.getDb().connection.db) || this;
        _this.mongoConnectionService = mongoConnectionService;
        _this.expressAppService = expressAppService;
        _this.router = express.Router();
        _this.routing();
        return _this;
    }
    PDFController.prototype.routing = function () {
        var _this = this;
        this.router.get('/pdf/:id/:mod', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.create(req)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        var app = this.expressAppService.getApp();
        app.use('/api', this.router);
    };
    PDFController = tslib_1.__decorate([
        Controller('/api'),
        tslib_1.__metadata("design:paramtypes", [MongoConnectionService,
            ExpressAppService])
    ], PDFController);
    return PDFController;
}(PDFGeneratorModel));
export { PDFController };
//# sourceMappingURL=pdf-generator.controller.js.map