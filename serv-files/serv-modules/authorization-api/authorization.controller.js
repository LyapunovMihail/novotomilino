import * as tslib_1 from "tslib";
import { userSchema } from './authorization.schema';
import { AUTHORIZATION_COLLECTION_NAME, USER_ID, } from './authorization.config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { Controller, Next, Post, Req, Res, } from '@nestjs/common';
import { MongoConnectionService } from '../mongo-connection.service';
var AuthorizationController = /** @class */ (function () {
    function AuthorizationController(mongoConnectionService) {
        this.mongoConnectionService = mongoConnectionService;
        this.salt = bcrypt.genSaltSync(10);
        this.db = this.mongoConnectionService.getDb();
        this.model = this.db.model(AUTHORIZATION_COLLECTION_NAME, userSchema);
    }
    // При попытке авторизации проверяем наличие user с _id : USER_ID.
    // При первой попытке в базе объекта не будет,
    // поэтому создаем нового пользователя с принятыми
    // login и password
    AuthorizationController.prototype.login = function (login, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var user, bcr, token, hash, newUser, token;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // если логин и пароль не строки, сразу возвращаем ответ о не удачной попытке
                        if (!(typeof login === 'string' && typeof password === 'string')) {
                            return [2 /*return*/, { result: false }];
                        }
                        return [4 /*yield*/, this.model.findOne({ _id: USER_ID })];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 2];
                        bcr = bcrypt.compareSync(password, user.password);
                        if (bcr) {
                            token = jwt.sign({ user: user, password: password }, 'secret', { expiresIn: 7200 });
                            return [2 /*return*/, { result: true, token: token, message: 'success login' }];
                        }
                        else {
                            // если нет, отдаем ошибку
                            return [2 /*return*/, { result: false }];
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        hash = bcrypt.hashSync(password, this.salt);
                        newUser = { _id: USER_ID, login: login, password: hash };
                        return [4 /*yield*/, this.model.create(newUser)];
                    case 3:
                        _a.sent();
                        token = jwt.sign({ user: newUser, password: password }, 'secret', { expiresIn: 7200 });
                        return [2 /*return*/, { result: true, token: token, message: 'user just create' }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthorizationController.prototype.verify = function (token) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, user;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, jwt.verify(token, 'secret')];
                    case 1:
                        data = _a.sent();
                        return [4 /*yield*/, this.model.findOne({ _id: USER_ID, login: data.user.login, password: data.user.password })];
                    case 2:
                        user = _a.sent();
                        if (user) {
                            return [2 /*return*/, true];
                        }
                        throw new Error('Пользователь не найден');
                }
            });
        });
    };
    AuthorizationController.prototype.reviuseToken = function (token) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, user;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, jwt.verify(token, 'secret')];
                    case 1:
                        data = _a.sent();
                        return [4 /*yield*/, this.model.findOne({ _id: USER_ID, login: data.user.login, password: data.user.password })];
                    case 2:
                        user = _a.sent();
                        if (user) {
                            return [2 /*return*/, { result: true, token: token, message: 'success login' }];
                        }
                        throw new Error('Пользователь не найден');
                }
            });
        });
    };
    AuthorizationController.prototype.authorization = function (req, res) {
        // если в реквесте есть поля: body, login, password
        // то передаем управление контроллеру
        if ('body' in req && 'login' in req.body && 'password' in req.body) {
            this.login(req.body.login, req.body.password).then(function (result) {
                if (result.result) {
                    res.json(result);
                }
                else {
                    res.status(401).json({ message: 'failed login' });
                }
            }).catch(function (err) {
                res.status(500).json({ message: err });
            });
            // в остальных случаях отдаем ответ об ошибке авторизации
        }
        else {
            res.status(401).json({ message: 'failed login' });
        }
    };
    AuthorizationController.prototype.reviusetoken = function (req) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reviuseToken(req.body.token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AuthorizationController.prototype.adminVerify = function (req, res, next) {
        console.log('admin path');
        this.verify(req.headers.token).then(function () {
            next();
        }).catch(function (err) {
            res.status(403).json({
                message: 'Forbidden',
                error: err,
            });
        });
    };
    tslib_1.__decorate([
        Post('/authorization'),
        tslib_1.__param(0, Req()), tslib_1.__param(1, Res()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object, Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], AuthorizationController.prototype, "authorization", null);
    tslib_1.__decorate([
        Post('/reviusetoken'),
        tslib_1.__param(0, Req()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object]),
        tslib_1.__metadata("design:returntype", Promise)
    ], AuthorizationController.prototype, "reviusetoken", null);
    tslib_1.__decorate([
        Post('/admin/*'),
        tslib_1.__param(0, Req()), tslib_1.__param(1, Res()), tslib_1.__param(2, Next()),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
        tslib_1.__metadata("design:returntype", void 0)
    ], AuthorizationController.prototype, "adminVerify", null);
    AuthorizationController = tslib_1.__decorate([
        Controller('/api'),
        tslib_1.__metadata("design:paramtypes", [MongoConnectionService])
    ], AuthorizationController);
    return AuthorizationController;
}());
export { AuthorizationController };
//# sourceMappingURL=authorization.controller.js.map