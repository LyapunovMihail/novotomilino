import * as fs from 'fs';
import * as writeFile from 'write';
import * as dateFormat from 'dateformat';
var randomInteger = function (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
};
var fileName = function () {
    var date = dateFormat(new Date(), 'yyyy-mm-dd-HH-MM-ss-ms');
    var random = randomInteger(1000, 2000);
    return ("date" + date + "_random" + random);
};
var fileExtension = function (originalFilename) {
    return originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase();
};
export var fileSaver = function (req, path) {
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
            resolve(fullName);
        });
    });
};
//# sourceMappingURL=file-saver.utilits.js.map