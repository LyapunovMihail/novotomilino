import * as tslib_1 from "tslib";
import { fileExtension, imageSaver, thumbnailSaver } from './../utilits/image-saver.utilits';
import { SHARES_COLLECTION_NAME, SHARES_UPLOADS_PATH } from './shares.iterfaces';
var ObjectId = require('mongodb').ObjectID;
var SharesModel = /** @class */ (function () {
    function SharesModel(db) {
        this.db = db;
        this.collectionName = SHARES_COLLECTION_NAME;
        this.collection = db.collection(this.collectionName);
    }
    SharesModel.prototype.createShare = function (obj) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.insert(obj)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SharesModel.prototype.getShares = function (limit, skip) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var options, length, sharesList;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            limit: limit,
                            skip: skip
                        };
                        return [4 /*yield*/, this.collection.count()];
                    case 1:
                        length = _a.sent();
                        return [4 /*yield*/, this.collection.find({}, options).sort({ created_at: -1 }).toArray()];
                    case 2:
                        sharesList = _a.sent();
                        return [2 /*return*/, ({
                                length: length,
                                sharesList: sharesList
                            })];
                }
            });
        });
    };
    SharesModel.prototype.getShareById = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(ObjectId.isValid(id))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.find({ _id: ObjectId(id) }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, []];
                }
            });
        });
    };
    SharesModel.prototype.updateShare = function (_id, obj) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.updateOne({ _id: ObjectId(_id) }, { $set: obj })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SharesModel.prototype.deleteShare = function (_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.deleteOne({ _id: ObjectId(_id) })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SharesModel.prototype.uploadImage = function (req) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var path, image, thumbnail;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(fileExtension(req.files['file'].originalFilename) === '.jpg'
                            || fileExtension(req.files['file'].originalFilename) === '.jpeg'
                            || fileExtension(req.files['file'].originalFilename) === '.png')) return [3 /*break*/, 3];
                        path = SHARES_UPLOADS_PATH;
                        return [4 /*yield*/, imageSaver(req, path, 50)];
                    case 1:
                        image = _a.sent();
                        return [4 /*yield*/, thumbnailSaver(req, path, { width: '300', height: '200' })];
                    case 2:
                        thumbnail = _a.sent();
                        return [2 /*return*/, ({
                                image: image,
                                thumbnail: thumbnail
                            })];
                    case 3: throw new Error('Не допустимое расширение файла.');
                }
            });
        });
    };
    return SharesModel;
}());
export { SharesModel };
//# sourceMappingURL=shares.model.js.map