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
            name: 'квартиры',
            value: 'КВ'
        },
        {
            name: 'апартаменты',
            value: 'АП'
        }
    ],
    decorationList: [
        {
            name: 'без отделки',
            value: '00'
        },
        {
            name: 'черновая',
            value: '01'
        },
        {
            name: 'чистовая',
            value: '03'
        }
    ]
};
