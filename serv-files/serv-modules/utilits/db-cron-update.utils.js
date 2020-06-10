import * as tslib_1 from "tslib";
import { ADDRESSES_COLLECTION_NAME, } from '../addresses-api/addresses.config';
import * as request from 'request';
import * as cron from 'cron';
import { Writable, } from 'stream';
import * as JSONStream from 'JSONStream';
var url = 'http://incrm.ru/export-tred/ExportToSite.svc/ExportToTf/json';
var CronJob = cron.CronJob;
var DbCronUpdate = /** @class */ (function () {
    function DbCronUpdate(db) {
        this.db = db;
        this.counter = 0;
        this.start();
    }
    DbCronUpdate.prototype.start = function () {
        var _this = this;
        this.requestBase();
        var task = new CronJob('0 13,19 * * *', function () {
            _this.requestBase();
        }, false);
        task.start();
    };
    DbCronUpdate.prototype.requestBase = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var collectionAddresses, requestStream, parserStream, processingStream, errorHandler;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.counter = 0;
                collectionAddresses = this.db.collection(ADDRESSES_COLLECTION_NAME);
                requestStream = request.get({ url: url, json: true });
                parserStream = JSONStream.parse('*');
                processingStream = new Writable({
                    write: function (object, encoding, callback) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var item;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    item = this.transformFlatItem(object);
                                    if (!(item != null)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, collectionAddresses.insert(item)];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2:
                                    callback();
                                    return [2 /*return*/];
                            }
                        });
                    }); },
                    objectMode: true,
                });
                errorHandler = function (err, name) {
                    var errorText = name + " error. " + (new Date()) + " DB UPDATE FAILED WITH ERROR: " + err + ";";
                    console.log(errorText, err);
                };
                requestStream
                    .on('error', function (err) { return errorHandler(err, 'requestStream'); })
                    .on('response', function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("DB update request " + (new Date()) + ", response status code " + res.statusCode + ";");
                                if (!(res.statusCode === 200)) return [3 /*break*/, 2];
                                return [4 /*yield*/, collectionAddresses.remove({})];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); })
                    .on('end', function () { return console.log("requestStream is ended " + (new Date()) + ";"); })
                    .pipe(parserStream)
                    .on('error', function (err) { return errorHandler(err, 'parserStream'); })
                    .pipe(processingStream)
                    .on('error', function (err) { return errorHandler(err, 'processingStream'); });
                processingStream.on('finish', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        try {
                            console.log("processingStream is finished " + (new Date()) + "; DB HAS BEEN UPDATED; flats count: " + this.counter);
                        }
                        catch (err) {
                            errorHandler(err, 'test base rename');
                        }
                        return [2 /*return*/];
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    DbCronUpdate.prototype.transformFlatItem = function (object) {
        if (('Article' in object) && !object.Article.startsWith('НТМ')) {
            return;
        }
        var _a = this.parseArticle(object.Article), house = _a.house, section = _a.section, floor = _a.floor, flat = _a.flat;
        var itemflat = {
            house: house,
            section: section,
            floor: floor,
            rooms: object.IsEuro === '1' ? 1 : Number(object.Rooms),
            flat: flat,
            status: object.StatusCode,
            statusName: object.StatusCodeName,
            decoration: object.Finishing,
            decorationName: object.Decoration,
            separateentrance: (object.SeparateEntrance === '1'),
            terrasescount: (Number(object.TerrasesCount) > 0),
            roofexit: (object.RoofExit === '1'),
            twolevel: (object['2level'] === '1'),
            space: Number(object.Quantity),
            price: Number(object.Sum),
            deliveryDate: object.DeliveryPeriodDate,
            article: object.Article
        };
        this.counter++;
        return itemflat;
    };
    DbCronUpdate.prototype.parseArticle = function (article) {
        // НТМ-03-01-04-02-018
        var _a = article.split('-'), houseStr = _a[1], sectionStr = _a[2], floorStr = _a[3], flatStr = _a[5];
        var _b = [houseStr, sectionStr, floorStr, flatStr].map(Number), house = _b[0], section = _b[1], floor = _b[2], flat = _b[3];
        return {
            house: house,
            section: section,
            floor: floor,
            flat: flat,
        };
    };
    return DbCronUpdate;
}());
export { DbCronUpdate };
//# sourceMappingURL=db-cron-update.utils.js.map