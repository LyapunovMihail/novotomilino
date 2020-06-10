import * as tslib_1 from "tslib";
import { SEO_COLLECTION_NAME } from './seo.interfaces';
var ObjectId = require('mongodb').ObjectID;
var SeoModel = /** @class */ (function () {
    function SeoModel(db) {
        this.db = db;
        this.collectionName = SEO_COLLECTION_NAME;
        this.collection = db.collection(this.collectionName);
    }
    SeoModel.prototype.getTagsCommon = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tags, tag;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTags(options)];
                    case 1:
                        tags = _a.sent();
                        if (tags.length && tags[0].hasOwnProperty('flatsSearchParams')) {
                            tag = { url: options.url, h1: '', title: '', meta: [], flatsSearchParams: null, flatsPopularCategory: false };
                        }
                        else {
                            tag = { url: options.url, h1: '', title: '', meta: [] };
                        }
                        tags.forEach(function (item) {
                            tag._id = item._id;
                            tag.h1 = item.h1;
                            tag.title = item.title;
                            tag.meta = tag.meta.concat(item.meta);
                            if (tag.hasOwnProperty('flatsSearchParams')) {
                                tag.flatsSearchParams = item.flatsSearchParams;
                                tag.flatsPopularCategory = item.flatsPopularCategory;
                            }
                        });
                        return [2 /*return*/, tag];
                }
            });
        });
    };
    SeoModel.prototype.setTag = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tagObject;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tagObject = { url: '', title: '', h1: '', meta: [{ name: '', content: '' }] };
                        return [4 /*yield*/, this.collection.insert(tagObject)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getTags({})];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SeoModel.prototype.createTag = function (tagObject) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.insert(tagObject)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getTags({})];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SeoModel.prototype.deleteTag = function (req) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.remove({ _id: ObjectId(req.body.tag_id) })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getTags({})];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SeoModel.prototype.updateTag = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tag;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (options.hasOwnProperty('flatsSearchParams')) {
                            tag = { url: options.url, title: options.title, h1: options.h1, meta: options.meta, flatsSearchParams: options.flatsSearchParams, flatsPopularCategory: options.flatsPopularCategory };
                        }
                        else {
                            tag = { url: options.url, title: options.title, h1: options.h1, meta: options.meta };
                        }
                        return [4 /*yield*/, this.collection.update({ _id: ObjectId(options._id) }, { $set: tag })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getTags({})];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SeoModel.prototype.pushTag = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.update({ _id: ObjectId(options._id) }, { $push: { meta: { name: '', content: '' } },
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getTags({})];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SeoModel.prototype.popTag = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.update({ _id: ObjectId(options._id) }, { $pop: { meta: 1 },
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getTags({})];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SeoModel.prototype.getTags = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find(options).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SeoModel.prototype.getFlatsSearchTag = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTags({ flatsPopularCategory: true })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return SeoModel;
}());
export { SeoModel };
//# sourceMappingURL=seo.model.js.map