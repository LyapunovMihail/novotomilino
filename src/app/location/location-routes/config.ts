

export let destination = [55.65618531858043, 37.92175475135617]; // Вот сюда сходятся все пути от контрольных точек

export let markersConfig = [
    {
        coords: [55.715760, 37.816980],
        size: [30, 46],
        offset: [-15, -46],
        zIndex: 0,
        class: 'marker-content marker-content_active',
        content: 1,
        tooltip: '',
        lineCoords : [
            [55.716199, 37.816873],
            [55.713813, 37.824018],
            [55.710175, 37.834825],
            [55.707497, 37.842641],
            [55.705493, 37.848483],
            [55.703703, 37.853627],
            [55.702486, 37.856508],
            [55.700901, 37.859813],
            [55.699608, 37.862336],
            [55.698272, 37.864975],
            [55.696439, 37.868617],
            [55.694910, 37.871639],
            [55.693556, 37.874225],
            [55.691761, 37.877582],
            [55.690893, 37.879237],
            [55.689667, 37.882622],
            [55.689113, 37.883952],
            [55.688219, 37.885653],
            [55.686006, 37.889392],
            [55.684884, 37.892078],
            [55.683439, 37.894915],
            [55.682578, 37.896675]
        ],
        text: 'На электричке от ст. м. Выхино, 10 минут',
        type: 'polyline'
    },
    {
        coords: [55.65530489185195, 37.954711361935246],
        size: [30, 46],
        offset: [0, -10],
        zIndex: 0,
        class: 'marker-content marker-content__bus',
        content: 2,
        tooltip: '',
        route: {
            origin: [[55.655325, 37.954210]],
            color: 'rgba(46,46,46,.6)',
            activeColor: 'rgb(46,46,46)'
        },
        text: 'Москва-Голутвин / Москва-47км до ст. Томилино',
        type: 'bus'
    }, {
        coords: [55.69964259049116, 37.853376418882235],
        size: [30, 46],
        offset: [0, -16],
        zIndex: 0,
        class: 'marker-content marker-content__bus',
        content: 3,
        tooltip: '',
        route: {
            origin: [[55.69964259049116, 37.853376418882235]],
            color: 'rgba(46,46,46,.6)',
            activeColor: 'rgb(46,46,46)'
        },
        text: 'Лермонтовский проспект Автобусы 323, 463; Маршрутки 393к, 534к; 25 мин',
        type: 'bus'
    }, {
        coords: [55.70394904600352, 37.833339779295756],
        size: [30, 46],
        offset: [0, -15],
        zIndex: 1,
        class: 'marker-content marker-content__auto',
        content: 5,
        tooltip: '',
        route: {
            origin: [[55.703891, 37.833485]],
            color: 'rgba(131,112,165,.6)',
            activeColor: 'rgb(131,112,165)'
        },
        text: 'От МКАД через Октябрьский пр-т 12 мин 6,5 км',
        type: 'auto'
    }, {
        coords: [55.683909, 37.838216], // Координаты отметки местоположения маркера
        size: [30, 46],
        offset: [0, -20],
        zIndex: 0,
        class: 'marker-content marker-content__auto',
        content: 6,
        tooltip: '',
        route: {
            origin: [[55.683909, 37.838216]], // Начало линии откуда простраивается путь
            color: 'rgba(131,112,165,.6)',
            activeColor: 'rgb(131,112,165)'
        },
        text: 'От МКАД через Новорязанское шоссе; 13 км; 25 мин',
        type: 'auto'
    }, {
        coords: [55.714603, 37.807055], // Координаты отметки местоположения маркера
        size: [30, 46],
        offset: [0, -20],
        zIndex: 0,
        class: 'marker-content marker-content__auto',
        content: 7,
        tooltip: '',
        route: {
            origin: [[55.714603, 37.807055]], // Начало линии откуда простраивается путь
            color: 'rgba(131,112,165,.6)',
            activeColor: 'rgb(131,112,165)'
        },
        text: 'МКАД (через Октябрьский пр.) - 8 км, 20 мин',
        type: 'auto'
    }, {
        coords: [55.698534, 37.801632], // Координаты отметки местоположения маркера
        size: [30, 46],
        offset: [0, -20],
        zIndex: 0,
        class: 'marker-content marker-content__auto',
        content: 8,
        tooltip: '',
        route: {
            origin: [[55.698534, 37.801632]], // Начало линии откуда простраивается путь
            color: 'rgba(131,112,165,.6)',
            activeColor: 'rgb(131,112,165)'
        },
        text: 'МКАД (через Новорязанское ш.) - 13 км, 25 мин',
        type: 'auto'
    }, {
        coords: [55.674105, 37.859445],
        size: [30, 46],
        offset: [0, -16],
        zIndex: 0,
        class: 'marker-content marker-content__bus',
        content: 9,
        tooltip: '',
        route: {
            origin: [[55.674105, 37.859445]],
            color: 'rgba(46,46,46,.6)',
            activeColor: 'rgb(46,46,46)'
        },
        text: 'ост. м. Котельники (15 минут на маршрутке: 44,45,13)',
        type: 'bus'
    }, {
        coords: [55.700748, 37.852449],
        size: [30, 46],
        offset: [0, -16],
        zIndex: 0,
        class: 'marker-content marker-content__bus',
        content: 10,
        tooltip: '',
        route: {
            origin: [[55.700658, 37.852339]],
            color: 'rgba(46,46,46,.6)',
            activeColor: 'rgb(46,46,46)'
        },
        text: 'ост. м. Лермонтовский проспект (16 мин. на автобусе: 323, 463 или на маршрутке: 393к, 534к)',
        type: 'bus'
    }, {
        coords: [55.703089, 37.927246],
        size: [30, 46],
        offset: [0, -16],
        zIndex: 0,
        class: 'marker-content marker-content__bus',
        content: 11,
        tooltip: '',
        route: {
            origin: [[55.703089, 37.927246]],
            color: 'rgba(46,46,46,.6)',
            activeColor: 'rgb(46,46,46)'
        },
        text: 'ост. м. Некрасовка (20 мин. на автобусе: 22, 25, 41 или на маршрутке: 23, 32, 33к, 75к)',
        type: 'bus'
    }, {
        coords: [55.659205, 37.928199],
        size: [30, 46],
        offset: [0, -16],
        zIndex: 0,
        class: 'marker-content marker-content__bus',
        content: 12,
        tooltip: '',
        route: {
            origin: [[55.659205, 37.928199], [55.659205, 37.928199]],
            color: 'rgba(46,46,46,.6)',
            activeColor: 'rgb(46,46,46)'
        },
        text: 'ост. ж/д ст. Томилино (7 минут на маршрутке 50к, 25 минут пешком)',
        type: 'bus'
    }, {
        coords: [55.656355158866056, 37.9214221574383],
        size: [50, 74],
        offset: [-20, -20],
        zIndex: 0,
        class: 'marker-content marker-content__main-marker',
        content: '',
        tooltip: '',
        title: 'ЖК Новотомилино',
        text: 'Люберцы городской округ, Томилино пгт',
        type: 'main'
    }
];
