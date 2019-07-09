
export interface IBuilderMarker {
    title: string;
    description: string;
    link: string;
    logo: string;
    image: string;
    mod: string;
    empty: boolean;
}

export interface IGenplanMarker {
    title: string;
    mod: string;
}

export let GENPLAN_MARKERS: IGenplanMarker[] = [
    {
        title: 'Парк Дубки',
        mod: 'dub'
    }, {
        title: 'Охраняемая территория',
        mod: 'sht'
    }, {
        title: 'Школа №1400 и дошкольное отделение',
        mod: 'scho'
    }, {
        title: 'Спортивная площадка',
        mod: 'sport'
    }, {
        title: 'Детская площадка',
        mod: 'child'
    }, {
        title: 'Супермаркет',
        mod: 'mag'
    }, {
        title: 'Въезд в подземный паркинг',
        mod: 'park'
    }, {
        title: 'Сколково',
        mod: 'skol'
    }, {
        title: 'ТЦ Вегас',
        mod: 'vegas'
    }
];

export let BUILDER_MARKERS: IBuilderMarker[] = [
    {
        title: 'ЖК «Облака»',
        description: 'Жилой комплекс комфорт-класса в<br>г. Люберецы',
        link: 'https://oblakadom.ru',
        logo: '/assets/img/about/builder/oblaka-logo.svg',
        image: '/assets/img/about/builder/oblaka-dom.jpg',
        mod: 'oblaka',
        empty: false
    }, {
        title: 'ЖК «Новокрасково»',
        description: 'Жилой комплекс на берегу озера в Люберецком районе',
        link: 'https://novokraskovo.ru/',
        logo: '/assets/img/about/builder/novo-logo.svg',
        image: '/assets/img/about/builder/novokraskogo-dom.jpg',
        mod: 'novo',
        empty: false
    }, {
        title: 'ЖК «Видный берег»',
        description: 'Жилой комплекс комфорт-класса на живописной окраине города Видное',
        link: 'http://vbdom.ru/',
        logo: '/assets/img/about/builder/bereg-logo.svg',
        image: '/assets/img/about/builder/vb-dom.jpg',
        mod: 'vb',
        empty: false
    }, {
        title: 'Резиденция «Май»',
        description: 'Уютные кварталы в ландшафтном парке заповедника Горки Ленинские',
        link: 'http://gorodmay.ru/',
        logo: '/assets/img/about/builder/may-logo.svg',
        image: '/assets/img/about/builder/may-dom.jpg',
        mod: 'may',
        empty: false
    }, {
        title: 'Дом на Барвихинской',
        description: 'Жилой дом бизнес-класса с подземной парковкой в Западном округе Москвы',
        link: '/',
        logo: '/assets/img/about/builder/barviha-logo.svg',
        image: '/assets/img/about/builder/barvihinskaya-dom.jpg',
        mod: 'barviha',
        empty: false
    },
    {
        title: 'ЖК «Академический»',
        description: '',
        link: '',
        logo: '',
        image: '/assets/img/about/builder/academicheskaya-dom.jpg',
        mod: 'academicheskaya',
        empty: false
    },
    {
        title: 'ЖК «Битцевские холмы»',
        description: '',
        link: '',
        logo: '',
        image: '/assets/img/about/builder/bh-dom.jpg',
        mod: 'bh',
        empty: false
    }
];
