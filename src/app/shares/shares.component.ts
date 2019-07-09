import { Component } from '@angular/core';
import { HouseService } from '../flats/house/house.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HOUSES_IMAGE_AND_SVG } from '../flats/house/house-svg';

@Component({
    selector: 'app-shares-component',
    templateUrl: './shares.component.html',
    styleUrls: ['./shares.component.scss'],
    providers: [HouseService]
})
export class SharesComponent  {

}
