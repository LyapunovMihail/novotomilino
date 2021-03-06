
export interface IProjectItem {
    link: string;
    city: string;
    distance: string;
    addDistance: boolean;
    title: string;
    subtitle: string;
    background: string;
    mod: string;
    classIndex: string;
    ilike: boolean;
}

export interface IAboutMarker {
    title: string;
    subtitle: string;
}

export interface IGenplanMarker {
    title: string;
    mod: string;
}

export let GENPLAN_MARKERS: IGenplanMarker[] = [
    {
        title: 'Детский сад',
        mod: 'kinder'
    }, {
        title: 'Школа',
        mod: 'school'
    }, {
        title: 'Детский сад',
        mod: 'kinder'
    }, {
        title: 'Остановка «Птицефабрика»',
        mod: 'stop'
    }, {
        title: 'Торговый центр',
        mod: 'shop'
    }, {
        title: 'Стадион урожай',
        mod: 'sport'
    }, {
        title: 'Поликлиника',
        mod: 'pharmacy'
    }
];

export let ABOUT_MARKERS: IAboutMarker[] = [
    {
        title: 'Общая площадь ЖК',
        subtitle: '115 825 м²'
    }, /* {
        title: 'Количество мест в школе №19',
        subtitle: '550'
    },*/ {
        title: 'Общая площадь квартир',
        subtitle: '78 873 м²'
    }, {
        title: 'Окончание строительства',
        subtitle: '2022 г.'
    }, {
        title: 'Количество квартир',
        subtitle: '2147'
    }, /* {
        title: 'Окончание строительства 2 очереди',
        subtitle: '2021 г.'
    },*/ {
        title: 'Площадь нежилых помещений',
        subtitle: '7 403 м²'
    }
];

export let PROJECT_MARKERS: IProjectItem[] = [
    {
        link: 'https://oblaka.ilike.ru/',
        city: 'г. Люберцы',
        distance: '5 км от МКАД',
        addDistance: true,
        title: 'Облака',
        subtitle: 'Квартиры от 2,3 млн. руб.',
        background: '/assets/img/about/project/oblaka.jpg',
        mod: '',
        classIndex: 'grid-item_one',
        ilike: true,
    }, {
        link: 'https://nk.ilike.ru/',
        city: 'Люберецкий р-н, пос. Красково',
        distance: '13 км от МКАД',
        addDistance: true,
        title: 'Новокрасково',
        subtitle: 'Квартиры от 2,2 млн. руб.',
        background: '/assets/img/about/project/nk.jpg',
        mod: '',
        classIndex: '',
        ilike: true,
    }, {
        link: 'https://barvihadom.ru/',
        city: 'г. Москва, Барвихинская улица, вл. 6',
        distance: '',
        addDistance: false,
        title: 'Дом на Барвихинской',
        subtitle: 'Квартиры от 6,3 млн. руб.',
        background: '/assets/img/about/project/barviha.jpg',
        mod: 'grid-item__location-city_barviha',
        classIndex: '',
        ilike: true,
    }, {
        link: 'https://residence.gorodmay.ru/',
        city: 'Ленинский р-н, пос. Горки Ленинские',
        distance: '10 км от МКАД',
        addDistance: true,
        title: 'Резиденция Май',
        subtitle: 'Квартиры от 3,8 млн. руб.',
        background: '/assets/img/about/project/may.jpg',
        mod: '',
        classIndex: '',
        ilike: true,
    }, {
        link: 'https://vb2.ilike.ru/',
        city: 'г. Видное',
        distance: '7,5 км от МКАД',
        addDistance: true,
        title: 'Видный Берег 2',
        subtitle: 'Скоро в продаже',
        background: '/assets/img/about/project/vb2.jpg',
        mod: '',
        classIndex: 'grid-item_five',
        ilike: true,
    }, {
        link: 'https://vbdom.ru/',
        city: 'Московская обл., Ленинский р-н, восточнее дер. Ермолино',
        distance: '10 км от МКАД',
        addDistance: true,
        title: 'Видный Берег',
        subtitle: 'Квартиры от 3,2 млн. руб.',
        background: '/assets/img/about/project/vb.jpg',
        mod: '',
        classIndex: '',
        ilike: false,
    }
];
