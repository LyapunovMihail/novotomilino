
export const path = '/assets/img/decoration/furniture';

export const furnitureConf = [
    {
        name: 'Шатура',
        vendor: 'shatura',
        type: [
            { name: 'Классика', value: 'classic', preview: `${path}/shatura/classic/0-living_rooms-1.jpg` },
            { name: 'Модерн', value: 'modern', preview: `${path}/shatura/modern/0-living_rooms-1.jpg` },
        ],
    }, {
        name: 'Лазурит',
        vendor: 'lazurit',
        type: [
            { name: 'Классика', value: 'classic', preview: `${path}/lazurit/classic/0-living_rooms-1.jpg` },
            { name: 'Модерн', value: 'modern', preview: `${path}/lazurit/modern/0-living_rooms-2.jpg` },
        ],
    },
    // {
    //     name: 'Хофф',
    //     vendor: 'hoff',
    //     type: [
    //         { name: 'Классика', value: 'classic', preview: `${path}/hoff/classic` },
    //         { name: 'Модерн', value: 'modern', preview: `${path}/hoff/modern` },
    //     ],
    // }
];

export const sliderContent = {
    shatura: {
        classic: [
            ['0-living_rooms-1.jpg', '0-living_rooms-2.jpg', '0-living_rooms-3.jpg', '0-hall-1.jpg'],
            ['1-living_rooms-1.jpg', '1-living_rooms-2.jpg', '1-plan-1.jpg', '1-plan-2.jpg', '1-plan-3.jpg', '1-plan-4.jpg'],
            [],
            [],
        ],
        modern: [
            ['0-living_rooms-1.jpg', '0-living_rooms-2.jpg', '0-hall-1.jpg', '0-hall-2.jpg'],
            ['1-living_rooms-1.jpg', '1-kitchen-1.jpg', '1-hall-1.jpg', '1-render-5-korp-1-kom-kv-modern-2-ice.jpg'],
            ['2-living_rooms-1.jpg', '2-kitchen-1.jpg', '2-bedroom-1.jpg', '2-hall-1.jpg', '2-ka-modern.jpg', '2-ka-modern2.jpg', '2-ka-modern3.jpg'],
            [],
        ],
    },
    lazurit: {
        classic: [
            ['0-living_rooms-1.jpg', '0-living_rooms-2.jpg', '0-living_rooms-3.jpg', '0-living_rooms-4.jpg', '0-hall-1.jpg'],
            ['1-living_rooms-1.jpg', '1-living_rooms-2.jpg', '1-living_rooms-3.jpg', '1-hall-1.jpg'],
            ['2-living_rooms-1.jpg', '2-living_rooms-2.jpg', '2-hall-1.jpg', '2-kitchen-1.jpg', '2-bedroom-1.jpg', '2-bedroom-2.jpg'],
            [],
        ],
        modern: [
            ['0-living_rooms-1.jpg', '0-living_rooms-2.jpg', '0-hall-1.jpg'],
            ['1-living_rooms-1.jpg', '1-living_rooms-2.jpg', '1-living_rooms-3.jpg', '1-living_rooms-4.jpg', '1-living_rooms-5.jpg', '1-living_rooms-6.jpg', '1-bedroom-1.jpg', '1-bedroom-2.jpg', '1-hall-1.jpg', '1-hall-2.jpg'],
            ['2-living_rooms-1.jpg', '2-living_rooms-2.jpg', '2-living_rooms-3.jpg', '2-living_rooms-4.jpg', '2-living_rooms-5.jpg', '2-kitchen-1.jpg', '2-kitchen-2.jpg', '2-childroom-1.jpg', '2-childroom-2.jpg', '2-childroom-3.jpg', '2-bedroom-1.jpg', '2-bedroom-2.jpg', '2-bedroom-3.jpg', '2-hall-1.jpg', '2-hall-2.jpg'],
            [],
        ],
    },
    hoff: {
        classic: [
            [],
            [],
            [],
            [],
        ],
        modern: [
            [],
            [],
            [],
            [],
        ],
    }
};
