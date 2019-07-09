import { Uploader } from 'angular2-http-file-upload';
import { HomePreviewAdminService } from './home-preview-admin.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
    EnumGallerySnippet,
    GALLERY_UPLOADS_PATH,
    IGallerySnippet
} from '../../../../../serv-files/serv-modules/gallery-api/gallery.interfaces';

@Component({
    selector: 'app-home-preview-admin',
    templateUrl: './home-preview-admin.component.html',
    styleUrls: [
        './home-preview-admin.component.scss'
    ],
    providers: [
        Uploader,
        HomePreviewAdminService
    ]
})

export class HomePreviewAdminComponent {

    @Output() close = new EventEmitter();

    @Output() galleryChange = new EventEmitter();

    @Input() isShowModal = false;

    @Input() gallerySlides: IGallerySnippet[] = [];

    public uploadsPath = `/${GALLERY_UPLOADS_PATH}`;

    public progressEvent;
    public progressCount: number;
    public progressCurrent: number;
    public progressLoaded = false;

    constructor(
        private galleryAdminService: HomePreviewAdminService
    ) { }

    public setSlides(e) {
        const fileList: FileList = e.target.files;
        this.progressCount = fileList.length;
        this.progressLoaded = true;
        this.progressEvent = this.galleryAdminService.getCurrentLoadedImage().subscribe((val) => {
            this.progressCurrent = val;
        });
        this.galleryAdminService.imageUpload(fileList, EnumGallerySnippet.PREVIEW).then((arr: IGallerySnippet[]) => {
            console.log('data: ', arr);
            this.progressCount = 0;
            this.progressLoaded = false;
            this.galleryChange.emit(arr);
            this.progressEvent.unsubscribe();
        }).catch((err) => {
            console.error(err);
            alert('Что-то пошло не так!');
        });
    }

    public changeImage(id, e) {
        const fileList: FileList = e.target.files;
        this.progressCount = fileList.length;
        this.progressLoaded = true;
        this.progressEvent = this.galleryAdminService.getCurrentLoadedImage().subscribe((val) => {
            this.progressCurrent = val + 1;
        });
        this.galleryAdminService.changeImage(id, e)
            .then((arr: IGallerySnippet[]) => {
                this.progressCount = 0;
                this.progressLoaded = false;
                this.galleryChange.emit(arr);
                this.progressEvent.unsubscribe();
            })
            .catch((err) => {
                console.error(err);
                this.progressEvent.unsubscribe();
                alert('Что-то пошло не так!');
            });
    }

    public deleteSlide(id) {
        const accept = confirm('Вы действительно хотите удалить изображение?');
        if ( accept ) {
            this.galleryAdminService.deleteSnippet(id).subscribe(
                (arr: IGallerySnippet[]) => this.galleryChange.emit(arr),
                (err) => {
                    console.error(err);
                    alert('Что-то пошло не так!');
                }
            );
        }
    }

}
