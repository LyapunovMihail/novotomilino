import { Subject, Subscription } from 'rxjs';
import { FlatsDiscountService } from '../../../commons/flats-discount.service';
import { SharesService } from '../shares.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {
    Share,
    SHARES_CREATE_ID,
    SHARES_UPLOADS_PATH,
    ShareBodyBlock,
    ShareFlat,
    ShareFlatDiscountType
} from '../../../../../serv-files/serv-modules/shares-api/shares.interfaces';
import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import * as moment from 'moment';
import { SharesObserverService } from '../shares-observer.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

export function createDynamicNewsObj(): Share {
    return ({
        name: '',
        text: '',
        textPreview: '',
        mainImage: null,
        mainThumbnail: null,
        countdown: false,
        show_on_main: false,
        created_at: new Date().toISOString(),
        finish_date: new Date().toISOString(),
        body: [],
        requestBtn: false
    });
}

@Component({
    selector: 'app-shares-edit',
    templateUrl: './shares-edit.component.html',
    styleUrls: ['./shares-edit.component.scss']
})

export class SharesEditComponent implements OnInit, OnDestroy {

    public form: FormGroup;

    public uploadsPath: string;

    public finishDate;

    public days: number;

    public dateNow: string;

    public paginatorCount;

    @Input() isForm: boolean = false ;

    @Input() redactId: any ;

    // вызывается при изменении сниппета
    @Output() snippetsChange = new EventEmitter();

    @Output() close = new EventEmitter();

    private subs: Subscription[] = [];
    private _ngUnsubscribe: Subject<any> = new Subject();

    public formLoading: boolean = true;

    constructor(
        private activeRoute: ActivatedRoute,
        private sharesService: SharesService,
        private sharesObserverService: SharesObserverService,
        private flatsDiscountService: FlatsDiscountService,
        private router: Router
    ) {
        this.uploadsPath = SHARES_UPLOADS_PATH;
        this.form  = new FormGroup({
            name: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(60)])),
            text: new FormControl('', Validators.required),
            textPreview: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(60)])),
            mainImage: new FormControl(null, Validators.required),
            mainThumbnail: new FormControl(null, Validators.required),
            show_on_main: new FormControl(false, Validators.required),
            created_at: new FormControl('', Validators.required),
            countdown: new FormControl(false, Validators.required),
            requestBtn: new FormControl(false, Validators.required),
            finish_date: new FormControl('', Validators.required),
            body: new FormArray([])
        });

        this.days = 0;

        this.paginatorCount = 1;

        moment.locale('ru');
    }

    // tslint:disable-next-line:member-access

    ngOnInit() {
        if (this.redactId === SHARES_CREATE_ID) {
            this.form.reset(createDynamicNewsObj());
        } else {
            this.getObjectById();
        }
        this.finishDate = this.form.value['finish_date'];

        this.countDown();

        this.subs.push(this.form.get('finish_date').valueChanges
            .pipe(takeUntil(this._ngUnsubscribe))
            .subscribe((value) => {
                this.finishDate = this.form.get('finish_date').value;
                this.countDown();
            }));

        this.identifyPaginatorCount();

        this.dateNow = moment(Date.now()).format('LL').slice(0, -3);
    }


    // tslint:disable-next-line:member-access
    ngOnDestroy() {
        this.unsubscribe();
    }

    public get body(): FormArray { return this.form.get('body') as FormArray; }

    public addFlats(order?: number, value?: ShareFlat[]) {
        this.body.push(new FormControl({
            blockType: 'flats',
            blockOrderNumber: order ? order : this.body.controls.length,
            blockFlats: value
                ? value
                : [
                    {
                        house: null,
                        number: null,
                        section: null,
                        floor: null,
                        space: null,
                        room: null,
                        decoration: null,
                        scheme: null,
                        price: null,
                        discount: null,
                        discountType: ShareFlatDiscountType.SUM
                    }
                ]
        }));
    }

    public removeBlock(cnt) {
        if (confirm('Удалить секцию?')) {
            this.body.removeAt(cnt);
        }
    }

    public onImagePicked(e: Event, type: string): void {
        const file = (e.target as HTMLInputElement).files[0];
        const results = [];
        this.sharesService.imageUpload(file)
            .then((data: any) => {
                if (type === 'main-image') {
                    this.form.patchValue({mainImage: data.image});
                    this.form.patchValue({mainThumbnail: data.thumbnail});
                }
            }).catch((err) => {
                alert('Что-то пошло не так!');
                console.error(err);
            });
    }

    public countDown() {
        const createdDateVal = moment(Date.now());
        const finishDateVal = moment(this.finishDate);
        const duration = moment.duration(createdDateVal.diff(finishDateVal));
        this.days = Math.ceil(duration.asDays() * -1);
    }

    public getObjectById() {
        this.sharesService.getShareById(this.redactId).subscribe((data: Share[]) => {
            this.form.reset(data[0]);
            this.finishDate = data[0].finish_date;
            (data[0].body as ShareBodyBlock[]).forEach((body: ShareBodyBlock) => {
                if (body.blockType === 'flats') {
                    this.addFlats(body.blockOrderNumber, body.blockFlats);
                }
            });
            this.countDown();
        });
    }

    public onSave(form): void {

        if (form.valid) {
            if (this.redactId === SHARES_CREATE_ID) {
                this.sharesService.createShare(form.value).subscribe(
                    (response) => {
                        console.log(response);
                        this.close.emit();
                        this.snippetsChange.emit(response);
                        this.flatsDiscountService.getShares(); // обновляем список акций в сервисе для определения скидки на квартиры по акциям
                    },
                    (err) => {
                        alert('Что-то пошло не так!');
                        console.log('Ошибка', err);
                    });
            } else {
                this.sharesService.updateShare(this.redactId, form.value as Share)
                    .subscribe(
                        (response) => {
                            console.log(response);
                            this.close.emit();
                            this.snippetsChange.emit(response);
                            this.flatsDiscountService.getShares(); // обновляем список акций в сервисе для определения скидки на квартиры по акциям
                        },
                        (err) => {
                            alert('Что-то пошло не так!');
                            console.log('Ошибка', err);
                        }
                    );
            }
        }
    }

    public identifyPaginatorCount() {
        this.subs.push(this.sharesObserverService.getPageCount
            .pipe(takeUntil(this._ngUnsubscribe))
            .subscribe((event) => {
                if (event) {
                    this.paginatorCount = event;
                }
            })
        );
    }

    private unsubscribe() {
        this._ngUnsubscribe.next();
        this.subs.forEach((sub: Subscription) => {
            sub.unsubscribe();
        });
    }
}
