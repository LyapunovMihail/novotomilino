export const CREDIT_COLLECTION_NAME = 'credit';

export const CREDIT_UPLOADS_PATH = 'uploads/credit/';

export interface ICreditSnippet {
    _id?: any;
    image: string;
    percent: string;
    category: SnippetCategoryEnum;
    initial: string;
    created_at: string;
}

export enum SnippetCategoryEnum {
    BASE = 'base',
    MILITARY = 'military'
}
