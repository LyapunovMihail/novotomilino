import * as tslib_1 from "tslib";
import { DYNAMIC_COLLECTION_NAME, DYNAMIC_UPLOADS_PATH, EnumDynamicImageType } from './dynamic.interfaces';
import { imageSaver, thumbnailSaver } from './../utilits/image-saver.utilits';
var ObjectId = require('mongodb').ObjectID;
var DynamicModel = /** @class */ (function () {
    function DynamicModel(db) {
        this.db = db;
        this.collectionName = DYNAMIC_COLLECTION_NAME;
        this.collection = db.collection(this.collectionName);
    }
    DynamicModel.prototype.getObjects = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({}).sort({ created_at: 1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DynamicModel.prototype.changeReady = function (id, ready) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var date;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id) return [3 /*break*/, 3];
                        ready = typeof ready === 'number' ? ready : 0;
                        date = new Date();
                        return [4 /*yield*/, this.collection.update({ _id: ObjectId(id) }, {
                                $set: { ready: ready, last_modifyed: date }
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getObjects()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: throw new Error('Не корректно переданы параметры!');
                }
            });
        });
    };
    DynamicModel.prototype.changeDescription = function (id, description) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var date;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id) return [3 /*break*/, 3];
                        date = new Date();
                        description = typeof description === 'string' ? description : '';
                        return [4 /*yield*/, this.collection.update({ _id: ObjectId(id) }, {
                                $set: { description: description, last_modifyed: date }
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getObjects()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: throw new Error('Не корректно переданы параметры!');
                }
            });
        });
    };
    DynamicModel.prototype.deleteObject = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.deleteOne({ _id: ObjectId(id) })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getObjects()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: throw new Error('Не корректно переданы параметры!');
                }
            });
        });
    };
    DynamicModel.prototype.setVideo = function (id, origin) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var date;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(id && origin && typeof origin === 'string')) return [3 /*break*/, 3];
                        date = new Date();
                        return [4 /*yield*/, this.collection.update({ _id: ObjectId(id) }, {
                                $set: { last_modifyed: date },
                                $push: { images: { type: EnumDynamicImageType.VIDEO, origin: origin, thumbnail: origin } }
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getObjects()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: throw new Error('Не корректно переданы параметры!');
                }
            });
        });
    };
    DynamicModel.prototype.setObject = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var date, newObject;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!('year' in options && 'month' in options && 'title' in options)) return [3 /*break*/, 3];
                        date = new Date();
                        newObject = {
                            title: options.title,
                            description: '',
                            created_at: date,
                            last_modifyed: date,
                            month: options.month,
                            year: options.year,
                            ready: 0,
                            images: []
                        };
                        return [4 /*yield*/, this.collection.insertOne(newObject)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getObjects()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: throw new Error('Не корректно переданы параметры!');
                }
            });
        });
    };
    DynamicModel.prototype.deleteImage = function (id, image, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var date;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(id && image && type && typeof image === 'string' && image.length > 0)) return [3 /*break*/, 3];
                        date = new Date();
                        return [4 /*yield*/, this.collection.update({ _id: ObjectId(id) }, {
                                $set: { last_modifyed: date },
                                $pull: { images: { type: type, thumbnail: image } }
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getObjects()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: throw new Error('Не корректно переданы параметры!');
                }
            });
        });
    };
    DynamicModel.prototype.setImages = function (req) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var media, date;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.uploadSnippetImage(req)];
                    case 1:
                        media = _a.sent();
                        date = new Date();
                        return [4 /*yield*/, this.collection.update({ _id: ObjectId(req.headers.id) }, {
                                $set: { last_modifyed: date },
                                $push: { images: { type: EnumDynamicImageType.IMAGE, origin: media.image, thumbnail: media.thumbnail } }
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getObjects()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DynamicModel.prototype.uploadSnippetImage = function (req) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var path, thumbnailSize, image, thumbnail;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = DYNAMIC_UPLOADS_PATH;
                        thumbnailSize = {
                            height: '360',
                            width: '480'
                        };
                        return [4 /*yield*/, imageSaver(req, path, 80)];
                    case 1:
                        image = _a.sent();
                        return [4 /*yield*/, thumbnailSaver(req, path, thumbnailSize)];
                    case 2:
                        thumbnail = _a.sent();
                        return [2 /*return*/, ({
                                thumbnail: thumbnail,
                                image: image
                            })];
                }
            });
        });
    };
    DynamicModel.prototype.getLastMonthValue = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var array, lastYear_1, lastMonth, date;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getObjects()];
                    case 1:
                        array = _a.sent();
                        if (array.length > 0) {
                            lastYear_1 = array.reduce(function (prev, cur, index, arr) {
                                if (Number(cur.year) > Number(prev.year)) {
                                    return cur;
                                }
                                else {
                                    return prev;
                                }
                            }).year;
                            lastMonth = array.filter(function (val) {
                                return Number(val.year) === Number(lastYear_1);
                            }).reduce(function (prev, cur, index, arr) {
                                if (Number(cur.month) > Number(prev.month)) {
                                    return cur;
                                }
                                else {
                                    return prev;
                                }
                            }).month;
                            return [2 /*return*/, ({ year: lastYear_1, month: lastMonth })];
                        }
                        else {
                            date = new Date();
                            return [2 /*return*/, ({ year: date.getFullYear(), month: (date.getMonth() + 1) })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return DynamicModel;
}());
export { DynamicModel };
//# sourceMappingURL=dynamic.model.js.map