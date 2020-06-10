import * as tslib_1 from "tslib";
import { imageSaver, thumbnailSaver, fileExtension } from './../utilits/image-saver.utilits';
import { EnumNewsSnippet, NEWS_UPLOADS_PATH, NEWS_COLLECTION_NAME, ErrorNotCorrectArguments } from './news.interfaces';
var ObjectId = require('mongodb').ObjectID;
var NewsModel = /** @class */ (function () {
    function NewsModel(db) {
        this.db = db;
        this.collectionName = NEWS_COLLECTION_NAME;
        this.collection = db.collection(this.collectionName);
    }
    // поиск новостей
    NewsModel.prototype.getSnippet = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var findCriteria;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        findCriteria = id ? { _id: ObjectId(id) } : { category: EnumNewsSnippet.NEW };
                        return [4 /*yield*/, this.collection.find(findCriteria).sort({ created_at: -1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // новость для главной страницы
    NewsModel.prototype.getMainSnippet = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ show_on_main: true, category: EnumNewsSnippet.NEW }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // создание новости
    NewsModel.prototype.setSnippet = function (parameters) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var options;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = parameters;
                        return [4 /*yield*/, this.errorParamsCatcher(this.valuesReview(options), function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var created;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.collection.insert(options)];
                                        case 1:
                                            created = _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // обновление новости
    NewsModel.prototype.updateSnippet = function (id, parameters) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var options;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = parameters;
                        return [4 /*yield*/, this.errorParamsCatcher((this.valuesReview(options) && ObjectId.isValid(id)), function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var created;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            // удаление _id из параметров если он там есть
                                            if ('_id' in options) {
                                                delete options._id;
                                            }
                                            return [4 /*yield*/, this.collection.updateOne({ _id: ObjectId(id) }, { $set: options })];
                                        case 1:
                                            created = _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // удаление новости
    NewsModel.prototype.deleteSnippet = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.errorParamsCatcher(ObjectId.isValid(id), function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.collection.deleteOne({ _id: ObjectId(id) })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NewsModel.prototype.uploadImage = function (req) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var path, image, thumbnail;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(fileExtension(req.files.file.originalFilename) === '.jpg')) return [3 /*break*/, 3];
                        path = NEWS_UPLOADS_PATH;
                        return [4 /*yield*/, imageSaver(req, path, 50)];
                    case 1:
                        image = _a.sent();
                        return [4 /*yield*/, thumbnailSaver(req, path, { width: '300', height: '200' })];
                    case 2:
                        thumbnail = _a.sent();
                        return [2 /*return*/, ({
                                image: image,
                                thumbnail: thumbnail,
                            })];
                    case 3: throw new Error('Не допустимое расширение файла.');
                }
            });
        });
    };
    // обертка для возврата ошибки о неверно переданных параметрах
    NewsModel.prototype.errorParamsCatcher = function (val, fn) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!val) return [3 /*break*/, 3];
                        return [4 /*yield*/, fn()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getSnippet()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: throw new Error(ErrorNotCorrectArguments);
                }
            });
        });
    };
    NewsModel.prototype.valuesReview = function (options) {
        // если есть все параметры : 'created_at', 'last_modifyed', 'title', 'description', 'image', 'thumbnail', 'category', 'show_on_main'
        // а так же если 'category' равна одному из значений EnumNewsSnippet
        return (('created_at' in options && 'last_modifyed' in options && 'title' in options
            && 'description' in options && 'image' in options && 'thumbnail' in options
            && 'category' in options && 'show_on_main' in options && 'icon_mod' in options
            && (options.category === EnumNewsSnippet.NEW || options.category === EnumNewsSnippet.SHARE)) ? true : false);
    };
    return NewsModel;
}());
export { NewsModel };
//# sourceMappingURL=news.model.js.map