export const FormConfig = {
    price: {
        min: 6000000,
        max: 18000000
    },
    floor: {
        min: 2,
        max: 10
    },
    space: {
        min: 30,
        max: 100
    },
    sort: 'floor_1',
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
    ]
};
