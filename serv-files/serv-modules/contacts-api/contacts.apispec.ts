import { CONTACTS_COLLECTION_NAME } from './contacts.interfaces';
import { ContactsModel } from './contacts.model';
import * as fixture from 'pow-mongodb-fixtures';
import { MongoClientConnection } from '../dataBase/db-connect';
import { ServerConfiguration } from '../server-configuration.test';
import * as request from 'request-promise';
import { Server } from '../express-app';

describe(`Тесты контроллера контактов.`, () => {
    let controller: ContactsModel;
    let connection;
    let mongodbConnection;
    let db;
    let collectionConf = {};
    collectionConf[CONTACTS_COLLECTION_NAME] = [];

    // создаётся база и загружаются исходные данные
    beforeAll(async(done) => {
        connection = await fixture.connect(ServerConfiguration.dbName, {
            host: ServerConfiguration.dbOrigin,
        });

        mongodbConnection = await new MongoClientConnection(ServerConfiguration.dbName,
            ServerConfiguration.dbOrigin, ServerConfiguration.dbPort);
        db = await mongodbConnection.connect();
        controller = new ContactsModel(db);
        connection.load(collectionConf, async (param) => {
            await controller.getInstance(db);
            done();
        });
    });

    // останавливается после каждого теста
    // уничтожается база
    afterEach( async (done) => {
        connection.clear(done);
    });

    describe('Тесты методов контроллера.', () => {

        describe('Тесты номера телефона.', async () => {

            xit('Редактирование номера телефона.', async () => {
                let test = await controller.updatePhone('test');
                expect(test.phone).toBe('test');
            });

        });

        describe('Тесты списка эл.почты.', () => {

            let mails = [];

            beforeEach( async () => {
                mails = await controller.setMail();
            });

            it('Получение эл. почты.', async () => {
                let test = await controller.getMail();
                expect(test.length).toBe(1);
            });

            it('Создание объекта эл. почты.', async () => {
                let test = await controller.setMail();
                expect(test.length).toBe(2);
            });

            it('Изменение статуса объекта.', async () => {
                let test = await controller.updateMail( mails[0]._id, mails[0].name, true );
                expect(test[0].status).toBe(true);
            });

            it('Изменение значения объекта.', async () => {
                let test = await controller.updateMail( mails[0]._id, 'test', mails[0].status );
                expect(test[0].name).toBe('test');
            });

            it('Удаление объекта эл. почты.', async () => {
                let test = await controller.deleteMail(mails[0]._id);
                expect(test.length).toBe(0);
            });
        });

    });

    describe('Тесты request номера телефона.', async () => {
        let server: Server;

        // стартует сервер
        beforeAll(async() => {
            server = await new Server(ServerConfiguration);
            await server.init();
        });

        // останавливается сервер
        afterAll(async() => {
            await server.close();
        });

        xit('Получение номера телефона', async () => {
            let test = await request.get('http://localhost:8081/api/contacts/phone', {json: true});
            expect(typeof test.phone === 'string').toBeTruthy();
        });

        it('Получение списка эл.почты', async () => {
            let test = await request.get('http://localhost:8081/api/contacts/mail/get', {json: true});
            expect(Array.isArray(test)).toBeTruthy();
        });

    });
});
