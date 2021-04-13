import { ADDRESSES_COLLECTION_NAME, IAddressItemFlat } from './addresses.interfaces';
import * as mongodb from 'mongodb';
import { FormConfig } from './search-form.config';
const ObjectId = require('mongodb').ObjectID;

export class AddressesModel {

    private collectionName = ADDRESSES_COLLECTION_NAME;

    private collection: any;

    private objectId = mongodb.ObjectId;

    constructor( public db: any ) {
        this.collection = db.collection(this.collectionName);
    }

    public async getObjects(query) {
        let data = this.parseRequest(query);
        return await this.collection.find(data.request, data.parameters).toArray();
    }

    public async getObjectsWithCount(query) {
        let data = this.parseRequest(query);
        return {
            count: await this.collection.find(data.request, data.parameters).count(),
            flats: await this.collection.find(data.request, data.parameters).toArray()
        };
    }

    public async getObjectsByHousesAndNumbers(body) {
        return await this.collection.find({house: {$in: body.flatsData.houses}, flat: {$in: body.flatsData.numbers}}).toArray();
    }

    public async getHouseChess() {
        const flats = await this.collection.find({type: 'КВ'}).toArray();
        const chess: any = {};

        flats.forEach((flat: IAddressItemFlat) => {
            if (!chess[flat.house]) {
                chess[flat.house] = [];
            }

            let section = chess[flat.house][flat.section];
            if (!section) {
                section = new Array(flat.floorsInSection).fill([]); // Заполняем секцию этажами и этажи мок квартирами
                section.forEach((floor, i) => {
                    const mockFlat = {status: '-1', house: flat.house, section: flat.section, floor: section.length - i};
                    section[i] = new Array(flat.flatsInFloor).fill(mockFlat);
                });
                chess[flat.house][flat.section] = section;
            }

            const floor = section[section.length - flat.floor];
            const firstMockFlat = floor.findIndex((mockFlat) => mockFlat.status === '-1');  // Находим первую мок квартиру на этаже и меняем на настоящую
            floor[firstMockFlat] = flat;
        });

        return chess;
    }

