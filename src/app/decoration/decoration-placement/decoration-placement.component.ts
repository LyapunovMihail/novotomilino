import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DecorationService } from '../decoration.service';
import { Subscription } from 'rxjs';
import {filter, map} from 'rxjs/operators';

@Component({
    selector: 'app-placement',
    templateUrl: './decoration-placement.component.html',
    styleUrls: ['./decoration-placement.component.scss'],
    providers: [
        DecorationService
    ]
})

export class DecorationPlacementComponent implements OnInit, OnDestroy {

    public slideList = [];
    public routerEvents: Subscription;
    public pageType: string;
    public activeIndex: number = 0;

    constructor(
        private decorationService: DecorationService,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    public ngOnInit() {
        this.defineType();

        this.routerEvents = this.router.events
            .pipe(filter((router) => (router instanceof NavigationEnd)), map((router: NavigationEnd) => router.url))
            .subscribe((router) => {
                this.defineType();
            });
    }

    public ngOnDestroy() {
        this.routerEvents.unsubscribe();
    }

    public defineType() {
        this.pageType = this.activatedRoute.snapshot.params['type'];
        if (this.reviuseUrlType(this.pageType)) {
            this.slideList = this.decorationService.placement[this.pageType];
            if (this.activeIndex >=  this.slideList.length || this.pageType === 'places') {
                this.activeIndex = 0;
            }
        } else {
            this.router.navigate(['/error-404'], { skipLocationChange: true });
        }
    }

    public reviuseUrlType(urlType) {
        return (Object.keys(this.decorationService.placement).some((key) => (key === urlType)));
    }
}
