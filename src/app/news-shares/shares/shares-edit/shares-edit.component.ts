import { Subject, Subscription } from 'rxjs';
import { FlatsDiscountService } from '../../../commons/flats-discount.service';
import { SharesService } from '../shares.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {
    Share,
    SHARES_CREATE_ID,
    SHARES_UPLOADS_PATH,
    ShareFlat
} from '../../../../../serv-files/serv-modules/shares-api/shares.interfaces';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { SharesObserverService } from '../shares-observer.service';
import { takeUntil } from 'rxjs/operators';
import { MetaRenderAdminService } from '../../render-meta-admin.service';

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
        shareFlats: [],
        requestBtn: false
    });
}

@Component({
    selector: 'app-shares-edit',
    templateUrl: './shares-edit.component.html',
    styleUrls: ['./shares-edit.component.scss'],
    providers: [ MetaRenderAdminService ]
})

export class SharesEditComponent implements OnInit, OnDestroy {

    public form: FormGroup;

    public uploadsPath: string;

    public days: number;

    public dateNow: string;

    public paginatorCount;

    @Input() isForm = false;

    @Input() redactId: any;

    // вызывается при изменении сниппета
    @Output() snippetsChange = new EventEmitter();

    @Output() close = new EventEmitter();

    private subs: Subscription[] = [];
    private _ngUnsubscribe: Subject<any> = new Subject();

    public formLoading = true;

    constructor(
        private activeRoute: ActivatedRoute,
        private sharesService: SharesService,
        private sharesObserverService: SharesObserverService,
        private flatsDiscountService: FlatsDiscountService,
        private metaAdminService: MetaRenderAdminService,
    ) {
        this.uploadsPath = SHARES_UPLOADS_PATH;
        this.form = new FormGroup({
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
            shareFlats: new FormArray([])
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

        this.countDown();
        this.setShowOnMain();

        this.subscribeValueChanges();

        this.identifyPaginatorCount();

        this.dateNow = moment(Date.now()).format('LL').slice(0, -3);
    }

    subscribeValueChanges() {
        this.subs.push(this.form.get('finish_date').valueChanges
            .pipe(takeUntil(this._ngUnsubscribe))
            .subscribe(() => {
                this.countDown();
                this.setShowOnMain();
            }));

        this.subs.push(this.form.get('countdown').valueChanges
            .pipe(takeUntil(this._ngUnsubscribe))
            .subscribe(() => {
                this.setShowOnMain();
            }));
    }

    // tslint:disable-next-line:member-access
    ngOnDestroy() {
        this.unsubscribe();
    }

    public get shareFlats(): FormArray {
        return this.form.get('shareFlats') as FormArray;
    }

    public addFlats(value?: ShareFlat[]) {
        if (value) {
            value.forEach((flat: ShareFlat) => {
                this.shareFlats.push(new FormControl(flat));
            });
        } else {
            this.shareFlats.push(new FormControl(
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
                    discountType: null
                }
            ));
        }
    }

    public removeBlock(cnt) {
        if (confirm('Удалить квартиру?')) {
            this.shareFlats.removeAt(cnt);
        }
    }

    public onImagePicked(e: Event, type: string): void {
        const file = (e.target as HTMLInputElement).files[0];
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
        const finishDateVal = moment(this.form.get('finish_date').value);
        const duration = moment.duration(createdDateVal.diff(finishDateVal));
        this.days = Math.ceil(duration.asDays() * -1);

    }

    public setShowOnMain() {
        let showOnMain = this.form.get('show_on_main').value;
        if (this.form.get('countdown').value && this.days < 0) {
            showOnMain = false;
        }
        this.form.get('show_on_main').setValue(showOnMain);
    }

    public getObjectById() {
        this.sharesService.getShareById(this.redactId).subscribe((data: Share[]) => {
            this.form.reset(data[0]);
            this.addFlats(data[0].shareFlats);
            this.countDown();
            this.setShowOnMain();
        });
    }

    public onSave(form): void {

        if (form.valid) {
            if (this.redactId === SHARES_CREATE_ID) {
                this.sharesService.createShare(form.value).subscribe(
                    (response) => {
                        this.close.emit();
                        this.snippetsChange.emit(response);
                        this.flatsDiscountService.getShares(); // обновляем список акций в сервисе для определения скидки на квартиры по акциям
                        this.metaAdminService.setMeta(response, form.value, 'shares');
                    },
                    (err) => {
                        alert('Что-то пошло не так!');
                    });
            } else {
                this.sharesService.updateShare(this.redactId, form.value as Share)
                    .subscribe(
                        (response) => {
                            this.close.emit();
                            this.snippetsChange.emit(response);
                            this.flatsDiscountService.getShares(); // обновляем список акций в сервисе для определения скидки на квартиры по акциям
                            this.metaAdminService.updateMeta(form.value, this.redactId, 'shares');
                        },
                        (err) => {
                            alert('Что-то пошло не так!');
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
