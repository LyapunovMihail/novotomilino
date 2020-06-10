import * as tslib_1 from "tslib";
import * as express from 'express';
import { responseHandler } from './../utilits/response-handler.utilits';
import { TriggerModel } from './trigger.model';
import { Controller } from '@nestjs/common';
import { MongoConnectionService } from '../mongo-connection.service';
import { ExpressAppService } from '../express-app.service';
var TriggerController = /** @class */ (function (_super) {
    tslib_1.__extends(TriggerController, _super);
    function TriggerController(expressAppService, mongoConnectionService) {
        var _this = _super.call(this, mongoConnectionService.getDb().connection.db) || this;
        _this.expressAppService = expressAppService;
        _this.mongoConnectionService = mongoConnectionService;
        _this.router = express.Router();
        _this.routing();
        return _this;
    }
    TriggerController.prototype.routing = function () {
        var _this = this;
        this.router.get('/trigger', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSnippet()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        this.router.post('/admin/trigger/update', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateSnippet(req.body.id, req.body.key, req.body.value)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        var app = this.expressAppService.getApp();
        app.use('/api', this.router);
    };
    TriggerController = tslib_1.__decorate([
        Controller('/api'),
        tslib_1.__metadata("design:paramtypes", [ExpressAppService,
            MongoConnectionService])
    ], TriggerController);
    return TriggerController;
}(TriggerModel));
export { TriggerController };
//# sourceMappingURL=trigger.controller.js.map