import * as tslib_1 from "tslib";
import { Controller, Get, Param, Res, } from '@nestjs/common';
import * as fs from 'fs';
import { uploadsRootPath } from '../utilits/uploads-root-path';
var UploadsController = /** @class */ (function () {
    function UploadsController() {
    }
    UploadsController.prototype.uploadedFiles = function (path, image, res) {
        var file = "uploads/" + path + "/" + image;
        if (fs.existsSync(uploadsRootPath(file))) {
            res.status(200).sendFile(uploadsRootPath(file));
        }
        else {
            console.log(uploadsRootPath(file));
            res.status(404).json({ message: "file: " + uploadsRootPath(file) + "  does not exist" });
        }
    };
    tslib_1.__decorate([
        Get('/:path/:image'),
        tslib_1.__param(0, Param('path')), tslib_1.__param(1, Param('image')), tslib_1.__param(2, Res()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], UploadsController.prototype, "uploadedFiles", null);
    UploadsController = tslib_1.__decorate([
        Controller('uploads')
    ], UploadsController);
    return UploadsController;
}());
export { UploadsController };
//# sourceMappingURL=uploads.controller.js.map