var _this = this;
import * as tslib_1 from "tslib";
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
describe('AppController (e2e)', function () {
    var app;
    beforeAll(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var moduleFixture;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Test.createTestingModule({
                        imports: [AppModule],
                    }).compile()];
                case 1:
                    moduleFixture = _a.sent();
                    app = moduleFixture.createNestApplication();
                    return [4 /*yield*/, app.init()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('/ (GET)', function () {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    });
});
//# sourceMappingURL=app.e2e-spec.js.map