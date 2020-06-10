import * as tslib_1 from "tslib";
import { imageSaver, thumbnailSaver } from './../utilits/image-saver.utilits';
import { GALLERY_UPLOADS_PATH, GALLERY_COLLECTION_NAME } from './gallery.interfaces';
var ObjectId = require('mongodb').ObjectID;
var GalleryModel = /** @class */ (function () {
    function GalleryModel(db) {
        this.db = db;
        this.collectionName = GALLERY_COLLECTION_NAME;
        this.collection = db.collection(this.collectionName);
    }
    GalleryModel.prototype.getSnippet = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find(options).sort({ order: -1 }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GalleryModel.prototype.setSnippet = function (req) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var media, date, snippet;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.uploadSnippetImage(req)];
                    case 1:
                        media = _a.sent();
                        date = new Date();
                        snippet = {
                            image: media.image,
                            thumbnail: media.thumbnail,
                            created_at: date,
                            last_modifyed: date,
                            description: '',
                            name: '',
                            order: 0,
                            type: req.headers.type
                        };
                        return [4 /*yield*/, this.collection.insertOne(snippet)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getSnippet({ type: req.headers.type })];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GalleryModel.prototype.updateImage = function (req) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var id, media, date, options, snippet;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.headers.id;
                        if (!(id && ObjectId.isValid(id))) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.uploadSnippetImage(req)];
                    case 1:
                        media = _a.sent();
                        date = new Date();
                        options = {
                            last_modifyed: date,
                            image: media.image,
                            thumbnail: media.thumbnail
                        };
                        return [4 /*yield*/, this.collection.findOne({ _id: ObjectId(id) })];
                    case 2:
                        snippet = _a.sent();
                        return [4 /*yield*/, this.collection.update({ _id: ObjectId(id) }, { $set: options })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.getSnippet({ type: snippet.type })];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: throw new Error('Не корректный id.');
                }
            });
        });
    };
    GalleryModel.prototype.deleteSnippet = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var snippet;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(id && ObjectId.isValid(id))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.collection.findOne({ _id: ObjectId(id) })];
                    case 1:
                        snippet = _a.sent();
                        return [4 /*yield*/, this.collection.deleteOne({ _id: ObjectId(id) })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getSnippet({ type: snippet.type })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: throw new Error('Не корректный id.');
                }
            });
        });
    };
    GalleryModel.prototype.changeDescription = function (id, description) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var date, options, snippet;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(id && ObjectId.isValid(id) && description !== undefined && typeof description === 'string')) return [3 /*break*/, 4];
                        date = new Date();
                        options = {
                            last_modifyed: date,
                            description: description
                        };
                        return [4 /*yield*/, this.collection.findOne({ _id: ObjectId(id) })];
                    case 1:
                        snippet = _a.sent();
                        return [4 /*yield*/, this.collection.update({ _id: ObjectId(id) }, { $set: options })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getSnippet({ type: snippet.type })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: throw new Error('Не корректный id.');
                }
            });
        });
    };
    GalleryModel.prototype.changeName = function (id, name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var date, options, snippet;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(id && ObjectId.isValid(id) && name !== undefined && typeof name === 'string')) return [3 /*break*/, 4];
                        date = new Date();
                        options = {
                            last_modifyed: date,
                            name: name
                        };
                        return [4 /*yield*/, this.collection.findOne({ _id: ObjectId(id) })];
                    case 1:
                        snippet = _a.sent();
                        return [4 /*yield*/, this.collection.update({ _id: ObjectId(id) }, { $set: options })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getSnippet({ type: snippet.type })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: throw new Error('Не корректный id.');
                }
            });
        });
    };
    GalleryModel.prototype.changeType = function (id, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var date, options;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(id && ObjectId.isValid(id) && type !== undefined)) return [3 /*break*/, 3];
                        date = new Date();
                        options = {
                            last_modifyed: date,
                            type: type
                        };
                        return [4 /*yield*/, this.collection.update({ _id: ObjectId(id) }, { $set: options })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getSnippet({ type: type })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: throw new Error('Не корректный id.');
                }
            });
        });
    };
    GalleryModel.prototype.uploadSnippetImage = function (req) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var path, image, thumbnailSize, thumbnail;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = GALLERY_UPLOADS_PATH;
                        return [4 /*yield*/, imageSaver(req, path, 80)];
                    case 1:
                        image = _a.sent();
                        thumbnailSize = {
                            height: '370',
                            width: '670'
                        };
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
    return GalleryModel;
}());
export { GalleryModel };
//# sourceMappingURL=gallery.model.js.map