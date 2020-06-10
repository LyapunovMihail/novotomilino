import * as tslib_1 from "tslib";
import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { SERVER_CONFIGURATIONS } from './configuration';
var MongoConnectionService = /** @class */ (function () {
    function MongoConnectionService() {
    }
    MongoConnectionService_1 = MongoConnectionService;
    MongoConnectionService.connect = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = MongoConnectionService_1;
                        return [4 /*yield*/, mongoose.connect(SERVER_CONFIGURATIONS.MONGODB_CONNECTION)];
                    case 1:
                        _a.db = _b.sent();
                        return [2 /*return*/, MongoConnectionService_1.db];
                }
            });
        });
    };
    MongoConnectionService.prototype.getDb = function () {
        return MongoConnectionService_1.db;
    };
    var MongoConnectionService_1;
    MongoConnectionService = MongoConnectionService_1 = tslib_1.__decorate([
        Injectable()
    ], MongoConnectionService);
    return MongoConnectionService;
}());
export { MongoConnectionService };
//# sourceMappingURL=mongo-connection.service.js.map