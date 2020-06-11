import * as tslib_1 from "tslib";
import { HOME_COLLECTION_NAME } from './home.interfaces';
var HomeModel = /** @class */ (function () {
    function HomeModel(db) {
        this.db = db;
        this.collectionName = HOME_COLLECTION_NAME;
        this.mainObjectId = 'header';
        this.homeObjectId = 'preview';
        this.VideoObjectId = 'previewVideo';
        this.collection = db.collection(this.collectionName);
    }
    HomeModel.prototype.getHeaderDescription = function () {
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
    HomeModel.prototype.updateHeaderDescription = function (description) {
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
    HomeModel.prototype.getHomePreview = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var previewObj;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOne({ _id: this.homeObjectId })];
                    case 1:
                        previewObj = _a.sent();
                        return [2 /*return*/, (previewObj ? previewObj : {
                                title: '',
                                description: '',
                            })];
                }
            });
        });
    };
    HomeModel.prototype.updateHomePreview = function (val) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var headerDescription, options;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOne({ _id: this.homeObjectId })];
                    case 1:
                        headerDescription = _a.sent();
                        options = {
                            _id: this.homeObjectId,
                            title: val.title,
                            description: val.description,
                        };
                        if (!headerDescription) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.updateOne({ _id: this.homeObjectId }, { $set: val })];
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
    HomeModel.prototype.getPreviewVideo = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var videoObj;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOne({ _id: this.VideoObjectId })];
                    case 1:
                        videoObj = _a.sent();
                        return [2 /*return*/, (videoObj ? videoObj : {
                                name: '',
                                link: '',
                                show: false,
                            })];
                }
            });
        });
    };
    HomeModel.prototype.updatePreviewVideo = function (val) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var videoObj, options;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOne({ _id: this.VideoObjectId })];
                    case 1:
                        videoObj = _a.sent();
                        options = {
                            _id: this.VideoObjectId,
                            name: val.name,
                            link: val.link,
                            show: val.show,
                        };
                        if (!videoObj) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.collection.updateOne({ _id: this.VideoObjectId }, { $set: val })];
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
    return HomeModel;
}());
export { HomeModel };
//# sourceMappingURL=home.model.js.map