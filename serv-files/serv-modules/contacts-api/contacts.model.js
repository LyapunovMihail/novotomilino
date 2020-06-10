import * as tslib_1 from "tslib";
import { CONTACTS_COLLECTION_NAME } from './contacts.interfaces';
var ObjectId = require('mongodb').ObjectID;
var ContactsModel = /** @class */ (function () {
    function ContactsModel(db) {
        this.db = db;
        this.collectionName = CONTACTS_COLLECTION_NAME;
        this.getInstance(db);
    }
    ContactsModel.prototype.getInstance = function (db) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, db.collection(this.collectionName)];
                    case 1:
                        _a.collection = _b.sent();
                        return [4 /*yield*/, this.initPhone()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContactsModel.prototype.initPhone = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var phone, data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPhone()];
                    case 1:
                        phone = _a.sent();
                        if (!!phone) return [3 /*break*/, 3];
                        data = { _id: 'phone', phone: '' };
                        return [4 /*yield*/, this.collection.insertOne(data)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, 'just create phone object'];
                    case 3: return [2 /*return*/, 'already exist phone object'];
                }
            });
        });
    };
    ContactsModel.prototype.getPhone = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.findOne({ _id: 'phone' })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactsModel.prototype.updatePhone = function (newPhone) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.updateOne({ _id: 'phone' }, { $set: { phone: newPhone } })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getPhone()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactsModel.prototype.getMail = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ type: 'mail' }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactsModel.prototype.setMail = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var newMail;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newMail = { type: 'mail', status: false, name: '' };
                        return [4 /*yield*/, this.collection.insertOne(newMail)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getMail()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactsModel.prototype.deleteMail = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.deleteOne({ _id: ObjectId(id) })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getMail()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContactsModel.prototype.updateMail = function (id, value, status) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.updateOne({ _id: ObjectId(id) }, { $set: { name: value, status: status } })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getMail()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ContactsModel;
}());
export { ContactsModel };
//# sourceMappingURL=contacts.model.js.map