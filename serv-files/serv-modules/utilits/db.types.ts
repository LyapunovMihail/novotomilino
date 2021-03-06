export interface DbJsonObject {
    ArticleID: string;
    Article: string;
    Number: string;
    StatusCode: string;
    StatusCodeName: string;
    Quantity: string;
    Rooms: string;
    Sum: string;
    Finishing: string;
    Decoration: string;
    SeparateEntrance: string;
    RoofExit: string;
    '2level': string;
    TerrasesCount: string;
    IsEuro: string;
    ArticleTypeCode: string;
    articleSubTypeCode: string;
    DeliveryPeriodDate: string;
    SaleChars?: any[];
    planid: string;
}

export interface DbFurnitureItemsObject {
    id: string;
    itemId: string;
    itemName: string;
    itemsDefaultCount: string;
    itemPrice: string;
    chSalesId: string;
}