    public parseRequest(query) {
        let request: any = {};

        if ('sections' in query && (/[1|2|3|4|5|6]/).exec(query.sections)) {
            request.section = { $in: query.sections.split(',').map(Number) };
        }
        if ('houses' in query && (/[1|2|3|9]/).exec(query.houses)) {
            request.house = { $in: query.houses.split(',').map(Number) };
        }
        if ('euro' in query) {
            
            if ('rooms' in query && (/[0|1|2|3|4]/).exec(query.rooms)) {
                const rooms = query.rooms.split(',').map(Number);
                const option = rooms.map( room => {
                    return { $and : [{ rooms: ++room, isEuro: '1' }] };
                });
                request = { ...request, $or: option };
            } else {
                request.isEuro = query.euro;
            }
        }
        if ( 'priceMin' in query && 'priceMax' in query ) {
            request.price = { $gte: Number(query.priceMin), $lte: Number(query.priceMax) };
        }
        if ( 'floorMin' in query && 'floorMax' in query ) {
            request.floor = { $gte: Number(query.floorMin), $lte: Number(query.floorMax) };
        }
        if ( 'spaceMin' in query && 'spaceMax' in query ) {
            request.space = { $gte: Number(query.spaceMin), $lte: Number(query.spaceMax) };
        }
        if ( 'floor' in query ) {
            request.floor = Number(query.floor);
        }
        if ( 'number' in query ) {
            request.flat = Number(query.number);
        }
        if ('type' in query && query.type.split(',').every((item) => FormConfig.typeList.some((i) => item === i.value))) {
            request.type = { $in: query.type.split(',')};
        }
        if ('status' in query && query.status.split(',').every((item) => FormConfig.statusList.some((i) => item === i.value))) {
            request.status = { $in: query.status.split(',')};
        }
        if ('decoration' in query && query.decoration.split(',').every((item) => FormConfig.decorationList.some((i) => item === i.value))) {
            const decMas = query.decoration.split(',');
            if (decMas.some((item) => item === '03')) { // Если в отделке присутствует чистовая, в её же состав входят и многие другие отделки, подключаем их к поиску
                decMas.push(...FormConfig.extraDecorationList.map((item) => item.value));
            }
            request.decoration = { $in: decMas};
        }
        if ('furniture' in query && query.furniture.split(',').every((item) => FormConfig.furniture.some((i) => item === i.value))) {
            request.furniture = {$ne: null};
        }

        let parameters = {};

        if ('skip' in query && 'limit' in query) {
            parameters = {
                skip : Number(query['skip']),
                limit : Number(query['limit'])
            };
        }

        if ('sort' in query && query.sort === 'price_1') {
            parameters['sort'] = { price : 1 };
        } else if ('sort' in query && query.sort === 'price_0') {
            parameters['sort'] = { price : -1 };
        } else if ('sort' in query && query.sort === 'space_1') {
            parameters['sort'] = { space : 1 };
        } else if ('sort' in query && query.sort === 'space_0') {
            parameters['sort'] = { space : -1 };
        } else if ('sort' in query && query.sort === 'floor_1') {
            parameters['sort'] = { floor : 1 };
        } else if ('sort' in query && query.sort === 'floor_0') {
            parameters['sort'] = { floor : -1 };
        } else if ('sort' in query && query.sort === 'delivery_1') {
            parameters['sort'] = { deliveryDate : 1 };
        } else if ('sort' in query && query.sort === 'delivery_0') {
            parameters['sort'] = { deliveryDate : -1 };
        }

        if ('flats' in query) {
            const arr = query.flats.split('s');
            const sectionsArray = [];
            for (let i = 1; i < arr.length; i++) {
              let sectionObj = {};
              if (arr[i].indexOf('-') >= 0) {
                sectionObj = {
                  section: arr[i].substring(0, arr[i].indexOf('-')),
                  flat: {$in: arr[i].substring(arr[i].indexOf('-') + 1).split(',')}
                };
              } else {
                sectionObj['section'] = arr[i].substring(0);
              }
              sectionsArray.push(sectionObj);
            }
            request = {
              $or: sectionsArray
            };
        }

        if ('euro' in query) {
            return {
                request,
                parameters
            };
        }

        let roomsQuery = {};

        if ('rooms' in query && (/[0|1|2|3|4]/).exec(query.rooms)) {
            /*
                Студии = студии+1Е, однушки = 1к+2Е, двушки = 2к+3Е, трешки = 3к
                Все также как и у 2Е, то есть 1Е это Rooms:1 + IsEuro:1, 3Е это Rooms:3 + IsEuro:1
            */
            const rooms = query.rooms.split(',').map(Number);
            const option = rooms.map(room => {
                if (room < 3) {
                    return { $or: [
                        { $and: [{ rooms: room, isEuro: '0' }] },
                        { $and: [{ rooms: ++room, isEuro: '1' }] },
                    ]};
                } else {
                    return { $and : [{ rooms: room, isEuro: '0' }] };
                }
            });
            roomsQuery = { $or: option };
        }
        request = { ...request, ...roomsQuery };

        return {
            request,
            parameters,
        };
    }

    public async getFavorites(session) {
        const flats = session.favoriteFlats ? session.favoriteFlats.filter(el => el.article.startsWith('НТМ')) : [];
        return flats ? flats : [];
    }

    public async setFavorites(session, flat) {

        if (session.favoriteFlats === undefined) {
            session.favoriteFlats = [];
        }

        const index = session.favoriteFlats.findIndex((item) => item.article === flat.article);
        if (index >= 0) {
            session.favoriteFlats.splice(index, 1);
        } else {
            session.favoriteFlats.push(flat);
        }

        return session.favoriteFlats;
    }

    public async refreshFavorites(session, flats) {
        session.favoriteFlats = flats;
        return 'OK';
    }

    public async getFlatByParams(query) {
        const params = {
            flat: Number(query.apartment),
            house: Number(query.house),
            floor: Number(query.floor),
            section: Number(query.section),
            type: query.type === 'flat' ? 'КВ' : 'КН',
        };
        const flat = await this.collection.findOne(params);
        return flat;
    }
}
