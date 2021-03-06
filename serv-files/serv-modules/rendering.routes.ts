import { ADDRESSES_COLLECTION_NAME } from './addresses-api/addresses.interfaces';
import { AddressesModel } from './addresses-api/addresses.model';
import { floorCount } from './addresses-api/floor-count';
import { SERVER_CONFIGURATIONS } from './configuration';
import { DecorationModel } from './decoration-api/decoration.model';
import { MongoConnectionService } from './mongo-connection.service';
import { NEWS_COLLECTION_NAME } from './news-api/news.interfaces';
import { SHARES_COLLECTION_NAME } from './shares-api/shares.interfaces';
import { clientRender } from './utilits/client-render';
import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';
const ObjectId = require('mongodb').ObjectID;

export const ROUTES: any[] = [
    '/',
    '/about',
    '/favorites',
    '/documentation',
    '/agreement',
    '/seo',

    '/location/routes',
    '/location/office',
    '/location/infrastructure',

    {
        url: '/dynamic/:year/:month',
        handle: async (req: any, res: Response, next) => {
            await checkDynamicMonthAndYear(req, res, next);
        },
    },

    '/purchase/credit',
    '/purchase/installment',

    '/news-shares/all',
    '/news-shares/news/list',
    {
        url: '/news-shares/news/list/:id',
        handle: async (req: any, res: Response, next) => {
            const validId =  ObjectId.isValid(req.params.id);
            const news = (validId) ? await MongoConnectionService.getDb().connection.db.collection(NEWS_COLLECTION_NAME).findOne({ _id: ObjectId(req.params.id) }) : null;
            (news) ? next() : clientRender(req, res, 404, req.session);
        },
    },
    '/news-shares/shares/list/1',
    {
        url: '/news-shares/shares/list/1/:id',
        handle: async (req: any, res: Response, next) => {
            const validId =  ObjectId.isValid(req.params.id);
            const share = (validId) ? await MongoConnectionService.getDb().connection.db.collection(SHARES_COLLECTION_NAME).findOne({ _id: ObjectId(req.params.id) }) : null;
            (share) ? next() : clientRender(req, res, 404, req.session);
        },
    },

    '/decoration',
    {
        url: '/decoration/:type',
        handle: async (req: any, res: Response, next) => {
            if (req.type !== 'bedroom' || req.type !== 'kitchen' || req.type !== 'bathroom' || req.type !== 'hallway'
                || req.type !== 'living-rooms' || req.type !== 'places') {
                clientRender(req, res, 404, req.session);
            } else {
                next();
            }
        },
    },
    '/decoration/furniture',
    {
        url: '/decoration/furniture/type/:type/vendor/:vendor/room/:room',
        handle: async (req: any, res: Response, next) => {
            const completed = await checkDecorationFurnitureParams(req, res);
            if (completed) {
                next();
            }
        },
    },

    '/flats/popular',
    '/flats/plan',
    '/flats/search',
    '/flats/_search',
    '/flats/_search/**',
    '/flats/house',
    {
        url: '/flats/house/:house/section/:section/floor/:floor',
        handle: async (req: any, res: Response, next) => {
            const completed = await checkFlatsHouseSectionFloor(req, res);
            if (completed) {
                next();
            }
        },
    },
    {
        url: '/flats/house/:house/section/:section/floor/:floor/:type/:apartment',
        handle: async (req: any, res: Response, next) => {
            await checkFlatsApartment(req, res, next);
        },
    },
    '/flats/commercial/list',
    '/flats/commercial/plan',
    {
        url: '/flats/commercial/house/:house/section/:section/floor/:floor',
        handle: async (req: any, res: Response, next) => {
            const completed = await checkCommercialFlatsHouseSectionFloor(req, res);
            if (completed) {
                next();
            }
        },
    },
];

