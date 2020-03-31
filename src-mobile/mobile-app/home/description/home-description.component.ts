import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';

@Component({
    selector: 'app-home-description',
    templateUrl: './home-description.component.html',
    styleUrls: [
        './home-description.component.scss'
    ],
    providers: [
    ]
})

export class HomeDescriptionComponent implements OnInit  {

    public description;

    constructor(private homeService: HomeService) {}

    ngOnInit() {

        this.homeService.getHeaderDescription().subscribe(
            data => this.description = data.description,
            error => console.log(error)
        );
    }
}
