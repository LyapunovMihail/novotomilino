export const HOME_COLLECTION_NAME = 'home';

export interface IHomePreview {
    _id: any;
    title: string;
    description: string;
}
export interface IHomeDescription {
    _id: any;
    description: string;
}

export interface IHomeVideo {
    _id: any;
    name: string;
    link: string;
    show: boolean;
}