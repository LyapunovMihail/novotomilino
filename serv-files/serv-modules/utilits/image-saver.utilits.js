var _this = this;
import * as tslib_1 from "tslib";
import * as fs from 'fs';
import * as graphicsmagic from 'gm';
import * as writeFile from 'write';
import * as dateFormat from 'dateformat';
var gm = graphicsmagic.subClass({ graphicsMagick: true });
var randomInteger = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
};
var fileName = function () {
    var date = dateFormat(new Date(), 'yyyy-mm-dd-HH-MM-ss-ms');
    var random = randomInteger(1000, 2000);
    return ("date" + date + "_random" + random);
};
export var fileExtension = function (originalFilename) {
    return originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase();
};
export var imageSaver = function (req, path, quality) {
    // генерация названия файла
    // будет иметь вид 2017-9-19-13-17-13-260.jpg
    var name = fileName();
    // расширение в нижнем регистре
    var fileFormat = fileExtension(req.files['file'].originalFilename);
    // полное имя файла
    var fullName = "" + name + fileFormat;
    // чтение файла из реквеста
    var data = fs.readFileSync(req.files['file'].path);
    return new Promise(function (resolve, reject) {
        // запись файла
        writeFile("" + path + fullName, data, function (err) {
            if (err) {
                reject(err);
            }
            // обработка файла утилитой graphicsmagic
            gm("" + path + fullName).strip().interlace('Line').quality(quality).write(path + "/" + fullName, function (error) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (error) {
                        reject(error);
                    }
                    resolve(fullName);
                    return [2 /*return*/];
                });
            }); });
        });
    });
};
export var thumbnailSaver = function (req, path, size) {
    // генерация названия файла
    // будет иметь вид 2017-9-19-13-17-13-260.jpg
    var name = "thumbnail-" + fileName();
    // расширение в нижнем регистре
    var fileFormat = fileExtension(req.files['file'].originalFilename);
    // полное имя файла
    var fullName = "" + name + fileFormat;
    // чтение файла из реквеста
    var data = fs.readFileSync(req.files['file'].path);
    return new Promise(function (resolve, reject) {
        // запись файла
        writeFile("" + path + fullName, data, function (err) {
            if (err) {
                reject(err);
            }
            // обработка файла утилитой graphicsmagic
            gm("" + path + fullName).thumb(size.width, size.height, path + "/" + fullName, 100, function (error) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    if (error) {
                        reject(error);
                    }
                    resolve(fullName);
                    return [2 /*return*/];
                });
            }); });
        });
    });
};
//# sourceMappingURL=image-saver.utilits.js.map