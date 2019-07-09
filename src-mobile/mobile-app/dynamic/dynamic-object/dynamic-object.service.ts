import { DynamicAdminUpload } from './dynamic-admin.uload';
import { adminHeaders } from './../../commons/admin-headers.utilit';
import { Injectable, Inject, forwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Uploader } from 'angular2-http-file-upload';
import { map } from 'rxjs/operators';

@Injectable()

export class DynamicObjectService {

    public subject = new BehaviorSubject<number>(0);

    constructor (
        private http: HttpClient,
       // @Inject(forwardRef(() => Uploader)) private uploaderService: Uploader
    ) { }

    public setCurrentLoadedImage(val: number) {
        this.subject.next(val);
    }

    public getCurrentLoadedImage(): Observable<number> {
        return this.subject.asObservable();
    }

    public changeDescription(id, description): Observable<any> {
        const message = JSON.stringify({id, description});
        return this.http.post('/api/admin/dynamic/update/description', message, adminHeaders())
            .pipe(map((response: Response) => response.json()));
    }

    public changeReady(id, ready): Observable<any> {
        const message = JSON.stringify({id, ready});
        return this.http.post('/api/admin/dynamic/update/ready', message, adminHeaders())
            .pipe(map((response: Response) => response.json()));
    }

    public deleteObject(id): Observable<any> {
        const message = JSON.stringify({id});
        return this.http.post('/api/admin/dynamic/delete', message, adminHeaders())
            .pipe(map((response: Response) => response.json()));
    }

    public deleteImage(id, image, type): Observable<any> {
        const message = JSON.stringify({id, image, type});
        return this.http.post('/api/admin/dynamic/update/image_delete', message, adminHeaders())
            .pipe(map((response: Response) => response.json()));
    }

    public setVideo(id, origin): Observable<any> {
        const message = JSON.stringify({id, origin});
        return this.http.post('/api/admin/dynamic/video/set', message, adminHeaders())
            .pipe(map((response: Response) => response.json()));
    }

    // Рекурсивная загрузка изображений
   /* imageUpload(id, fileList: FileList) {
        return new Promise((resolve, reject) => {
            let index = 0;
            let url = '/api/admin/dynamic/image/set';

            let upload = (i) => {
                this.setCurrentLoadedImage(i + 1);
                let myUploadItem = new DynamicAdminUpload(id, url, fileList[i]);
                myUploadItem.formData = { FormDataKey: 'Form Data Value' };
                this.uploaderService.upload(myUploadItem);
            };

            upload(index);

            this.uploaderService.onSuccessUpload = (item, response, status, headers) => {
                if (index < fileList.length - 1) {
                    index ++ ;
                    upload(index);
                } else {
                    resolve(JSON.parse(response));
                }
            };

            this.uploaderService.onErrorUpload = (item, response, status, headers) => {
                reject(response);
            };
            // this.uploaderService.onCompleteUpload = (item, response, status, headers) => {};
            // this.uploaderService.onProgressUpload = (item, percentComplete) => {};
        });
    } */
}
