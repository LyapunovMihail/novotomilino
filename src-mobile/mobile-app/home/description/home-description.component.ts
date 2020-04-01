import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
    @Output() public isDescription = new EventEmitter<any>();

    constructor(private homeService: HomeService) {}

    ngOnInit() {

        this.homeService.getHeaderDescription().subscribe(
            data => {
                this.description = data.description;
                (this.description && this.description.length > 0) ? this.isDescription.emit(true) : this.isDescription.emit(false);
            },
            error => console.log(error)
            );
    }
}
