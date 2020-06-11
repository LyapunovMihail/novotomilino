import * as tslib_1 from "tslib";
import { ADDRESSES_COLLECTION_NAME } from './addresses.interfaces';
import * as mongodb from 'mongodb';
import { FormConfig } from './search-form.config';
var ObjectId = require('mongodb').ObjectID;
var AddressesModel = /** @class */ (function () {
    function AddressesModel(db) {
        this.db = db;
        this.collectionName = ADDRESSES_COLLECTION_NAME;
        this.objectId = mongodb.ObjectId;
        this.collection = db.collection(this.collectionName);
    }
    AddressesModel.prototype.getObjects = function (query) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = this.parseRequest(query);
                        return [4 /*yield*/, this.collection.find(data.request, data.parameters).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AddressesModel.prototype.getObjectsWithCount = function (query) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        data = this.parseRequest(query);
                        _a = {};
                        return [4 /*yield*/, this.collection.find(data.request, data.parameters).count()];
                    case 1:
                        _a.count = _b.sent();
                        return [4 /*yield*/, this.collection.find(data.request, data.parameters).toArray()];
                    case 2: return [2 /*return*/, (_a.flats = _b.sent(),
                            _a)];
                }
            });
        });
    };
    AddressesModel.prototype.getObjectsByHousesAndNumbers = function (body) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection.find({ house: { $in: body.flatsData.houses }, flat: { $in: body.flatsData.numbers } }).toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AddressesModel.prototype.getSearchConfig = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var config;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.collection('flats-search-config').find({}).toArray()];
                    case 1:
                        config = _a.sent();
                        return [2 /*return*/, config];
                }
            });
        });
    };
    AddressesModel.prototype.parseRequest = function (query) {
        var request = {};
        if ('sections' in query && (/[1|2|3|4|5|6]/).exec(query.sections)) {
            request.section = { $in: query.sections.split(',').map(Number) };
        }
        if ('houses' in query && (/[1|2|3|9]/).exec(query.houses)) {
            request.house = { $in: query.houses.split(',').map(Number) };
        }
        if ('rooms' in query && (/[0|1|2|3|4]/).exec(query.rooms)) {
            request.rooms = { $in: query.rooms.split(',').map(Number) };
        }
        if ('priceMin' in query && 'priceMax' in query) {
            request.price = { $gte: Number(query.priceMin), $lte: Number(query.priceMax) };
        }
        if ('floorMin' in query && 'floorMax' in query) {
            request.floor = { $gte: Number(query.floorMin), $lte: Number(query.floorMax) };
        }
        if ('spaceMin' in query && 'spaceMax' in query) {
            request.space = { $gte: Number(query.spaceMin), $lte: Number(query.spaceMax) };
        }
        if ('floor' in query) {
            request.floor = Number(query.floor);
        }
        if ('number' in query) {
            request.flat = Number(query.number);
        }
        if ('type' in query && query.type.split(',').every(function (item) { return FormConfig.typeList.some(function (i) { return item === i.value; }); })) {
            request.type = { $in: query.type.split(',') };
        }
        if ('decoration' in query && query.decoration.split(',').every(function (item) { return FormConfig.decorationList.some(function (i) { return item === i.value; }); })) {
            request.decoration = { $in: query.decoration.split(',') };
        }
        var parameters = {};
        if ('skip' in query && 'limit' in query) {
            parameters = {
                skip: Number(query['skip']),
                limit: Number(query['limit'])
            };
        }
        if ('sort' in query && query.sort === 'price_1') {
            parameters['sort'] = { price: 1 };
        }
        else if ('sort' in query && query.sort === 'price_0') {
            parameters['sort'] = { price: -1 };
        }
        else if ('sort' in query && query.sort === 'space_1') {
            parameters['sort'] = { space: 1 };
        }
        else if ('sort' in query && query.sort === 'space_0') {
            parameters['sort'] = { space: -1 };
        }
        else if ('sort' in query && query.sort === 'floor_1') {
            parameters['sort'] = { floor: 1 };
        }
        else if ('sort' in query && query.sort === 'floor_0') {
            parameters['sort'] = { floor: -1 };
        }
        else if ('sort' in query && query.sort === 'delivery_1') {
            parameters['sort'] = { deliveryDate: 1 };
        }
        else if ('sort' in query && query.sort === 'delivery_0') {
            parameters['sort'] = { deliveryDate: -1 };
        }
        if ('flats' in query) {
            var arr = query.flats.split('s');
            var sectionsArray = [];
            for (var i = 1; i < arr.length; i++) {
                var sectionObj = {};
                if (arr[i].indexOf('-') >= 0) {
                    sectionObj = {
                        section: arr[i].substring(0, arr[i].indexOf('-')),
                        flat: { $in: arr[i].substring(arr[i].indexOf('-') + 1).split(',') }
                    };
                }
                else {
                    sectionObj['section'] = arr[i].substring(0);
                }
                sectionsArray.push(sectionObj);
            }
            request = {
                $or: sectionsArray
            };
        }
        return {
            request: request,
            parameters: parameters
        };
    };
    return AddressesModel;
}());
export { AddressesModel };
//# sourceMappingURL=addresses.model.js.map