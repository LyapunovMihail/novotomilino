import { PlatformDetectService } from './../platform-detect.service';
import { AuthorizationObserverService } from './../authorization/authorization.observer.service';
import { IDynamicObject } from '../../../serv-files/serv-modules/dynamic-api/dynamic.interfaces';
import { DynamicService } from './dynamic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-dynamic',
    templateUrl: './dynamic.component.html',
    styleUrls: ['./dynamic.component.scss'],
    providers: [PlatformDetectService]
})

export class DynamicComponent implements OnInit, OnDestroy {

    public currentYear: number;
    public currentMonth: number;
    public objectsArray: IDynamicObject[] = [];
    public routerEvent;
    public AuthorizationEvent;
    public isAuthorizated: boolean = false;

    constructor(
        private router: Router,
        private authorization: AuthorizationObserverService,
        public activatedRoute: ActivatedRoute,
        public dynamicService: DynamicService,
        public platform: PlatformDetectService
    ) { }

    ngOnInit() {
        if ( this.platform.isBrowser ) {
            // подписка на авторизацию
            // this.AuthorizationEvent = this.authorization.getAuthorization().subscribe( (val) => {
                this.isAuthorizated = false;
            // });

            this.routerEvent = this.activatedRoute.params.subscribe((params) => {
                this.reviseUrlParams(params);
            });

            this.dynamicService.getObjects().subscribe(
                (data: IDynamicObject[]) => this.objectsArray = data,
                (err) => { console.error(err);  this.objectsArray = JSON.parse(`[{"_id":"5b47190e8f3cfa5fa0e126cc","title":"Корпус 1 ","description":"","created_at":"2018-07-12T09:02:06.720Z","last_modifyed":"2018-07-12T09:02:24.673Z","month":3,"year":2019,"ready":33,
                "images":[{"type":"IMAGE","origin":"/assets/img/dynamic/gallery/01.jpg","thumbnail":"/assets/img/dynamic/gallery/01.jpg"},
                {"type":"IMAGE","origin":"/assets/img/dynamic/gallery/02.jpg","thumbnail":"/assets/img/dynamic/gallery/02.jpg"},{"type":"IMAGE","origin":"/assets/img/dynamic/gallery/03.jpg","thumbnail":"/assets/img/dynamic/gallery/03.jpg"},
                {"type":"IMAGE","origin":"/assets/img/dynamic/gallery/04.jpg","thumbnail":"/assets/img/dynamic/gallery/04.jpg"},{"type":"IMAGE","origin":"/assets/img/dynamic/gallery/05.jpg","thumbnail":"/assets/img/dynamic/gallery/05.jpg"},
                {"type":"IMAGE","origin":"/assets/img/dynamic/gallery/06.jpg","thumbnail":"/assets/img/dynamic/gallery/06.jpg"},{"type":"IMAGE","origin":"/assets/img/dynamic/gallery/07.jpg","thumbnail":"/assets/img/dynamic/gallery/07.jpg"},
                {"type":"IMAGE","origin":"/assets/img/dynamic/gallery/08.jpg","thumbnail":"/assets/img/dynamic/gallery/08.jpg"},{"type":"IMAGE","origin":"/assets/img/dynamic/gallery/09.jpg","thumbnail":"/assets/img/dynamic/gallery/09.jpg"},
                {"type":"IMAGE","origin":"/assets/img/dynamic/gallery/10.jpg","thumbnail":"/assets/img/dynamic/gallery/10.jpg"},{"type":"IMAGE","origin":"/assets/img/dynamic/gallery/11.jpg","thumbnail":"/assets/img/dynamic/gallery/11.jpg"}]}]`);
                    console.log("this.objectsArray: ", this.objectsArray);
                }
            );
        }
    }

    ngOnDestroy() {
        /* if ( this.platform.isBrowser ) {
            this.AuthorizationEvent.unsubscribe();
            // this.routerEvent.unsubscribe();
        } */
    }

    // проверка на корректность url - параметров 'year', 'month'
    public reviseUrlParams(params) {
        if ( params['month'] &&  params['year'] ) {

            // удаляем все символы из параметров кроме чисел ( возможно случайно попавшие )
            let month = params['month'].replace(/[^0-9]/g, '');
            let year = params['year'].replace(/[^0-9]/g, '');

            // если в обоих параметрах есть цифры
            if ( month.length > 0 && year.length > 0
                // проверяем 'year' на соответствие диапазону от 2017го до текущего года
                && Number(year) >= 2018 && Number(year) <= Number(new Date().getFullYear())
                // проверяем 'month' на соответствие диапазону от 1 до 12
                && Number(month) >= 1 && Number(month) <= 12 ) {

                // если все ок, то назначаем свойства
                this.currentMonth = Number(month);
                this.currentYear = Number(year);

                return true;

            // иначе редирект на 404ю страницу
            // и отписка от событий роутера
            } else {
                // this.routerEvent.unsubscribe();
                this.router.navigate(['/error-404'], { skipLocationChange: true });
                return false;
            }
        } else {
            // this.routerEvent.unsubscribe();
            this.router.navigate(['/error-404'], { skipLocationChange: true });
            return false;
        }
    }

    public monthChange(val) {
        this.router.navigate([`/dynamic/${this.currentYear}/${val}`]);
    }

    public yearChange(val) {
        this.router.navigate([`/dynamic/${val}/${this.currentMonth}`]);
    }
}
