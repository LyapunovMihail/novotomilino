import { WindowScrollLocker } from './../../commons/window-scroll-block';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicObjectService } from './dynamic-object.service';
import { IDynamicObject, DYNAMIC_UPLOADS_PATH } from '../../../../serv-files/serv-modules/dynamic-api/dynamic.interfaces';
import {
    Component,
    Input,
    EventEmitter,
    Output,
    OnInit,
    OnDestroy,
    AfterViewInit,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef
} from '@angular/core';

@Component({
    selector: 'app-dynamic-object',
    templateUrl: './dynamic-object.component.html',
    styleUrls: ['./dynamic-object.component.scss'],
    providers: [
        WindowScrollLocker,
        DynamicObjectService
    ]
})

export class DynamicObjectComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

    @Input() month: number;
    @Input() year: number;
    @Input() objectsArray: IDynamicObject[] = [];

    @Output() changeObjectsArray: EventEmitter<IDynamicObject[]> = new EventEmitter();

    public progressEvent;
    public progressCount: number;
    public progressCurrent: number;
    public progressLoaded: boolean = false;

    public uploadsPath: string = `/${DYNAMIC_UPLOADS_PATH}`;

    formVideo: FormGroup = this.formBuilder.group({
        origin: ['', Validators.compose([ Validators.required, Validators.minLength(1)])],
    });

    public AuthorizationEvent;
    public isAuthorizated: boolean = false;

    public isVideoShow: boolean = false;
    public videoUrl: string = '';
    public isSlideShow: boolean = false;
    public slideShowId: any;
    public slideShowCurrent: number = 0;

    constructor(
        private formBuilder: FormBuilder,
        private dynamicObjectService: DynamicObjectService,
        public windowScrollLocker: WindowScrollLocker,
        public ref: ChangeDetectorRef
    ) { }

    ngOnInit() {
        console.log(this.objectsArray);
    }

    ngAfterViewInit() {
        this.dynamicObjectService.fillReadySegments(this.objectsArray, false);
    }

    ngOnChanges() {
        this.ref.detectChanges();
        this.dynamicObjectService.fillReadySegments(this.objectsArray, false);
    }

    ngOnDestroy() {
    }

    public startSlideShow(id, i) {
        if ( !this.isAuthorizated ) {
            this.windowScrollLocker.block();
            this.isSlideShow = true;
            this.slideShowId = id;
            this.slideShowCurrent = i;
        }
    }

    public startVideoShow(url) {
        if ( !this.isAuthorizated ) {
            this.windowScrollLocker.block();
            this.isVideoShow = true;
            this.videoUrl = url;
        }
    }

    public setVideo(id, form) {
        this.formVideo.reset();
        this.dynamicObjectService.setVideo(id, form.origin).subscribe(
            (data: IDynamicObject[]) => this.changeObjectsArray.emit(data),
            (err) => {
                alert('??????-???? ?????????? ???? ??????!');
                console.error(err);
            }
        );
    }

    public changeDescription(id, e) {
        this.dynamicObjectService.changeDescription(id, e.target.value).subscribe(
            (data: IDynamicObject[]) => this.changeObjectsArray.emit(data),
            (err) => {
                alert('??????-???? ?????????? ???? ??????!');
                console.error(err);
            }
        );
    }

    public deleteObject(id) {
        let accept = confirm('???? ?????????????????????????? ???????????? ?????????????? ?????????????');
        if ( accept ) {
            this.dynamicObjectService.deleteObject(id).subscribe(
                (data: IDynamicObject[]) => this.changeObjectsArray.emit(data),
                (err) => {
                    alert('??????-???? ?????????? ???? ??????!');
                    console.error(err);
                }
            );
        }
    }

    public changeReady(id, e) {
        this.dynamicObjectService.changeReady(id, Number(e.target.value)).subscribe(
            (data: IDynamicObject[]) => this.changeObjectsArray.emit(data),
            (err) => {
                alert('??????-???? ?????????? ???? ??????!');
                console.error(err);
            }
        );
    }

    public deleteImage(id, image, type) {
        this.dynamicObjectService.deleteImage(id, image, type).subscribe(
            (data: IDynamicObject[]) => this.changeObjectsArray.emit(data),
            (err) => {
                alert('??????-???? ?????????? ???? ??????!');
                console.error(err);
            }
        );
    }

    public setSlides(id, e) {
        let fileList: FileList = e.target.files;
        this.progressCount = fileList.length;
        this.progressLoaded = true;
        this.progressEvent = this.dynamicObjectService.getCurrentLoadedImage().subscribe((val) => {
            this.progressCurrent = val;
        });
    }

}
