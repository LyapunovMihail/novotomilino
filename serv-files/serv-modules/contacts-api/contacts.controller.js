import * as tslib_1 from "tslib";
import { Controller } from '@nestjs/common';
import { ExpressAppService } from '../express-app.service';
import { MongoConnectionService } from '../mongo-connection.service';
import { responseHandler } from './../utilits/response-handler.utilits';
import { ContactsModel } from './contacts.model';
import * as express from 'express';
var ContactsController = /** @class */ (function (_super) {
    tslib_1.__extends(ContactsController, _super);
    function ContactsController(expressAppService, mongoConnectionService) {
        var _this = _super.call(this, mongoConnectionService.getDb().connection.db) || this;
        _this.expressAppService = expressAppService;
        _this.mongoConnectionService = mongoConnectionService;
        _this.router = express.Router();
        _this.routing();
        return _this;
    }
    ContactsController.prototype.routing = function () {
        var _this = this;
        // get phone number
        this.router.get('/contacts/phone', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPhone()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        // update phone number
        this.router.post('/admin/contacts/phone', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updatePhone(req.body.phone)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        // get mails
        this.router.get('/contacts/mail/get', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMail()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        // set mail
        this.router.post('/admin/contacts/mail/set', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setMail()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        // delete mail
        this.router.post('/admin/contacts/mail/delete', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.deleteMail(req.body.mail_id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        // update mails
        this.router.post('/admin/contacts/mail/update', responseHandler(function (req) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateMail(req.body.mail_id, req.body.mail_value, req.body.mail_status)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); }));
        var app = this.expressAppService.getApp();
        app.use('/api', this.router);
    };
    ContactsController = tslib_1.__decorate([
        Controller('/api'),
        tslib_1.__metadata("design:paramtypes", [ExpressAppService,
            MongoConnectionService])
    ], ContactsController);
    return ContactsController;
}(ContactsModel));
export { ContactsController };
//# sourceMappingURL=contacts.controller.js.map