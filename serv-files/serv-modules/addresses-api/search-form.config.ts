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
        { name: 'Евро', value: '1' }
    ],
    typeList: [
        { name: 'квартиры', value: 'КВ' },
        { name: 'апартаменты', value: 'АП' },
        { name: 'коммерческая недвижимость', value: 'КН' },
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
    ],
    extraDecorationList: [
        {
            name: 'рассвет',
            value: '03'
        },
        {
            name: 'ялта',
            value: '06'
        },
        {
            name: 'классика',
            value: '08'
        },
        {
            name: 'модерн',
            value: '09'
        },
        {
            name: 'венеция',
            value: '14'
        },
        {
            name: 'милан',
            value: '15'
        }
    ],
    housesList: [
        {
            name: 'Все корпуса',
            value: 'all'
        },
        {
            name: 'Корпус 1',
            value: '1'
        },
        {
            name: 'Корпус 2',
            value: '2'
        },
        {
            name: 'Корпус 3',
            value: '3'
        },
        {
            name: 'Корпус 4',
            value: '4'
        }
    ]
};
