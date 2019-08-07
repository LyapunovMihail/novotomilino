export const BANKS: Banks[] = [
    {
        name: 'Сбербанк',
        cssclass: 'sber',
        image: '/assets/img/purchase/credit/sberb_logo_bage.svg'
    },
    {
        name: 'Альфа-Банк',
        cssclass: 'alfa',
        image: '/assets/img/purchase/credit/alfa_logo_bage.svg'
    },
    {
        name: 'ВТБ',
        cssclass: 'vtb',
        image: '/assets/img/purchase/credit/vtb_logo_bage.svg'
    },
    {
        name: 'Райффайзенбанк',
        cssclass: 'raif',
        image: '/assets/img/purchase/credit/raif_logo_bage.svg'
    },
    {
        name: 'Почта Банк',
        cssclass: 'pocht',
        image: '/assets/img/purchase/credit/pocht_logo_bage.jpg'
    },
    {
        name: 'ВОЗРОЖДЕНИЕ БАНК',
        cssclass: 'ress',
        image: '/assets/img/purchase/credit/ress_logo_bage.jpg'
    },
    {
        name: 'УРАЛСИБ БАНК',
        cssclass: 'ural',
        image: '/assets/img/purchase/credit/ural_logo_bage.svg'
    },
    {
        name: 'Тинькофф',
        cssclass: 'tink',
        image: '/assets/img/purchase/credit/tink_logo_bage.jpg'
    },
    {
        name: 'Открытие',
        cssclass: 'open',
        image: '/assets/img/purchase/credit/open_logo_bage.jpg'
    },
    {
        name: 'ДОМ РФ',
        cssclass: 'dom',
        image: '/assets/img/purchase/credit/dom_logo_bage.jpg'
    },
    {
        name: 'Металлинвестбанк',
        cssclass: 'iron',
        image: '/assets/img/purchase/credit/iron_logo_bage.jpg'
    },
    {
        name: 'БАНК ЗЕНИТ',
        cssclass: 'zenit',
        image: '/assets/img/purchase/credit/zenit_logo_bage.jpg'
    },
    {
        name: 'РоссельхозБанк',
        cssclass: 'ross',
        image: '/assets/img/purchase/credit/ross_logo_bage.jpg'
    },
];

export interface Banks {
  name: string;
  cssclass: string;
  image: string;
}
