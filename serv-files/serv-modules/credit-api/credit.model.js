import * as tslib_1 from "tslib";
import { imageSaver } from './../utilits/image-saver.utilits';
import { CREDIT_UPLOADS_PATH, CREDIT_COLLECTION_NAME } from './credit.interfaces';
import * as dateFormat from 'dateformat';
var ObjectId = require('mongodb').ObjectID;
var CreditModel = /** @class */ (function () {
    function CreditModel(db) {
        this.db = db;
        this.collectionName = CREDIT_COLLECTION_NAME;
        this.collection = db.collection(this.collectionName);
    }
    CreditModel.prototype.getAllSnippet = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find().sort({ created_at: -1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreditModel.prototype.getActiveSnippet = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ active: true }).sort({ created_at: -1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreditModel.prototype.getActiveSnippetWithParams = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var snippets;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({
                            active: true,
                            initial: { $lte: params.initial },
                            deadline: { $gte: params.deadline },
                        })
                            .sort({ created_at: -1 }).toArray()];
                    case 1:
                        snippets = _a.sent();
                        return [2 /*return*/, snippets];
                }
            });
        });
    };
    CreditModel.prototype.setSnippet = function (banks) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var date, banksSnippets;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        date = new Date();
                        return [4 /*yield*/, this.collection.remove({})];
                    case 1:
                        _a.sent();
                        banksSnippets = [];
                        banks.forEach(function (bank) {
                            var created_at = dateFormat(date, 'yyyy-mm-ddTHH:MM:ssZ');
                            var snippet = {
                                name: bank.name,
                                image: bank.image,
                                cssclass: bank.cssclass,
                                percent: 0,
                                initial: 0,
                                deadline: 0,
                                // military: false,
                                // maternal: false,
                                // nationality: false,
                                active: true,
                                created_at: created_at,
                            };
                            banksSnippets.push(snippet);
                        });
                        return [4 /*yield*/, this.collection.insertMany(banksSnippets)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getAllSnippet()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreditModel.prototype.deleteSnippet = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(id && ObjectId.isValid(id))) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.deleteOne({ _id: ObjectId(id) })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getActiveSnippet()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: throw new Error('Не корректный id.');
                }
            });
        });
    };
    CreditModel.prototype.updateSnippet = function (id, key, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, options;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = key;
                        switch (_a) {
                            case 'percent': return [3 /*break*/, 1];
                            case 'initial': return [3 /*break*/, 1];
                            case 'deadline': return [3 /*break*/, 1];
                            case 'active': return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 5];
                    case 1:
                        // если key - правильный но нет его значения, отдается ошибка
                        if (value === undefined) {
                            throw new Error("\u041D\u0435 \u043F\u0435\u0440\u0435\u0434\u0430\u043D\u043E \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 " + key);
                        }
                        if ((key === 'initial' || key === 'percent' || key === 'deadline') && typeof value !== 'number') {
                            throw new Error("\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 " + key + " \u043D\u0435 \u0446\u0438\u0444\u0440\u043E\u0432\u044B\u0435, \u043F\u0435\u0447\u0430\u0442\u0430\u0439\u0442\u0435 \u0446\u0438\u0444\u0440\u044B");
                        }
                        if (!ObjectId.isValid(id)) return [3 /*break*/, 4];
                        options = {};
                        options[key] = value;
                        return [4 /*yield*/, this.collection.update({ _id: ObjectId(id) }, { $set: options })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.getActiveSnippet()];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4: 
                    // если id не валиден, отдается ошибка
                    throw new Error('Не корректный id.');
                    case 5: throw new Error('Изменяемый параметр указан не корректно, или такого параметра не может быть.');
                }
            });
        });
    };
    CreditModel.prototype.uploadSnippetImage = function (req) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var path, image;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = CREDIT_UPLOADS_PATH;
                        return [4 /*yield*/, imageSaver(req, path, 50)];
                    case 1:
                        image = _a.sent();
                        return [4 /*yield*/, this.collection.update({ _id: ObjectId(req.headers.id) }, { $set: { image: image } })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getActiveSnippet()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return CreditModel;
}());
export { CreditModel };
//# sourceMappingURL=credit.model.js.map