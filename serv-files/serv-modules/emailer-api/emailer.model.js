import * as tslib_1 from "tslib";
import * as mongodb from 'mongodb';
import * as nodemailer from 'nodemailer';
import * as request from 'request';
var EmailerModel = /** @class */ (function () {
    function EmailerModel(db) {
        this.db = db;
        this.objectId = mongodb.ObjectId;
        this.collectionName = 'contacts';
        this.collection = db.collection(this.collectionName);
    }
    EmailerModel.prototype.callRequest = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var mails, config;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mailsFind()];
                    case 1:
                        mails = _a.sent();
                        console.log('sending mail to: ' + mails);
                        config = {
                            mails: mails,
                            subject: 'Заказ звонка.',
                            text: "\n                <b>\u0418\u043C\u044F :</b> " + data.name + ",<br>\n                <b>\u0422\u0435\u043B\u0435\u0444\u043E\u043D :</b> " + data.phone + ",<br>\n                <b>\u0412\u0440\u0435\u043C\u044F \u0434\u043B\u044F \u0437\u0432\u043E\u043D\u043A\u0430 :</b> " + ((data.wait_for_call === 'now') ? 'ожидает сейчас' : data.time)
                        };
                        this.sendMail(config);
                        return [2 /*return*/, ({ message: 'ok' })];
                }
            });
        });
    };
    EmailerModel.prototype.creditRequest = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var options;
            return tslib_1.__generator(this, function (_a) {
                options = {
                    uri: 'http://incrm.ru/Export-TRED/ImportFromSite.svc/Integration',
                    method: 'POST',
                    json: data
                };
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body); // Print the shortened url.
                    }
                    else {
                        console.log(error);
                    }
                });
                return [2 /*return*/, ({ message: 'ok' })];
            });
        });
    };
    EmailerModel.prototype.reserveRequest = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var options;
            return tslib_1.__generator(this, function (_a) {
                options = {
                    uri: 'http://incrm.ru/Export-TRED/ImportFromSite.svc/Integration',
                    method: 'POST',
                    json: data
                };
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body); // Print the shortened url.
                    }
                    else {
                        console.log(error);
                    }
                });
                return [2 /*return*/, ({ message: 'ok' })];
            });
        });
    };
    EmailerModel.prototype.mailsFind = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var mails;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ type: 'mail', status: true }).toArray()];
                    case 1:
                        mails = _a.sent();
                        return [2 /*return*/, mails.map(function (i) { return i.name; }).join(', ')];
                }
            });
        });
    };
    EmailerModel.prototype.sendMail = function (config) {
        // oblaka@3-capital.ru
        // lubertsi86
        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: 465,
            secure: true,
            auth: {
                user: 'novotomilino@3-capital.ru',
                pass: 'qwe91x'
            }
        });
        // setup email data with unicode symbols
        var mailOptions = {
            from: 'novotomilino@3-capital.ru',
            to: config.mails,
            subject: config.subject,
            // text: config.text, // plain text body
            html: config.text // html body
        };
        // send mail with defined transport object
        if (config.mails.length > 0) {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
        }
        else {
            console.log('No recipients defined');
        }
    };
    return EmailerModel;
}());
export { EmailerModel };
//# sourceMappingURL=emailer.model.js.map