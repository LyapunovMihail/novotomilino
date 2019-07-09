import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ImgModalService {

    private subject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public changeImgVisibility(state: boolean): void {
        this.subject.next(state);
    }

    public get getImgVisibility(): Observable<boolean> {
        return this.subject.asObservable();
    }
}
