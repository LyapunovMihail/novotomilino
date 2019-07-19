

export let destination = [55.684853, 37.896472]

export let markersConfig = [
    {
        coords: [55.715760, 37.816980],
        size: [30, 46],
        offset: [-15, -46],
        zIndex: 0,
        class: 'marker-content marker-content--route marker-content--active',
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
    }, {
        coords: [55.674384, 37.859491],
        size: [30, 46],
        offset: [-15, -46],
        zIndex: 0,
        class: 'marker-content marker-content--route',
        content: 2,
        tooltip: '',
        route: {
            origin: [55.674384, 37.859491],
            color: 'rgba(46,46,46,.6)',
            activeColor: 'rgb(46,46,46)'
        },
        text: 'На маршрутном такси №40 и №9 от ст. м. Котельники, 15 минут',
        type: 'bus'
    }, {
        coords: [55.700760, 37.852744],
        size: [30, 46],
        offset: [-15, -46],
        zIndex: 0,
        class: 'marker-content marker-content--route',
        content: 3,
        tooltip: '',
        route: {
            origin: [55.700760, 37.852744],
            color: 'rgba(46,46,46,.6)',
            activeColor: 'rgb(46,46,46)'
        },
        text: 'На маршрутном такси №405 К от ст. м. Лермонтовский проспект, 16 мин',
        type: 'bus'
    }, {
        coords: [55.704881, 37.833872],
        size: [30, 46],
        offset: [-15, -46],
        zIndex: 0,
        class: 'marker-content marker-content--route marker-content--color',
        content: 4,
        tooltip: '',
        route: {
            origin: [55.704881, 37.833872],
            color: 'rgba(131,112,165,.6)',
            activeColor: 'rgb(131,112,165)'
        },
        text: 'От МКАД через Косинское шоссе 10 мин 5,5 км',
        type: 'auto'
    }, {
        coords: [55.703891, 37.833485],
        size: [30, 46],
        offset: [-15, -46],
        zIndex: 1,
        class: 'marker-content marker-content--route marker-content--color',
        content: 5,
        tooltip: '',
        route: {
            origin: [55.703891, 37.833485],
            color: 'rgba(131,112,165,.6)',
            activeColor: 'rgb(131,112,165)'
        },
        text: 'От МКАД через Октябрьский пр-т 12 мин 6,5 км',
        type: 'auto'
    }, {
        coords: [55.684020, 37.837029],
        size: [30, 46],
        offset: [-15, -46],
        zIndex: 0,
        class: 'marker-content marker-content--route marker-content--color',
        content: 6,
        tooltip: '',
        route: {
            origin: [55.684020, 37.837029],
            color: 'rgba(131,112,165,.6)',
            activeColor: 'rgb(131,112,165)'
        },
        text: 'От МКАД через Новорязанское шоссе 15 мин 7,4 км',
        type: 'auto'
    }, {
        coords: [55.663139, 37.958373],
        size: [50, 74],
        offset: [-25, -74],
        zIndex: 0,
        class: 'marker-content marker-content__main-marker',
        content: '',
        tooltip: '<div class="marker-content__tooltip"><div class="marker-content__tooltip-content"><p class="marker-content__tooltip-content-title">ЖК Новотомилино</p><p class="marker-content__tooltip-content-text">Люберцы городской округ, Томилино пгт</p></div></div>',
        type: ''
    },
];
