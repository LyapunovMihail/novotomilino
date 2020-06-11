import * as tslib_1 from "tslib";
import { fileSaver } from './../utilits/file-saver.utilits';
import { FILEUPLOADS_UPLOADS_PATH } from './../fileuploads-api/fileuploads.interfaces';
import { DOCUMENTATION_COLLECTION_NAME } from './documentation.interfaces';
var ObjectId = require('mongodb').ObjectID;
var DocumentationModel = /** @class */ (function () {
    function DocumentationModel(db) {
        this.db = db;
        this.collectionName = DOCUMENTATION_COLLECTION_NAME;
        this.mainObjectId = 'header';
        this.collection = db.collection(this.collectionName);
    }
    DocumentationModel.prototype.createObject = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var objItem;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        objItem = {
                            title: '',
                            uploads: []
                        };
                        return [4 /*yield*/, this.collection.insert(objItem)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getObjects()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DocumentationModel.prototype.getHeaderDescription = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var headerDescription;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOne({ _id: this.mainObjectId })];
                    case 1:
                        headerDescription = _a.sent();
                        return [2 /*return*/, (headerDescription ? headerDescription : {
                                description: ''
                            })];
                }
            });
        });
    };
    DocumentationModel.prototype.updateHeaderDescription = function (description) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var headerDescription, options;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOne({ _id: this.mainObjectId })];
                    case 1:
                        headerDescription = _a.sent();
                        options = {
                            _id: this.mainObjectId,
                            description: description
                        };
                        if (!headerDescription) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.updateOne({ _id: this.mainObjectId }, { $set: { description: description } })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.collection.insert(options)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, options];
                }
            });
        });
    };
    DocumentationModel.prototype.getObjects = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ _id: { $ne: this.mainObjectId } }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DocumentationModel.prototype.deleteObject = function (_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.deleteOne({ _id: ObjectId(_id) })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getObjects()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DocumentationModel.prototype.updateObjectTitle = function (_id, title) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var options;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = { title: title };
                        return [4 /*yield*/, this.collection.updateOne({ _id: ObjectId(_id) }, { $set: options })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getObjects()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DocumentationModel.prototype.uploadFile = function (req) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _id, path, fileName, date, snippet;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _id = req.headers.id;
                        path = FILEUPLOADS_UPLOADS_PATH;
                        return [4 /*yield*/, fileSaver(req, path)];
                    case 1:
                        fileName = _a.sent();
                        date = new Date();
                        snippet = {
                            name: fileName,
                            originalName: req.files['file'].originalFilename,
                            created_at: date
                        };
                        return [4 /*yield*/, this.collection.updateOne({ _id: ObjectId(_id) }, { $push: { uploads: snippet } })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getObjects()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DocumentationModel.prototype.deleteFile = function (_id, file) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(_id && file)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.collection.updateOne({ _id: ObjectId(_id) }, { $pull: { uploads: file } })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.getObjects()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return DocumentationModel;
}());
export { DocumentationModel };
//# sourceMappingURL=documentation.model.js.map