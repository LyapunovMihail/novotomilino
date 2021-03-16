import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SearchFlatsLinkHandlerService } from '../../commons/searchFlatsLinkHandler.service';
import { SearchService } from '../search/search.service';
import { WindowScrollLocker } from '../../commons/window-scroll-block';

@Component({
    selector: 'app-popular',
    templateUrl: 'popular.component.html',
    styleUrls: ['./popular.component.scss'],
    providers: [
        SearchService,
        WindowScrollLocker
    ]
})

export class PopularComponent implements OnInit, OnDestroy {

    public metaTags;

    constructor(
        private searchService: SearchService,
        public scrollLock: WindowScrollLocker,
        private searchFlatsLinkHandlerService: SearchFlatsLinkHandlerService,
        private router: Router
    ) { }

    ngOnInit() {
        this.scrollLock.block();

        this.searchService.getMetaTags()
        .subscribe((tags) => {
                this.metaTags = tags;
            },
            (err) => console.log(err));
    }

    public navigate(url, flatsParams) {
        if (!flatsParams) {
            this.router.navigate([url]);
        } else {
            this.searchFlatsLinkHandlerService.seoLinkHandle(true, url);
        }
    }

    public previousRoute() {
        const prevRoute = JSON.parse(sessionStorage.getItem('vb2-prev-route'));
        if (prevRoute.route === '/flats/plan') {
            this.searchFlatsLinkHandlerService.linkHandle(true, prevRoute.params);
            return;
        }
        this.router.navigate([prevRoute.route || '/flats'], { queryParams: prevRoute.params });
    }

    ngOnDestroy() {
        this.scrollLock.unblock();
        sessionStorage.removeItem('vb2-prev-route');
    }
}
