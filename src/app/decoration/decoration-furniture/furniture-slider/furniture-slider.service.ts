import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDecorationPreviewVendor, IDecorationType } from '../../../../../serv-files/serv-modules/decoration-api/decoration.interfaces';

@Injectable()

export class FurnitureSliderService {

    constructor( private http: HttpClient ) {}

    public getDecorationFurnitureData(): Observable<IDecorationType[]> {
        return this.http.get<IDecorationType[]>('/api/get_decoration_data');
    }

    public getDecorationFurniturePreview(): Observable<IDecorationPreviewVendor[]> {
        return this.http.get<IDecorationPreviewVendor[]>('/api/get_decoration_preview');
    }


}
