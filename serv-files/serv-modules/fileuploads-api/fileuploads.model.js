import * as tslib_1 from "tslib";
import { fileSaver } from './../utilits/file-saver.utilits';
import { FILEUPLOADS_COLLECTION_NAME, FILEUPLOADS_UPLOADS_PATH } from './fileuploads.interfaces';
var ObjectId = require('mongodb').ObjectID;
var FileUploadsModel = /** @class */ (function () {
    function FileUploadsModel(db) {
        this.db = db;
        this.collectionName = FILEUPLOADS_COLLECTION_NAME;
        this.collection = db.collection(this.collectionName);
    }
    FileUploadsModel.prototype.deleteSnippet = function (id, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.deleteOne({ _id: ObjectId(id) })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getSnippet(type)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FileUploadsModel.prototype.getSnippet = function (type) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ type: type }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FileUploadsModel.prototype.uploadFile = function (req) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var date, path, fileName, snippet;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        date = new Date();
                        path = FILEUPLOADS_UPLOADS_PATH;
                        return [4 /*yield*/, fileSaver(req, path)];
                    case 1:
                        fileName = _a.sent();
                        snippet = {
                            created_at: date,
                            name: fileName,
                            originName: req.files['file'].originalFilename,
                            type: req.headers.type
                        };
                        return [4 /*yield*/, this.collection.insertOne(snippet)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getSnippet(req.headers.type)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return FileUploadsModel;
}());
export { FileUploadsModel };
//# sourceMappingURL=fileuploads.model.js.map