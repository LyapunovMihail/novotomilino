import * as tslib_1 from "tslib";
import { TRIGGER_COLLECTION_NAME } from './trigger.interfaces';
var ObjectId = require('mongodb').ObjectID;
var TriggerModel = /** @class */ (function () {
    function TriggerModel(db) {
        this.db = db;
        this.collectionName = TRIGGER_COLLECTION_NAME;
        this.collection = db.collection(this.collectionName);
    }
    TriggerModel.prototype.getSnippet = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var triggers;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find().toArray()];
                    case 1:
                        triggers = _a.sent();
                        if (!(triggers.length === 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.setSnippet()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.collection.find().toArray()];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TriggerModel.prototype.setSnippet = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var snippets;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        snippets = [
                            { rooms_space: 'Студии (33-37 м²)', price: '6,7' },
                            { rooms_space: '1 комн. (42-54 м²)', price: '7,7' },
                            { rooms_space: '2 комн. (59-70 м²)', price: '9,7' },
                            { rooms_space: '3 комн. (85-91 м²)', price: '13,5' }
                        ];
                        return [4 /*yield*/, this.collection.insertMany(snippets)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TriggerModel.prototype.updateSnippet = function (id, key, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, options;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = key;
                        switch (_a) {
                            case 'rooms_space': return [3 /*break*/, 1];
                            case 'price': return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 5];
                    case 1:
                        // если key - правильный но нет его значения, отдается ошибка
                        if (value === undefined) {
                            throw new Error("\u041D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D\u043E \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 " + key);
                        }
                        if (!ObjectId.isValid(id)) return [3 /*break*/, 4];
                        options = {};
                        options[key] = value;
                        return [4 /*yield*/, this.collection.update({ _id: ObjectId(id) }, { $set: options })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.getSnippet()];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4: 
                    // если id не валиден, отдается ошибка
                    throw new Error('Не корректный id.');
                    case 5: throw new Error('Изменяемый параметр указан не корректно, или такого параметра не может быть.');
                }
            });
        });
    };
    return TriggerModel;
}());
export { TriggerModel };
//# sourceMappingURL=trigger.model.js.map