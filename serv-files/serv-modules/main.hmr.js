import * as tslib_1 from "tslib";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
function bootstrap() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var app;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, NestFactory.create(AppModule)];
                case 1:
                    app = _a.sent();
                    return [4 /*yield*/, app.listen(3000)];
                case 2:
                    _a.sent();
                    if (module.hot) {
                        module.hot.accept();
                        module.hot.dispose(function () { return app.close(); });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap();
//# sourceMappingURL=main.hmr.js.map