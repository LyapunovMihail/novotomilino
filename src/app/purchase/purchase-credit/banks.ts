export const BANKS: Banks[] = [
    {
        name: 'Сбербанк',
        cssclass: 'sber',
        image: '/assets/img/purchase/credit/sberb_logo.svg'
    },
    {
        name: 'Альфа-Банк',
        cssclass: 'alfa',
        image: '/assets/img/purchase/credit/alfa_logo.svg'
    },
    {
        name: 'ВТБ',
        cssclass: 'vtb',
        image: '/assets/img/purchase/credit/vtb_logo.svg'
    },
    {
        name: 'Райффайзенбанк',
        cssclass: 'raif',
        image: '/assets/img/purchase/credit/raif_logo.svg'
    },
    {
        name: 'Почта Банк',
        cssclass: 'pocht',
        image: '/assets/img/purchase/credit/pocht_logo.svg'
    },
    {
        name: 'ВОЗРОЖДЕНИЕ БАНК',
        cssclass: 'ress',
        image: '/assets/img/purchase/credit/ress_logo.svg'
    },
    {
        name: 'УРАЛСИБ БАНК',
        cssclass: 'ural',
        image: '/assets/img/purchase/credit/ural_logo.svg'
    },
    {
        name: 'Тинькофф',
        cssclass: 'tink',
        image: '/assets/img/purchase/credit/tink_logo.svg'
    },
    {
        name: 'Открытие',
        cssclass: 'open',
        image: '/assets/img/purchase/credit/open_logo.svg'
    },
    {
        name: 'ДОМ РФ',
        cssclass: 'dom',
        image: '/assets/img/purchase/credit/dom_logo.svg'
    },
    {
        name: 'Металлинвестбанк',
        cssclass: 'iron',
        image: '/assets/img/purchase/credit/iron_logo.svg'
    },
    {
        name: 'БАНК ЗЕНИТ',
        cssclass: 'zenit',
        image: '/assets/img/purchase/credit/zenit_logo.svg'
    },
    {
        name: 'РоссельхозБанк',
        cssclass: 'ross',
        image: '/assets/img/purchase/credit/ross_logo.svg'
    },
];

export interface Banks {
  name: string;
  cssclass: string;
  image: string;
}
