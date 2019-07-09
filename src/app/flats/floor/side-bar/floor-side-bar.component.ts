import { PlatformDetectService } from './../../../platform-detect.service';
import { Router } from '@angular/router';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-floor-side-bar',
    templateUrl: './floor-side-bar.component.html',
    styleUrls: ['./floor-side-bar.component.scss']
})

export class FloorSideBarComponent implements OnInit, OnDestroy {

    @Input() public sectionNumber;
    @Input() public floorNumber;
    @Input() public floorSelector;

    @Output() public svgClick: EventEmitter<any> = new EventEmitter();

    private selectedFloor$: Subject<number> = new Subject<number>();
    private _ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        public router: Router,
        public platform: PlatformDetectService
    ) { }

    public ngOnInit() {
        this.selectedFloor$
        .pipe(debounceTime(300), takeUntil(this._ngUnsubscribe))
        .subscribe((floor) => {
            this.router.navigate([`/flats/section/${this.sectionNumber}/floor/${floor}`]);
        });
    }

    public ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }

    public writePreviousUrl() {
        if (this.platform.isBrowser) {
            localStorage.setItem('previousRoute', this.router.url);
            this.router.navigate(['/flats/search']);
        }
    }

    public floorSelect(floor) {
        if (this.floorSelector.indexOf(floor) == -1) {
            return;
        }
        this.floorNumber = floor;
        this.selectedFloor$.next(floor);
    }

}
