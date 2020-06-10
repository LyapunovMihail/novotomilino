import * as tslib_1 from "tslib";
import { Controller, Get, Param, Req, Res, Session, } from '@nestjs/common';
import { clientRender } from '../utilits/client-render';
var PagesController = /** @class */ (function () {
    function PagesController() {
    }
    PagesController.prototype.setDevice = function (device, req, res, session) {
        session.onlyDesktop = (device === 'desktop') ? true : false;
        res.json({ result: 'ok' });
    };
    PagesController.prototype.renderPage = function (req, res, session) {
        clientRender(req, res, 200, session);
    };
    tslib_1.__decorate([
        Get('/api/agent/:device'),
        tslib_1.__param(0, Param('device')), tslib_1.__param(1, Req()), tslib_1.__param(2, Res()), tslib_1.__param(3, Session()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object, Object, Object, Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], PagesController.prototype, "setDevice", null);
    tslib_1.__decorate([
        Get('*'),
        tslib_1.__param(0, Req()), tslib_1.__param(1, Res()), tslib_1.__param(2, Session()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], PagesController.prototype, "renderPage", null);
    PagesController = tslib_1.__decorate([
        Controller()
    ], PagesController);
    return PagesController;
}());
export { PagesController };
//# sourceMappingURL=pages.controller.js.map