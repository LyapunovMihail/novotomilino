export const FormConfig = {
    price: {
        min: 1400000,
        max: 11000000
    },
    floor: {
        min: 2,
        max: 17
    },
    space: {
        min: 17,
        max: 120
    },
    sort: 'price_1',
    statusList: [
        {
            name: 'В продаже',
            value: '4'
        }, {
            name: 'Скоро в продаже',
            value: '1'
        }
    ],
    typePlan: [
        {
            name: 'Евро',
            value: '1'
        }
    ],
    typeList: [
        {
            name: 'Квартиры',
            value: 'КВ'
        },
        {
            name: 'Апартаменты',
            value: 'АП'
        }
    ],
    furniture: [
        {
            name: 'С мебелью',
            value: '1'
        }
    ],
    decorationList: [
        {
            name: 'Без отделки',
            value: '00'
        },
        {
            name: 'Черновая',
            value: '01'
        },
        {
            name: 'Чистовая',
            value: '03'
        }
    ],
    housesList: [
        {
            name: 'Все корпуса',
            value: 'all'
        },
        {
            name: 'Корпус 1',
            value: '1',
            disabled: false
        },
        {
            name: 'Корпус 2',
            value: '2',
            disabled: false
        },
        {
            name: 'Корпус 3',
            value: '3',
            disabled: false
        },
        {
            name: 'Корпус 9',
            value: '9',
            disabled: false
        }
    ]
};