function checkDynamicMonthAndYear(req: any, res: Response, next) {
    if (req.params.month && req.params.year) {

        // ?????????????? ?????? ?????????????? ???? ???????????????????? ?????????? ?????????? ( ???????????????? ???????????????? ???????????????? )
        const month = req.params.month.replace(/[^0-9]/g, '');
        const year = req.params.year.replace(/[^0-9]/g, '');

        // ???????? ?? ?????????? ???????????????????? ???????? ??????????
        if ( month.length > 0 && year.length > 0
            // ?????????????????? 'year' ???? ???????????????????????? ?????????????????? ???? 2017???? ???? ???????????????? ????????
            && Number(year) >= 2019 && Number(year) <= Number(new Date().getFullYear())
            // ?????????????????? 'month' ???? ???????????????????????? ?????????????????? ???? 1 ???? 12
            && Number(month) >= 1 && Number(month) <= 12 ) {

            next();

            // ?????????? 404 ????????????
        } else {
            clientRender(req, res, 404, req.session);
        }
    } else {
        clientRender(req, res, 404, req.session);
    }
}

async function checkDecorationFurnitureParams(req, res: Response) {
    const decorationTypes = await new DecorationModel(MongoConnectionService.getDb().connection.db).getDecorationSliderData();
    const decorationType = decorationTypes.find((data) => data.type === req.params.type);
    if (!decorationType) {
        clientRender(req, res, 404, req.session);
        return false;
    }
    const vendorList = decorationType.vendors;
    const decorationVendor = vendorList.find((data) => data.vendor === req.params.vendor);
    if (!decorationVendor) {
        clientRender(req, res, 404, req.session);
        return false;
    }
    const furnitureList = decorationVendor.furniture;
    const furnitureItem = furnitureList.find((data) => data.rooms === Number(req.params.room));
    if (!isFinite(Number(req.params.room)) || !furnitureItem) {
        clientRender(req, res, 404, req.session);
        return false;
    }
    return true;
}

async function checkFlatsHouseSectionFloor(req: any, res: Response) {
    const dir = join(SERVER_CONFIGURATIONS.DIST_FOLDER, 'dist', 'desktop', 'assets', 'floor-plans', `house_${req.params.house}`,
        `section_${req.params.section}`, `floor_${req.params.floor}`, `sect_${req.params.section}_fl_${req.params.floor}.svg`);
    const floorSchemeExist = fs.existsSync(dir);
    if (!floorSchemeExist) {
        clientRender(req, res, 404, req.session);
        return false;
    }

    if (floorCount[req.params.house] && floorCount[req.params.house][req.params.section]
        && floorCount[req.params.house][req.params.section].some((floor) => floor === Number(req.params.floor))) {
        return true;
    } else {
        clientRender(req, res, 404, req.session);
        return false;
    }
}

async function checkFlatsApartment(req: any, res: Response, next) {
    const flats = await MongoConnectionService.getDb().connection.db.collection(ADDRESSES_COLLECTION_NAME).find(
        { house: Number(req.params.house), section: Number(req.params.section), floor: Number(req.params.floor), flat: Number(req.params.apartment) }).toArray();
    const flat = flats.find((item) => item.flat === Number(req.params.apartment));
    if (!flat) {
        clientRender(req, res, 404, req.session);
    } else if (req.params.type !== 'flat' && req.params.type !== 'office' && req.params.type !== 'storerooms' && req.params.type !== 'parking') {
        clientRender(req, res, 404, req.session);
    } else {
        next();
    }
}

async function checkCommercialFlatsHouseSectionFloor(req: any, res: Response) {
    const dir = join(SERVER_CONFIGURATIONS.DIST_FOLDER, 'dist', 'desktop', 'assets', 'floor-plans', `house_${req.params.house}`,
        `section_${req.params.section}`, `floor_${req.params.floor}`, `sect_${req.params.section}_fl_${req.params.floor}.svg`);
    const floorSchemeExist = fs.existsSync(dir);
    if (!floorSchemeExist) {
        clientRender(req, res, 404, req.session);
        return false;
    }

    if (floorCount[req.params.house] && floorCount[req.params.house][req.params.section]
        && (req.params.floor === '0' || req.params.floor === '1')) {
        return true;
    } else {
        clientRender(req, res, 404, req.session);
        return false;
    }
}
