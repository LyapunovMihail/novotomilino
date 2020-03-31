import { adminHeaders } from './../../commons/admin-headers.utilit';
import { Injectable, Inject, forwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { SEGMENTSCOLOR } from './segments-color';
declare let $: any;

@Injectable()

export class DynamicObjectService {

    public subject = new BehaviorSubject<number>(0);

    public segmentsColor = {
        1 : '#d5210d',
        2 : '#d5210d',
        3 : '#d5210d',
        4 : '#ffb94a',
        5 : '#ffb94a',
        6 : '#ffb94a',
        7 : '#7ba64a',
        8 : '#7ba64a',
        9 : '#7ba64a',
        10 : '#7ba64a'
    };

    constructor (
        private http: HttpClient
    ) { }

    public setCurrentLoadedImage(val: number) {
        this.subject.next(val);
    }

    public getCurrentLoadedImage(): Observable<number> {
        return this.subject.asObservable();
    }

    public changeDescription(id, description): Observable<any> {
        const message = JSON.stringify({id, description});
        return this.http.post('/api/admin/dynamic/update/description', message, adminHeaders());
    }

    public changeReady(id, ready): Observable<any> {
        const message = JSON.stringify({id, ready});
        return this.http.post('/api/admin/dynamic/update/ready', message, adminHeaders());
    }

    public deleteObject(id): Observable<any> {
        const message = JSON.stringify({id});
        return this.http.post('/api/admin/dynamic/delete', message, adminHeaders());
    }

    public deleteImage(id, image, type): Observable<any> {
        const message = JSON.stringify({id, image, type});
        return this.http.post('/api/admin/dynamic/update/image_delete', message, adminHeaders());
    }

    public setVideo(id, origin): Observable<any> {
        const message = JSON.stringify({id, origin});
        return this.http.post('/api/admin/dynamic/video/set', message, adminHeaders());
    }

    public fillReadySegments(objectArray, isMinimap: boolean) {
        const prefix = isMinimap ? 'minimap-' : '';

        objectArray.forEach((obj) => {
            const ready = obj.ready;
            const numberOfSegments = Math.ceil(ready / 10);
            const color = this.segmentsColor[numberOfSegments];

            for (let i = 1; i <= numberOfSegments; i++) {
                $(`#${prefix}${obj._id}-segment-${i}`).css({fill : color});
            }
        });
    }
}
