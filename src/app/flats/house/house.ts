import { FlatBubbleComponent } from './flat-bubble/flat-bubble.component';
import { HouseMinimapComponent } from './house-minimap/house-minimap.component';
import { HouseSidebarComponent } from './house-sidebar/house-sidebar.component';
import { HouseSVGSanitizePipe } from './house-svg-sanitize.pipe';
import { HouseComponent } from './house.component';

export const HouseComponents = [
    HouseSVGSanitizePipe,
    HouseComponent,
    HouseMinimapComponent,
    HouseSidebarComponent,
    FlatBubbleComponent
];
